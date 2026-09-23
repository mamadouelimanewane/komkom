import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight, QrCode, Smartphone } from 'lucide-react';

export default function WaveCheckout({ credit, merchant, onPaymentSuccess, onClose }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidDone, setPaidDone] = useState(false);

  const amount = credit?.remainingAmount || 50000;
  const customerName = credit?.customerName || "Client";
  const businessName = merchant?.businessName || "Éts Ndiaye & Frères Sandaga";

  const handleConfirmWavePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creditId: credit?.id,
          customerId: credit?.customerId,
          amount: amount,
          paymentMethod: 'wave'
        })
      });
      const data = await res.json();
      setPaidDone(true);
      setTimeout(() => {
        if (onPaymentSuccess) onPaymentSuccess(data);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la validation du paiement Wave.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-sky-100 animate-in fade-in zoom-in duration-200">
        {/* Wave Blue Header */}
        <div className="bg-[#1ea5fc] text-white p-5 sm:p-6 text-center relative">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-white text-[#1ea5fc] flex items-center justify-center text-xl sm:text-2xl font-black shadow-lg mb-2 sm:mb-3">
            🌊
          </div>
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-90">Wave Sénégal</span>
          <h2 className="text-xl sm:text-2xl font-black font-display mt-0.5 sm:mt-1">
            {amount.toLocaleString('fr-FR')} <span className="text-xs sm:text-sm font-bold">FCFA</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-sky-100 mt-1 truncate">
            À l'ordre de : <span className="font-bold text-white">{businessName}</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {!paidDone ? (
            <>
              <div className="bg-sky-50/60 rounded-2xl p-4 border border-sky-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Client débiteur :</span>
                  <span className="font-bold text-slate-800">{customerName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Frais de transfert :</span>
                  <span className="font-bold text-emerald-600">0 FCFA (Gratuit)</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Numéro marchand :</span>
                  <span className="font-mono font-bold text-slate-800">{merchant?.waveNumber || '+221 77 450 28 19'}</span>
                </div>
              </div>

              {/* Fake Wave QR Code */}
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-dashed border-slate-300 rounded-2xl">
                <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-mono text-xs text-center p-2 relative overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-2 opacity-30">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className={`rounded-xs ${i % 2 === 0 ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                    ))}
                  </div>
                  <span className="relative z-10 font-bold text-slate-700 bg-white/90 px-2 py-1 rounded">QR WAVE RAPIDE</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 font-medium">Scannez avec votre application Wave</span>
              </div>

              <button 
                onClick={handleConfirmWavePayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1ea5fc] hover:bg-[#128edc] text-white font-extrabold text-sm shadow-lg shadow-sky-500/30 transition transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Validation Wave en cours...</span>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>Valider le règlement Wave</span>
                  </>
                )}
              </button>

              <button 
                type="button" 
                onClick={onClose}
                className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 py-1"
              >
                Annuler
              </button>
            </>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Paiement Wave Réussi !</h3>
              <p className="text-xs text-slate-500">
                La somme de {amount.toLocaleString('fr-FR')} FCFA a été transmise. Le carnet de crédit a été décrémenté automatiquement.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
