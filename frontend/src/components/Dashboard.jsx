import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard,
  PhoneCall,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Dashboard({ kpis, merchant, recentTransactions, recentCredits, onOpenVoice, onSelectCustomer }) {
  if (!kpis) return <div className="p-8 text-center text-slate-500">Chargement des données du marché...</div>;

  return (
    <div className="space-y-6">
      {/* Banner Marchand */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {merchant?.market || "Marché Sandaga, Dakar"}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">
              {merchant?.businessName || "Établissements Ndiaye"}
            </h1>
            <p className="text-emerald-200/80 text-sm mt-1">
              Gérant : <span className="font-semibold text-white">{merchant?.name}</span> • Numéro Wave : <span className="font-mono text-white">{merchant?.waveNumber}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={onOpenVoice}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/50 transition-all transform hover:scale-105 active:scale-95"
            >
              <span className="text-lg">🎙️</span>
              Micro Koom-Koom (Vocal)
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Créances en cours */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Créances en cours</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              FCFA
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 font-display">
              {kpis.totalDebt?.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-500">FCFA</span>
            </div>
            <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {kpis.activeDebtors} commerçant(s) avec solde ouvert
            </p>
          </div>
        </div>

        {/* Total Recouvré */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recouvrement total</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-600 font-display">
              {kpis.totalRepaid?.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-500">FCFA</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Taux de recouvrement : {kpis.recoveryRate}%
            </p>
          </div>
        </div>

        {/* Retards / Alertes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Créances en retard</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-rose-600 font-display">
              {kpis.overdueAmount?.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-500">FCFA</span>
            </div>
            <p className="text-xs text-rose-600 font-medium mt-1">
              {kpis.overdueCount} dossier(s) à relancer en priorité
            </p>
          </div>
        </div>

        {/* Débiteurs Actifs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Réseau Débiteurs</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-slate-900 font-display">
              {kpis.activeDebtors} <span className="text-xs font-semibold text-slate-500">actifs</span>
            </div>
            <p className="text-xs text-sky-600 font-medium mt-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Relances automatisées actives
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Dernières Opérations du Kaye & Règlements Wave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Créances récentes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Dernières entrées au « Kaye »
            </h2>
            <span className="text-xs text-slate-500 font-medium">Temps réel</span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentCredits?.length > 0 ? (
              recentCredits.slice(0, 4).map((cred) => (
                <div key={cred.id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 rounded-lg px-2 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700">
                      {cred.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{cred.customerName}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">{cred.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-slate-900">
                      {cred.remainingAmount?.toLocaleString('fr-FR')} FCFA
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Échéance : {new Date(cred.dueDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">Aucune créance enregistrée</p>
            )}
          </div>
        </div>

        {/* Derniers Règlements Wave / Cash */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-sky-600" />
              Derniers Règlements Recouvrés
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold">
              Wave & Espèces
            </span>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentTransactions?.length > 0 ? (
              recentTransactions.slice(0, 4).map((txn) => (
                <div key={txn.id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 rounded-lg px-2 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                      txn.paymentMethod === 'wave' ? 'bg-sky-500 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {txn.paymentMethod === 'wave' ? 'W' : 'C'}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{txn.customerName}</div>
                      <div className="text-xs text-slate-500 font-mono">{txn.reference}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-emerald-600">
                      +{txn.amount?.toLocaleString('fr-FR')} FCFA
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(txn.timestamp).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">Aucun règlement récent</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
