import React from 'react';
import { Printer, Download, BookOpen, Sparkles, CheckCircle2, ShieldCheck, Phone, ArrowRight, MessageCircle } from 'lucide-react';

export default function Manuel() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-12">
      {/* Header Toolbar */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-2 border border-emerald-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            Documentation Officielle • Koom-Koom Voice
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold font-display leading-tight">
            Manuel d'Utilisation & Guide Pratique
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
            Guide complet de gestion du « Kaye » numérique et de recouvrement commercial par WhatsApp & Wave.
          </p>
        </div>

        <button 
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs shadow-lg transition transform active:scale-95 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer / Exporter en PDF</span>
        </button>
      </div>

      {/* Manual Content Paper */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-slate-200/80 shadow-sm space-y-6 sm:space-y-8 text-slate-800 text-xs sm:text-sm leading-relaxed">
        
        {/* Intro */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 border-b border-emerald-500 pb-2 mb-3 flex items-center gap-2">
            <span>1.</span> Pourquoi Koom-Koom Voice ?
          </h2>
          <p className="text-slate-600">
            Dans les grands marchés d'Afrique de l'Ouest (Marchés <strong>Sandaga</strong>, <strong>HLM</strong>, <strong>Tilène</strong> à Dakar, ou <strong>Adjamé</strong> à Abidjan), plus de 70% des volumes de marchandises sont vendus à crédit aux détaillants de quartier.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
              <span className="font-bold text-rose-900 text-xs block mb-1">❌ Le problème du carnet papier ("Kaye") :</span>
              <ul className="text-xs text-rose-800 space-y-1 list-disc list-inside">
                <li>Créances oubliées et pages arrachées</li>
                <li>Friction pour taper des chiffres sur un écran au marché</li>
                <li>Gêne sociale lors des relances par téléphone</li>
                <li>Lenteur des remboursements en argent liquide</li>
              </ul>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
              <span className="font-bold text-emerald-900 text-xs block mb-1">✅ La solution Koom-Koom Voice :</span>
              <ul className="text-xs text-emerald-800 space-y-1 list-disc list-inside">
                <li>Saisie 100% vocale en Wolof et Français</li>
                <li>Kaye numérique sécurisé et sauvegardé en ligne</li>
                <li>Relances courtoises automatiques sur WhatsApp</li>
                <li>Règlement instantané sans frais via lien direct Wave</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Module 1: La saisie vocale */}
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 border-b border-emerald-500 pb-2 mb-3 flex items-center gap-2">
            <span>2.</span> Guide de la Saisie Vocale IA
          </h2>
          <p className="text-slate-600 mb-3">
            Vous n'avez pas besoin d'écrire au clavier. Cliquez sur l'onglet <strong>« Saisie Vocale IA »</strong>, appuyez sur le bouton du micro et dictez :
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-700 flex justify-between">
              <span>Exemples de phrases reconnues</span>
              <span>Intention & Extraction</span>
            </div>
            <div className="divide-y divide-slate-200 p-3 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between gap-1 pt-2">
                <span className="font-semibold text-slate-900">« Mamadou Sow a pris 3 sacs de riz pour 75000 FCFA payable vendredi »</span>
                <span className="text-emerald-700 font-bold shrink-0">Créance : 75 000 FCFA (Client : Mamadou Sow)</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-1 pt-2">
                <span className="font-semibold text-slate-900">« Fatou Diop doit 175 000 FCFA pour du bazin riche »</span>
                <span className="text-emerald-700 font-bold shrink-0">Créance : 175 000 FCFA (Client : Fatou Diop)</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-1 pt-2">
                <span className="font-semibold text-slate-900">« Alioune feyna 30 000 FCFA ci Wave » (Wolof)</span>
                <span className="text-sky-700 font-bold shrink-0">Paiement : 30 000 FCFA encaissés</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Le Kaye */}
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 border-b border-emerald-500 pb-2 mb-3 flex items-center gap-2">
            <span>3.</span> Gestion du « Kaye » Numérique
          </h2>
          <p className="text-slate-600 mb-2">
            L'onglet <strong>« Le Kaye »</strong> regroupe vos créances avec un code couleur clair :
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-bold my-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">🟢 EN COURS : Créance active dans les délais</span>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800">🔴 RETARD : Échéance dépassée (relance prioritaire)</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">⚪ SOLDÉ : Dette totalement réglée</span>
          </div>
        </div>

        {/* Module 3: WhatsApp & Wave */}
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 border-b border-emerald-500 pb-2 mb-3 flex items-center gap-2">
            <span>4.</span> Relances WhatsApp & Liens Wave
          </h2>
          <p className="text-slate-600">
            Sur chaque fiche débiteur, cliquez sur <strong>« Relance WhatsApp »</strong>. Vous avez le choix entre 3 styles de messages :
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block mb-1">🤝 Courtois</span>
              Rappel amical avec prières de bénédiction (recommandé avant l'échéance).
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block mb-1">⚠️ Retard</span>
              Rappel ferme mais respectueux proposant un échelonnement de paiement.
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="font-bold text-slate-900 block mb-1">🇸🇳 Wolof</span>
              Rédigé en Wolof usuel pour les commerçants du marché.
            </div>
          </div>

          <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl text-xs text-sky-900 flex items-start gap-3">
            <span className="text-xl">🌊</span>
            <div>
              <strong>Le Lien Direct Wave :</strong> Chaque message WhatsApp contient un lien Wave personnalisé. Lorsque votre client clique dessus, son application Wave s'ouvre avec le montant et votre numéro pré-remplis. Le règlement se fait en 1 seconde sans frais de transfert.
            </div>
          </div>
        </div>

        {/* Module 4: Quittances */}
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 border-b border-emerald-500 pb-2 mb-3 flex items-center gap-2">
            <span>5.</span> Quittance de Paiement Certifiée
          </h2>
          <p className="text-slate-600">
            Dès que le client paie (via Wave ou en espèces au comptoir), une <strong>Quittance Certifiée</strong> avec QR Code et référence unique est générée. Vous pouvez :
          </p>
          <ul className="text-xs text-slate-700 list-disc list-inside mt-2 space-y-1">
            <li>L'imprimer pour la donner en main propre.</li>
            <li>La partager en 1 clic sur WhatsApp au client comme preuve formelle de paiement.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
