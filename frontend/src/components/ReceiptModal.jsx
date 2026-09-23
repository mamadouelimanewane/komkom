import React from 'react';
import { Printer, Share2, X, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ReceiptModal({ receipt, onClose }) {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*QUITTANCE DE PAIEMENT KOOM-KOOM*\n` +
      `Réf: ${receipt.receiptId}\n` +
      `Montant: ${receipt.amountPaid?.toLocaleString('fr-FR')} ${receipt.currency}\n` +
      `Client: ${receipt.customerName}\n` +
      `Commerçant: ${receipt.businessName}\n` +
      `Date: ${receipt.date}\n` +
      `Moyen: ${receipt.paymentMethod?.toUpperCase()}\n\n` +
      `Paiement certifié conforme et carnet régularisé.`;
    
    window.open(`https://wa.me/${receipt.customerPhone?.replace(/[\s\+]/g, '') || ''}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Receipt Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧾</span>
            <div>
              <h3 className="font-extrabold text-sm tracking-wide font-display">QUITTANCE DE PAIEMENT</h3>
              <p className="text-[10px] text-slate-400 font-mono">{receipt.receiptId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 bg-slate-50 space-y-4 font-mono text-xs text-slate-700">
          <div className="text-center border-b border-dashed border-slate-300 pb-3">
            <div className="font-black text-sm text-slate-900 font-display uppercase tracking-wider">{receipt.businessName}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{receipt.market}</div>
            <div className="text-[11px] text-slate-500">Tél: {receipt.merchantPhone}</div>
          </div>

          <div className="space-y-1.5 py-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Heure :</span>
              <span className="font-semibold text-slate-900">{receipt.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Client :</span>
              <span className="font-semibold text-slate-900">{receipt.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Téléphone client :</span>
              <span className="text-slate-800">{receipt.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Moyen de règlement :</span>
              <span className="font-bold text-sky-600 uppercase">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Réf. Transaction :</span>
              <span className="text-[10px] text-slate-600">{receipt.reference}</span>
            </div>
          </div>

          {/* Amount Box */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center my-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 block">Montant Encaissé</span>
            <div className="text-2xl font-black text-emerald-800 font-display mt-0.5">
              {receipt.amountPaid?.toLocaleString('fr-FR')} <span className="text-sm font-bold">FCFA</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              SOLDE CERTIFIÉ & MIS À JOUR DANS LE KAYE
            </div>
          </div>

          {/* Verification Barcode / Stamp */}
          <div className="text-center pt-2 border-t border-dashed border-slate-300">
            <div className="inline-block px-3 py-1 rounded bg-slate-200 font-mono text-[10px] text-slate-600 font-bold">
              VERIF-HASH: {receipt.receiptId?.split('-').pop()} • KOOM-KOOM SN
            </div>
            <p className="text-[9px] text-slate-400 mt-1 italic">
              Cette quittance numérique constitue une preuve légale d'extinction de dette selon les usages du marché.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <button 
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl font-bold text-xs transition"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>

          <button 
            onClick={handleShareWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition"
          >
            <Share2 className="w-4 h-4" />
            Partager WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
