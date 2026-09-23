/**
 * Service d'Intégration Passerelle Wave & Mobile Money (Sénégal & UEMOA)
 */

export function generateWavePaymentLink(merchantPhone, amount, reference, customerName = "") {
  // Formatage du numéro international sans le '+'
  const cleanPhone = merchantPhone.replace(/[\s\+]/g, '');
  
  // Format Deep Link Wave Sénégal
  const waveBase = "https://wave.com/send";
  const params = new URLSearchParams({
    phone: cleanPhone,
    amount: amount.toString()
  });

  return `${waveBase}?${params.toString()}`;
}

export function generateOrangeMoneyCode(merchantPhone, amount) {
  const cleanPhone = merchantPhone.replace(/[\s\+]/g, '');
  // Format USSD Marchand Sénégal Orange Money (#144#391*CODE*MONTANT#)
  return `#144#391*${cleanPhone}*${amount}#`;
}

export function createTransactionReceipt(transaction, merchant, customer) {
  const dateFormatted = new Date(transaction.timestamp || Date.now()).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return {
    receiptId: transaction.receiptCode || `KKV-${Date.now().toString().slice(-6)}`,
    merchantName: merchant.name,
    businessName: merchant.businessName,
    market: merchant.market,
    merchantPhone: merchant.phone,
    customerName: customer.name,
    customerPhone: customer.phone,
    amountPaid: transaction.amount,
    currency: "FCFA",
    paymentMethod: transaction.paymentMethod,
    reference: transaction.reference,
    date: dateFormatted,
    verified: true,
    watermark: "KOOM-KOOM CERTIFIED REVENUE",
    qrPayload: `KOOM-KOOM|${transaction.receiptCode}|${transaction.amount}FCFA|${customer.name}|${merchant.businessName}`
  };
}
