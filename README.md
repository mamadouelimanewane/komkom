# 🎙️ Koom-Koom Voice (Sénégal & UEMOA)
### Le « Kaye » Numérique & Recouvrement Vocal WhatsApp pour Grossistes

**Koom-Koom Voice** est une solution complète de gestion des créances informelles et de recouvrement commercial automatisé par la voix et WhatsApp, spécialement conçue pour les grossistes et commerçants des marchés d'Afrique de l'Ouest (Marchés Sandaga, HLM, Tilène à Dakar, Adjamé à Abidjan, etc.).

---

## 🌟 Fonctionnalités Clés

1. **Le « Kaye » Numérique (Carnet de Crédit)**
   - Remplacement instantané du carnet papier sans changer les habitudes du commerçant.
   - Suivi en temps réel des dettes en cours, échéances et retards.
   - Calcul automatique des taux de recouvrement et alertes visuelles.

2. **Moteur Vocal & NLU Spécialisé (Français & Wolof)**
   - Enregistrement au microphone dans le navigateur (Web Speech API).
   - Compréhension naturelle des transactions locales :
     - *"Mamadou Sow a pris 3 sacs de riz pour 75000 FCFA payable vendredi"*
     - *"Alioune feyna 30 000 FCFA ci Wave"*
     - *"Fatou Diop doit 175 000 FCFA pour du bazin"*
   - Extraction automatique : Client débiteur, Montant en FCFA, Marchandise, Date d'échéance.
   - Confirmation vocale bilingue et inscription immédiate dans le Kaye.

3. **Générateur & Simulateur WhatsApp Smartphone**
   - Écran de smartphone interactif reproduisant l'expérience WhatsApp en direct.
   - Messages de relance personnalisés et respectueux des codes culturels locaux (*Salam*, prières de bénédiction, respect).
   - Intégration de liens profonds directs de paiement Wave (`https://wave.com/send?...`).
   - Possibilité d'ouvrir directement le lien dans le vrai WhatsApp Web (`wa.me`).

4. **Passerelle Wave & Quittances Certifiées**
   - Simulation d'encaissement Wave avec règlement en 1 clic.
   - Génération de quittances officielles de paiement avec QR Code et référence unique, prêtes à être imprimées ou partagées sur WhatsApp.

---

## 🚀 Démarrage Rapide

### Option 1 : Double-clic (Recommandé sous Windows)
Double-cliquez simplement sur le fichier :
```
C:\gravity\koom-koom-voice\start-koom-koom.bat
```
Ce script lance automatiquement le backend, le frontend et ouvre votre navigateur sur `http://localhost:3000`.

### Option 2 : En ligne de commande
```bash
# Terminal 1 - Backend (Port 5000)
cd C:\gravity\koom-koom-voice\backend
node server.js

# Terminal 2 - Frontend (Port 3000)
cd C:\gravity\koom-koom-voice\frontend
npm run dev
```

---

## 📱 Architecture du Projet

```
C:\gravity\koom-koom-voice\
├── backend/
│   ├── data/
│   │   └── store.json          # Base de données persistante (Marchand, Kaye, Règlements)
│   ├── services/
│   │   ├── voice-nlu.js        # Moteur NLP/NLU (Wolof & Français du marché)
│   │   ├── wave-service.js     # Génération de deep-links Wave & quittances
│   │   └── whatsapp-engine.js  # Formatage des messages de relance courtois
│   ├── server.js               # Serveur API REST Express
│   └── test-nlu.js             # Tests unitaires du moteur vocal
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx       # Métriques de trésorerie & créances
│   │   │   ├── KayeCredit.jsx      # Carnet interactif & fiches clients
│   │   │   ├── VoiceRecorder.jsx   # Micro vocal avec analyse NLU en direct
│   │   │   ├── WhatsAppSim.jsx     # Simulateur smartphone WhatsApp interactif
│   │   │   ├── WaveCheckout.jsx    # Portail de paiement Wave débiteur
│   │   │   └── ReceiptModal.jsx    # Quittance officielle imprimable
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── vite.config.js
├── scripts/
│   ├── install-frontend.bat
│   └── build-frontend.bat
├── start-koom-koom.bat         # Lanceur unifié en un clic
└── README.md
```

---

## 💡 Passage en Production (Connexion APIs réelles)

1. **WhatsApp Business Cloud API** : Remplacer l'URL du simulateur dans `backend/services/whatsapp-engine.js` par l'appel `https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages` avec votre jeton permanent Meta Cloud.
2. **API Wave Merchant Sénégal** : Connecter votre compte développeur Wave (`https://api.wave.com/v1/checkout/sessions`) pour générer des sessions QR dynamiques et recevoir les webhooks officiels de crédit.
