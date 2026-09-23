import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  Key, 
  FileText, 
  Plus, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Percent, 
  Smartphone, 
  Save,
  AlertTriangle,
  ExternalLink,
  Sliders
} from 'lucide-react';

export default function AdminBackoffice() {
  const [adminTab, setAdminTab] = useState('merchants'); // merchants, risk, gateways, logs
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [settings, setSettings] = useState({
    commissionRate: 0.5,
    waveApiMode: 'live',
    waveMerchantId: '',
    waveApiKey: '',
    whatsappPhoneId: '',
    whatsappToken: '',
    smsFallbackEnabled: true
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false);

  // New merchant form
  const [newMName, setNewMName] = useState('');
  const [newMBusiness, setNewMBusiness] = useState('');
  const [newMMarket, setNewMMarket] = useState('Marché Sandaga, Hall Central, Dakar');
  const [newMSector, setNewMSector] = useState('');
  const [newMPhone, setNewMPhone] = useState('+221 ');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        setOverview(data);
        setMerchants(data.merchants || []);
        if (data.platformSettings) {
          setSettings(data.platformSettings);
        }
      }
    } catch (err) {
      console.error("Erreur chargement backoffice:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleMerchant = async (id) => {
    try {
      const res = await fetch(`/api/admin/merchants/${id}/toggle`, { method: 'PUT' });
      if (res.ok) {
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMerchant = async (e) => {
    e.preventDefault();
    if (!newMName || !newMBusiness || !newMPhone) return;

    try {
      const res = await fetch('/api/admin/merchants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMName,
          businessName: newMBusiness,
          market: newMMarket,
          sector: newMSector || "Commerce général",
          phone: newMPhone,
          waveNumber: newMPhone
        })
      });

      if (res.ok) {
        setShowAddMerchantModal(false);
        setNewMName('');
        setNewMBusiness('');
        setNewMSector('');
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-sky-400 text-xs font-bold mb-2 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
              Console de Supervision • Koom-Koom Network
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display">
              Backoffice d'Administration Plateforme
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Gestion centralisée des grossistes partenaires, des passerelles Wave & WhatsApp et surveillance des risques UEMOA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={fetchAdminData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Rafraîchir les données de la plateforme"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Global Platform KPIs */}
      {overview?.stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Marchands Enrôlés</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-1">
              {overview.stats.totalMerchants} <span className="text-xs font-normal text-slate-400">({overview.stats.activeMerchants} actifs)</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              Dakar & Abidjan
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Volume Supervisé</span>
            <div className="text-lg sm:text-2xl font-black text-slate-900 font-display mt-1">
              {overview.stats.totalVolume?.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-400">FCFA</span>
            </div>
            <p className="text-[11px] text-sky-600 font-medium mt-1">
              Flux mensuel estimé
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Revenus Commissions ({overview.stats.commissionRate}%)</span>
            <div className="text-lg sm:text-2xl font-black text-emerald-600 font-display mt-1">
              {overview.stats.platformRevenue?.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-400">FCFA</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Sur encaissements Wave
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Alertes Risque Réseau</span>
            <div className="text-xl sm:text-2xl font-black text-rose-600 font-display mt-1">
              {overview.stats.highRiskCustomers} <span className="text-xs font-normal text-slate-400">clients à risque</span>
            </div>
            <p className="text-[11px] text-rose-600 font-medium mt-1">
              Retards multi-boutiques
            </p>
          </div>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setAdminTab('merchants')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            adminTab === 'merchants' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Grossistes & Marchands ({merchants.length})</span>
        </button>

        <button 
          onClick={() => setAdminTab('risk')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            adminTab === 'risk' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Centrale des Risques (Scoring)</span>
        </button>

        <button 
          onClick={() => setAdminTab('gateways')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            adminTab === 'gateways' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4 text-amber-400" />
          <span>Passerelles & API</span>
        </button>

        <button 
          onClick={() => setAdminTab('logs')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            adminTab === 'logs' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-sky-400" />
          <span>Journal d'Audit</span>
        </button>
      </div>

      {/* TAB 1: Gestion des Grossistes & Marchands */}
      {adminTab === 'merchants' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Répertoire des Grossistes Partenaires</h2>
              <p className="text-xs text-slate-500">Commerçants équipés de la solution Koom-Koom Voice.</p>
            </div>
            <button 
              onClick={() => setShowAddMerchantModal(true)}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              Enrôler un Grossiste
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold">
                  <th className="py-3 px-3">Grossiste & Établissement</th>
                  <th className="py-3 px-3">Marché & Secteur</th>
                  <th className="py-3 px-3">Contact & Wave</th>
                  <th className="py-3 px-3">Vol. Mensuel</th>
                  <th className="py-3 px-3">Taux Recouvr.</th>
                  <th className="py-3 px-3">Statut</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {merchants.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{m.businessName}</div>
                      <div className="text-[11px] text-slate-500">{m.name}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{m.market}</div>
                      <div className="text-[11px] text-slate-400">{m.sector}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-slate-700">{m.phone}</div>
                      <div className="text-[10px] text-sky-600 font-bold">Wave: {m.waveNumber}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {m.monthlyVolume ? m.monthlyVolume.toLocaleString('fr-FR') + ' F' : '-'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                        {m.recoveryRate || 100}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        m.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {m.status === 'active' ? 'ACTIF' : 'SUSPENDU'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        onClick={() => handleToggleMerchant(m.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                          m.status === 'active' 
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' 
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {m.status === 'active' ? 'Suspendre' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Centrale des Risques & Scoring Débiteurs */}
      {adminTab === 'risk' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Centrale des Risques Partagés (Scoring Débiteurs)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Croisement des incidents de paiement entre plusieurs grossistes (détection des détaillants insolvables à l'échelle du marché).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-rose-950">Ibrahima Diallo</h3>
                  <p className="text-xs text-rose-700">Quincaillerie & Électricité Grand Yoff (+221 76 543 21 09)</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-200 text-rose-800 font-black text-xs">
                  SCORE 35/100 (RISQUE ÉLEVÉ)
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-rose-200/60 text-xs text-rose-900 space-y-1">
                <div>• Dette en retard : <strong>250 000 FCFA</strong> (retard de +13 jours)</div>
                <div>• Incidents signalés : 2 retards consécutifs sur Sandaga</div>
                <div className="text-[11px] text-rose-700 mt-2 font-medium">Recommandation : Bloquer tout nouveau crédit sans acompte de 60%.</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-amber-950">Fatou Diop</h3>
                  <p className="text-xs text-amber-700">Atelier Couture & Tissus HLM 5 (+221 78 987 65 43)</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-800 font-black text-xs">
                  SCORE 58/100 (MOYEN)
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-amber-200/60 text-xs text-amber-900 space-y-1">
                <div>• Dette en retard : <strong>175 000 FCFA</strong> (retard de 7 jours)</div>
                <div>• Relances WhatsApp effectuées : 2 (ouvertes avec clic Wave)</div>
                <div className="text-[11px] text-amber-700 mt-2 font-medium">Recommandation : Échelonner sur 2 règlements Wave.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Passerelles Wave & WhatsApp API */}
      {adminTab === 'gateways' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm">
          <div className="pb-3 border-b border-slate-100 mb-5">
            <h2 className="text-lg font-bold text-slate-900 font-display">Configuration des Passerelles Financières & API</h2>
            <p className="text-xs text-slate-500">Paramétrage direct des clés d'intégration Wave Sénégal et Meta WhatsApp Cloud.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
            {/* Wave API */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-3">
              <h3 className="text-sm font-bold text-sky-900 flex items-center gap-2">
                <span>🌊</span> API Wave Merchant Sénégal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Identifiant Marchand Wave</label>
                  <input 
                    type="text" 
                    value={settings.waveMerchantId}
                    onChange={(e) => setSettings({ ...settings, waveMerchantId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    placeholder="WAVE-MERCHANT-SN-..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mode d'exécution</label>
                  <select 
                    value={settings.waveApiMode}
                    onChange={(e) => setSettings({ ...settings, waveApiMode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="live">Live (Production Wave Sénégal)</option>
                    <option value="sandbox">Sandbox (Environnement de test)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* WhatsApp Cloud */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
              <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <span>💬</span> WhatsApp Business Cloud API (Meta)
              </h3>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone Number ID Meta</label>
                <input 
                  type="text" 
                  value={settings.whatsappPhoneId}
                  onChange={(e) => setSettings({ ...settings, whatsappPhoneId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  placeholder="109827364519283"
                />
              </div>
            </div>

            {/* Commission Platform */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-600" /> Commission Koom-Koom sur Recouvrement
              </h3>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="5"
                  value={settings.commissionRate}
                  onChange={(e) => setSettings({ ...settings, commissionRate: parseFloat(e.target.value) })}
                  className="w-28 px-3 py-2 rounded-xl border border-slate-200 text-sm font-black text-emerald-700"
                />
                <span className="text-xs text-slate-500 font-medium">
                  % prélevé sur les montants recouvrés via le lien Wave (Par défaut : 0.5%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                type="submit"
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                Enregistrer les Paramètres
              </button>

              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle className="w-4 h-4" /> Paramètres sauvegardés avec succès !
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: Journal d'Audit & Sécurité */}
      {adminTab === 'logs' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 font-display">Journal d'Audit des Événements Réseau</h2>
            <p className="text-xs text-slate-500">Traçabilité complète des transactions, enregistrements vocaux et webhooks.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {(overview?.recentLogs || []).map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div>
                  <span className="font-bold text-slate-900">{log.type}</span> • <span className="text-slate-600">{log.details}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">Acteur : {log.actor} • IP : {log.ip}</div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Enrôler Grossiste */}
      {showAddMerchantModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Enrôler un Nouveau Grossiste
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ajout d'un commerçant au réseau Koom-Koom Voice.
            </p>

            <form onSubmit={handleAddMerchant} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nom du gérant / propriétaire</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: El Hadj Babacar Diouf"
                  value={newMName}
                  onChange={(e) => setNewMName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Nom de l'établissement / Boutique</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Diouf Négoce & Import"
                  value={newMBusiness}
                  onChange={(e) => setNewMBusiness(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Marché & Emplacement</label>
                <input 
                  type="text" 
                  placeholder="Ex: Marché Sandaga Allée C N°4"
                  value={newMMarket}
                  onChange={(e) => setNewMMarket(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Secteur d'activité</label>
                <input 
                  type="text" 
                  placeholder="Ex: Alimentation générale, Tissus, Quincaillerie"
                  value={newMSector}
                  onChange={(e) => setNewMSector(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Téléphone & Compte Wave Marchand</label>
                <input 
                  type="text" 
                  required
                  placeholder="+221 77 000 00 00"
                  value={newMPhone}
                  onChange={(e) => setNewMPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddMerchantModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Valider l'Enrôlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
