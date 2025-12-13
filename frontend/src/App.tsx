import { useState, useEffect, useRef } from 'react';
import UrlInput from './components/UrlInput';
import AuditResults from './components/AuditResults';
import { ScanEye, Sparkles, Shield, ArrowRight, Zap, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface Issue {
  title: string;
  description: string;
  suggested_fix: string;
}

interface AuditReport {
  audit_summary: string;
  issues: Issue[];
}

function App() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const handleAnalyze = (url: string) => {
    setLoading(true);
    setError(null);
    setReport(null);

    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      const ws = new WebSocket('ws://localhost:8001/analyze-url');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to WebSocket');
        ws.send(JSON.stringify({ url }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.error) {
            setError(data.error);
            setLoading(false);
            return;
          }

          if (data.audit_summary && data.issues) {
            setReport(data);
            setLoading(false);
            ws.close();
          }
        } catch (err) {
          console.error('Error parsing message:', err);
          setError('Failed to parse server response');
          setLoading(false);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error. Please ensure the backend server is running.');
        setLoading(false);
      };

    } catch (err) {
      console.error('Connection failed:', err);
      setError('Failed to initiate connection');
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/20 selection:text-white overflow-x-hidden relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between backdrop-blur-sm bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <ScanEye className="w-6 h-6 text-black" />
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10 backdrop-blur-md">
          {['Home', 'Audit', 'Reports', 'Features', 'Pricing', 'FAQ'].map((item) => (
            <a key={item} href="#" className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium group">
            <span>Protection</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center ml-1">
              <Shield className="w-3 h-3" />
            </div>
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600" />
             <span>Sign In</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-40 pb-32 px-4 md:px-6 flex flex-col items-center justify-center min-h-screen">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-emerald-900/20 via-blue-900/20 to-purple-900/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
          
          {/* Floating Nodes - Left */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-0 left-0 hidden lg:flex flex-col gap-2 items-start"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white" />
            </div>
            <div className="flex flex-col items-start ml-2">
              <span className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" /> Heuristics
              </span>
              <span className="text-xs text-gray-500 ml-3.5">10-Point Check</span>
            </div>
            {/* Connecting Line */}
            <div className="absolute top-5 left-10 w-32 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
          </motion.div>

           <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="absolute bottom-20 left-10 hidden lg:flex flex-col gap-2 items-start"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex flex-col items-start ml-2">
              <span className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" /> Accessibility
              </span>
              <span className="text-xs text-gray-500 ml-3.5">WCAG 2.1</span>
            </div>
             {/* Connecting Line */}
             <div className="absolute top-5 left-10 w-24 h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
          </motion.div>


          {/* Floating Nodes - Right */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute top-10 right-0 hidden lg:flex flex-col gap-2 items-end"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-gray-200 flex items-center gap-2">
                Usability <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </span>
              <span className="text-xs text-gray-500 mr-3.5">Nielsen</span>
            </div>
             {/* Connecting Line */}
             <div className="absolute top-5 right-10 w-32 h-[1px] bg-gradient-to-l from-white/20 to-transparent" />
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-10 hover:bg-white/10 transition-colors cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
               <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Unlock Your UX Potential!</span>
            <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors group-hover:translate-x-0.5" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50"
          >
            One-click for <br />
            UX Perfection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed font-light"
          >
            Dive into deep analysis, where innovative AI technology meets design expertise.
            Instantly audit your website for usability and accessibility.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative max-w-lg mx-auto w-full"
          >
            <UrlInput onSubmit={handleAnalyze} isLoading={loading} />
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-10 flex items-center gap-4"
        >
             <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                <ArrowRight className="w-4 h-4 rotate-90" />
             </div>
             <span className="text-sm text-gray-400">01/03 . Scroll down</span>
        </motion.div>

         <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 right-10 flex flex-col items-end gap-2"
        >
             <span className="text-sm text-yellow-500/80 font-medium">UX Horizons</span>
             <div className="flex gap-1">
                 <div className="w-8 h-1 bg-white rounded-full" />
                 <div className="w-8 h-1 bg-white/10 rounded-full" />
                 <div className="w-8 h-1 bg-white/10 rounded-full" />
             </div>
        </motion.div>

      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 pb-20 relative z-10">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-center backdrop-blur-sm"
          >
            {error}
          </motion.div>
        )}

        {report && <AuditResults report={report} />}
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-40" />
      
      {/* Logos Footer */}
      <div className="fixed bottom-0 left-0 right-0 py-6 border-t border-white/5 bg-[#050505]/80 backdrop-blur-md z-30 hidden">
          <div className="container mx-auto px-6 flex justify-between items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholder for logos */}
              <span>Vercel</span>
              <span>Loom</span>
              <span>Cash App</span>
              <span>Loops</span>
              <span>Zapier</span>
              <span>Ramp</span>
              <span>Raycast</span>
          </div>
      </div>
    </div>
  );
}

export default App;
