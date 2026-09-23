import { parseVoiceInput } from './services/voice-nlu.js';

const mockCustomers = [
  { id: "cust_1", name: "Mamadou Sow" },
  { id: "cust_2", name: "Fatou Diop" }
];

const testPhrases = [
  "Mamadou Sow a pris 3 sacs de riz pour 75000 FCFA payable vendredi prochain",
  "Alioune feyna 30 000 FCFA ci Wave",
  "Fatou Diop doit 175 000 FCFA pour du bazin riche",
  "Enregistre un paiement Wave de 50 000 FCFA pour Mamadou Sow"
];

console.log("=== TESTS MOTEUR NLU KOOM-KOOM VOICE ===");
testPhrases.forEach((phrase, idx) => {
  console.log(`\n[Test ${idx + 1}] Phrase: "${phrase}"`);
  const result = parseVoiceInput(phrase, mockCustomers);
  console.log("Intent:", result.intent);
  console.log("Entities:", JSON.stringify(result.entities, null, 2));
  console.log("Feedback FR:", result.feedback.french);
  console.log("Feedback Wolof:", result.feedback.wolof);
});
