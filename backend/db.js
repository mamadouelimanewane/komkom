import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

// Initial seed data with authentic Dakar wholesalers context
const DEFAULT_DATA = {
  merchant: {
    id: "m_1",
    name: "El Hadj Cheikh Ndiaye",
    businessName: "Établissements Ndiaye & Frères (Gros & Demi-gros)",
    market: "Marché Sandaga, Hall Central, Dakar",
    phone: "+221774502819",
    waveNumber: "+221774502819",
    currency: "FCFA"
  },
  customers: [
    {
      id: "cust_1",
      name: "Mamadou Sow",
      phone: "+221771234567",
      business: "Boutique Alimentation Médina Rue 6",
      avatar: "👨🏾",
      riskLevel: "faible",
      totalDebt: 90000,
      totalRepaid: 150000,
      createdAt: "2026-08-10"
    },
    {
      id: "cust_2",
      name: "Fatou Diop",
      phone: "+221789876543",
      business: "Atelier Couture & Tissus HLM 5",
      avatar: "👩🏾",
      riskLevel: "moyen",
      totalDebt: 175000,
      totalRepaid: 80000,
      createdAt: "2026-08-15"
    },
    {
      id: "cust_3",
      name: "Ibrahima Diallo",
      phone: "+221765432109",
      business: "Quincaillerie & Électricité Grand Yoff",
      avatar: "👨🏾‍💼",
      riskLevel: "eleve",
      totalDebt: 250000,
      totalRepaid: 50000,
      createdAt: "2026-07-20"
    },
    {
      id: "cust_4",
      name: "Aïssatou Ba",
      phone: "+221708899112",
      business: "Cosmétiques & Parfumerie Tilène",
      avatar: "🧕🏾",
      riskLevel: "faible",
      totalDebt: 0,
      totalRepaid: 310000,
      createdAt: "2026-06-01"
    }
  ],
  credits: [
    {
      id: "cred_101",
      customerId: "cust_1",
      customerName: "Mamadou Sow",
      amount: 90000,
      remainingAmount: 90000,
      description: "5 sacs de riz parfumé 50kg + 2 cartons d'huile 5L",
      dateIssued: "2026-09-15",
      dueDate: "2026-09-25",
      status: "pending",
      notes: "Promis de verser par Wave après la foire"
    },
    {
      id: "cred_102",
      customerId: "cust_2",
      customerName: "Fatou Diop",
      amount: 175000,
      remainingAmount: 175000,
      description: "3 rouleaux Getzner Super Magnum + fil doré",
      dateIssued: "2026-09-02",
      dueDate: "2026-09-16",
      status: "overdue",
      notes: "En retard de 7 jours. Relancée hier."
    },
    {
      id: "cred_103",
      customerId: "cust_3",
      customerName: "Ibrahima Diallo",
      amount: 350000,
      remainingAmount: 250000,
      description: "10 rouleaux de câbles 2.5mm + disjoncteurs Legrand",
      dateIssued: "2026-08-20",
      dueDate: "2026-09-10",
      status: "overdue",
      notes: "A versé 100 000 FCFA le 28 août, reste 250 000 FCFA"
    }
  ],
  transactions: [
    {
      id: "txn_501",
      creditId: "cred_103",
      customerId: "cust_3",
      customerName: "Ibrahima Diallo",
      amount: 100000,
      paymentMethod: "wave",
      reference: "WAVE-SN-92817462",
      receiptCode: "KKV-REC-2026-0801",
      timestamp: "2026-08-28T14:30:00Z"
    },
    {
      id: "txn_502",
      creditId: "cred_old",
      customerId: "cust_4",
      customerName: "Aïssatou Ba",
      amount: 120000,
      paymentMethod: "wave",
      reference: "WAVE-SN-44321098",
      receiptCode: "KKV-REC-2026-0902",
      timestamp: "2026-09-10T11:15:00Z"
    }
  ],
  reminders: [
    {
      id: "rem_1",
      customerId: "cust_2",
      customerName: "Fatou Diop",
      phone: "+221789876543",
      amount: 175000,
      channel: "whatsapp",
      status: "delivered",
      message: "Salam Madame Diop. Rappel amical de votre solde de 175 000 FCFA chez Éts Ndiaye Sandaga. Lien direct de règlement Wave sans frais : https://wave.com/send?phone=221774502819&amount=175000",
      waveLink: "https://wave.com/send?phone=221774502819&amount=175000",
      sentAt: "2026-09-22T09:40:00Z"
    }
  ]
};

export function getDb() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const dataDir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
      return DEFAULT_DATA;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erreur lecture DB, fallback sur DEFAULT_DATA:", err);
    return DEFAULT_DATA;
  }
}

export function saveDb(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Erreur sauvegarde DB:", err);
    return false;
  }
}
