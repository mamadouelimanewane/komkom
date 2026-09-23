import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Volume2, 
  RefreshCw, 
  Layers, 
  DollarSign, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function VoiceRecorder({ onParsedActionSuccess }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const recognitionRef = useRef(null);

  // Setup Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';

      recognition.onstart = () => {
        setIsRecording(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setTranscript(current);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setErrorMsg("Veuillez autoriser l'accès au microphone dans votre navigateur.");
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      if (transcript) handleAnalyze(transcript);
    } else {
      setTranscript('');
      setAnalysisResult(null);
      setErrorMsg(null);
      setSuccessMsg(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn("Speech start error:", e);
        }
      } else {
        // Fallback simulateur si navigateur sans API vocale native
        setIsRecording(true);
        setTimeout(() => {
          setIsRecording(false);
          const sample = "Mamadou Sow a pris 3 sacs de riz pour 75000 FCFA payable vendredi prochain";
          setTranscript(sample);
          handleAnalyze(sample);
        }, 3000);
      }
    }
  };

  const handleAnalyze = async (textToAnalyze) => {
    const query = textToAnalyze || transcript;
    if (!query) return;

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/voice/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query })
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Erreur lors de l'analyse vocale. Vérifiez que le serveur backend est en marche.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExecute = async () => {
    if (!transcript) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/voice/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        if (onParsedActionSuccess) onParsedActionSuccess(data);
        // Play local browser TTS confirmation if available
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.message);
          utterance.lang = 'fr-FR';
          window.speechSynthesis.speak(utterance);
        }
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Erreur lors de l'enregistrement de l'opération.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const setExample = (phrase) => {
    setTranscript(phrase);
    setSuccessMsg(null);
    handleAnalyze(phrase);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Voice Control Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Moteur Vocal IA Wolof & Français pour Marchands
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Dictez vos ventes à crédit ou règlements
        </h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2">
          Appuyez sur le micro et parlez comme vous le feriez avec votre assistant à Sandaga ou HLM. L'IA extrait automatiquement le client, la marchandise et le montant FCFA.
        </p>

        {/* Big Record Button */}
        <div className="py-8 flex flex-col items-center justify-center">
          <button 
            onClick={toggleRecording}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-2xl relative ${
              isRecording 
                ? 'bg-rose-600 text-white shadow-rose-900/40 ring-8 ring-rose-100 animate-pulse' 
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-emerald-900/30 hover:shadow-emerald-900/50'
            }`}
          >
            {isRecording ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
          </button>

          {/* Sound waves animation while recording */}
          {isRecording && (
            <div className="flex items-center gap-1.5 mt-5">
              <span className="w-1.5 bg-rose-500 rounded-full soundwave-bar"></span>
              <span className="w-1.5 bg-rose-500 rounded-full soundwave-bar"></span>
              <span className="w-1.5 bg-rose-500 rounded-full soundwave-bar"></span>
              <span className="w-1.5 bg-rose-500 rounded-full soundwave-bar"></span>
              <span className="w-1.5 bg-rose-500 rounded-full soundwave-bar"></span>
              <span className="w-1.5 bg-rose-500 rounded-full soundwave-bar"></span>
              <span className="text-xs font-bold text-rose-600 ml-2 animate-pulse">Écoute en cours...</span>
            </div>
          )}

          {!isRecording && (
            <p className="text-xs text-slate-400 font-medium mt-3">
              Cliquez pour démarrer l'enregistrement vocal
            </p>
          )}
        </div>

        {/* Editable Transcript Input */}
        <div className="relative mt-2">
          <input 
            type="text" 
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              handleAnalyze(e.target.value);
            }}
            placeholder="Exemple : Mamadou Sow a pris 3 sacs de riz pour 75000 FCFA payable vendredi..."
            className="w-full px-4 py-3.5 pr-28 rounded-2xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium shadow-inner"
          />
          {transcript && (
            <button 
              onClick={() => handleAnalyze(transcript)}
              disabled={isAnalyzing}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1"
            >
              {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Analyser
            </button>
          )}
        </div>

        {/* Exemples rapides (One-tap test phrases) */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-left">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Exemples fréquents du marché (Cliquez pour tester) :
          </span>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setExample("Mamadou Sow a pris 3 sacs de riz pour 75000 FCFA payable vendredi")}
              className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200/60 px-3 py-2 rounded-xl transition text-left"
            >
              📦 "Mamadou Sow : 3 sacs de riz 75 000 FCFA payable vendredi"
            </button>

            <button 
              onClick={() => setExample("Fatou Diop doit 175 000 FCFA pour du bazin getzner")}
              className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200/60 px-3 py-2 rounded-xl transition text-left"
            >
              👗 "Fatou Diop : 175 000 FCFA pour du bazin"
            </button>

            <button 
              onClick={() => setExample("Alioune feyna 30 000 FCFA ci Wave")}
              className="text-xs bg-slate-100 hover:bg-sky-50 hover:text-sky-800 hover:border-sky-200 border border-slate-200/60 px-3 py-2 rounded-xl transition text-left"
            >
              🇸🇳 "Alioune feyna 30 000 FCFA ci Wave" (Wolof)
            </button>

            <button 
              onClick={() => setExample("Enregistre un paiement de 50 000 FCFA pour Mamadou Sow")}
              className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200/60 px-3 py-2 rounded-xl transition text-left"
            >
              💵 "Paiement de 50 000 FCFA pour Mamadou Sow"
            </button>
          </div>
        </div>
      </div>

      {/* Errors or Success Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Analysis Result Card */}
      {analysisResult && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-lg animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                analysisResult.intent === 'CREATE_CREDIT' 
                  ? 'bg-amber-100 text-amber-800' 
                  : analysisResult.intent === 'RECORD_PAYMENT' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-100 text-slate-800'
              }`}>
                {analysisResult.intent === 'CREATE_CREDIT' ? '✨ NOUVELLE CRÉANCE DÉTECTÉE' : '💰 RÈGLEMENT DÉTECTÉ'}
              </span>
              <span className="text-xs text-slate-400 font-medium">Confiance : {Math.round(analysisResult.confidence * 100)}%</span>
            </div>
          </div>

          {/* Extracted Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Client Débiteur</span>
              <span className="text-sm font-extrabold text-slate-800 block mt-1">
                {analysisResult.entities.customerName}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Montant</span>
              <span className="text-base font-black text-emerald-600 block mt-1 font-display">
                {analysisResult.entities.amount?.toLocaleString('fr-FR')} FCFA
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Échéance</span>
              <span className="text-xs font-bold text-slate-700 block mt-1">
                {analysisResult.entities.dueDate}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Mode</span>
              <span className="text-xs font-bold text-sky-600 block mt-1 uppercase">
                {analysisResult.entities.paymentMethod}
              </span>
            </div>
          </div>

          {/* Feedback Vocaux (Français & Wolof) */}
          <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 space-y-2">
            <div className="flex items-start gap-2">
              <Volume2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">{analysisResult.feedback?.french}</p>
                <p className="text-[11px] text-emerald-700 italic mt-0.5">Wolof : "{analysisResult.feedback?.wolof}"</p>
              </div>
            </div>
          </div>

          {/* Confirmation Execution Button */}
          <div className="mt-5 flex justify-end">
            <button 
              onClick={handleExecute}
              disabled={isAnalyzing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 sm:px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition transform active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Valider & Inscrire dans le Kaye</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
