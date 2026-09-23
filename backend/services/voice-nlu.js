/**
 * Moteur NLU Vocal Spécialisé Marchés Sénégal & UEMOA
 * Prise en charge du Français commercial local et des expressions courantes en Wolof.
 */

export function parseVoiceInput(text, existingCustomers = []) {
  if (!text || typeof text !== 'string') {
    return {
      intent: 'UNKNOWN',
      confidence: 0,
      originalText: '',
      message: "Aucun texte ou audio détecté."
    };
  }

  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // 1. Détection du moyen de paiement
  let paymentMethod = 'wave';
  if (lower.includes('orange money') || lower.includes('om') || lower.includes('orange')) {
    paymentMethod = 'orange_money';
  } else if (lower.includes('espèce') || lower.includes('espece') || lower.includes('liquide') || lower.includes('cash') || lower.includes('khaliss')) {
    paymentMethod = 'cash';
  } else if (lower.includes('free money') || lower.includes('free')) {
    paymentMethod = 'free_money';
  }

  // 2. Détection de l'intention avec priorité stricte
  let intent = 'UNKNOWN';
  let confidence = 0.5;

  const hasPayKeywords = /\b(fey|feyna|pay[ée]|paiement|rembours|vers[ée]|versement|acompte|règlement)\b/i.test(lower);
  const hasDebtKeywords = /\b(bor|boru|crédit|credit|a pris|m'a pris|doit|dette)\b/i.test(lower);
  const hasBalanceKeywords = /\b(solde|combien|koye|situation)\b/i.test(lower);
  const hasReminderKeywords = /\b(relance|relancer|rappelle|rappeler|fattali|whatsapp)\b/i.test(lower);

  if (hasPayKeywords && !hasDebtKeywords) {
    intent = 'RECORD_PAYMENT';
    confidence = 0.95;
  } else if (hasDebtKeywords && !hasPayKeywords) {
    intent = 'CREATE_CREDIT';
    confidence = 0.95;
  } else if (hasPayKeywords && hasDebtKeywords) {
    // Si les deux sont présents, ex: "a payé sur sa dette", c'est un paiement
    intent = 'RECORD_PAYMENT';
    confidence = 0.88;
  } else if (hasBalanceKeywords) {
    intent = 'CHECK_BALANCE';
    confidence = 0.88;
  } else if (hasReminderKeywords) {
    intent = 'SEND_REMINDER';
    confidence = 0.85;
  }

  // 3. Détection intelligente du montant en FCFA
  let extractedAmount = null;

  // Priorité A : nombre suivi explicitement par FCFA / CFA / F
  const explicitCurrencyRegex = /(\d+[\d\s\.]*)\s*(?:fcfa|f cfa|cfa|frs|francs|f)\b/i;
  const explicitMatch = lower.match(explicitCurrencyRegex);
  if (explicitMatch) {
    const rawNum = explicitMatch[1].replace(/[\s\.]/g, '');
    const num = parseInt(rawNum, 10);
    if (!isNaN(num) && num > 0) {
      extractedAmount = num;
    }
  }

  // Priorité B : Si pas trouvé avec devise, chercher tous les nombres et retenir le plus grand (les montants en FCFA sont en milliers, alors que les quantités sont petites)
  if (!extractedAmount) {
    const allNumbers = lower.match(/\b\d+[\d\s\.]*\b/g);
    if (allNumbers && allNumbers.length > 0) {
      const parsedNums = allNumbers
        .map(n => parseInt(n.replace(/[\s\.]/g, ''), 10))
        .filter(n => !isNaN(n) && n >= 500); // Seuil minimal de montant commercial en FCFA
      if (parsedNums.length > 0) {
        extractedAmount = Math.max(...parsedNums);
      }
    }
  }

  if (!extractedAmount) {
    // Si aucun montant > 500 n'a été trouvé, fallback sur n'importe quel nombre
    const anyNum = lower.match(/\b\d+\b/);
    if (anyNum) {
      extractedAmount = parseInt(anyNum[0], 10);
    }
  }

  if (intent === 'UNKNOWN' && extractedAmount) {
    intent = 'CREATE_CREDIT';
  }

  // 4. Reconnaissance du client
  let matchedCustomer = null;
  for (const cust of existingCustomers) {
    const nameLower = cust.name.toLowerCase();
    const parts = nameLower.split(' ');
    if (lower.includes(nameLower) || parts.some(p => p.length >= 4 && lower.includes(p))) {
      matchedCustomer = cust;
      break;
    }
  }

  let extractedCustomerName = matchedCustomer ? matchedCustomer.name : null;
  if (!extractedCustomerName) {
    const namePatterns = [
      /(?:pour|de|client|chez|à)\s+([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)?)/,
      /^([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)?)\s+(?:a pris|doit|m'a pris|verse|feyna)/i
    ];
    for (const pat of namePatterns) {
      const match = cleanText.match(pat);
      if (match && match[1]) {
        extractedCustomerName = match[1].trim();
        break;
      }
    }
  }

  // 5. Détection de la marchandise / description
  let description = "Vente de marchandises à crédit";
  const descMatch = cleanText.match(/(?:pour|pris)\s+(?:les|du|des|le|la|\d+\s+[a-zA-ZÀ-ÿ]+)?\s*([a-zA-ZÀ-ÿ0-9\s]{3,40}?)(?:\s+(?:pour|payable|à payer|le|\d+\s*fcfa))/i);
  if (descMatch && descMatch[1] && !descMatch[1].toLowerCase().includes('fcfa')) {
    description = descMatch[1].trim();
  } else if (lower.includes('riz')) {
    description = "Sacs de riz";
  } else if (lower.includes('tissu') || lower.includes('bazin') || lower.includes('getzner')) {
    description = "Pièces de tissu / Bazin";
  } else if (lower.includes('huile')) {
    description = "Bidons d'huile";
  }

  // 6. Détection de l'échéance
  let dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  let dueDateFormatted = dueDate.toISOString().split('T')[0];

  if (lower.includes('demain')) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    dueDateFormatted = d.toISOString().split('T')[0];
  } else if (lower.includes('vendredi')) {
    const d = new Date();
    const day = d.getDay();
    const diff = (5 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    dueDateFormatted = d.toISOString().split('T')[0];
  } else if (lower.includes('lundi')) {
    const d = new Date();
    const day = d.getDay();
    const diff = (1 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    dueDateFormatted = d.toISOString().split('T')[0];
  } else if (lower.includes('fin du mois') || lower.includes('fin de mois')) {
    const d = new Date();
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    dueDateFormatted = end.toISOString().split('T')[0];
  } else if (/dans\s+(\d+)\s+jours?/i.test(lower)) {
    const days = parseInt(lower.match(/dans\s+(\d+)\s+jours?/i)[1], 10);
    const d = new Date();
    d.setDate(d.getDate() + days);
    dueDateFormatted = d.toISOString().split('T')[0];
  }

  // 7. Feedback vocal et bilingue
  let confirmationPrompt = "";
  let wolofPrompt = "";

  if (intent === 'CREATE_CREDIT') {
    confirmationPrompt = `Créance de ${extractedAmount ? extractedAmount.toLocaleString('fr-FR') : '0'} FCFA enregistrée pour ${extractedCustomerName || 'le client'}, échéance le ${dueDateFormatted}.`;
    wolofPrompt = `Dañu koy bind ci kaye bi : ${extractedCustomerName || 'client bi'} amna boru ${extractedAmount ? extractedAmount.toLocaleString('fr-FR') : '0'} FCFA.`;
  } else if (intent === 'RECORD_PAYMENT') {
    confirmationPrompt = `Règlement de ${extractedAmount ? extractedAmount.toLocaleString('fr-FR') : '0'} FCFA enregistré pour ${extractedCustomerName || 'le client'} via ${paymentMethod.toUpperCase()}.`;
    wolofPrompt = `${extractedCustomerName || 'Client bi'} feyna ${extractedAmount ? extractedAmount.toLocaleString('fr-FR') : '0'} FCFA ci ${paymentMethod.toUpperCase()}.`;
  } else if (intent === 'CHECK_BALANCE') {
    confirmationPrompt = `Vérification du solde du carnet pour ${extractedCustomerName || 'le compte général'}.`;
    wolofPrompt = `Xoolal ma boru ${extractedCustomerName || 'ñëpp'}.`;
  } else if (intent === 'SEND_REMINDER') {
    confirmationPrompt = `Relance WhatsApp avec lien Wave préparée pour ${extractedCustomerName || 'le client'}.`;
    wolofPrompt = `Yónnee ko rappelu WhatsApp ak lien Wave.`;
  }

  return {
    intent,
    confidence,
    rawText: cleanText,
    entities: {
      customerName: extractedCustomerName || "Client Comptoir",
      isExistingCustomer: !!matchedCustomer,
      customerId: matchedCustomer ? matchedCustomer.id : null,
      amount: extractedAmount || 0,
      description,
      dueDate: dueDateFormatted,
      paymentMethod
    },
    feedback: {
      french: confirmationPrompt,
      wolof: wolofPrompt
    }
  };
}
