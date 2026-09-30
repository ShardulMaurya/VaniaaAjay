import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Home,
  User,
  Sparkles,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Settings,
  Mic,
  MicOff,
  Volume2,
  Square,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Bell,
  MapPin,
  Award,
  Gift,
  ShieldCheck,
  Edit3,
  LogOut,
  Maximize2,
  Minimize2,
  Lock,
  KeyRound,
  Fingerprint,
  LayoutDashboard,
  Users,
  FileCheck,
  Filter,
  BadgeCheck,
  Building,
  Activity,
  Check,
  RefreshCw,
  PhoneCall,
  Save,
  Calculator,
  X,
  Printer,
  QrCode,
  FileText,
  Languages,
  Headphones,
  Download,
  Map,
  Zap,
  Wheat,
  Milk,
  Scissors,
  Wrench,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";

// ==========================================
// 1. LIVE REACTIVE AUDIO WAVEFORM COMPONENT
// ==========================================
function LiveMicVisualizer({ isRecording, darkMode }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!isRecording) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = darkMode ? "rgba(148, 163, 184, 0.4)" : "rgba(203, 213, 225, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      return;
    }

    let isCancelled = false;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          if (isCancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;

          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;

          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const drawBars = () => {
            animFrameRef.current = requestAnimationFrame(drawBars);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 1.8;
            let x = 4;

            for (let i = 0; i < bufferLength; i++) {
              const barHeight = Math.max(3, (dataArray[i] / 255) * (canvas.height - 4));
              const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
              gradient.addColorStop(0, "#ef4444");
              gradient.addColorStop(0.5, "#f59e0b");
              gradient.addColorStop(1, "#10b981");

              ctx.fillStyle = gradient;
              ctx.fillRect(x, (canvas.height - barHeight) / 2, Math.max(2, barWidth - 2), barHeight);

              x += barWidth + 1.5;
              if (x > canvas.width) break;
            }
          };

          drawBars();
        })
        .catch(() => {
          let simPhase = 0;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");

          const drawSim = () => {
            animFrameRef.current = requestAnimationFrame(drawSim);
            simPhase += 0.15;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);
            for (let px = 0; px < canvas.width; px += 4) {
              const py = canvas.height / 2 + Math.sin(px * 0.15 + simPhase) * 6;
              ctx.lineTo(px, py);
            }
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 2;
            ctx.stroke();
          };
          drawSim();
        });
    }

    return () => {
      isCancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isRecording, darkMode]);

  return (
    <canvas
      ref={canvasRef}
      width={130}
      height={32}
      style={{ display: "block", borderRadius: 4 }}
    />
  );
}

