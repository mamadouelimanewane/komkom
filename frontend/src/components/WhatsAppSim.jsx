import React, { useState } from 'react';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft, 
  CheckCheck, 
  Paperclip, 
  Smile, 
  Mic, 
  ExternalLink,
  Sparkles,
  Receipt
} from 'lucide-react';

export default function WhatsAppSim({ 
  selectedCredit, 
  merchant, 
  onSendRealWhatsApp,
  onOpenWaveCheckout 
}) {
  const [tone, setTone] = useState('courtois'); // courtois, retard, wolof
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'merchant',
      text: selectedCredit 
        ? `Salam ${selectedCredit.customerName}, j'espère que vous vous portez bien.\n\nC'est un rappel amical concernant votre créance de *${selectedCredit.remainingAmount?.toLocaleString('fr-FR')} FCFA* chez *${merchant?.businessName || 'Éts Ndiaye'}*.\n\nLien direct de règlement Wave sans frais :\n👉 https://wave.com/send?phone=221774502819&amount=${selectedCredit.remainingAmount}\n\nDieuredieuf !`
        : `Salam Mamadou, rappel pour votre solde de 90 000 FCFA. Règlement Wave : https://wave.com/send?phone=221774502819&amount=90000`,
      time: '09:42',
      status: 'read'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');

  const customerName = selectedCredit?.customerName || "Mamadou Sow (Client)";
  const customerPhone = selectedCredit?.phone || "+221 77 123 45 67";

  const handleSendCustom = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'merchant',
      text: inputMsg,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };

    setMessages([...messages, newMsg]);
    setInputMsg('');
  };

  const handleSimulateClientReply = () => {
    const replies = [
      "Salam El Hadj, dieuredieuf ! Je viens de cliquer sur le lien Wave, le versement est fait à l'instant.",
      "Salam patron, nanga def ? Je règle la moitié ce soir par Wave et le reste vendredi inch'Allah.",
      "C'est bien noté grand Cheikh, je valide le paiement Wave tout de suite !"
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    const clientMsg = {
      id: Date.now(),
      sender: 'client',
      text: randomReply,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };

    setMessages(prev => [...prev, clientMsg]);
  };

  const waveLink = `https://wave.com/send?phone=${merchant?.waveNumber?.replace(/[\s\+]/g, '') || '221774502819'}&amount=${selectedCredit?.remainingAmount || 50000}`;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Settings / Controls Column */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Module de Recouvrement WhatsApp
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 font-display">
            Générateur de Relances
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Adaptez le ton du message aux règles de courtoisie sénégalaises.
          </p>

          <div className="mt-5 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">Style de relance :</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setTone('courtois')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition ${tone === 'courtois' ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              >
                🤝 Courtois
              </button>
              <button 
                onClick={() => setTone('retard')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition ${tone === 'retard' ? 'bg-rose-50 text-rose-800 border-rose-500 ring-2 ring-rose-500/20' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              >
                ⚠️ Retard
              </button>
              <button 
                onClick={() => setTone('wolof')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition ${tone === 'wolof' ? 'bg-amber-50 text-amber-800 border-amber-500 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              >
                🇸🇳 Wolof
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
            <button 
              onClick={handleSimulateClientReply}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl font-bold text-xs transition"
            >
              💬 Simuler une réponse du client
            </button>

            <button 
              onClick={() => onOpenWaveCheckout(selectedCredit)}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-sky-900/20 transition"
            >
              🌊 Tester l'encaissement via le lien Wave
            </button>

            <a 
              href={`https://wa.me/${customerPhone.replace(/[\s\+]/g, '')}?text=${encodeURIComponent(messages[0]?.text || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ouvrir dans le vrai WhatsApp Web
            </a>
          </div>
        </div>
      </div>

      {/* Smartphone Mockup */}
      <div className="lg:col-span-7 flex justify-center">
        <div className="w-full max-w-[360px] bg-slate-900 rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
          {/* Phone Speaker & Notch */}
          <div className="h-5 flex items-center justify-center relative mb-1">
            <div className="w-20 h-4 bg-slate-950 rounded-full"></div>
            <div className="absolute right-4 w-3 h-3 rounded-full bg-slate-800"></div>
          </div>

          {/* Screen Content */}
          <div className="bg-[#efeae2] rounded-[32px] overflow-hidden flex flex-col h-[560px] relative shadow-inner">
            {/* WhatsApp Header */}
            <div className="bg-[#075e54] text-white px-3 py-3 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-800">
                  {customerName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-xs leading-tight truncate max-w-[130px]">{customerName}</div>
                  <div className="text-[10px] text-emerald-200">en ligne</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Video className="w-4 h-4 text-white/90" />
                <Phone className="w-4 h-4 text-white/90" />
                <MoreVertical className="w-4 h-4 text-white/90" />
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              <div className="text-center my-1">
                <span className="bg-white/80 backdrop-blur-sm text-[10px] text-slate-500 px-2 py-0.5 rounded-md shadow-xs">
                  AUJOURD'HUI
                </span>
              </div>

              {messages.map((msg) => {
                const isMerchant = msg.sender === 'merchant';
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${isMerchant ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-sm text-slate-800 ${
                        isMerchant 
                          ? 'bg-[#dcf8c6] rounded-tr-none' 
                          : 'bg-white rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed text-[12px]">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                        <span>{msg.time}</span>
                        {isMerchant && <CheckCheck className="w-3.5 h-3.5 text-sky-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* WhatsApp Input Bar */}
            <form onSubmit={handleSendCustom} className="p-2 bg-[#f0f2f5] flex items-center gap-2 shrink-0 border-t border-slate-200">
              <Smile className="w-5 h-5 text-slate-500" />
              <Paperclip className="w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Message..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-full bg-white text-xs text-slate-800 border-none focus:outline-none"
              />
              {inputMsg.trim() ? (
                <button type="submit" className="w-8 h-8 rounded-full bg-[#128c7e] text-white flex items-center justify-center">
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#128c7e] text-white flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
