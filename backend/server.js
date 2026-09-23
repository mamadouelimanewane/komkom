import express from 'express';
import cors from 'cors';
import { getDb, saveDb } from './db.js';
import { parseVoiceInput } from './services/voice-nlu.js';
import { generateWavePaymentLink, createTransactionReceipt } from './services/wave-service.js';
import { buildWhatsAppReminder } from './services/whatsapp-engine.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Koom-Koom Voice API',
    location: 'Dakar / UEMOA',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Dashboard KPIs & Synthèse
app.get('/api/dashboard', (req, res) => {
  const db = getDb();
  
  const totalDebt = db.credits.reduce((sum, c) => sum + (c.remainingAmount || 0), 0);
  const totalRepaid = db.transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalCreditIssued = db.credits.reduce((sum, c) => sum + (c.amount || 0), 0);
  
  const recoveryRate = totalCreditIssued > 0 
    ? Math.round((totalRepaid / (totalRepaid + totalDebt)) * 100) 
    : 100;

  const now = new Date().toISOString().split('T')[0];
  const overdueCredits = db.credits.filter(c => c.status === 'overdue' || (c.remainingAmount > 0 && c.dueDate < now));
  const activeDebtors = new Set(db.credits.filter(c => c.remainingAmount > 0).map(c => c.customerId)).size;

  res.json({
    merchant: db.merchant,
    kpis: {
      totalDebt,
      totalRepaid,
      totalCreditIssued,
      recoveryRate,
      activeDebtors,
      overdueCount: overdueCredits.length,
      overdueAmount: overdueCredits.reduce((s, c) => s + c.remainingAmount, 0)
    },
    recentCredits: db.credits.slice(-6).reverse(),
    recentTransactions: db.transactions.slice(-6).reverse(),
    recentReminders: (db.reminders || []).slice(-6).reverse()
  });
});

// 3. Customers
app.get('/api/customers', (req, res) => {
  const db = getDb();
  // Recalculer le totalDebt pour chaque client
  const enriched = db.customers.map(cust => {
    const custCredits = db.credits.filter(c => c.customerId === cust.id);
    const activeDebt = custCredits.reduce((sum, c) => sum + (c.remainingAmount || 0), 0);
    return {
      ...cust,
      currentDebt: activeDebt
    };
  });
  res.json(enriched);
});

app.post('/api/customers', (req, res) => {
  const db = getDb();
  const { name, phone, business, riskLevel } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ error: "Le nom et le téléphone sont obligatoires" });
  }

  const newCust = {
    id: `cust_${Date.now()}`,
    name: name.trim(),
    phone: phone.trim(),
    business: business || "Commerce de détail",
    avatar: "👤",
    riskLevel: riskLevel || "faible",
    totalDebt: 0,
    totalRepaid: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.customers.push(newCust);
  saveDb(db);
  res.status(201).json(newCust);
});

// 4. Credits (Créances / Le Kaye)
app.get('/api/credits', (req, res) => {
  const db = getDb();
  const { customerId, status } = req.query;
  let list = db.credits;
  if (customerId) list = list.filter(c => c.customerId === customerId);
  if (status) list = list.filter(c => c.status === status);
  res.json(list);
});

app.post('/api/credits', (req, res) => {
  const db = getDb();
  let { customerId, customerName, phone, amount, description, dueDate, notes } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Le montant de la créance doit être supérieur à 0" });
  }

  // Si le client n'existe pas, on le crée automatiquement
  let customer = db.customers.find(c => c.id === customerId);
  if (!customer && customerName) {
    customer = db.customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
  }

  if (!customer) {
    customer = {
      id: `cust_${Date.now()}`,
      name: customerName || "Client Comptoir",
      phone: phone || "+221770000000",
      business: "Commerce de quartier",
      avatar: "👤",
      riskLevel: "moyen",
      totalDebt: 0,
      totalRepaid: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    db.customers.push(customer);
  }

  const now = new Date();
  const defaultDue = new Date();
  defaultDue.setDate(defaultDue.getDate() + 7);

  const newCredit = {
    id: `cred_${Date.now()}`,
    customerId: customer.id,
    customerName: customer.name,
    amount: parseInt(amount, 10),
    remainingAmount: parseInt(amount, 10),
    description: description || "Vente de marchandises à crédit",
    dateIssued: now.toISOString().split('T')[0],
    dueDate: dueDate || defaultDue.toISOString().split('T')[0],
    status: "pending",
    notes: notes || "Enregistré via Koom-Koom"
  };

  customer.totalDebt = (customer.totalDebt || 0) + newCredit.amount;
  db.credits.push(newCredit);
  saveDb(db);

  res.status(201).json({
    credit: newCredit,
    customer,
    wavePaymentLink: generateWavePaymentLink(db.merchant.waveNumber, newCredit.amount, newCredit.id, customer.name)
  });
});

