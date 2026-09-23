/**
 * Moteur de Messagerie WhatsApp & Relations Débiteurs Marchés d'Afrique de l'Ouest
 */

export function buildWhatsAppReminder({ customer, merchant, amountDue, dueDate, tone = 'courtois', waveLink }) {
  const formattedAmount = (amountDue || 0).toLocaleString('fr-FR');
  const dueDateStr = dueDate ? new Date(dueDate).toLocaleDateString('fr-FR') : 'incessamment';

  let message = "";

  if (tone === 'courtois') {
    message = `Salam ${customer.name}, j'espère que vous et la famille vous portez bien.\n\n` +
      `C'est un rappel amical concernant votre créance en cours de *${formattedAmount} FCFA* chez *${merchant.businessName}* (${merchant.market}), arrivant à échéance le ${dueDateStr}.\n\n` +
      `Vous pouvez régler directement et sans frais via ce lien Wave sécurisé :\n👉 ${waveLink}\n\n` +
      `Yalla na Yalla barkeel ligéey bi. Dieuredieuf !`;
  } else if (tone === 'retard') {
    message = `Salam ${customer.name}.\n\n` +
      `Nous constatons que l'échéance du ${dueDateStr} pour un montant de *${formattedAmount} FCFA* est dépassée.\n\n` +
      `Merci d'effectuer le règlement par Wave pour clôturer le kaye :\n👉 ${waveLink}\n\n` +
      `Si vous souhaitez convenir d'un échelonnement, merci de me contacter rapidement au ${merchant.phone}.\nBonne journée !`;
  } else if (tone === 'wolof') {
    message = `Salam ${customer.name}, nanga def ?\n\n` +
      `Dañu lay rappelé bor bi ci kaye bi : *${formattedAmount} FCFA* ci *${merchant.businessName}*.\n\n` +
      `Mën nga fey leegi ci Wave ci lien bii :\n👉 ${waveLink}\n\n` +
      `Dieuredieuf ak jàmm !`;
  } else if (tone === 'remerciement') {
    message = `Salam ${customer.name} !\n\n` +
      `Nous confirmons la bonne réception de votre paiement de *${formattedAmount} FCFA*. Votre carnet a été mis à jour avec succès.\n\n` +
      `Merci infiniment pour votre fidélité et votre sérieux.\n*${merchant.businessName}* vous remercie !`;
  }

  return {
    recipientPhone: customer.phone,
    recipientName: customer.name,
    message,
    waveLink,
    tone,
    timestamp: new Date().toISOString()
  };
}