// ==========================================
// 2. INLINE BACKGROUND ANIMATION COMPONENT
// ==========================================
function LoginBackground({ children, darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const tradeSymbols = ["⚡", "🌾", "🥛", "🧵", "🔧", "🚜", "☀️"];
    const nodes = Array.from({ length: 24 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.78),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      symbol: tradeSymbols[i % tradeSymbols.length],
      size: Math.random() * 4 + 14,
      alpha: Math.random() * 0.35 + 0.15
    }));

    let wavePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      wavePhase += 0.022;
      const waveBaseY = height * 0.88;

      const drawAudioRibbon = (amplitude, frequency, offset, color) => {
        ctx.beginPath();
        ctx.moveTo(0, waveBaseY);
        for (let x = 0; x <= width; x += 6) {
          const y =
            waveBaseY +
            Math.sin(x * frequency + wavePhase + offset) * amplitude *
            Math.cos(x * 0.0015 + wavePhase * 0.5);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      };

      if (darkMode) {
        drawAudioRibbon(26, 0.008, 0, "rgba(59, 130, 246, 0.28)");
        drawAudioRibbon(36, 0.005, 2, "rgba(245, 158, 11, 0.28)");
        drawAudioRibbon(20, 0.012, 4, "rgba(16, 185, 129, 0.28)");
      } else {
        drawAudioRibbon(28, 0.008, 0, "rgba(37, 99, 235, 0.2)");
        drawAudioRibbon(40, 0.005, 2, "rgba(249, 115, 22, 0.22)");
        drawAudioRibbon(22, 0.012, 4, "rgba(5, 150, 105, 0.2)");
      }

      const lineColor = darkMode ? "rgba(59, 130, 246, 0.08)" : "rgba(12, 35, 64, 0.06)";
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 135) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        ctx.font = `${n.size}px sans-serif`;
        ctx.fillStyle = darkMode
          ? `rgba(226, 232, 240, ${n.alpha * 0.85})`
          : `rgba(15, 23, 42, ${n.alpha * 0.7})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.symbol, n.x, n.y);

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 20 || n.x > width - 20) n.vx *= -1;
        if (n.y < 20 || n.y > height * 0.8) n.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: darkMode
          ? "radial-gradient(circle at 10% 10%, rgba(245, 158, 11, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.12) 0%, transparent 45%), linear-gradient(180deg, #070d18 0%, #030814 100%)"
          : "radial-gradient(circle at 10% 10%, rgba(254, 215, 170, 0.65) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(187, 247, 208, 0.65) 0%, transparent 45%), linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)"
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1
        }}
      />
      <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

// ==========================================
// 3. MULTILINGUAL LOCALIZATION DICTIONARY
// ==========================================
const translations = {
  English: {
    govIndia: "Government of India",
    mosje: "Ministry of Social Justice and Empowerment (MoSJE)",
    counseledBadge: "1,482+ Beneficiaries Counseled",
    audioGuideBtn: "What is this portal? (Audio Guide)",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit Fullscreen",
    citizenLoginBtn: "Citizen Login",
    officerLoginBtn: "Officer Login",
    heroTitle: "Vani-Ajay",
    heroSubtitle: "Voice-first AI skilling and livelihood assistant for Scheduled Caste citizens. Speak naturally in local dialects to match accredited NSQF qualification packs, ₹15,000 modern trade toolkits, and direct ₹50,000 enterprise subsidies.",
    heroCtaCitizen: "Citizen Login (Aadhaar / Voice)",
    heroCtaOfficer: "District Officer / Admin Login",
    goToDashboard: "Open Citizen Dashboard →",
    statTraining: "Training Fees",
    statTrainingVal: "100% Free",
    statTrainingSub: "+ Monthly Stipend",
    statToolkit: "Free Tool-Kit",
    statToolkitVal: "₹15,000",
    statToolkitSub: "Upon Certification",
    statSubsidy: "Capital Subsidy",
    statSubsidyVal: "₹50,000",
    statSubsidySub: "50% Direct Grant",
    statLoan: "NSFDC Soft Loan",
    statLoanVal: "4% p.a.",
    statLoanSub: "Zero Collateral",
    howTitle: "How Vani-Ajay Bridges the Skilling Gap",
    step1Title: "1. Speak in Vernacular Dialect",
    step1Desc: "Rural beneficiaries do not need to fill out complex forms. They speak in Bundeli, Bhojpuri, or Hindi describing what they know (e.g. tubewell repair, dairy, milling).",
    step2Title: "2. AI Maps NSQF & Demands",
    step2Desc: "The AI matches trade aspirations with accredited qualification packs (Level 3/4) and pairs candidates with authorized Government ITIs or PMKK centers nearby.",
    step3Title: "3. Direct Grant Sanctions",
    step3Desc: "Instantly calculates direct grant entitlements: free tuition, a ₹15,000 modern trade toolkit, and ₹50,000 seed capital subsidy disbursed straight into the beneficiary's DBT bank account.",
    pillarsTitle: "Explore PM-AJAY GIA Statutory Entitlements",
    pillar1Tab: "1. Skill Training",
    pillar2Tab: "2. ₹15,000 Tool-Kit",
    pillar3Tab: "3. ₹50,000 Grant & EMI",
    tradesTitle: "Which trade do you want to learn or start? (Touch picture to choose)",
    tradesSubtitle: "Please login with Aadhaar first so your chosen trade, grant, and voice questions can be saved securely.",
    touchToHear: "Login required to save progress",
    selectThis: "Select & Login",
    needHelp: "Need Assistance? (Toll-Free Helpline)",
    needHelpSub: "Visit your nearest CSC Center or District Welfare Office. Toll-Free: 1800-2026-AJAY",
    directAadhaarBtn: "Login with Aadhaar Directly →",
    portalHomeBtn: "Portal Home",
    citizenKioskReturn: "← Return to Portal Home",
    listening: "Listening to your voice...",
    voiceAssistant: "Voice Assistant",
    speakChanges: "Tap mic to speak changes",
    tapToSpeakHero: "Tap to Speak (Login First)",
    listeningHero: "Listening...",
    profileCompleted: "Profile Completed",
    recommendedPathways: "Recommended Pathways",
    docReadiness: "Document Readiness",
    nextStep: "Next Step",
    inProgress: "In Progress",
    profileSummary: "Your Profile Summary",
    hearBackProfile: "Hear Back Profile",
    topRecommendation: "Your Top Recommendation",
    highMatch: "High Match",
    alternativePathways: "Alternative Pathways:",
    listenAdvice: "Listen Advice & Claim Grants",
    stopVoice: "Stop Voice",
    docsBadge: "Docs",
    grantEmiBtn: "Grant & EMI",
    printSlipBtn: "Print Slip",
    officerViewBtn: "Officer View",
    saveChanges: "Save Profile Changes",
    exportCsv: "Export CSV",
    liveTelemetry: "LIVE TELEMETRY FEED",
    totalCounseled: "Total Counseled Citizens",
    toolkitsDisbursed: "Toolkits Disbursed",
    subsidiesApproved: "Subsidies Approved",
    avgSaturation: "Average ITI Saturation",
    blockDensity: "District Livelihood Block Cluster Density",
    tradeDemandMatrix: "Voiced Citizen Trade Demand Matrix",
    grantUtilization: "Grant Fund Utilization Pipeline",
    disbursed: "Disbursed",
    actionApprove: "Approve",
    sanctionedBadge: "✓ Sanctioned",
    underReview: "Under Review"
  },
  Hindi: {
    govIndia: "भारत सरकार",
    mosje: "सामाजिक न्याय और अधिकारिता मंत्रालय (MoSJE)",
    counseledBadge: "१,४८२+ लाभार्थियों की काउंसिलिंग पूर्ण",
    audioGuideBtn: "यह पोर्टल क्या है? (ऑडियो गाइड)",
    fullscreen: "पूर्ण स्क्रीन (Fullscreen)",
    exitFullscreen: "सामान्य स्क्रीन",
    citizenLoginBtn: "नागरिक लॉगिन",
    officerLoginBtn: "अधिकारी लॉगिन",
    heroTitle: "वाणी-अजय (Vani-Ajay)",
    heroSubtitle: "अनुसूचित जाति के भाई-बहनों हेतु आवाज से संचालित कौशल व आजीविका पोर्टल। अपनी बोली में बोलकर सरकारी कोर्स, ₹15,000 की आधुनिक टूलकिट और ₹50,000 का सरकारी अनुदान पाएं।",
    heroCtaCitizen: "नागरिक लॉगिन (आधार व आवाज)",
    heroCtaOfficer: "जिला अधिकारी / एडमिन लॉगिन",
    goToDashboard: "नागरिक डैशबोर्ड खोलें →",
    statTraining: "प्रशिक्षण शुल्क",
    statTrainingVal: "१००% मुफ़्त",
    statTrainingSub: "+ हर माह वजीफा",
    statToolkit: "मुफ़्त टूल-किट",
    statToolkitVal: "₹१५,०००",
    statToolkitSub: "सर्टिफिकेट मिलने पर",
    statSubsidy: "पूंजी अनुदान",
    statSubsidyVal: "₹५०,०००",
    statSubsidySub: "५०% सरकारी मदद",
    statLoan: "सस्ता बैंक ऋण",
    statLoanVal: "४% वार्षिक",
    statLoanSub: "बिना किसी गारंटी",
    howTitle: "वाणी-अजय कैसे कार्य करता है?",
    step1Title: "१. अपनी बोली में बोलें",
    step1Desc: "ग्रामीण नागरिकों को कोई कठिन फॉर्म भरने की जरूरत नहीं। बुंदेली, भोजपुरी या हिंदी में बोलकर बताएं कि आप क्या काम जानते हैं।",
    step2Title: "२. एआई द्वारा कोर्स मिलान",
    step2Desc: "सिस्टम आपकी पसंद को सरकारी आईटीआई (ITI) और पीएमकेके (PMKK) केंद्रों के मान्यता प्राप्त एनएसक्यूएफ कोर्स से जोड़ता है।",
    step3Title: "३. सीधा सरकारी अनुदान",
    step3Desc: "मुफ्त पढ़ाई, ₹15,000 की आधुनिक टूलकिट और ₹50,000 की दुकान सहायता सीधे आपके बैंक खाते (DBT) में स्वीकृत होती है।",
    pillarsTitle: "पीएम-अजय योजना के तीन मुख्य स्तंभ",
    pillar1Tab: "१. निशुल्क कौशल प्रशिक्षण",
    pillar2Tab: "२. ₹१५,००० टूलकिट",
    pillar3Tab: "३. ₹५०,००० दुकान अनुदान",
    tradesTitle: "आप कौन सा काम सीखना या शुरू करना चाहते हैं? (चित्र छूकर चुनें)",
    tradesSubtitle: "कृपया पहले आधार लॉगिन करें ताकि आपका चयनित कोर्स, अनुदान व आवाज से पूछे गए प्रश्न सुरक्षित रखे जा सकें।",
    touchToHear: "डेटा सुरक्षित रखने हेतु लॉगिन जरूरी",
    selectThis: "चुनें व लॉगिन करें",
    needHelp: "सहायता की आवश्यकता है? (टोल-फ्री हेल्पलाइन)",
    needHelpSub: "नजदीकी सीएससी (CSC) केंद्र या जिला कल्याण कार्यालय पर संपर्क करें। टोल-फ्री: 1800-2026-AJAY",
    directAadhaarBtn: "सीधे आधार से लॉगिन करें →",
    portalHomeBtn: "पोर्टल मुख्य पृष्ठ",
    citizenKioskReturn: "← मुख्य पृष्ठ पर वापस जाएं",
    listening: "आपकी आवाज सुन रहे हैं...",
    voiceAssistant: "आवाज सहायक",
    speakChanges: "माइक दबाकर बदलाव बोलें",
    tapToSpeakHero: "माइक दबाएं (पहले लॉगिन करें)",
    listeningHero: "सुन रहे हैं...",
    profileCompleted: "प्रोफ़ाइल पूर्णता",
    recommendedPathways: "सुझाए गए कोर्स",
    docReadiness: "दस्तावेज तैयारी",
    nextStep: "अगला कदम",
    inProgress: "प्रक्रिया जारी",
    profileSummary: "आपकी प्रोफ़ाइल का सारांश",
    hearBackProfile: "प्रोफ़ाइल सुनें",
    topRecommendation: "आपका सर्वोत्तम अनुशंसित कोर्स",
    highMatch: "सर्वोत्तम मैच",
    alternativePathways: "अन्य विकल्प कोर्स:",
    listenAdvice: "योजना की सलाह सुनें व लाभ लें",
    stopVoice: "आवाज बंद करें",
    docsBadge: "दस्तावेज",
    grantEmiBtn: "अनुदान व ईएमआई",
    printSlipBtn: "रसीद प्रिंट करें",
    officerViewBtn: "अधिकारी पोर्टल",
    saveChanges: "प्रोफ़ाइल सुरक्षित करें",
    exportCsv: "सीएसवी रिपोर्ट डाउनलोड",
    liveTelemetry: "लाइव टेलीमेट्री फीड",
    totalCounseled: "कुल काउंसिलिंग नागरिक",
    toolkitsDisbursed: "टूलकिट वितरित",
    subsidiesApproved: "अनुदान स्वीकृत",
    avgSaturation: "औसत आईटीआई क्षमता उपयोग",
    blockDensity: "जिला ब्लॉकवार मांग घनत्व (Heatmap)",
    tradeDemandMatrix: "नागरिकों द्वारा बोली गई ट्रेड मांग",
    grantUtilization: "अनुदान निधि उपयोग पाइपलाइन",
    disbursed: "खाते में भेजा गया",
    actionApprove: "स्वीकृत करें",
    sanctionedBadge: "✓ स्वीकृत",
    underReview: "समीक्षाधीन"
  }
};

// Helper for session storage persistence
function getStoredValue(key, fallback) {
  try {
    const item = window.sessionStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStoredValue(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

// ==========================================
// 4. MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  // PERSISTENT VIEW AND TAB STATES
  const [currentView, setCurrentView] = useState(() => getStoredValue("va_currentView", "landing"));
  const [customerTab, setCustomerTab] = useState(() => getStoredValue("va_customerTab", "home"));
  const [adminTab, setAdminTab] = useState(() => getStoredValue("va_adminTab", "overview"));
  const [lang, setLang] = useState(() => getStoredValue("va_lang", "English"));
  const [dialect, setDialect] = useState(() => getStoredValue("va_dialect", "Standard"));
  const [darkMode, setDarkMode] = useState(() => getStoredValue("va_darkMode", false));

  const [verifiedCitizen, setVerifiedCitizen] = useState(() => getStoredValue("va_verifiedCitizen", null));
  const [authenticatedOfficer, setAuthenticatedOfficer] = useState(() => getStoredValue("va_authenticatedOfficer", null));

  // Sync to sessionStorage whenever changed
  useEffect(() => { setStoredValue("va_currentView", currentView); }, [currentView]);
  useEffect(() => { setStoredValue("va_customerTab", customerTab); }, [customerTab]);
  useEffect(() => { setStoredValue("va_adminTab", adminTab); }, [adminTab]);
  useEffect(() => { setStoredValue("va_lang", lang); }, [lang]);
  useEffect(() => { setStoredValue("va_dialect", dialect); }, [dialect]);
  useEffect(() => { setStoredValue("va_darkMode", darkMode); }, [darkMode]);
  useEffect(() => { setStoredValue("va_verifiedCitizen", verifiedCitizen); }, [verifiedCitizen]);
  useEffect(() => { setStoredValue("va_authenticatedOfficer", authenticatedOfficer); }, [authenticatedOfficer]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const tText = translations[lang] || translations.English;

  // Modals & Sliders
  const [homePillarTab, setHomePillarTab] = useState("training");
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPrintSlip, setShowPrintSlip] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [calcProjectCost, setCalcProjectCost] = useState(100000);
  const [calcTenureYears, setCalcTenureYears] = useState(5);

  const currentUtteranceRef = useRef(null);
  const [availableVoices, setAvailableVoices] = useState([]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Citizen Authentication Form State
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [consentChecked, setConsentChecked] = useState(true);
  const [loginError, setLoginError] = useState("");

  // Officer Authentication Form State
  const [officerId, setOfficerId] = useState("");
  const [officerPassword, setOfficerPassword] = useState("");
  const [officerDesignation, setOfficerDesignation] = useState("District Welfare Officer (DWO)");
  const [officerDistrict, setOfficerDistrict] = useState("Bhopal");
  const [officerLoginError, setOfficerLoginError] = useState("");

  const [selectedClusterBlock, setSelectedClusterBlock] = useState("All");
  const [pendingTradeTarget, setPendingTradeTarget] = useState(null);

  // Customer Profile State
  const [profile, setProfile] = useState(() => getStoredValue("va_profile", {
    name: "Priya Singh",
    age: "22 years",
    education: "Class 10",
    occupation: "Farming (family business)",
    skills: "Basic electrical work",
    interests: "Repair work, Technical jobs",
    mobility: "Within 20 km",
    preference: "Self-employment",
    district: "Bhopal",
    category: "Scheduled Caste (SC)"
  }));

  useEffect(() => {
    setStoredValue("va_profile", profile);
  }, [profile]);

  const [docChecklist, setDocChecklist] = useState({
    casteCert: true,
    incomeCert: true,
    bankDbtSeeded: true,
    educationMarksheet: true
  });

  const readinessScore = Object.values(docChecklist).filter(Boolean).length * 25;

  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState(
    "I want to learn technical repair work so I can start my own workshop."
  );

  // Dynamic NSQF Advisory based on actual profile
  const dynamicAdvisor = useMemo(() => {
    const skillsLower = (profile.skills || "").toLowerCase();
    const interestsLower = (profile.interests || "").toLowerCase();
    const occupationLower = (profile.occupation || "").toLowerCase();
    const combined = `${skillsLower} ${interestsLower} ${occupationLower}`;

    if (combined.includes("dairy") || combined.includes("milk") || combined.includes("दूध") || combined.includes("पशु")) {
      return {
        topRole: "Dairy Farm Supervisor & Bulk Milk Chiller Operator",
        nsqfLevel: "NSQF Level 4",
        qpCode: "FIC/Q0103",
        sector: "Food Processing & Dairy",
        matchPercentage: "95%",
        benefits: [
          `Directly leverages your background in ${profile.skills}`,
          `High demand for rural chilling units in ${profile.district}`,
          `Approved under PM-AJAY GIA subsidized dairy enterprise scheme`,
          `Complete hands-on training provided with ₹2,000/mo stipend`
        ],
        center: `${profile.district} Co-operative Dairy Training Wing`
      };
    } else if (combined.includes("sewing") || combined.includes("cloth") || combined.includes("सिलाई") || combined.includes("हथकरघा") || combined.includes("tailor")) {
      return {
        topRole: "Handloom Weaver & Technical Garment Maker",
        nsqfLevel: "NSQF Level 4",
        qpCode: "TSC/Q7301",
        sector: "Textiles & Handloom",
        matchPercentage: "94%",
        benefits: [
          `Matches your experience with ${profile.skills}`,
          `Free modern automated sewing machine & tool-kit voucher`,
          `Dedicated women & SC beneficiary livelihood clusters in ${profile.district}`,
          `Zero-interest microcredit linkage for rural production`
        ],
        center: `${profile.district} Kaushal Vikas Kendra (Textiles)`
      };
    } else if (combined.includes("motor") || combined.includes("bike") || combined.includes("auto") || combined.includes("मैकेनिक") || combined.includes("गाड़ी")) {
      return {
        topRole: "Automotive Two-Wheeler & EV Service Technician",
        nsqfLevel: "NSQF Level 4",
        qpCode: "ASC/Q1401",
        sector: "Automotive & Clean Mobility",
        matchPercentage: "97%",
        benefits: [
          `Direct alignment with your experience in ${profile.skills}`,
          `Equips you to open a self-owned garage or workshop in ${profile.district}`,
          `100% Free toolkit box with diagnostic multimeter & pneumatic tools`,
          `Soft loan assistance under NSFDC concessional credit @ 4%`
        ],
        center: `Govt ITI ${profile.district}`
      };
    } else if (combined.includes("grain") || combined.includes("flour") || combined.includes("चक्की") || combined.includes("मिलिंग") || combined.includes("कृषि")) {
      return {
        topRole: "Food Grain Milling & Spice Processing Technician",
        nsqfLevel: "NSQF Level 3",
        qpCode: "FIC/Q0101",
        sector: "Agro-Processing",
        matchPercentage: "92%",
        benefits: [
          `Builds upon your familiarity with ${profile.skills}`,
          `Capital subsidy of ₹50,000 for setting up grain/spice processing units`,
          `Affiliated with local agricultural produce centers in ${profile.district}`,
          `Zero collateral loan through NSFDC`
        ],
        center: `${profile.district} Rural Agro-Skilling Wing`
      };
    } else {
      return {
        topRole: "Solar PV Installer & Service Technician",
        nsqfLevel: "NSQF Level 4",
        qpCode: "SGJ/Q0102",
        sector: "Green Jobs & Renewable Power",
        matchPercentage: "96%",
        benefits: [
          `Tailored for your recorded experience in ${profile.skills}`,
          `Approved under PM-KUSUM agricultural solar pump scheme in ${profile.district}`,
          `Entitled to ₹15,000 free toolkit grant upon certification`,
          `Direct ₹50,000 project capital subsidy for self-employment`
        ],
        center: `Govt ITI Govindpura (${profile.district})`
      };
    }
  }, [profile.skills, profile.interests, profile.occupation, profile.district]);

  const visualTradeCards = [
    {
      id: "solar",
      title: "Solar Pump & Tubewell",
      hindiTitle: "सोलर पंप व ट्यूबवेल मिस्त्री",
      icon: "☀️",
      role: "Solar PV Installer & Service Technician",
      qp: "SGJ/Q0102",
      nsqf: "NSQF Level 4",
      benefit: "₹15,000 टूलकिट + ₹50,000 दुकान अनुदान",
      benefitEn: "₹15k Toolkit + ₹50k Grant",
      color: "#f59e0b",
      audioHi: "सोलर पंप और ट्यूबवेल मिस्त्री कोर्स। इसमें आपको खेत के सोलर पंप की मरम्मत सिखाई जाएगी। पूरी पढ़ाई मुफ्त है, और १५,००० की टूलकिट तथा ५०,००० की सरकारी मदद मिलेगी।"
    },
    {
      id: "dairy",
      title: "Dairy & Milk Chilling",
      hindiTitle: "डेयरी व दूध शीतलन केंद्र",
      icon: "🥛",
      role: "Dairy Farm Supervisor & Bulk Milk Chiller Operator",
      qp: "FIC/Q0103",
      nsqf: "NSQF Level 4",
      benefit: "₹15,000 टूलकिट + ₹50,000 यूनिट ग्रांट",
      benefitEn: "₹15k Toolkit + ₹50k Unit Grant",
      color: "#3b82f6",
      audioHi: "डेयरी और दूध केंद्र कार्य। इसमें दूध की जांच, चिलर मशीन चलाना और डेयरी यूनिट शुरू करना सिखाया जाएगा। इसके लिए ५०,००० रुपये तक का सरकारी अनुदान मिलेगा।"
    },
    {
      id: "milling",
      title: "Flour Mill & Grain Chakki",
      hindiTitle: "आटा चक्की व मसाला पिसाई",
      icon: "🌾",
      role: "Food Grain Milling & Spice Processing Technician",
      qp: "FIC/Q0101",
      nsqf: "NSQF Level 3",
      benefit: "₹15,000 टूलकिट + 4% ब्याज पर ऋण",
      benefitEn: "₹15k Toolkit + 4% Loan",
      color: "#10b981",
      audioHi: "आटा चक्की व मसाला पिसाई स्वरोजगार। अपनी खुद की चक्की या खाद्य प्रसंस्करण इकाई लगाने के लिए आधुनिक मशीन टूलकिट और बैंक से ४ प्रतिशत की सस्ती सहायता मिलेगी।"
    },
    {
      id: "sewing",
      title: "Sewing & Handloom",
      hindiTitle: "सिलाई व परिधान निर्माण",
      icon: "🧵",
      role: "Handloom Weaver & Technical Garment Maker",
      qp: "TSC/Q7301",
      nsqf: "NSQF Level 4",
      benefit: "मुफ़्त सिलाई मशीन व उपकरण किट",
      benefitEn: "Free Machine & Sewing Kit",
      color: "#8b5cf6",
      audioHi: "सिलाई और कपड़ा निर्माण कार्य। महिलाओं और युवाओं के लिए निशुल्क प्रशिक्षण और पास होने पर अत्याधुनिक सिलाई मशीन व कटिंग किट मुफ्त दी जाएगी।"
    },
    {
      id: "mechanic",
      title: "Motorcycle & Electrical Repair",
      hindiTitle: "मोटरसाइकिल व बिजली रिपेयर",
      icon: "🔧",
      role: "Automotive Two-Wheeler & EV Service Technician",
      qp: "ASC/Q1401",
      nsqf: "NSQF Level 4",
      benefit: "₹15,000 मैकेनिकल टूलकिट",
      benefitEn: "₹15,000 Tool Box",
      color: "#ec4899",
      audioHi: "मोटरसाइकिल और बिजली उपकरण रिपेयरिंग। अपनी वर्कशॉप खोलने के लिए पूरा मैकेनिक टूलकिट बॉक्स और ५०,००० की पूंजी सहायता सरकार से मिलेगी।"
    }
  ];

  const alternatives = [
    { title: "Electrician", nsqf: "NSQF 4" },
    { title: "Mobile Repair Technician", nsqf: "NSQF 3" },
    { title: "Dairy Chilling Operator", nsqf: "NSQF 4" }
  ];

  const allRecommendedCourses = [
    {
      title: dynamicAdvisor.topRole,
      qp: dynamicAdvisor.qpCode,
      nsqf: dynamicAdvisor.nsqfLevel,
      sector: dynamicAdvisor.sector,
      duration: "300 Hours",
      match: dynamicAdvisor.matchPercentage,
      grant: "₹50,000 Subsidy + ₹15,000 Toolkit",
      center: dynamicAdvisor.center
    },
    {
      title: "Electrician (Agricultural Tube Wells & Pumps)",
      qp: "AGR/Q1101",
      nsqf: "Level 4",
      sector: "Agriculture & Power",
      duration: "350 Hours",
      match: "91%",
      grant: "₹50,000 Subsidy + ₹15,000 Toolkit",
      center: `${profile.district} Rural Kaushal Vikas Kendra`
    },
    {
      title: "Dairy Farm Supervisor & Bulk Milk Chiller Operator",
      qp: "FIC/Q0103",
      nsqf: "Level 4",
      sector: "Food Processing",
      duration: "280 Hours",
      match: "85%",
      grant: "₹50,000 Subsidy + ₹15,000 Toolkit",
      center: `${profile.district} Dairy Training Wing`
    }
  ];

  const authorizedCentersList = [
    {
      name: `Govt ITI Govindpura (${profile.district})`,
      type: "Government Industrial Training Institute",
      location: `Industrial Area, ${profile.district}`,
      contact: "0755-2587123",
      coursesActive: [dynamicAdvisor.topRole, "Electrician", "Automotive Mechanic"],
      seatsAvailable: 24,
      stipend: "₹2,500/month provided under PM-AJAY GIA"
    },
    {
      name: `${profile.district} Rural Kaushal Vikas Kendra`,
      type: "PM-AJAY Dedicated Rural Skill Wing",
      location: `Rural Block, ${profile.district}`,
      contact: "0755-2489100",
      coursesActive: ["Dairy Processing", "Agri-Machinery Servicing", "Milling Tech"],
      seatsAvailable: 38,
      stipend: "₹2,000/month + Free Residential Boarding"
    }
  ];

  const [adminDistrictFilter, setAdminDistrictFilter] = useState("All");
  const [liveCounter, setLiveCounter] = useState(1482);

  const [beneficiaryRecords, setBeneficiaryRecords] = useState([
    {
      id: "PM-AJAY-2026-8812",
      aadhaarMasked: "[Aadhaar Redacted]",
      district: "Bhopal",
      block: "Govindpura Industrial",
      education: "8th Pass",
      voicedTrade: "Solar Agricultural Pump Servicing",
      qpCode: "AGR/Q1101",
      grantAmount: "₹50,000",
      toolkitStatus: "Disbursed",
      enterpriseStatus: "Approved",
      date: "2 mins ago"
    },
    {
      id: "PM-AJAY-2026-8813",
      aadhaarMasked: "[Aadhaar Redacted]",
      district: "Varanasi",
      block: "Chauka Ghat",
      education: "10th Pass",
      voicedTrade: "Handloom & Technical Textiles",
      qpCode: "TSC/Q7301",
      grantAmount: "₹50,000",
      toolkitStatus: "Approved",
      enterpriseStatus: "Under Review",
      date: "14 mins ago"
    },
    {
      id: "PM-AJAY-2026-8814",
      aadhaarMasked: "[Aadhaar Redacted]",
      district: "Patna",
      block: "Danapur",
      education: "5th Pass",
      voicedTrade: "Cold Storage Warehouse In-Charge",
      qpCode: "LSC/Q0101",
      grantAmount: "₹15,000",
      toolkitStatus: "Disbursed",
      enterpriseStatus: "N/A (Wage)",
      date: "31 mins ago"
    }
  ]);

  const districtClusterBlocks = [
    { blockName: "Govindpura Industrial", district: "Bhopal", totalCounseled: 540, primaryDemand: "Solar PV & Electrician", status: "High Demand", color: "#16a34a" },
    { blockName: "Berasia Rural", district: "Bhopal", totalCounseled: 412, primaryDemand: "Dairy Processing & Agri-Milling", status: "Active Kiosks", color: "#0284c7" },
    { blockName: "Phanda Urban", district: "Bhopal", totalCounseled: 320, primaryDemand: "Tool-Kit Assembly & Repair", status: "Normal", color: "#64748b" },
    { blockName: "Kolar-Bairagarh", district: "Bhopal", totalCounseled: 210, primaryDemand: "Cold Storage Logistics", status: "Expanding", color: "#ca8a04" }
  ];

  const sectorDemands = [
    { sector: "Solar Energy & PM-KUSUM Pumps", count: 486, pct: 33, color: "#f59e0b" },
    { sector: "Agro-Processing & Grain Milling", count: 372, pct: 25, color: "#10b981" },
    { sector: "Dairy Farming & Bulk Chilling", count: 298, pct: 20, color: "#3b82f6" },
    { sector: "Handloom & Technical Textiles", count: 184, pct: 12, color: "#8b5cf6" }
  ];

  const maxSubsidy = 50000;
  const subsidyAmount = Math.min(calcProjectCost * 0.5, maxSubsidy);
  const beneficiaryMargin = calcProjectCost * 0.1;
  const loanPrincipal = Math.max(0, calcProjectCost - subsidyAmount - beneficiaryMargin);

  const annualRate = 0.04;
  const monthlyRate = annualRate / 12;
  const totalMonths = calcTenureYears * 12;
  const monthlyEmi =
    loanPrincipal > 0
      ? Math.round(
          (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
        )
      : 0;

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      }
    };

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      stopSpeech();
    };
  }, []);

  const stopSpeech = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      currentUtteranceRef.current = null;
      setIsSpeaking(false);
    }
  };

  const speakText = (text, targetLang = null) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance;

    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    const isIndic = targetLang ? targetLang.startsWith("hi") : (lang === "Hindi" || dialect !== "Standard");

    if (isIndic) {
      utterance.lang = "hi-IN";
      const hindiVoice = voices.find(
        (v) =>
          (v.lang && (v.lang === "hi-IN" || v.lang.startsWith("hi"))) ||
          (v.name && (v.name.toLowerCase().includes("hindi") || v.name.includes("Kalpana") || v.name.includes("Hemant") || v.name.includes("Swara") || v.name.includes("Madhur")))
      );
      const indianEngVoice = voices.find(
        (v) =>
          (v.lang && (v.lang === "en-IN" || v.lang.includes("IN"))) ||
          (v.name && (v.name.toLowerCase().includes("india") || v.name.includes("Ravi") || v.name.includes("Heera")))
      );

      if (hindiVoice) {
        utterance.voice = hindiVoice;
      } else if (indianEngVoice) {
        utterance.voice = indianEngVoice;
      }
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
    } else {
      utterance.lang = "en-IN";
      const indianVoice = voices.find(
        (v) => (v.lang && v.lang.includes("IN")) || (v.name && v.name.toLowerCase().includes("india"))
      );
      if (indianVoice) utterance.voice = indianVoice;
      utterance.rate = 0.98;
      utterance.pitch = 1.0;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      currentUtteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPortalAudioIntro = () => {
    let introText = "";
    if (dialect === "Bundelkhandi") {
      introText = "नमस्ते। वाणी-अजय पोर्टल में आप सभी को स्वागत है। अगर आप पढ़े-लिखे नहीं हैं, तऊ चिंता न करें। सबसे पहले आधार कार्ड से लॉगिन करें ताकि आपके सवाल और ५० हजार की दुकान मदद का आवेदन सुरक्षित हो सके।";
    } else if (dialect === "Bhojpuri") {
      introText = "प्रणाम। वाणी-अजय पोर्टल पर रउआ सब के स्वागत बा। कवनो सवाल पूछे या काम चुने से पहिले आधार कार्ड से लॉगिन क लिहीं, ताकि रउआ के सरकारी सब्सिडी आ टूलकिट सीधे सुरक्षित हो सके।";
    } else {
      introText = "नमस्ते। वाणी-अजय पोर्टल पर आपका स्वागत है। कोई भी सवाल पूछने या काम चुनने से पहले कृपया अपना आधार लॉगिन पूरा करें ताकि आपकी आवाज का रिकॉर्ड और ५०,००० की सरकारी सहायता सुरक्षित रूप से सहेजी जा सके।";
    }
    speakText(introText, "hi-IN");
  };

  // MANDATORY AUTHENTICATION GATEWAY FOR LANDING INTERACTIONS
  const triggerAuthRequiredForInteraction = (intendedAction = null) => {
    stopSpeech();
    const promptMsg =
      lang === "Hindi"
        ? "कृपया पहले आधार लॉगिन करें ताकि आपकी आवाज और चुने गए कोर्स का विवरण सुरक्षित रखा जा सके।"
        : "Please log in with your Aadhaar first so your trade selection and voice questions can be saved.";
    speakText(promptMsg, lang === "Hindi" || dialect !== "Standard" ? "hi-IN" : "en-IN");

    if (intendedAction) {
      setPendingTradeTarget(intendedAction);
    }
    setLoginError(promptMsg);
    setCurrentView("login");
  };

  const handleSelectVisualTrade = (card) => {
    if (!verifiedCitizen) {
      triggerAuthRequiredForInteraction(card);
      return;
    }

    speakText(card.audioHi, "hi-IN");
    setProfile((prev) => ({
      ...prev,
      skills: card.title,
      interests: card.hindiTitle
    }));
    setCurrentView("landing");
    alert(lang === "Hindi" ? `${card.hindiTitle} आपके खाते में सुरक्षित कर लिया गया है। आप ऊपर "डैशबोर्ड खोलें" पर क्लिक करके देख सकते हैं।` : `${card.title} selected and saved! You can now click "Open Citizen Dashboard" above.`);
  };

  // DYNAMIC PROFILE READBACK - USES ACTUAL CITIZEN PROFILE STATE
  const handleHearBackProfile = () => {
    let text = "";
    if (dialect === "Bundelkhandi") {
      text = `नागरिक प्रोफ़ाइल सारांश: नाम ${profile.name}। उम्र ${profile.age}। शिक्षा ${profile.education}। जिला ${profile.district}। आपन हुनर ${profile.skills} है और आप ${profile.preference} करना चाहते हैं। आप पीएम-अजय योजना के तहत ५० हजार रुपये की पूंजी अनुदान और १५ हजार रुपये की टूलकिट के पात्र हैं।`;
    } else if (dialect === "Bhojpuri") {
      text = `नागरिक प्रोफ़ाइल विवरण: नाम ${profile.name}, उमिर ${profile.age}, पढ़ाई ${profile.education}, जिला ${profile.district}। रउआ के हुनर ${profile.skills} बा। पीएम-अजय योजना में ५० हजार रुपया के सरकारी अनुदान आ १५ हजार के टूलकिट रउआ खातिर मंजूर बा।`;
    } else if (lang === "Hindi") {
      text = `नागरिक प्रोफ़ाइल सारांश: नाम ${profile.name}। आयु ${profile.age}। शैक्षणिक योग्यता ${profile.education}। जिला ${profile.district}। आपका पंजीकृत कौशल ${profile.skills} है तथा आजीविका प्राथमिकता ${profile.preference} है। आप पीएम-अजय योजना के तहत ५०,००० रुपये के स्वरोजगार पूंजी अनुदान तथा १५,००० रुपये के निशुल्क टूलकिट के लिए पूर्णतः पात्र हैं।`;
    } else {
      text = `Citizen Profile Summary: Name ${profile.name}, Age ${profile.age}, Education ${profile.education}, District ${profile.district}. Your registered skill is ${profile.skills}, with preference for ${profile.preference}. You are verified under Scheduled Caste category and eligible for a 50,000 rupees PM-AJAY capital grant and a 15,000 rupees modern toolkit.`;
    }

    speakText(text, lang === "Hindi" || dialect !== "Standard" ? "hi-IN" : "en-IN");
  };

  const handleInspectDocsVoice = () => {
    const missing = [];
    if (!docChecklist.casteCert) missing.push(lang === "Hindi" ? "जाति प्रमाण पत्र" : "Caste Certificate");
    if (!docChecklist.incomeCert) missing.push(lang === "Hindi" ? "आय प्रमाण पत्र" : "Income Certificate");
    if (!docChecklist.bankDbtSeeded) missing.push(lang === "Hindi" ? "बैंक खाता आधार सीडिंग" : "Bank Aadhaar-DBT Seeding");
    if (!docChecklist.educationMarksheet) missing.push(lang === "Hindi" ? "शैक्षणिक अंकसूची" : "Marksheet Certificate");

    let speechMsg = "";
    if (missing.length === 0) {
      speechMsg =
        lang === "Hindi" || dialect !== "Standard"
          ? `बधाई हो ${profile.name} जी! आपके सभी ४ आवश्यक दस्तावेज सत्यापित हैं। आपकी पात्रता स्कोर १०० प्रतिशत है और आपका अनुदान तुरंत स्वीकृत किया जा सकता है।`
          : `Congratulations ${profile.name}! All 4 prerequisite documents are verified. Your GIA readiness score is 100 percent.`;
    } else {
      speechMsg =
        lang === "Hindi" || dialect !== "Standard"
          ? `ध्यान दें ${profile.name} जी! आपके आवेदन में ${missing.join(", ")} अभी अधूरा है। कृपया नजदीकी सीएससी केंद्र पर जाकर इसे पूरा करें ताकि अनुदान मिलने में कोई रुकावट न आए।`
          : `Attention ${profile.name}! Your application is pending ${missing.length} documents. Please verify them at your nearest Common Service Centre.`;
    }

    speakText(speechMsg, lang === "Hindi" || dialect !== "Standard" ? "hi-IN" : "en-IN");
  };

  // DYNAMIC ADVICE READBACK - USES ACTUAL CITIZEN PROFILE AND MATCHED TRADE
  const toggleSpeechPlayback = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      let chosenText = "";
      let targetLang = "en-IN";

      if (dialect === "Bundelkhandi") {
        chosenText = `राम-राम ${profile.name} जी। ${profile.district} जिला में आपके ${profile.skills} के अनुभव के आधार पर ${dynamicAdvisor.topRole} कोर्स सबसे बढ़िया है। पीएम-अजय योजना में पढ़ाई पूरी तरह मुफ्त है, और १५,००० की टूलकिट तथा ५०,००० की दुकान सहायता मिलेगी।`;
        targetLang = "hi-IN";
      } else if (dialect === "Bhojpuri") {
        chosenText = `प्रणाम ${profile.name} जी। ${profile.district} जिला में रउआ के ${profile.skills} के अनुभव देख के ${dynamicAdvisor.topRole} कोर्स सबसे नीक बा। ई योजना में पूरा ट्रेनिंग एकदम मुफ्त बा, आ १५ हजार के टूलकिट संगे ५० हजार के सरकारी अनुदान सीधे बैंक में मिली।`;
        targetLang = "hi-IN";
      } else if (lang === "Hindi") {
        chosenText = `नमस्ते ${profile.name} जी। ${profile.district} जिले में आपके ${profile.skills} अनुभव और ${profile.education} शिक्षा के आधार पर '${dynamicAdvisor.topRole}' ${dynamicAdvisor.matchPercentage} मैच के साथ आपका सर्वोत्तम कौशल कोर्स है। पीएम-अजय योजना के तहत आपका पूरा प्रशिक्षण निशुल्क है, और आपको १५,००० रुपये की आधुनिक टूलकिट तथा ५०,००० रुपये का सरकारी अनुदान मिलेगा।`;
        targetLang = "hi-IN";
      } else {
        chosenText = `Hello ${profile.name}. Based on your background in ${profile.skills} and education of ${profile.education} in ${profile.district} district, ${dynamicAdvisor.topRole} is your top NSQF match with ${dynamicAdvisor.matchPercentage} suitability. Under PM-AJAY Grant in Aid, your complete training is fully funded, and you receive a 15,000 rupee toolkit grant plus up to 50,000 rupees capital subsidy to start your own enterprise.`;
        targetLang = "en-IN";
      }

      speakText(chosenText, targetLang);
    }
  };

  const toggleRecording = () => {
    if (!verifiedCitizen) {
      triggerAuthRequiredForInteraction();
      return;
    }

    stopSpeech();
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Please use Chrome or Edge for voice recognition.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRec();
    recognition.lang = lang === "Hindi" || dialect !== "Standard" ? "hi-IN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      handleVoiceAnalysis(speechToText);
    };

    recognition.start();
  };

  const handleVoiceAnalysis = async (userQuery) => {
    stopSpeech();
    const query = userQuery || transcript;
    if (!query.trim()) return;

    // Dynamically update skills from spoken query
    setProfile((prev) => ({
      ...prev,
      skills: query,
      interests: query
    }));

    try {
      const res = await fetch("http://127.0.0.1:8000/api/advisor/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_speech: query,
          selected_district: profile.district,
          education: profile.education,
          aspiration_type: "self_employment",
          language: lang,
          dialect: dialect
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recommendations && data.recommendations.length > 0) {
          const top = data.recommendations[0];

          const newEntry = {
            id: `PM-AJAY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            aadhaarMasked: verifiedCitizen ? verifiedCitizen.aadhaarMasked : "[Aadhaar Redacted]",
            district: profile.district,
            block: "Govindpura Industrial",
            education: profile.education,
            voicedTrade: top.job_role,
            qpCode: top.qp_code,
            grantAmount: "₹50,000",
            toolkitStatus: "Under Review",
            enterpriseStatus: "Under Review",
            date: "Just now"
          };
          setBeneficiaryRecords((prev) => [newEntry, ...prev]);

          const dynamicFeedback =
            lang === "Hindi" || dialect !== "Standard"
              ? `नमस्ते ${profile.name} जी। आपकी आवाज और ${query} के आधार पर '${top.job_role}' आपका सर्वोत्तम कोर्स चुना गया है।`
              : `Hello ${profile.name}, based on your voice inquiry of ${query}, '${top.job_role}' has been matched for you.`;

          speakText(dynamicFeedback, lang === "Hindi" || dialect !== "Standard" ? "hi-IN" : "en-IN");
        }
      }
    } catch (e) {
      const dynamicFeedback =
        lang === "Hindi" || dialect !== "Standard"
          ? `नमस्ते ${profile.name} जी। आपके द्वारा बताए गए '${query}' के आधार पर '${dynamicAdvisor.topRole}' आपका अनुशंसित कोर्स है।`
          : `Hello ${profile.name}, based on your input '${query}', '${dynamicAdvisor.topRole}' is your top recommended pathway.`;

      speakText(dynamicFeedback, lang === "Hindi" || dialect !== "Standard" ? "hi-IN" : "en-IN");
    }
  };

  const downloadAuditCSV = () => {
    const headers = [
      "Application ID",
      "Aadhaar Status",
      "District",
      "Block",
      "Education",
      "Voiced Trade Aspiration",
      "NSQF QP Code",
      "Sanctioned Grant",
      "Toolkit Status",
      "Enterprise Subsidy Status",
      "Timestamp"
    ];

    const rows = filteredBeneficiaries.map((b) => [
      `"${b.id}"`,
      `"${b.aadhaarMasked}"`,
      `"${b.district}"`,
      `"${b.block || 'Urban'}"`,
      `"${b.education}"`,
      `"${b.voicedTrade}"`,
      `"${b.qpCode}"`,
      `"${b.grantAmount}"`,
      `"${b.toolkitStatus}"`,
      `"${b.enterpriseStatus}"`,
      `"${b.date}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `PM_AJAY_GIA_Audit_Report_${adminDistrictFilter}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApproveGrant = (id) => {
    setBeneficiaryRecords((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, enterpriseStatus: "Approved", toolkitStatus: "Approved" } : rec
      )
    );
  };

  const handleAadhaarChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, 12);
    const formatted = rawVal.replace(/(\d{4})(?=\d)/g, "$1 ");
    setAadhaarNumber(formatted);
    setLoginError("");
  };

  const handleSendOtp = () => {
    const cleanNumber = aadhaarNumber.replace(/\s/g, "");
    if (cleanNumber.length !== 12) {
      setLoginError(lang === "English" ? "Please enter a valid 12-digit Aadhaar number." : "कृपया वैध 12 अंकों का आधार नंबर दर्ज करें।");
      return;
    }
    if (!consentChecked) {
      setLoginError(lang === "English" ? "Please grant consent for Aadhaar authentication." : "कृपया आधार सत्यापन हेतु सहमति दें।");
      return;
    }
    setOtpSent(true);
    setLoginError("");
  };

  const handleVerifyOtp = () => {
    if (enteredOtp.length < 4) {
      setLoginError(lang === "English" ? "Please enter the OTP sent to your registered mobile." : "कृपया मोबाइल पर प्राप्त ओटीपी दर्ज करें।");
      return;
    }
    const citizenAuth = {
      aadhaarMasked: "[Aadhaar Redacted]",
      name: "Priya Singh"
    };
    setVerifiedCitizen(citizenAuth);
    setLoginError("");

    if (pendingTradeTarget) {
      setProfile((prev) => ({
        ...prev,
        skills: pendingTradeTarget.title,
        interests: pendingTradeTarget.hindiTitle
      }));
      setPendingTradeTarget(null);
    }

    // Default back to landing after login, but now user can hit refresh on any tab without being booted
    setCurrentView("landing");
  };

  const handleDemoAutofill = () => {
    setAadhaarNumber("[Aadhaar Redacted]");
    setOtpSent(true);
    setEnteredOtp("123456");
    setLoginError("");
  };

  const handleOfficerLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!officerId.trim() || !officerPassword.trim()) {
      setOfficerLoginError(lang === "English" ? "Please enter both Official ID and Password." : "कृपया अधिकारी आईडी और पासवर्ड दोनों दर्ज करें।");
      return;
    }
    const officerAuth = {
      id: officerId,
      designation: officerDesignation,
      district: officerDistrict,
      name: "Dr. Arvind Saxena, IAS"
    };
    setAuthenticatedOfficer(officerAuth);
    setOfficerLoginError("");
    setAdminDistrictFilter(officerDistrict || "All");
    setSelectedClusterBlock("All");
    setCurrentView("admin");
  };

  const handleDemoOfficerAutofill = () => {
    setOfficerId("EMP-DWO-MP-4029");
    setOfficerPassword("gov@2026#secure");
    setOfficerDesignation("District Welfare Officer (DWO)");
    setOfficerDistrict("Bhopal");
    setOfficerLoginError("");
  };

  const t = {
    bg: darkMode
      ? "linear-gradient(135deg, #070d18 0%, #030814 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #eef2f6 100%)",
    sidebarBg: darkMode
      ? "linear-gradient(180deg, #030712 0%, #0a1128 100%)"
      : "linear-gradient(180deg, #0b224e 0%, #081736 100%)",
    cardBg: darkMode
      ? "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)",
    cardSubBg: darkMode
      ? "linear-gradient(135deg, rgba(51, 65, 85, 0.5) 0%, rgba(30, 41, 59, 0.6) 100%)"
      : "linear-gradient(135deg, rgba(241, 245, 249, 0.9) 0%, rgba(226, 232, 240, 0.6) 100%)",
    cardBorder: darkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(203, 213, 225, 0.8)",
    textPrimary: darkMode ? "#f8fafc" : "#0f172a",
    textSecondary: darkMode ? "#94a3b8" : "#64748b",
    headerBg: darkMode
      ? "linear-gradient(90deg, #020617 0%, #0f172a 100%)"
      : "linear-gradient(90deg, #0c2340 0%, #1e3a5f 100%)",
    headerBorder: darkMode ? "#1e293b" : "#3b82f6",

    btnPrimary: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    btnSuccess: "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
    btnOfficer: "linear-gradient(135deg, #1e3a5f 0%, #312e81 100%)",
    btnVoice: "linear-gradient(135deg, #ef4444 0%, #ea580c 100%)",
    btnDanger: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    tileGradient1: darkMode ? "linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(30,41,59,0.5) 100%)" : "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
    tileGradient2: darkMode ? "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(30,41,59,0.5) 100%)" : "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
    tileGradient3: darkMode ? "linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(30,41,59,0.5) 100%)" : "linear-gradient(135deg, #fefce8 0%, #ffffff 100%)",
    tileGradient4: darkMode ? "linear-gradient(135deg, rgba(236,72,153,0.18) 0%, rgba(30,41,59,0.5) 100%)" : "linear-gradient(135deg, #fdf2f8 0%, #ffffff 100%)"
  };

  const filteredBeneficiaries = beneficiaryRecords.filter((b) => {
    const matchesDistrict =
      adminDistrictFilter === "All" || b.district.toLowerCase() === adminDistrictFilter.toLowerCase();
    const matchesBlock =
      selectedClusterBlock === "All" || (b.block && b.block.toLowerCase().includes(selectedClusterBlock.toLowerCase()));
    return matchesDistrict && matchesBlock;
  });

  const LanguageToggleBtn = () => (
    <button
      onClick={() => setLang(lang === "English" ? "Hindi" : "English")}
      style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "#ffffff",
        border: "1px solid rgba(255,255,255,0.3)",
        padding: "3px 9px",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        gap: 5,
        boxShadow: "0 2px 6px rgba(37,99,235,0.3)"
      }}>
      <Languages size={12} />
      <span>{lang === "English" ? "हिन्दी" : "English"}</span>
    </button>
  );

  /* ========================================================
     VIEW 0: CITIZEN AADHAAR LOGIN
     ======================================================== */
  if (currentView === "login") {
    return (
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 4, background: "linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%)", flexShrink: 0, zIndex: 10 }} />

        <div style={{
          height: 38,
          background: t.headerBg,
          color: "#ffffff",
          padding: "0 28px",
          fontSize: 11,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${t.headerBorder}`,
          flexShrink: 0,
          zIndex: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setCurrentView("landing")}
              style={{ background: t.btnOfficer, color: "#93c5fd", border: "1px solid #3b82f6", padding: "2px 8px", borderRadius: 4, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              <ArrowLeft size={12} />
              <span>{tText.portalHomeBtn}</span>
            </button>
            <span>{tText.govIndia} • {tText.mosje}</span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <LanguageToggleBtn />

            <button
              onClick={toggleFullscreen}
              style={{ background: t.btnOfficer, color: "#facc15", border: "1px solid #3b82f6", padding: "3px 8px", borderRadius: 4, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              <span>{isFullscreen ? tText.exitFullscreen : tText.fullscreen}</span>
            </button>

            <button
              onClick={() => setCurrentView("officer_login")}
              style={{ background: t.btnOfficer, color: "#facc15", border: "1px solid #3b82f6", padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontWeight: 700, fontSize: 11 }}>
              {tText.officerLoginBtn}
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{ background: "transparent", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: 11 }}>
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </div>

        <LoginBackground darkMode={darkMode}>
          <div style={{
            width: "100%",
            maxWidth: 460,
            background: t.cardBg,
            backdropFilter: "blur(16px)",
            border: `1px solid ${t.cardBorder}`,
            borderRadius: 18,
            padding: "28px 32px",
            boxShadow: darkMode ? "0 20px 45px rgba(0,0,0,0.7)" : "0 15px 35px rgba(12, 35, 64, 0.1)",
            boxSizing: "border-box"
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, #0c2340 0%, #1e3a5f 100%)",
                color: "#f59e0b",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 22,
                border: "2px solid #f59e0b",
                marginBottom: 8,
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.35)"
              }}>
                अ
              </div>
              <h2 style={{ margin: "0 0 4px 0", fontSize: 19, fontWeight: 800, color: t.textPrimary }}>
                {lang === "Hindi" ? "नागरिक आधार लॉगिन" : "Citizen Aadhaar Login"}
              </h2>
              <p style={{ margin: 0, fontSize: 11, color: t.textSecondary }}>
                PM-AJAY GIA Component • AI Voice & Skilling Assistant
              </p>
            </div>

            {loginError && (
              <div style={{
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                color: "#1d4ed8",
                border: "1px solid #bfdbfe",
                padding: "10px 12px",
                borderRadius: 8,
                fontSize: 11.5,
                fontWeight: 600,
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <AlertCircle size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                <span>{loginError}</span>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, display: "block", marginBottom: 4 }}>
                <Fingerprint size={13} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                {lang === "Hindi" ? "आधार कार्ड नंबर (12 अंक):" : "Aadhaar Card Number (12 Digits):"}
              </label>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={handleAadhaarChange}
                disabled={otpSent}
                placeholder="XXXX XXXX XXXX"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 8,
                  border: `1.5px solid ${t.cardBorder}`,
                  background: darkMode ? "rgba(30, 41, 59, 0.8)" : "#ffffff",
                  color: t.textPrimary,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 2,
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {otpSent && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, display: "block", marginBottom: 4 }}>
                  <KeyRound size={13} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                  {lang === "Hindi" ? "6 अंकों का ओटीपी दर्ज करें:" : "Enter 6-Digit OTP:"}
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • • • •"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1.5px solid ${t.cardBorder}`,
                    background: darkMode ? "rgba(30, 41, 59, 0.8)" : "#ffffff",
                    color: t.textPrimary,
                    fontSize: 18,
                    textAlign: "center",
                    letterSpacing: 6,
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: 8, alignItems: "start", marginBottom: 16 }}>
              <input type="checkbox" id="consent" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} style={{ marginTop: 2, cursor: "pointer" }} />
              <label htmlFor="consent" style={{ fontSize: 10.5, color: t.textSecondary, lineHeight: 1.35, cursor: "pointer" }}>
                {lang === "Hindi"
                  ? "मैं स्वेच्छा से पीएम-अजय जीआईए योजना के अंतर्गत अपनी पात्रता सत्यापन एवं प्रश्न सुरक्षित करने हेतु अपने आधार विवरण का उपयोग करने की सहमति देता/देती हूँ।"
                  : "I voluntarily give consent to use my Aadhaar details for authenticating my eligibility and saving my voice inquiries under PM-AJAY GIA schemes."}
              </label>
            </div>

            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: t.btnOfficer,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 14px rgba(30, 58, 95, 0.35)"
                }}>
                <Lock size={15} />
                <span>{lang === "Hindi" ? "आधार ओटीपी प्राप्त करें" : "Get Aadhaar OTP"}</span>
              </button>
            ) : (
              <button
                onClick={handleVerifyOtp}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: t.btnSuccess,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 14px rgba(5, 150, 105, 0.4)"
                }}>
                <CheckCircle2 size={16} />
                <span>{lang === "Hindi" ? "सत्यापित करें और आगे बढ़ें" : "Verify & Save Inquiries"}</span>
              </button>
            )}

            <div style={{ marginTop: 14, textAlign: "center" }}>
              <button
                onClick={handleDemoAutofill}
                style={{ background: "transparent", border: "none", color: "#0284c7", fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                {lang === "Hindi" ? "⚡ त्वरित डेमो ऑटो-फिल (नमूना लाभार्थी)" : "⚡ Quick Demo Autofill (Sample Beneficiary)"}
              </button>
            </div>
          </div>
        </LoginBackground>

        <footer style={{
          height: 26,
          background: t.headerBg,
          color: "#94a3b8",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          borderTop: `1px solid ${t.headerBorder}`,
          flexShrink: 0,
          zIndex: 10
        }}>
          <span>Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)</span>
          <span>Aadhaar Authenticated Access • SIH 2026</span>
        </footer>
      </div>
    );
  }

  /* ========================================================
     VIEW 0.5: OFFICER LOGIN
     ======================================================== */
  if (currentView === "officer_login") {
    return (
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 4, background: "linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%)", flexShrink: 0, zIndex: 10 }} />

        <div style={{
          height: 38,
          background: t.headerBg,
          color: "#ffffff",
          padding: "0 28px",
          fontSize: 11,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${t.headerBorder}`,
          flexShrink: 0,
          zIndex: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setCurrentView("landing")}
              style={{ background: t.btnOfficer, color: "#93c5fd", border: "1px solid #3b82f6", padding: "2px 8px", borderRadius: 4, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              <ArrowLeft size={12} />
              <span>{tText.portalHomeBtn}</span>
            </button>
            <span>MoSJE • PM-AJAY GIA Officer Gateway</span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <LanguageToggleBtn />

            <button
              onClick={toggleFullscreen}
              style={{ background: t.btnOfficer, color: "#facc15", border: "1px solid #3b82f6", padding: "3px 8px", borderRadius: 4, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              <span>{isFullscreen ? tText.exitFullscreen : tText.fullscreen}</span>
            </button>

            <button
              onClick={() => setCurrentView("login")}
              style={{ background: t.btnOfficer, color: "#93c5fd", border: "1px solid #3b82f6", padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>
              ← {tText.citizenLoginBtn}
            </button>
          </div>
        </div>

        <LoginBackground darkMode={darkMode}>
          <div style={{
            width: "100%",
            maxWidth: 480,
            background: t.cardBg,
            backdropFilter: "blur(16px)",
            border: `1px solid ${t.cardBorder}`,
            borderRadius: 18,
            padding: "28px 32px",
            boxShadow: darkMode ? "0 20px 45px rgba(0,0,0,0.7)" : "0 15px 35px rgba(12, 35, 64, 0.1)",
            boxSizing: "border-box"
          }}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <ShieldCheck size={36} color="#facc15" style={{ display: "inline-block", marginBottom: 6 }} />
              <h2 style={{ margin: "0 0 4px 0", fontSize: 18, fontWeight: 800, color: t.textPrimary }}>
                {lang === "Hindi" ? "जिला अधिकारी लॉगिन" : "District Officer Login"}
              </h2>
              <p style={{ margin: 0, fontSize: 11, color: t.textSecondary }}>
                {lang === "Hindi" ? "प्रशासनिक व टेलीमेट्री मॉनिटरिंग कंसोल" : "Administrative & Telemetry Monitoring Console"}
              </p>
            </div>

            <form onSubmit={handleOfficerLogin}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, display: "block", marginBottom: 4 }}>
                  {lang === "Hindi" ? "अधिकारी कर्मचारी आईडी (Employee ID):" : "Officer Employee ID:"}
                </label>
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. EMP-DWO-MP-4029"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: `1.5px solid ${t.cardBorder}`, background: darkMode ? "rgba(30, 41, 59, 0.8)" : "#ffffff", color: t.textPrimary, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, display: "block", marginBottom: 4 }}>
                    {lang === "Hindi" ? "पदनाम (Role):" : "Role:"}
                  </label>
                  <select
                    value={officerDesignation}
                    onChange={(e) => setOfficerDesignation(e.target.value)}
                    style={{ width: "100%", padding: "8px", borderRadius: 6, border: `1.5px solid ${t.cardBorder}`, background: darkMode ? "rgba(30, 41, 59, 0.8)" : "#ffffff", color: t.textPrimary, fontSize: 11, outline: "none" }}>
                    <option value="District Welfare Officer (DWO)">DWO</option>
                    <option value="District Collectorate (Admin)">District Collectorate</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, display: "block", marginBottom: 4 }}>
                    {lang === "Hindi" ? "जिला (District):" : "District:"}
                  </label>
                  <select
                    value={officerDistrict}
                    onChange={(e) => setOfficerDistrict(e.target.value)}
                    style={{ width: "100%", padding: "8px", borderRadius: 6, border: `1.5px solid ${t.cardBorder}`, background: darkMode ? "rgba(30, 41, 59, 0.8)" : "#ffffff", color: t.textPrimary, fontSize: 11, outline: "none" }}>
                    <option value="Bhopal">Bhopal (MP)</option>
                    <option value="Varanasi">Varanasi (UP)</option>
                    <option value="Patna">Patna (Bihar)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, display: "block", marginBottom: 4 }}>
                  {lang === "Hindi" ? "पासवर्ड (Security Password):" : "Security Password:"}
                </label>
                <input
                  type="password"
                  value={officerPassword}
                  onChange={(e) => setOfficerPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: `1.5px solid ${t.cardBorder}`, background: darkMode ? "rgba(30, 41, 59, 0.8)" : "#ffffff", color: t.textPrimary, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {officerLoginError && (
                <div style={{ background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)", color: "#dc2626", padding: "8px", borderRadius: 6, fontSize: 11, marginBottom: 12 }}>
                  {officerLoginError}
                </div>
              )}

              <button
                type="submit"
                style={{ width: "100%", padding: "12px", background: t.btnOfficer, color: "#ffffff", border: "none", borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 4px 14px rgba(30, 58, 95, 0.35)" }}>
                <LayoutDashboard size={15} />
                <span>{lang === "Hindi" ? "सत्यापित करें व कंसोल खोलें" : "Authenticate & Open Console"}</span>
              </button>
            </form>

            <div style={{ marginTop: 12, textAlign: "center" }}>
              <button
                type="button"
                onClick={handleDemoOfficerAutofill}
                style={{ background: "transparent", border: "none", color: "#0284c7", fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                {lang === "Hindi" ? "⚡ त्वरित डेमो ऑटो-फिल (अधिकारी)" : "⚡ Quick Demo Autofill (Officer)"}
              </button>
            </div>
          </div>
        </LoginBackground>
      </div>
    );
  }

  /* ========================================================
     VIEW 1: MULTILINGUAL ACCESSIBLE PORTAL HOME
     ======================================================== */
  if (currentView === "landing") {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: t.bg,
        color: t.textPrimary,
        fontFamily: "'Segoe UI', -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ height: 4, background: "linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%)", flexShrink: 0 }} />

        {/* Civic Header Bar */}
        <div style={{
          height: 38,
          background: t.headerBg,
          color: "#ffffff",
          padding: "0 28px",
          fontSize: 11,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>{tText.govIndia}</span>
            <span style={{ color: "#64748b" }}>•</span>
            <span style={{ color: "#93c5fd" }}>{tText.mosje}</span>
            <span style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)", color: "#4ade80", padding: "1px 8px", borderRadius: 10, fontWeight: 700, fontSize: 10, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              ● {tText.counseledBadge}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={handlePlayPortalAudioIntro}
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "#ffffff",
                border: "none",
                padding: "3px 10px",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 5,
                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.35)"
              }}>
              <Volume2 size={13} />
              <span>{tText.audioGuideBtn}</span>
            </button>

            {/* Dialect Selector */}
            <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.2)", gap: 4 }}>
              <Languages size={12} color="#facc15" />
              <select
                value={dialect}
                onChange={(e) => {
                  stopSpeech();
                  setDialect(e.target.value);
                }}
                style={{ background: "transparent", border: "none", color: "#ffffff", fontSize: 11, fontWeight: 700, outline: "none", cursor: "pointer" }}>
                <option value="Standard" style={{ color: "#000" }}>हिंदी (Standard)</option>
                <option value="Bundelkhandi" style={{ color: "#000" }}>बुंदेली / मालवी (MP)</option>
                <option value="Bhojpuri" style={{ color: "#000" }}>भोजपुरी (Purvanchal)</option>
              </select>
            </div>

            <LanguageToggleBtn />

            <button
              onClick={toggleFullscreen}
              style={{ background: t.btnOfficer, color: "#facc15", border: "1px solid #3b82f6", padding: "3px 8px", borderRadius: 4, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              <span>{isFullscreen ? tText.exitFullscreen : tText.fullscreen}</span>
            </button>

            <button
              onClick={() => setCurrentView("officer_login")}
              style={{ background: t.btnOfficer, color: "#facc15", border: "1px solid #3b82f6", padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <BadgeCheck size={12} />
              <span>{tText.officerLoginBtn}</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{ background: "transparent", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              {darkMode ? <Sun size={12} color="#facc15" /> : <Moon size={12} />}
              <span>{darkMode ? "Light" : "Dark"}</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <header style={{
          background: darkMode
            ? "linear-gradient(135deg, #020617 0%, #0f172a 60%, #1e1b4b 100%)"
            : "linear-gradient(135deg, #0c2340 0%, #1e3a5f 60%, #1e1b4b 100%)",
          color: "#ffffff",
          padding: "24px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "3px solid #f97316",
          flexShrink: 0
        }}>
          <div style={{ maxWidth: 520 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(234, 88, 12, 0.2) 100%)", border: "1px solid #f59e0b", padding: "3px 10px", borderRadius: 20, marginBottom: 8 }}>
              <ShieldCheck size={14} color="#facc15" />
              <span style={{ fontSize: 11, fontWeight: 800, color: "#facc15", textTransform: "uppercase" }}>
                PM-AJAY GIA Component • AI Voice & Skilling Assistant
              </span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 6px 0", lineHeight: 1.15 }}>
              {tText.heroTitle}
            </h1>
            <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.4, margin: "0 0 14px 0" }}>
              {tText.heroSubtitle}
            </p>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => setCurrentView("login")}
                style={{
                  background: t.btnSuccess,
                  color: "#ffffff",
                  border: "none",
                  padding: "9px 18px",
                  borderRadius: 6,
                  fontWeight: 800,
                  fontSize: 12.5,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                <Fingerprint size={15} />
                <span>{verifiedCitizen ? `✓ ${verifiedCitizen.name}` : tText.heroCtaCitizen}</span>
              </button>

              {verifiedCitizen && (
                <button
                  onClick={() => setCurrentView("kiosk")}
                  style={{
                    background: t.btnPrimary,
                    color: "#ffffff",
                    border: "none",
                    padding: "9px 18px",
                    borderRadius: 6,
                    fontWeight: 900,
                    fontSize: 12.5,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 4px 14px rgba(37,99,235,0.4)"
                  }}>
                  <Home size={15} />
                  <span>{tText.goToDashboard}</span>
                </button>
              )}

              <button
                onClick={handlePlayPortalAudioIntro}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "9px 15px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5
                }}>
                <Volume2 size={14} />
                <span>{lang === "Hindi" ? "सुनें (Listen)" : "Listen Audio Guide"}</span>
              </button>
            </div>
          </div>

          {/* Central Voice Kiosk Orb */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 20px" }}>
            <button
              onClick={toggleRecording}
              title={verifiedCitizen ? "Tap to speak" : "Requires login to save records"}
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                border: "3px solid #ffffff",
                background: isRecording ? t.btnDanger : t.btnVoice,
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isRecording
                  ? "0 0 35px rgba(239, 68, 68, 0.9)"
                  : "0 0 25px rgba(245, 158, 11, 0.6)",
                transform: isRecording ? "scale(1.08)" : "scale(1)",
                transition: "all 0.2s ease"
              }}>
              {isRecording ? <MicOff size={34} /> : <Mic size={34} />}
            </button>
            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 900, color: "#facc15", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              {isRecording ? tText.listeningHero : (verifiedCitizen ? (lang === "Hindi" ? "माइक दबाकर बोलें" : "Tap to Speak") : tText.tapToSpeakHero)}
            </div>
            <div style={{ fontSize: 10, color: "#cbd5e1" }}>
              {verifiedCitizen ? (lang === "Hindi" ? "अपनी भाषा में काम बताएं" : "Speak in your dialect") : (lang === "Hindi" ? "प्रश्न पूछने से पहले लॉगिन करें" : "Log in to record & save inquiries")}
            </div>

            <div style={{ marginTop: 6 }}>
              <LiveMicVisualizer isRecording={isRecording} darkMode={true} />
            </div>
          </div>

          {/* Statutory Benefits Anchors */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, minWidth: 280 }}>
            <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: 8, textAlign: "center" }}>
              <span style={{ fontSize: 9.5, color: "#93c5fd", fontWeight: 700 }}>{tText.statTraining}</span>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#4ade80", margin: "2px 0" }}>{tText.statTrainingVal}</div>
              <span style={{ fontSize: 9, color: "#cbd5e1" }}>{tText.statTrainingSub}</span>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: 8, textAlign: "center" }}>
              <span style={{ fontSize: 9.5, color: "#93c5fd", fontWeight: 700 }}>{tText.statToolkit}</span>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#facc15", margin: "2px 0" }}>{tText.statToolkitVal}</div>
              <span style={{ fontSize: 9, color: "#cbd5e1" }}>{tText.statToolkitSub}</span>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, padding: 8, textAlign: "center", gridColumn: "span 2" }}>
              <span style={{ fontSize: 9.5, color: "#93c5fd", fontWeight: 700 }}>{tText.statSubsidy}</span>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#38bdf8", margin: "2px 0" }}>{tText.statSubsidyVal} ({tText.statSubsidySub})</div>
              <span style={{ fontSize: 9.5, color: "#cbd5e1" }}>{tText.statLoanVal} {tText.statLoan} ({tText.statLoanSub})</span>
            </div>
          </div>
        </header>

        {/* Tactile Picture Trade Grid */}
        <main style={{ flex: 1, padding: "16px 36px", display: "flex", flexDirection: "column", gap: 14, overflowY: "scroll" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={16} color="#2563eb" />
                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: t.textPrimary }}>
                  {tText.tradesTitle}
                </h2>
              </div>
              <span style={{ fontSize: 11, color: t.textSecondary }}>
                {verifiedCitizen
                  ? (lang === "Hindi" ? "चित्र छूते ही यह ट्रेड आपके खाते में सुरक्षित हो जाएगा।" : "Touch any trade to save it to your citizen profile.")
                  : tText.tradesSubtitle}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: verifiedCitizen ? "#16a34a" : "#ea580c", fontWeight: 700, background: t.cardSubBg, padding: "4px 10px", borderRadius: 20 }}>
              {verifiedCitizen ? <CheckCircle size={13} /> : <Lock size={13} />}
              <span>{verifiedCitizen ? (lang === "Hindi" ? "लॉगिन पूर्ण • सुरक्षित होगा" : "Authenticated & Ready") : tText.touchToHear}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            {visualTradeCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleSelectVisualTrade(card)}
                style={{
                  background: t.cardBg,
                  border: `2px solid ${card.color}35`,
                  borderRadius: 12,
                  padding: "16px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  transition: "all 0.18s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = card.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.borderColor = `${card.color}35`;
                }}>
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${card.color}20 0%, ${card.color}40 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  marginBottom: 8,
                  boxShadow: `0 4px 12px ${card.color}30`
                }}>
                  {card.icon}
                </div>

                <strong style={{ fontSize: 13, color: t.textPrimary, lineHeight: 1.25, marginBottom: 2 }}>
                  {lang === "Hindi" ? card.hindiTitle : card.title}
                </strong>
                <span style={{ fontSize: 10, color: t.textSecondary, marginBottom: 6 }}>
                  {card.role}
                </span>

                <div style={{
                  background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                  color: "#166534",
                  padding: "3px 6px",
                  borderRadius: 6,
                  fontSize: 9.5,
                  fontWeight: 800,
                  marginBottom: 8
                }}>
                  {lang === "Hindi" ? card.benefit : card.benefitEn}
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "6px",
                    background: card.color,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 10.5,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4
                  }}>
                  {verifiedCitizen ? <Volume2 size={12} /> : <Lock size={12} />}
                  <span>{verifiedCitizen ? tText.selectThis : (lang === "Hindi" ? "चुनें व लॉगिन करें" : "Select & Login")}</span>
                </button>
              </div>
            ))}
          </div>

          {/* 3-Step Process */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: 16 }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: 14, fontWeight: 800 }}>{tText.howTitle}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, fontSize: 11 }}>
              <div style={{ background: t.cardSubBg, padding: 10, borderRadius: 8 }}>
                <strong style={{ color: "#2563eb", display: "block", marginBottom: 3 }}>{tText.step1Title}</strong>
                <span style={{ color: t.textSecondary }}>{tText.step1Desc}</span>
              </div>
              <div style={{ background: t.cardSubBg, padding: 10, borderRadius: 8 }}>
                <strong style={{ color: "#16a34a", display: "block", marginBottom: 3 }}>{tText.step2Title}</strong>
                <span style={{ color: t.textSecondary }}>{tText.step2Desc}</span>
              </div>
              <div style={{ background: t.cardSubBg, padding: 10, borderRadius: 8 }}>
                <strong style={{ color: "#9333ea", display: "block", marginBottom: 3 }}>{tText.step3Title}</strong>
                <span style={{ color: t.textSecondary }}>{tText.step3Desc}</span>
              </div>
            </div>
          </div>

          <div style={{
            background: t.cardBg,
            border: `1.5px solid ${t.cardBorder}`,
            borderRadius: 12,
            padding: "12px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <HelpCircle size={18} />
              </div>
              <div>
                <strong style={{ fontSize: 12, color: t.textPrimary }}>{tText.needHelp}</strong>
                <div style={{ fontSize: 11, color: t.textSecondary }}>{tText.needHelpSub}</div>
              </div>
            </div>

            <button
              onClick={() => setCurrentView(verifiedCitizen ? "kiosk" : "login")}
              style={{
                background: t.btnPrimary,
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
                borderRadius: 6,
                fontWeight: 800,
                fontSize: 11.5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
              <span>{verifiedCitizen ? tText.goToDashboard : tText.directAadhaarBtn}</span>
            </button>
          </div>
        </main>

        <footer style={{
          marginTop: "auto",
          background: t.headerBg,
          color: "#94a3b8",
          padding: "10px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
          borderTop: `1px solid ${t.headerBorder}`,
          flexShrink: 0
        }}>
          <div>
            <strong>Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)</strong>
            <span style={{ margin: "0 8px" }}>•</span>
            <span>{tText.mosje}</span>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <span>Smart India Hackathon 2026</span>
            <span>Authenticated Data Persistence</span>
          </div>
        </footer>
      </div>
    );
  }

  /* ========================================================
     VIEW 2: FULLY RESTORED CITIZEN DASHBOARD (5 WORKING TABS)
     ======================================================== */
  if (currentView === "kiosk") {
    return (
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", background: t.bg, fontFamily: "'Inter', sans-serif", color: t.textPrimary, position: "relative" }}>
        
        {/* DOCUMENT READINESS MODAL */}
        {showDocModal && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.68)",
            backdropFilter: "blur(4px)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            boxSizing: "border-box"
          }}>
            <div style={{
              width: "100%",
              maxWidth: 540,
              background: t.cardBg,
              border: `1.5px solid ${t.cardBorder}`,
              borderRadius: 16,
              padding: "24px 26px",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
              boxSizing: "border-box"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, borderBottom: `1px solid ${t.cardBorder}`, paddingBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                      {lang === "Hindi" ? "पीएम-अजय दस्तावेज तैयारी जांच" : "PM-AJAY Document Readiness"}
                    </h3>
                    <span style={{ fontSize: 11, color: t.textSecondary }}>
                      {lang === "Hindi" ? "अनुदान व टूलकिट वितरण पूर्व-सत्यापन" : "Pre-Screening for Grant & Toolkit Disbursal"}
                    </span>
                  </div>
                </div>

                <button onClick={() => setShowDocModal(false)} style={{ background: "transparent", border: "none", color: t.textSecondary, cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ background: t.cardSubBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>
                    {lang === "Hindi" ? "पात्रता तैयारी स्कोर:" : "Eligibility Readiness Score:"}
                  </span>
                  <strong style={{ fontSize: 16, color: readinessScore === 100 ? "#16a34a" : (readinessScore >= 50 ? "#ca8a04" : "#dc2626") }}>
                    {readinessScore}% {readinessScore === 100 ? (lang === "Hindi" ? "पूर्ण (Ready)" : "Ready") : (lang === "Hindi" ? "कार्रवाई आवश्यक" : "Action Required")}
                  </strong>
                </div>
                <div style={{ width: "100%", height: 8, background: "#cbd5e1", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{
                    width: `${readinessScore}%`,
                    height: "100%",
                    background: readinessScore === 100 ? "linear-gradient(90deg, #10b981 0%, #059669 100%)" : "linear-gradient(90deg, #f59e0b 0%, #ea580c 100%)",
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, fontSize: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, background: t.cardSubBg, padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: `1px solid ${t.cardBorder}` }}>
                  <input
                    type="checkbox"
                    checked={docChecklist.casteCert}
                    onChange={(e) => setDocChecklist({ ...docChecklist, casteCert: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: t.textPrimary }}>1. {lang === "Hindi" ? "जाति प्रमाण पत्र (SC Category)" : "Caste Certificate (SC Category)"}</strong>
                    <div style={{ fontSize: 10.5, color: t.textSecondary }}>State revenue portal issued or verified via DigiLocker.</div>
                  </div>
                  {docChecklist.casteCert && <span style={{ color: "#16a34a", fontSize: 11, fontWeight: 800 }}>✓ Verified</span>}
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, background: t.cardSubBg, padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: `1px solid ${t.cardBorder}` }}>
                  <input
                    type="checkbox"
                    checked={docChecklist.incomeCert}
                    onChange={(e) => setDocChecklist({ ...docChecklist, incomeCert: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: t.textPrimary }}>2. {lang === "Hindi" ? "वार्षिक आय प्रमाण पत्र (Income ≤ ₹3.0L)" : "Annual Income Certificate (≤ ₹3.00 Lakh)"}</strong>
                    <div style={{ fontSize: 10.5, color: t.textSecondary }}>Annual household income must be ≤ ₹3.00 Lakh/year.</div>
                  </div>
                  {docChecklist.incomeCert && <span style={{ color: "#16a34a", fontSize: 11, fontWeight: 800 }}>✓ Verified</span>}
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, background: t.cardSubBg, padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: `1px solid ${t.cardBorder}` }}>
                  <input
                    type="checkbox"
                    checked={docChecklist.bankDbtSeeded}
                    onChange={(e) => setDocChecklist({ ...docChecklist, bankDbtSeeded: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: t.textPrimary }}>3. {lang === "Hindi" ? "बैंक खाता आधार-डीबीटी सीडिंग (NPCI Active)" : "Bank Account with Aadhaar-DBT Seeding"}</strong>
                    <div style={{ fontSize: 10.5, color: t.textSecondary }}>Active bank linkage for direct transfer of ₹15,000 / ₹50,000 subsidies.</div>
                  </div>
                  {docChecklist.bankDbtSeeded && <span style={{ color: "#16a34a", fontSize: 11, fontWeight: 800 }}>✓ Seeded</span>}
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 10, background: t.cardSubBg, padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: `1px solid ${t.cardBorder}` }}>
                  <input
                    type="checkbox"
                    checked={docChecklist.educationMarksheet}
                    onChange={(e) => setDocChecklist({ ...docChecklist, educationMarksheet: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: t.textPrimary }}>4. {lang === "Hindi" ? "शैक्षणिक अंकसूची (10वीं/8वीं पास)" : "Education Marksheet (10th/8th Pass Certificate)"}</strong>
                    <div style={{ fontSize: 10.5, color: t.textSecondary }}>Proof of basic educational qualification for NSQF Level 4 entry.</div>
                  </div>
                  {docChecklist.educationMarksheet && <span style={{ color: "#16a34a", fontSize: 11, fontWeight: 800 }}>✓ Ready</span>}
                </label>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleInspectDocsVoice}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: t.btnOfficer,
                    color: "#facc15",
                    border: "1px solid #3b82f6",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6
                  }}>
                  <Volume2 size={15} />
                  <span>{lang === "Hindi" ? "बोलकर जांचें (Inspect by Voice)" : "Inspect by Voice"}</span>
                </button>

                <button
                  onClick={() => setShowDocModal(false)}
                  style={{
                    padding: "10px 18px",
                    background: t.btnPrimary,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer"
                  }}>
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRINTABLE CITIZEN ACKNOWLEDGMENT SLIP MODAL */}
        {showPrintSlip && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(5px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            boxSizing: "border-box"
          }}>
            <div id="printableSlipArea" style={{
              width: "100%",
              maxWidth: 580,
              background: "#ffffff",
              color: "#0f172a",
              border: "2px solid #0c2340",
              borderRadius: 14,
              padding: "24px 28px",
              boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
              boxSizing: "border-box",
              position: "relative"
            }}>
              <div style={{ height: 4, background: "linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%)", borderRadius: 2, marginBottom: 12 }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", borderBottom: "2px solid #0c2340", paddingBottom: 10, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, #0c2340 0%, #1e3a5f 100%)", color: "#f59e0b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, border: "2px solid #f59e0b" }}>
                    अ
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#0c2340" }}>
                      PM-AJAY GIA Component • Official Receipt
                    </h3>
                    <div style={{ fontSize: 11, color: "#475569" }}>
                      {tText.mosje} • {tText.govIndia}
                    </div>
                  </div>
                </div>

                <button
                  className="no-print"
                  onClick={() => setShowPrintSlip(false)}
                  style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", padding: "8px 12px", borderRadius: 6, fontSize: 11, border: "1px solid #e2e8f0", marginBottom: 14 }}>
                <div><strong>Application ID:</strong> PM-AJAY-2026-8812</div>
                <div><strong>Generated:</strong> 29 Sept 2026, 12:45 PM</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 11, marginBottom: 14, borderBottom: "1px dashed #cbd5e1", paddingBottom: 12 }}>
                <div><span style={{ color: "#64748b" }}>Candidate Name:</span> <strong>{profile.name}</strong></div>
                <div><span style={{ color: "#64748b" }}>Category:</span> <strong>Scheduled Caste (SC) Verified</strong></div>
                <div><span style={{ color: "#64748b" }}>Education:</span> <strong>{profile.education}</strong></div>
                <div><span style={{ color: "#64748b" }}>Assigned District:</span> <strong>{profile.district} (MP)</strong></div>
              </div>

              <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", border: "1.5px solid #3b82f6", borderRadius: 8, padding: "10px 12px", marginBottom: 14, fontSize: 11 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#1d4ed8", textTransform: "uppercase" }}>Recommended NSQF Course & Center</div>
                <strong style={{ fontSize: 13, color: "#0f172a", display: "block", marginTop: 2 }}>{dynamicAdvisor.topRole} ({dynamicAdvisor.nsqfLevel})</strong>
                <div style={{ color: "#475569", marginTop: 2 }}>QP Code: {dynamicAdvisor.qpCode} • Training Center: {dynamicAdvisor.center}</div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#475569", textTransform: "uppercase", marginBottom: 6 }}>Sanctioned PM-AJAY GIA Financial Entitlements:</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontSize: 10 }}>
                  <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "1px solid #bbf7d0", padding: "6px 8px", borderRadius: 6 }}>
                    <span style={{ color: "#166534", display: "block" }}>1. Course Training:</span>
                    <strong style={{ fontSize: 11, color: "#15803d" }}>100% Free + Stipend</strong>
                  </div>
                  <div style={{ background: "linear-gradient(135deg, #fefce8 0%, #fef08a 100%)", border: "1px solid #fef08a", padding: "6px 8px", borderRadius: 6 }}>
                    <span style={{ color: "#854d0e", display: "block" }}>2. Free Modern Toolkit:</span>
                    <strong style={{ fontSize: 11, color: "#a16207" }}>₹15,000 Grant</strong>
                  </div>
                  <div style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)", border: "1px solid #fed7aa", padding: "6px 8px", borderRadius: 6 }}>
                    <span style={{ color: "#9a3412", display: "block" }}>3. Capital Subsidy (50%):</span>
                    <strong style={{ fontSize: 11, color: "#c2410c" }}>₹50,000 Direct Grant</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 54, height: 54, background: "#f8fafc", border: "1.5px solid #0c2340", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <QrCode size={38} color="#0c2340" />
                  </div>
                  <div style={{ fontSize: 9.5, color: "#475569", maxWidth: 240, lineHeight: 1.3 }}>
                    Scan QR at authorized PMKK/ITI Center or District Welfare Office to access live digital audit record.
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#0c2340" }}>Directorate of SC Welfare</div>
                  <div style={{ fontSize: 9, color: "#64748b" }}>Government of Madhya Pradesh</div>
                </div>
              </div>

              <div className="no-print" style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: t.btnSuccess,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.35)"
                  }}>
                  <Printer size={15} />
                  <span>Print Receipt / Save as PDF</span>
                </button>

                <button
                  onClick={() => setShowPrintSlip(false)}
                  style={{ padding: "10px 16px", background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PM-AJAY GIA SUBSIDY & EMI CALCULATOR MODAL */}
        {showCalculator && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            boxSizing: "border-box"
          }}>
            <div style={{
              width: "100%",
              maxWidth: 540,
              background: t.cardBg,
              border: `1.5px solid ${t.cardBorder}`,
              borderRadius: 16,
              padding: "24px 28px",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
              boxSizing: "border-box",
              position: "relative"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: `1px solid ${t.cardBorder}`, paddingBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calculator size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                      {lang === "Hindi" ? "पीएम-अजय अनुदान व ईएमआई कैलकुलेटर" : "PM-AJAY GIA Grant & EMI Calculator"}
                    </h3>
                    <span style={{ fontSize: 11, color: t.textSecondary }}>
                      {lang === "Hindi" ? "स्वरोजगार पूंजी सहायता व बैंक ऋण योजना" : "MoSJE Self-Employment Assistance Scheme"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCalculator(false)}
                  style={{ background: "transparent", border: "none", color: t.textSecondary, cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary }}>
                    {lang === "Hindi" ? "कुल प्रोजेक्ट लागत:" : "Total Project Cost:"}
                  </label>
                  <strong style={{ fontSize: 18, color: "#2563eb" }}>₹{calcProjectCost.toLocaleString("en-IN")}</strong>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="150000"
                  step="5000"
                  value={calcProjectCost}
                  onChange={(e) => setCalcProjectCost(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: t.textSecondary, marginTop: 2 }}>
                  <span>₹20,000 (Micro unit)</span>
                  <span>₹1,50,000 (Full Workshop)</span>
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary }}>
                    {lang === "Hindi" ? "ऋण अवधि (Tenure):" : "NSFDC Soft Loan Tenure:"}
                  </label>
                  <strong style={{ fontSize: 14, color: t.textPrimary }}>{calcTenureYears} Years ({calcTenureYears * 12} Months)</strong>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {[3, 4, 5].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setCalcTenureYears(yr)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: 6,
                        border: calcTenureYears === yr ? "1.5px solid #2563eb" : `1px solid ${t.cardBorder}`,
                        background: calcTenureYears === yr ? (darkMode ? "rgba(37,99,235,0.2)" : "#eff6ff") : t.cardSubBg,
                        color: calcTenureYears === yr ? "#2563eb" : t.textPrimary,
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer"
                      }}>
                      {yr} Years
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: t.cardSubBg, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, fontSize: 11 }}>
                  <div style={{ background: t.cardBg, padding: 8, borderRadius: 6, border: `1px solid ${t.cardBorder}` }}>
                    <span style={{ color: t.textSecondary, display: "block" }}>{lang === "Hindi" ? "सरकारी अनुदान (50%):" : "Govt Subsidy (50%):"}</span>
                    <strong style={{ fontSize: 14, color: "#16a34a" }}>₹{subsidyAmount.toLocaleString("en-IN")}</strong>
                    <span style={{ fontSize: 9, color: "#16a34a", display: "block" }}>100% Non-refundable</span>
                  </div>

                  <div style={{ background: t.cardBg, padding: 8, borderRadius: 6, border: `1px solid ${t.cardBorder}` }}>
                    <span style={{ color: t.textSecondary, display: "block" }}>{lang === "Hindi" ? "लाभार्थी अंश (10%):" : "Beneficiary (10%):"}</span>
                    <strong style={{ fontSize: 14, color: "#ca8a04" }}>₹{beneficiaryMargin.toLocaleString("en-IN")}</strong>
                    <span style={{ fontSize: 9, color: t.textSecondary, display: "block" }}>Own contribution</span>
                  </div>

                  <div style={{ background: t.cardBg, padding: 8, borderRadius: 6, border: `1px solid ${t.cardBorder}` }}>
                    <span style={{ color: t.textSecondary, display: "block" }}>{lang === "Hindi" ? "सस्ता बैंक ऋण (40%):" : "NSFDC Loan (40%):"}</span>
                    <strong style={{ fontSize: 14, color: "#0284c7" }}>₹{loanPrincipal.toLocaleString("en-IN")}</strong>
                    <span style={{ fontSize: 9, color: "#0284c7", display: "block" }}>@ 4% Soft Interest</span>
                  </div>
                </div>

                <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${t.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary }}>
                      {lang === "Hindi" ? "अनुमानित मासिक बैंक किस्त (EMI):" : "Estimated Monthly Bank EMI:"}
                    </div>
                    <div style={{ fontSize: 10, color: t.textSecondary }}>Zero collateral, no guarantor required for SC candidates</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#2563eb" }}>₹{monthlyEmi.toLocaleString("en-IN")} /mo</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowCalculator(false);
                  speakText(
                    `For a project cost of rupees ${calcProjectCost.toLocaleString("en-IN")}, your direct PM-AJAY capital subsidy is rupees ${subsidyAmount.toLocaleString("en-IN")}. The bank loan EMI is only rupees ${monthlyEmi} per month.`
                  );
                }}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: t.btnPrimary,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)"
                }}>
                <Check size={16} />
                <span>{lang === "Hindi" ? "स्वीकार करें व विवरण सुनें" : "Confirm Parameters & Hear Breakdown"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Navy Sidebar */}
        <aside style={{ width: 240, height: "100vh", background: t.sidebarBg, color: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ padding: "18px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.btnPrimary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)" }}>अ</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>PM-AJAY</div>
                <div style={{ fontSize: 11, color: "#93c5fd" }}>Livelihood Assistant</div>
              </div>
            </div>

            <nav style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { id: "home", label: lang === "Hindi" ? "होम (Home)" : "Home", icon: Home },
                { id: "profile", label: lang === "Hindi" ? "मेरी प्रोफ़ाइल" : "My Profile", icon: User },
                { id: "recommendations", label: lang === "Hindi" ? "अनुशंसित कोर्स" : "Recommendations", icon: Sparkles },
                { id: "jobs", label: lang === "Hindi" ? "प्रशिक्षण केंद्र" : "Training & Jobs", icon: Briefcase },
                { id: "tracker", label: lang === "Hindi" ? "प्रगति ट्रैकर" : "Progress Tracker", icon: TrendingUp }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = customerTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      stopSpeech();
                      setCustomerTab(item.id);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: isActive ? t.btnPrimary : "transparent",
                      color: isActive ? "#ffffff" : "#94a3b8",
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: isActive ? "0 4px 12px rgba(37, 99, 235, 0.35)" : "none",
                      transition: "all 0.15s ease"
                    }}>
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              onClick={() => {
                stopSpeech();
                setCurrentView("landing");
              }}
              style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#cbd5e1", fontSize: 11, cursor: "pointer" }}>
              {tText.citizenKioskReturn}
            </button>
          </div>
        </aside>

        {/* Dynamic Workspace Container */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <header style={{ height: 58, background: t.cardBg, borderBottom: `1px solid ${t.cardBorder}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.btnVoice, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)" }}>👩🏽</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{lang === "Hindi" ? `नमस्ते, ${profile.name}` : `Hello, ${profile.name}`}</div>
                <div style={{ fontSize: 11, color: t.textSecondary }}>
                  {lang === "Hindi" ? "आइए एक साथ आपका उज्ज्वल भविष्य बनाएं!" : "Let's build your brighter future together!"}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {isSpeaking && (
                <button
                  onClick={stopSpeech}
                  style={{
                    background: t.btnDanger,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 6,
                    padding: "5px 10px",
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    boxShadow: "0 0 12px rgba(220, 38, 38, 0.5)"
                  }}>
                  <Square size={12} fill="#ffffff" />
                  <span>{tText.stopVoice}</span>
                </button>
              )}

              {/* Language Switcher */}
              <LanguageToggleBtn />

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                style={{ background: t.btnOfficer, color: "#facc15", border: "1px solid #3b82f6", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                <span>{isFullscreen ? tText.exitFullscreen : tText.fullscreen}</span>
              </button>

              {/* Document Readiness Quick Action Button */}
              <button
                onClick={() => setShowDocModal(true)}
                style={{
                  background: readinessScore === 100 ? t.btnSuccess : "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}>
                <FileCheck size={13} />
                <span>{tText.docsBadge}: {readinessScore}%</span>
              </button>

              {/* Dialect Selector */}
              <div style={{ display: "flex", alignItems: "center", background: t.cardSubBg, padding: "3px 8px", borderRadius: 6, border: `1px solid ${t.cardBorder}`, gap: 4 }}>
                <Languages size={13} color="#2563eb" />
                <select
                  value={dialect}
                  onChange={(e) => {
                    stopSpeech();
                    setDialect(e.target.value);
                  }}
                  style={{ background: "transparent", border: "none", color: t.textPrimary, fontSize: 11, fontWeight: 700, outline: "none", cursor: "pointer" }}>
                  <option value="Standard">हिंदी (Standard)</option>
                  <option value="Bundelkhandi">बुंदेली / मालवी (MP)</option>
                  <option value="Bhojpuri">भोजपुरी (Purvanchal)</option>
                </select>
              </div>

              {/* Printable Slip Trigger Button */}
              <button
                onClick={() => setShowPrintSlip(true)}
                style={{
                  background: t.btnOfficer,
                  color: "#facc15",
                  border: "1px solid #f59e0b",
                  padding: "5px 11px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5
                }}>
                <Printer size={13} />
                <span>{tText.printSlipBtn}</span>
              </button>

              {/* Calculator Quick Action Button */}
              <button
                onClick={() => setShowCalculator(true)}
                style={{
                  background: t.btnSuccess,
                  color: "#ffffff",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)"
                }}>
                <Calculator size={13} />
                <span>{tText.grantEmiBtn}</span>
              </button>

              <button
                onClick={() => {
                  stopSpeech();
                  setCurrentView("admin");
                }}
                style={{ background: t.btnOfficer, color: "#facc15", border: "1px solid #3b82f6", padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                {tText.officerViewBtn}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${t.cardBorder}`, background: "transparent", color: t.textPrimary, cursor: "pointer" }}>
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>
          </header>

          <main style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14, overflowY: "scroll" }}>
            {customerTab === "home" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  <div style={{ background: t.tileGradient1, border: `1px solid ${t.cardBorder}`, padding: "12px 14px", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <span style={{ fontSize: 11, color: t.textSecondary }}>{tText.profileCompleted}</span>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#2563eb" }}>78%</div>
                  </div>
                  <div style={{ background: t.tileGradient2, border: `1px solid ${t.cardBorder}`, padding: "12px 14px", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <span style={{ fontSize: 11, color: t.textSecondary }}>{tText.recommendedPathways}</span>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#16a34a" }}>3</div>
                  </div>

                  <div
                    onClick={() => setShowDocModal(true)}
                    style={{ background: t.tileGradient3, border: `1px solid ${t.cardBorder}`, padding: "12px 14px", borderRadius: 10, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <span style={{ fontSize: 11, color: t.textSecondary }}>{tText.docReadiness}</span>
                    <div style={{ fontSize: 18, fontWeight: 900, color: readinessScore === 100 ? "#16a34a" : "#ca8a04" }}>
                      {readinessScore}% <span style={{ fontSize: 10, fontWeight: 700, color: "#2563eb" }}>Inspect →</span>
                    </div>
                  </div>

                  <div style={{ background: t.tileGradient4, border: `1px solid ${t.cardBorder}`, padding: "12px 14px", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <span style={{ fontSize: 11, color: t.textSecondary }}>{tText.nextStep}</span>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#ea580c" }}>{tText.inProgress}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 14, flex: 1 }}>
                  <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.04)" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <h3 style={{ margin: 0, fontSize: 14 }}>{tText.profileSummary}</h3>
                        
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={handleHearBackProfile}
                            title="Hear audibly verified profile details"
                            style={{
                              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                              border: "1px solid #bfdbfe",
                              color: "#2563eb",
                              fontSize: 10.5,
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "3px 8px",
                              borderRadius: 6
                            }}>
                            <Headphones size={12} />
                            <span>{tText.hearBackProfile}</span>
                          </button>

                          <button
                            onClick={() => setCustomerTab("profile")}
                            style={{ background: "transparent", border: "none", color: "#2563eb", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>{lang === "Hindi" ? "आयु" : "Age"}</span><strong>{profile.age}</strong></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>{lang === "Hindi" ? "शिक्षा" : "Education"}</span><strong>{profile.education}</strong></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>{lang === "Hindi" ? "वर्तमान कार्य" : "Current Occupation"}</span><strong>{profile.occupation}</strong></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>{lang === "Hindi" ? "कौशल" : "Skills"}</span><strong style={{ color: "#2563eb" }}>{profile.skills}</strong></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>{lang === "Hindi" ? "पसंद" : "Preference"}</span><strong style={{ color: "#2563eb" }}>{profile.preference}</strong></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>{lang === "Hindi" ? "जिला" : "District"}</span><strong>{profile.district} (MP)</strong></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>{lang === "Hindi" ? "बोली प्रारूप" : "Dialect"}</span><strong style={{ color: "#047857" }}>{dialect}</strong></div>
                      </div>
                    </div>

                    <div style={{
                      marginTop: 16,
                      background: isRecording ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)" : t.cardSubBg,
                      border: isRecording ? "1.5px solid #ef4444" : `1px solid ${t.cardBorder}`,
                      padding: "8px 12px",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button
                          onClick={toggleRecording}
                          title={isRecording ? "Stop Voice Input" : "Speak to Assistant"}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "none",
                            background: isRecording ? t.btnDanger : t.btnPrimary,
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: isRecording ? "0 0 15px rgba(239, 68, 68, 0.7)" : "0 2px 8px rgba(37, 99, 235, 0.4)"
                          }}>
                          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: isRecording ? "#ef4444" : t.textPrimary }}>
                            {isRecording ? tText.listening : tText.voiceAssistant}
                          </div>
                          <div style={{ fontSize: 10, color: t.textSecondary }}>
                            {isRecording ? `Speak in ${dialect} trade dialect` : tText.speakChanges}
                          </div>
                        </div>
                      </div>

                      <LiveMicVisualizer isRecording={isRecording} darkMode={darkMode} />
                    </div>
                  </div>

                  <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.04)" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <h3 style={{ margin: 0, fontSize: 14 }}>{tText.topRecommendation}</h3>
                        <span style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", color: "#166534", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 800 }}>{dynamicAdvisor.matchPercentage}</span>
                      </div>

                      <div style={{ background: t.cardSubBg, padding: 12, borderRadius: 8, marginBottom: 10 }}>
                        <h4 style={{ margin: 0, fontSize: 14, color: "#2563eb" }}>{dynamicAdvisor.topRole}</h4>
                        <span style={{ fontSize: 10, color: t.textSecondary }}>{dynamicAdvisor.nsqfLevel} • {dynamicAdvisor.qpCode}</span>
                        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3, fontSize: 10.5 }}>
                          {dynamicAdvisor.benefits.map((b, i) => (
                            <div key={i} style={{ display: "flex", gap: 5 }}><Check size={12} color="#16a34a" /> {b}</div>
                          ))}
                        </div>
                      </div>

                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1.2fr 1fr",
                        gap: 6,
                        marginBottom: 10
                      }}>
                        <div style={{ background: t.cardSubBg, padding: 8, borderRadius: 6 }}>
                          <span style={{ fontSize: 10, color: t.textSecondary, display: "block" }}>{tText.statSubsidy}:</span>
                          <strong style={{ fontSize: 13, color: "#16a34a" }}>₹50,000 Direct Grant</strong>
                        </div>
                        <button
                          onClick={() => setShowCalculator(true)}
                          style={{
                            background: t.cardSubBg,
                            border: "1px dashed #2563eb",
                            padding: 8,
                            borderRadius: 6,
                            cursor: "pointer",
                            textAlign: "center"
                          }}>
                          <span style={{ fontSize: 10, color: "#2563eb", display: "block", fontWeight: 700 }}>Calculate Loan EMI</span>
                          <span style={{ fontSize: 11, fontWeight: 800, color: t.textPrimary }}>@ 4% NSFDC →</span>
                        </button>
                      </div>

                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, marginBottom: 4 }}>
                          {tText.alternativePathways}
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {alternatives.map((a, i) => (
                            <span key={i} style={{ background: t.cardSubBg, padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600 }}>{a.title} ({a.nsqf})</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={toggleSpeechPlayback}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: isSpeaking ? t.btnDanger : t.btnPrimary,
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        marginTop: 10,
                        boxShadow: isSpeaking ? "0 0 14px rgba(220, 38, 38, 0.5)" : "0 4px 12px rgba(37, 99, 235, 0.35)",
                        transition: "all 0.2s ease"
                      }}>
                      {isSpeaking ? (
                        <>
                          <Square size={14} fill="#ffffff" />
                          <span>{tText.stopVoice}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={15} />
                          <span>{tText.listenAdvice}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {customerTab === "profile" && (
              <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: `1px solid ${t.cardBorder}`, paddingBottom: 10 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16 }}>{lang === "Hindi" ? "नागरिक प्रोफ़ाइल व सत्यापन विवरण" : "Citizen Profile & Verification Details"}</h3>
                    <span style={{ fontSize: 11, color: t.textSecondary }}>PM-AJAY GIA Component Direct Beneficiary Information</span>
                  </div>
                  <span style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", color: "#166534", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                    ✓ Aadhaar Verified (UIDAI)
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, display: "block", marginBottom: 4 }}>
                      {lang === "Hindi" ? "पूरा नाम (आधार के अनुसार):" : "Full Name (as per Aadhaar):"}
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${t.cardBorder}`, background: t.cardSubBg, color: t.textPrimary, fontSize: 12, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, display: "block", marginBottom: 4 }}>
                      {lang === "Hindi" ? "सामाजिक वर्ग (Category):" : "Social Category:"}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={profile.category}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${t.cardBorder}`, background: t.cardSubBg, color: t.textPrimary, fontSize: 12, opacity: 0.8, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, display: "block", marginBottom: 4 }}>
                      {lang === "Hindi" ? "शैक्षणिक योग्यता:" : "Education Level:"}
                    </label>
                    <select
                      value={profile.education}
                      onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${t.cardBorder}`, background: t.cardSubBg, color: t.textPrimary, fontSize: 12 }}>
                      <option value="5th Pass">5th Pass</option>
                      <option value="8th Pass">8th Pass</option>
                      <option value="Class 10">Class 10 (Matric)</option>
                      <option value="Class 12">Class 12 (Intermediate)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, display: "block", marginBottom: 4 }}>
                      {lang === "Hindi" ? "जिला / कार्यक्षेत्र:" : "District / Jurisdiction:"}
                    </label>
                    <select
                      value={profile.district}
                      onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${t.cardBorder}`, background: t.cardSubBg, color: t.textPrimary, fontSize: 12 }}>
                      <option value="Bhopal">Bhopal (MP)</option>
                      <option value="Varanasi">Varanasi (UP)</option>
                      <option value="Patna">Patna (Bihar)</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, display: "block", marginBottom: 4 }}>
                      {lang === "Hindi" ? "कार्य अनुभव व कौशल:" : "Trade Skills & Experience:"}
                    </label>
                    <input
                      type="text"
                      value={profile.skills}
                      onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${t.cardBorder}`, background: t.cardSubBg, color: t.textPrimary, fontSize: 12, boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    onClick={() => {
                      alert(lang === "Hindi" ? "प्रोफ़ाइल सफलतापूर्वक सुरक्षित की गई!" : "Profile details updated successfully!");
                      setCustomerTab("home");
                    }}
                    style={{ background: t.btnPrimary, color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)" }}>
                    <Save size={14} />
                    <span>{tText.saveChanges}</span>
                  </button>
                </div>
              </div>
            )}

            {customerTab === "recommendations" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: 14 }}>
                  <h3 style={{ margin: 0, fontSize: 15 }}>
                    {lang === "Hindi" ? "आपकी प्रोफ़ाइल हेतु मान्यता प्राप्त एनएसक्यूएफ कोर्स" : "Accredited NSQF Qualification Packs for Your Profile"}
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: 11, color: t.textSecondary }}>
                    Courses aligned with high-growth agricultural and technical trades in {profile.district} under PM-AJAY GIA grant provisions.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {allRecommendedCourses.map((c, i) => (
                    <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                          <span style={{ fontSize: 10, color: "#2563eb", fontWeight: 700 }}>{c.sector} • {c.nsqf}</span>
                          <span style={{ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", color: "#166534", padding: "2px 6px", borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{c.match} Match</span>
                        </div>
                        <h4 style={{ margin: "6px 0 4px 0", fontSize: 13, color: t.textPrimary }}>{c.title}</h4>
                        <div style={{ fontSize: 10, color: t.textSecondary }}>QP Code: {c.qp} • Duration: {c.duration}</div>
                        <div style={{ marginTop: 8, fontSize: 11, color: "#10b981", fontWeight: 600 }}>Grant: {c.grant}</div>
                        <div style={{ fontSize: 10.5, color: t.textSecondary, marginTop: 2 }}>Training Center: {c.center}</div>
                      </div>

                      <button
                        onClick={() => {
                          setProfile((prev) => ({
                            ...prev,
                            skills: c.title
                          }));
                          setCustomerTab("home");
                        }}
                        style={{ marginTop: 10, width: "100%", padding: "7px", background: t.cardSubBg, border: `1px solid ${t.cardBorder}`, borderRadius: 6, color: t.textPrimary, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                        {lang === "Hindi" ? "इसे प्राथमिक ट्रेड चुनें →" : "Select As Primary Target Trade →"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customerTab === "jobs" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: 14 }}>
                  <h3 style={{ margin: 0, fontSize: 15 }}>
                    {lang === "Hindi" ? `अधिकृत प्रशिक्षण केंद्र व उद्योग लिंकेज (${profile.district})` : `Authorized Training Centers & Industrial Linkage (${profile.district})`}
                  </h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: 11, color: t.textSecondary }}>
                    Institutes affiliated with the Ministry of Social Justice & Empowerment for PM-AJAY GIA certified skilling.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {authorizedCentersList.map((center, i) => (
                    <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 10, color: "#2563eb", fontWeight: 700 }}>{center.type}</div>
                        <h4 style={{ margin: "4px 0", fontSize: 13, color: t.textPrimary }}>{center.name}</h4>
                        <div style={{ fontSize: 11, color: t.textSecondary }}><MapPin size={11} style={{ display: "inline", marginRight: 3 }} />{center.location}</div>
                        <div style={{ fontSize: 11, color: "#16a34a", marginTop: 4, fontWeight: 600 }}>{center.stipend}</div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#ea580c" }}>{center.seatsAvailable} Seats Open</div>
                        <div style={{ fontSize: 11, color: t.textSecondary, margin: "4px 0" }}><PhoneCall size={11} style={{ display: "inline", marginRight: 3 }} />{center.contact}</div>
                        <button
                          onClick={() => alert(`Seat reservation request sent to ${center.name}. District Officer will contact you.`)}
                          style={{ background: t.btnPrimary, color: "#ffffff", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                          {lang === "Hindi" ? "सीट आरक्षित करें" : "Book Training Seat"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customerTab === "tracker" && (
              <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ margin: "0 0 4px 0", fontSize: 16 }}>
                  {lang === "Hindi" ? "पीएम-अजय वित्तीय अनुदान व प्रशिक्षण प्रगति" : "PM-AJAY GIA Financial Grant & Training Progress"}
                </h3>
                <p style={{ margin: "0 0 20px 0", fontSize: 11, color: t.textSecondary }}>Application Tracking ID: PM-AJAY-2026-8812</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
                  {[
                    { title: "Stage 1: Aadhaar Authentication & Caste Eligibility", desc: "Citizen identity verified via UIDAI. Eligible under SC Category.", status: "Completed", date: "24 Sept 2026", color: "#16a34a" },
                    { title: "Stage 2: Voice-Based NSQF Trade Matching", desc: `Aspiration matched with ${dynamicAdvisor.topRole} (${dynamicAdvisor.nsqfLevel}).`, status: "Completed", date: "24 Sept 2026", color: "#16a34a" },
                    { title: "Stage 3: Training Center Seat Allocation & Free Modern Toolkit", desc: `Batch scheduled at ${dynamicAdvisor.center}. ₹15,000 tool-kit sanction ready upon exam completion.`, status: "In-Progress", date: "Scheduled Oct 2026", color: "#ea580c" },
                    { title: "Stage 4: ₹50,000 Micro-Enterprise Grant & NSFDC Soft Loan", desc: "Capital subsidy disbursement to bank account for workshop setup.", status: "Pending Graduation", date: "Estimated Nov 2026", color: "#94a3b8" }
                  ].map((step, idx) => (
                    <div key={idx} style={{ display: "flex", gap: 14, alignItems: "start" }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: step.status === "Completed" ? "#dcfce7" : (step.status === "In-Progress" ? "#fff7ed" : t.cardSubBg),
                        color: step.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: 12,
                        flexShrink: 0,
                        border: `2px solid ${step.color}`
                      }}>
                        {step.status === "Completed" ? "✓" : idx + 1}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <strong style={{ fontSize: 13, color: t.textPrimary }}>{step.title}</strong>
                          <span style={{ fontSize: 10, color: step.color, fontWeight: 700 }}>{step.status} • {step.date}</span>
                        </div>
                        <p style={{ margin: "4px 0 0 0", fontSize: 11, color: t.textSecondary }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  /* ========================================================
     VIEW 3: FULLY RESTORED OFFICER MONITORING DASHBOARD
     ======================================================== */
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: t.bg, fontFamily: "'Segoe UI', sans-serif", color: t.textPrimary }}>
      <div style={{ height: 4, background: "linear-gradient(90deg, #ff9933 0%, #ffffff 50%, #138808 100%)", flexShrink: 0 }} />

      <header style={{ height: 56, background: t.headerBg, color: "#ffffff", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setCurrentView("landing")}
            style={{ background: t.btnOfficer, color: "#93c5fd", border: "1px solid #3b82f6", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowLeft size={13} />
            <span>{tText.portalHomeBtn}</span>
          </button>
          <span style={{ fontSize: 15, fontWeight: 900 }}>PM-AJAY GIA District Officer Dashboard</span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)", border: "1px solid #10b981", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 800, color: "#34d399" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            <span>{tText.liveTelemetry}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LanguageToggleBtn />

          <button
            onClick={toggleFullscreen}
            style={{ background: t.btnOfficer, color: "#facc15", border: "1px solid #3b82f6", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            <span>{isFullscreen ? tText.exitFullscreen : tText.fullscreen}</span>
          </button>

          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            {authenticatedOfficer ? `${authenticatedOfficer.name} (${authenticatedOfficer.district})` : "Dr. Arvind Saxena, IAS (Bhopal)"}
          </div>

          <button
            onClick={() => {
              setAuthenticatedOfficer(null);
              setCurrentView("officer_login");
            }}
            style={{ background: "transparent", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#ef4444", padding: "4px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ background: t.cardBg, borderBottom: `1px solid ${t.cardBorder}`, padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "overview", label: lang === "Hindi" ? "अवलोकन व हीटमैप (Overview)" : "Overview & Heatmap", icon: Activity },
            { id: "logs", label: `${lang === "Hindi" ? "नागरिक आवेदन लॉग" : "Citizen Voice Logs"} (${filteredBeneficiaries.length})`, icon: FileCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "transparent", border: "none", borderBottom: isActive ? "3px solid #2563eb" : "3px solid transparent", color: isActive ? "#2563eb" : t.textSecondary, fontWeight: isActive ? 800 : 600, fontSize: 12, cursor: "pointer" }}>
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Filter size={12} color="#94a3b8" />
            <span style={{ color: t.textSecondary }}>District:</span>
            <select
              value={adminDistrictFilter}
              onChange={(e) => {
                setAdminDistrictFilter(e.target.value);
                setSelectedClusterBlock("All");
              }}
              style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${t.cardBorder}`, background: t.cardSubBg, color: t.textPrimary, fontSize: 11, outline: "none", cursor: "pointer" }}>
              <option value="All">All Districts</option>
              <option value="Bhopal">Bhopal (MP)</option>
              <option value="Varanasi">Varanasi (UP)</option>
              <option value="Patna">Patna (Bihar)</option>
            </select>
          </div>

          {selectedClusterBlock !== "All" && (
            <button
              onClick={() => setSelectedClusterBlock("All")}
              style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "3px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10, fontWeight: 700 }}>
              Block: {selectedClusterBlock} ✕
            </button>
          )}

          <button
            onClick={downloadAuditCSV}
            style={{
              background: t.btnSuccess,
              color: "#ffffff",
              border: "none",
              padding: "5px 11px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)"
            }}>
            <Download size={12} />
            <span>{tText.exportCsv}</span>
          </button>
        </div>
      </div>

      <main style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14, overflowY: "scroll" }}>
        {adminTab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              <div style={{ background: t.tileGradient1, border: `1px solid ${t.cardBorder}`, padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: 11, color: t.textSecondary }}>{tText.totalCounseled}</span>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#2563eb" }}>{liveCounter.toLocaleString()}</div>
                <span style={{ fontSize: 10, color: "#16a34a" }}>↑ +18 today</span>
              </div>
              <div style={{ background: t.tileGradient2, border: `1px solid ${t.cardBorder}`, padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: 11, color: t.textSecondary }}>{tText.toolkitsDisbursed}</span>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#16a34a" }}>₹1.86 Cr</div>
                <span style={{ fontSize: 10, color: t.textSecondary }}>1,240 Grants @ ₹15k</span>
              </div>
              <div style={{ background: t.tileGradient3, border: `1px solid ${t.cardBorder}`, padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: 11, color: t.textSecondary }}>{tText.subsidiesApproved}</span>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#ca8a04" }}>₹2.41 Cr</div>
                <span style={{ fontSize: 10, color: "#16a34a" }}>482 Units Approved</span>
              </div>
              <div style={{ background: t.tileGradient4, border: `1px solid ${t.cardBorder}`, padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: 11, color: t.textSecondary }}>{tText.avgSaturation}</span>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#db2777" }}>84.6%</div>
                <span style={{ fontSize: 10, color: t.textSecondary }}>Across 6 Centers</span>
              </div>
            </div>

            <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Map size={16} color="#2563eb" />
                  <strong style={{ fontSize: 13, color: t.textPrimary }}>{tText.blockDensity} ({adminDistrictFilter})</strong>
                </div>
                <span style={{ fontSize: 11, color: t.textSecondary }}>
                  Click a block to isolate citizen logs
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {districtClusterBlocks.map((blk, i) => {
                  const isSelected = selectedClusterBlock === blk.blockName;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedClusterBlock(isSelected ? "All" : blk.blockName);
                        setAdminTab("logs");
                      }}
                      style={{
                        background: isSelected ? "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(30,41,59,0.3) 100%)" : t.cardSubBg,
                        border: isSelected ? "2px solid #2563eb" : `1px solid ${t.cardBorder}`,
                        borderRadius: 8,
                        padding: "10px 12px",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <strong style={{ fontSize: 12, color: t.textPrimary }}>{blk.blockName}</strong>
                        <span style={{
                          background: blk.status === "High Demand" ? "#dcfce7" : "#e2e8f0",
                          color: blk.status === "High Demand" ? "#166534" : "#334155",
                          padding: "1px 6px",
                          borderRadius: 4,
                          fontSize: 9,
                          fontWeight: 800
                        }}>
                          {blk.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: blk.color, margin: "4px 0" }}>
                        {blk.totalCounseled} <span style={{ fontSize: 10, fontWeight: 600, color: t.textSecondary }}>inquiries</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: t.textSecondary }}>Trade: <strong>{blk.primaryDemand}</strong></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
              <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: 16 }}>
                <strong style={{ fontSize: 13 }}>{tText.tradeDemandMatrix}</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                  {sectorDemands.map((sec, idx) => (
                    <div key={idx} style={{ fontSize: 11 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span>{sec.sector}</span>
                        <strong>{sec.count} ({sec.pct}%)</strong>
                      </div>
                      <div style={{ width: "100%", height: 6, background: t.cardSubBg, borderRadius: 10, overflow: "hidden" }}>
                        <div style={{ width: `${sec.pct * 2.5}%`, height: "100%", background: sec.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: 16 }}>
                <strong style={{ fontSize: 13 }}>{tText.grantUtilization}</strong>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: t.cardSubBg, padding: 10, borderRadius: 6, fontSize: 11 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Annual Allocation:</span>
                      <strong>₹6.50 Cr</strong>
                    </div>
                    <div style={{ width: "100%", height: 6, background: "#cbd5e1", borderRadius: 10, margin: "6px 0", overflow: "hidden" }}>
                      <div style={{ width: "65.6%", height: "100%", background: "linear-gradient(90deg, #10b981 0%, #059669 100%)" }} />
                    </div>
                    <span style={{ color: "#16a34a", fontSize: 10, fontWeight: 700 }}>₹4.27 Cr Disbursed (65.6%)</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {adminTab === "logs" && (
          <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 10, padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <strong style={{ fontSize: 13 }}>Live Citizen Inquiries & Verification Pipeline</strong>
                <div style={{ fontSize: 11, color: t.textSecondary }}>
                  Showing {filteredBeneficiaries.length} verified records (District: {adminDistrictFilter} | Block: {selectedClusterBlock})
                </div>
              </div>

              <button
                onClick={downloadAuditCSV}
                style={{
                  background: t.btnSuccess,
                  color: "#ffffff",
                  border: "none",
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}>
                <Download size={12} />
                <span>{tText.exportCsv}</span>
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, textAlign: "left", marginTop: 4 }}>
              <thead>
                <tr style={{ background: t.cardSubBg, color: t.textSecondary }}>
                  <th style={{ padding: "8px" }}>App ID</th>
                  <th style={{ padding: "8px" }}>District</th>
                  <th style={{ padding: "8px" }}>Block</th>
                  <th style={{ padding: "8px" }}>Trade Aspiration</th>
                  <th style={{ padding: "8px" }}>NSQF QP</th>
                  <th style={{ padding: "8px" }}>Grant</th>
                  <th style={{ padding: "8px" }}>Toolkit</th>
                  <th style={{ padding: "8px" }}>Enterprise Subsidy</th>
                  <th style={{ padding: "8px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBeneficiaries.map((rec) => (
                  <tr key={rec.id} style={{ borderBottom: `1px solid ${t.cardBorder}` }}>
                    <td style={{ padding: "8px", color: "#0284c7", fontWeight: 700 }}>{rec.id}</td>
                    <td style={{ padding: "8px" }}>{rec.district}</td>
                    <td style={{ padding: "8px", color: t.textSecondary }}>{rec.block || "Govindpura Industrial"}</td>
                    <td style={{ padding: "8px", fontWeight: 600 }}>{rec.voicedTrade}</td>
                    <td style={{ padding: "8px", color: "#16a34a", fontWeight: 700 }}>{rec.qpCode}</td>
                    <td style={{ padding: "8px", fontWeight: 700 }}>{rec.grantAmount}</td>
                    <td style={{ padding: "8px" }}>{rec.toolkitStatus}</td>
                    <td style={{ padding: "8px" }}>
                      <span style={{
                        background: rec.enterpriseStatus === "Approved" ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" : "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                        color: rec.enterpriseStatus === "Approved" ? "#166534" : "#92400e",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontWeight: 700,
                        fontSize: 10
                      }}>
                        {rec.enterpriseStatus === "Approved" ? tText.sanctionedBadge : tText.underReview}
                      </span>
                    </td>
                    <td style={{ padding: "8px" }}>
                      {rec.enterpriseStatus !== "Approved" ? (
                        <button
                          onClick={() => handleApproveGrant(rec.id)}
                          style={{
                            background: t.btnSuccess,
                            color: "#fff",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 700,
                            cursor: "pointer"
                          }}>
                          {tText.actionApprove}
                        </button>
                      ) : (
                        <span style={{ color: "#16a34a", fontSize: 10, fontWeight: 700 }}>✓ Sanctioned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}