// 5. Règlements / Paiements
app.post('/api/payments', (req, res) => {
  const db = getDb();
  const { creditId, customerId, amount, paymentMethod = 'wave', reference } = req.body;

  const payAmount = parseInt(amount, 10);
  if (!payAmount || payAmount <= 0) {
    return res.status(400).json({ error: "Montant invalide" });
  }

  let credit = null;
  if (creditId) {
    credit = db.credits.find(c => c.id === creditId);
  } else if (customerId) {
    // Si pas de creditId spécifié, déduire de la plus ancienne dette active
    credit = db.credits.find(c => c.customerId === customerId && c.remainingAmount > 0);
  }

  const targetCustomerId = credit ? credit.customerId : customerId;
  const customer = db.customers.find(c => c.id === targetCustomerId);

  if (!customer) {
    return res.status(404).json({ error: "Client introuvable" });
  }

  // Mise à jour de la créance
  if (credit) {
    credit.remainingAmount = Math.max(0, credit.remainingAmount - payAmount);
    if (credit.remainingAmount === 0) {
      credit.status = 'paid';
    } else {
      credit.status = 'partial';
    }
  }

  // Mise à jour du client
  customer.totalDebt = Math.max(0, (customer.totalDebt || 0) - payAmount);
  customer.totalRepaid = (customer.totalRepaid || 0) + payAmount;

  const txnId = `txn_${Date.now()}`;
  const receiptCode = `KKV-REC-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

  const newTxn = {
    id: txnId,
    creditId: credit ? credit.id : null,
    customerId: customer.id,
    customerName: customer.name,
    amount: payAmount,
    paymentMethod,
    reference: reference || `WAVE-SN-${Math.floor(10000000 + Math.random() * 90000000)}`,
    receiptCode,
    timestamp: new Date().toISOString()
  };

  db.transactions.push(newTxn);
  saveDb(db);

  const receipt = createTransactionReceipt(newTxn, db.merchant, customer);

  res.status(201).json({
    transaction: newTxn,
    receipt,
    updatedCustomer: customer,
    updatedCredit: credit
  });
});

// 6. Moteur NLU Vocal
app.post('/api/voice/parse', (req, res) => {
  const db = getDb();
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Texte manquant" });
  }

  const parsed = parseVoiceInput(text, db.customers);
  res.json(parsed);
});

// 7. Exécution automatique de la commande vocale (One-Click Voice Action)
app.post('/api/voice/execute', (req, res) => {
  const db = getDb();
  const { text } = req.body;

  const parsed = parseVoiceInput(text, db.customers);

  if (parsed.intent === 'CREATE_CREDIT') {
    let customer = db.customers.find(c => c.name.toLowerCase() === parsed.entities.customerName.toLowerCase());
    if (!customer) {
      customer = {
        id: `cust_${Date.now()}`,
        name: parsed.entities.customerName,
        phone: "+221770000000",
        business: "Client Marché",
        avatar: "👤",
        riskLevel: "faible",
        totalDebt: 0,
        totalRepaid: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      db.customers.push(customer);
    }

    const credit = {
      id: `cred_${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      amount: parsed.entities.amount || 10000,
      remainingAmount: parsed.entities.amount || 10000,
      description: parsed.entities.description,
      dateIssued: new Date().toISOString().split('T')[0],
      dueDate: parsed.entities.dueDate,
      status: "pending",
      notes: "Enregistré par commande vocale"
    };

    customer.totalDebt = (customer.totalDebt || 0) + credit.amount;
    db.credits.push(credit);
    saveDb(db);

    return res.json({
      success: true,
      action: 'CREDIT_CREATED',
      credit,
      customer,
      message: `Créance de ${credit.amount.toLocaleString('fr-FR')} FCFA enregistrée pour ${customer.name}.`,
      wolofMessage: `Kaye bi yees na : ${customer.name} amna boru ${credit.amount.toLocaleString('fr-FR')} FCFA.`
    });
  } else if (parsed.intent === 'RECORD_PAYMENT') {
    const customer = db.customers.find(c => c.name.toLowerCase() === parsed.entities.customerName.toLowerCase()) || db.customers[0];
    const amount = parsed.entities.amount || 5000;
    
    // Déduire de la créance
    const credit = db.credits.find(c => c.customerId === customer.id && c.remainingAmount > 0);
    if (credit) {
      credit.remainingAmount = Math.max(0, credit.remainingAmount - amount);
      if (credit.remainingAmount === 0) credit.status = 'paid';
      else credit.status = 'partial';
    }
    customer.totalDebt = Math.max(0, (customer.totalDebt || 0) - amount);
    customer.totalRepaid = (customer.totalRepaid || 0) + amount;

    const newTxn = {
      id: `txn_${Date.now()}`,
      creditId: credit ? credit.id : null,
      customerId: customer.id,
      customerName: customer.name,
      amount,
      paymentMethod: parsed.entities.paymentMethod || 'wave',
      reference: `WAVE-SN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      receiptCode: `KKV-REC-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString()
    };

    db.transactions.push(newTxn);
    saveDb(db);

    return res.json({
      success: true,
      action: 'PAYMENT_RECORDED',
      transaction: newTxn,
      customer,
      message: `Paiement de ${amount.toLocaleString('fr-FR')} FCFA enregistré pour ${customer.name}.`,
      wolofMessage: `${customer.name} feyna ${amount.toLocaleString('fr-FR')} FCFA. Jërëjëf !`
    });
  } else {
    return res.json({
      success: false,
      action: 'UNKNOWN',
      message: "Action non reconnue automatiquement. Veuillez vérifier la commande."
    });
  }
});

