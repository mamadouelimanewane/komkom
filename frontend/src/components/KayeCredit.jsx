import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  ArrowRight,
  Receipt,
  Phone,
  DollarSign
} from 'lucide-react';

export default function KayeCredit({ 
  customers, 
  credits, 
  onAddCredit, 
  onRecordPayment, 
  onOpenWhatsApp, 
  onViewReceipt 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, overdue, active, paid
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);

  // Form states for new credit
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPhone, setNewPhone] = useState('+221 ');
  const [newAmount, setNewAmount] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Form state for payment
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('wave');

  // Filter credits
  const filteredCredits = credits.filter(c => {
    const matchesSearch = c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    const isOverdue = c.status === 'overdue' || (c.remainingAmount > 0 && new Date(c.dueDate) < new Date());
    if (filterStatus === 'overdue') return isOverdue;
    if (filterStatus === 'active') return c.remainingAmount > 0 && !isOverdue;
    if (filterStatus === 'paid') return c.remainingAmount === 0 || c.status === 'paid';
    return true;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newCustomerName || !newAmount) return;
    onAddCredit({
      customerName: newCustomerName,
      phone: newPhone,
      amount: parseInt(newAmount, 10),
      description: newDesc || "Vente de marchandises",
      dueDate: newDueDate || undefined
    });
    setShowAddModal(false);
    setNewCustomerName('');
    setNewAmount('');
    setNewDesc('');
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!payAmount || !selectedCredit) return;
    onRecordPayment({
      creditId: selectedCredit.id,
      customerId: selectedCredit.customerId,
      amount: parseInt(payAmount, 10),
      paymentMethod: payMethod
    });
    setShowPayModal(false);
    setPayAmount('');
    setSelectedCredit(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Rechercher un commerçant ou marchandise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 sm:pl-11 pr-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex bg-slate-100 p-1 rounded-xl text-[11px] sm:text-xs font-semibold text-slate-600 shrink-0">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition ${filterStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            >
              Tous ({credits.length})
            </button>
            <button 
              onClick={() => setFilterStatus('overdue')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition ${filterStatus === 'overdue' ? 'bg-rose-600 text-white shadow-sm' : 'hover:text-rose-600'}`}
            >
              Retards
            </button>
            <button 
              onClick={() => setFilterStatus('active')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition ${filterStatus === 'active' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:text-emerald-600'}`}
            >
              En cours
            </button>
            <button 
              onClick={() => setFilterStatus('paid')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition ${filterStatus === 'paid' ? 'bg-slate-800 text-white shadow-sm' : 'hover:text-slate-900'}`}
            >
              Soldés
            </button>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-900/20 transition active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Nouveau</span>
            <span className="xs:hidden">+</span>
          </button>
        </div>
      </div>

      {/* Credits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCredits.map((cred) => {
          const isOverdue = cred.status === 'overdue' || (cred.remainingAmount > 0 && new Date(cred.dueDate) < new Date());
          const isPaid = cred.remainingAmount === 0 || cred.status === 'paid';
          const cust = customers.find(c => c.id === cred.customerId) || {};

          return (
            <div 
              key={cred.id}
              className={`bg-white rounded-2xl p-5 border transition hover:shadow-md relative overflow-hidden flex flex-col justify-between ${
                isPaid 
                  ? 'border-slate-200 opacity-75' 
                  : isOverdue 
                    ? 'border-rose-200 shadow-sm' 
                    : 'border-slate-200/80'
              }`}
            >
              {/* Status Ribbon */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner">
                    {cust.avatar || "👤"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">{cred.customerName}</h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {cust.phone || "Téléphone non renseigné"}
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  isPaid 
                    ? 'bg-slate-100 text-slate-600' 
                    : isOverdue 
                      ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {isPaid ? 'RÉGLÉ' : isOverdue ? 'RETARD' : 'EN COURS'}
                </span>
              </div>

              {/* Debt details */}
              <div className="bg-slate-50 rounded-xl p-3.5 my-3 border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Marchandises à crédit :</div>
                <div className="text-sm font-semibold text-slate-800 line-clamp-2 mt-0.5">
                  {cred.description}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Reste à payer</span>
                    <span className={`text-xl font-black font-display ${isPaid ? 'text-slate-400' : isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                      {cred.remainingAmount?.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-500">FCFA</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Initial : {cred.amount?.toLocaleString('fr-FR')} F</span>
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(cred.dueDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center gap-2">
                {!isPaid && (
                  <>
                    <button 
                      onClick={() => onOpenWhatsApp(cred)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-2.5 rounded-xl font-bold text-xs transition border border-emerald-200"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      Relance WhatsApp
                    </button>

                    <button 
                      onClick={() => { setSelectedCredit(cred); setPayAmount(cred.remainingAmount.toString()); setShowPayModal(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-sky-900/10 transition active:scale-95"
                    >
                      <DollarSign className="w-4 h-4" />
                      Encaisser
                    </button>
                  </>
                )}

                {isPaid && (
                  <button 
                    onClick={() => onViewReceipt(cred)}
                    className="w-full flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-xs transition"
                  >
                    <Receipt className="w-4 h-4 text-slate-500" />
                    Voir la quittance
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nouveau Crédit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Ajouter une créance au « Kaye »
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enregistrement manuel ou vocal d'une vente à crédit.
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nom du client ou commerçant</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Cheikh Tidiane Diallo"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Numéro WhatsApp / Téléphone</label>
                <input 
                  type="text" 
                  placeholder="+221 77 123 45 67"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Montant (FCFA)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="75000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Échéance prévue</label>
                  <input 
                    type="date" 
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description des marchandises</label>
                <textarea 
                  rows="2"
                  placeholder="Ex: 4 cartons de lait Bonnet Rouge + 2 sacs de sucre 50kg"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                >
                  Enregistrer dans le Kaye
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Encaisser Règlement */}
      {showPayModal && selectedCredit && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Encaisser un règlement
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Client : <span className="font-bold text-slate-800">{selectedCredit.customerName}</span> • Solde restant : <span className="font-bold text-emerald-600">{selectedCredit.remainingAmount.toLocaleString('fr-FR')} FCFA</span>
            </p>

            <form onSubmit={handlePaySubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Montant versé (FCFA)</label>
                <input 
                  type="number" 
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-lg font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mode d'encaissement</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    type="button" 
                    onClick={() => setPayMethod('wave')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                      payMethod === 'wave' ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-500/20' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>🌊 Wave</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPayMethod('orange_money')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                      payMethod === 'orange_money' ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>🍊 Orange M.</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPayMethod('cash')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                      payMethod === 'cash' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>💵 Espèces</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition"
                >
                  Valider l'encaissement & Quittance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
