import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import KayeCredit from './components/KayeCredit';
import VoiceRecorder from './components/VoiceRecorder';
import WhatsAppSim from './components/WhatsAppSim';
import WaveCheckout from './components/WaveCheckout';
import ReceiptModal from './components/ReceiptModal';
import Manuel from './components/Manuel';
import { 
  LayoutDashboard, 
  BookOpen, 
  Mic, 
  MessageCircle, 
  RefreshCw,
  Bell,
  Sparkles,
  FileText
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, kaye, voice, whatsapp
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    merchant: null,
    kpis: null,
    recentCredits: [],
    recentTransactions: [],
    recentReminders: []
  });
  const [customers, setCustomers] = useState([]);
  const [credits, setCredits] = useState([]);

  // Modals state
  const [waveCheckoutCredit, setWaveCheckoutCredit] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [selectedCreditForWhatsApp, setSelectedCreditForWhatsApp] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, custRes, credRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/customers'),
        fetch('/api/credits')
      ]);

      const dashData = await dashRes.json();
      const custData = await custRes.json();
      const credData = await credRes.json();

      setData(dashData);
      setCustomers(custData);
      setCredits(credData);
    } catch (err) {
      console.error("Erreur de chargement des données:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCredit = async (creditPayload) => {
    try {
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creditPayload)
      });
      if (res.ok) {
        await fetchData();
        setActiveTab('kaye');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordPayment = async (payPayload) => {
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payPayload)
      });
      const resData = await res.json();
      if (res.ok) {
        await fetchData();
        if (resData.receipt) {
          setViewingReceipt(resData.receipt);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVoiceSuccess = async (actionData) => {
    await fetchData();
    if (actionData.action === 'PAYMENT_RECORDED') {
      const receiptRes = await fetch(`/api/receipts/${actionData.transaction.id}`);
      if (receiptRes.ok) {
        const rData = await receiptRes.json();
        setViewingReceipt(rData);
      }
    } else {
      setActiveTab('kaye');
    }
  };

  const handleOpenWhatsAppFromKaye = (credit) => {
    setSelectedCreditForWhatsApp(credit);
    setActiveTab('whatsapp');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xl font-black shadow-md shadow-emerald-900/20">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-950 font-display tracking-tight">Koom-Koom Voice</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 tracking-wider">
                  Sénégal & UEMOA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Le Kaye Numérique & Recouvrement Vocal WhatsApp
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'dashboard' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              Tableau de Bord
            </button>

            <button 
              onClick={() => setActiveTab('kaye')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'kaye' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Le Kaye ({credits.length})
            </button>

            <button 
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'voice' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mic className="w-4 h-4 text-emerald-600" />
              Saisie Vocale IA
            </button>

            <button 
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'whatsapp' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Simulateur WhatsApp
            </button>

            <button 
              onClick={() => setActiveTab('manuel')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'manuel' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              Manuel PDF
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('manuel')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition shadow-xs"
              title="Consulter le Manuel d'utilisation & Export PDF"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Manuel PDF</span>
            </button>

            <button 
              onClick={fetchData} 
              title="Rafraîchir les soldes"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-700 font-mono">WAVE ACTIF</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 md:pb-12">
        {activeTab === 'dashboard' && (
          <Dashboard 
            kpis={data.kpis}
            merchant={data.merchant}
            recentCredits={data.recentCredits}
            recentTransactions={data.recentTransactions}
            onOpenVoice={() => setActiveTab('voice')}
            onSelectCustomer={(cust) => {
              setActiveTab('kaye');
            }}
          />
        )}

        {activeTab === 'kaye' && (
          <KayeCredit 
            credits={credits}
            customers={customers}
            onAddCredit={handleAddCredit}
            onRecordPayment={handleRecordPayment}
            onOpenWhatsApp={handleOpenWhatsAppFromKaye}
            onViewReceipt={(cred) => {
              const matchTxn = data.recentTransactions?.find(t => t.creditId === cred.id);
              if (matchTxn) {
                setViewingReceipt({
                  receiptId: matchTxn.receiptCode,
                  businessName: data.merchant?.businessName,
                  market: data.merchant?.market,
                  merchantPhone: data.merchant?.phone,
                  customerName: cred.customerName,
                  customerPhone: "+221 77 123 45 67",
                  amountPaid: cred.amount,
                  currency: "FCFA",
                  paymentMethod: matchTxn.paymentMethod || "wave",
                  reference: matchTxn.reference,
                  date: new Date().toLocaleDateString('fr-FR')
                });
              } else {
                setViewingReceipt({
                  receiptId: `KKV-REC-${Date.now().toString().slice(-4)}`,
                  businessName: data.merchant?.businessName,
                  market: data.merchant?.market,
                  merchantPhone: data.merchant?.phone,
                  customerName: cred.customerName,
                  customerPhone: "+221 77 123 45 67",
                  amountPaid: cred.amount,
                  currency: "FCFA",
                  paymentMethod: "wave",
                  reference: `WAVE-SOLDE-${cred.id}`,
                  date: new Date().toLocaleDateString('fr-FR')
                });
              }
            }}
          />
        )}

        {activeTab === 'voice' && (
          <VoiceRecorder onParsedActionSuccess={handleVoiceSuccess} />
        )}

        {activeTab === 'whatsapp' && (
          <WhatsAppSim 
            selectedCredit={selectedCreditForWhatsApp || credits[0]}
            merchant={data.merchant}
            onOpenWaveCheckout={(cred) => setWaveCheckoutCredit(cred || credits[0])}
          />
        )}

        {activeTab === 'manuel' && (
          <Manuel />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Optimized for one-hand thumb use) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-1.5 px-2 flex items-center justify-around z-40 shadow-xl">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${activeTab === 'dashboard' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Accueil</span>
        </button>

        <button 
          onClick={() => setActiveTab('kaye')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${activeTab === 'kaye' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span>Kaye</span>
        </button>

        <button 
          onClick={() => setActiveTab('voice')}
          className={`flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white w-12 h-12 rounded-full shadow-lg shadow-emerald-900/40 ring-4 ring-white active:scale-95 transition`}
          title="Microphone Koom-Koom"
        >
          <Mic className="w-6 h-6" />
        </button>

        <button 
          onClick={() => setActiveTab('whatsapp')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${activeTab === 'whatsapp' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <MessageCircle className="w-4 h-4 mb-0.5" />
          <span>WhatsApp</span>
        </button>

        <button 
          onClick={() => setActiveTab('manuel')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${activeTab === 'manuel' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>Manuel</span>
        </button>
      </nav>

      {/* Wave Payment Portal Checkout Modal */}
      {waveCheckoutCredit && (
        <WaveCheckout 
          credit={waveCheckoutCredit}
          merchant={data.merchant}
          onPaymentSuccess={(payResult) => {
            setWaveCheckoutCredit(null);
            fetchData();
            if (payResult.receipt) {
              setViewingReceipt(payResult.receipt);
            }
          }}
          onClose={() => setWaveCheckoutCredit(null)}
        />
      )}

      {/* Official Receipt Modal */}
      {viewingReceipt && (
        <ReceiptModal 
          receipt={viewingReceipt}
          onClose={() => setViewingReceipt(null)}
        />
      )}
    </div>
  );
}