// 8. Relances WhatsApp (Génération & Simulation d'envoi)
app.post('/api/whatsapp/send-reminder', (req, res) => {
  const db = getDb();
  const { customerId, creditId, tone = 'courtois' } = req.body;

  const customer = db.customers.find(c => c.id === customerId);
  if (!customer) return res.status(404).json({ error: "Client introuvable" });

  const credit = creditId ? db.credits.find(c => c.id === creditId) : db.credits.find(c => c.customerId === customerId && c.remainingAmount > 0);
  const amountDue = credit ? credit.remainingAmount : (customer.totalDebt || customer.currentDebt || 50000);
  const dueDate = credit ? credit.dueDate : null;

  const waveLink = generateWavePaymentLink(db.merchant.waveNumber, amountDue, credit ? credit.id : 'solde', customer.name);

  const reminderData = buildWhatsAppReminder({
    customer,
    merchant: db.merchant,
    amountDue,
    dueDate,
    tone,
    waveLink
  });

  const reminderRecord = {
    id: `rem_${Date.now()}`,
    customerId: customer.id,
    customerName: customer.name,
    phone: customer.phone,
    amount: amountDue,
    channel: "whatsapp",
    status: "delivered",
    message: reminderData.message,
    waveLink,
    sentAt: new Date().toISOString()
  };

  if (!db.reminders) db.reminders = [];
  db.reminders.push(reminderRecord);
  saveDb(db);

  res.json({
    success: true,
    reminder: reminderRecord,
    whatsappUrl: `https://wa.me/${customer.phone.replace(/[\s\+]/g, '')}?text=${encodeURIComponent(reminderData.message)}`
  });
});

// 9. Reçus
app.get('/api/receipts/:txnId', (req, res) => {
  const db = getDb();
  const txn = db.transactions.find(t => t.id === req.params.txnId);
  if (!txn) return res.status(404).json({ error: "Transaction introuvable" });

  const customer = db.customers.find(c => c.id === txn.customerId) || { name: txn.customerName, phone: "+221" };
  const receipt = createTransactionReceipt(txn, db.merchant, customer);
  res.json(receipt);
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[KOOM-KOOM VOICE] Backend API démarré sur http://localhost:${PORT}`);
    console.log(`Mode Marchés Sénégal & UEMOA actif (Wave & WhatsApp Engine)`);
  });
}

export default app;
