import React, { useState } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    try {
      new URL(url);
      setError('');
      onSubmit(url);
    } catch (err) {
      setError('Please enter a valid URL (e.g., https://example.com)');
    }
  };

  return (
    <div className="w-full relative z-10">
      <motion.form 
        onSubmit={handleSubmit} 
        className="relative"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`
          relative flex items-center p-1.5 bg-white/5 backdrop-blur-xl rounded-full 
          transition-all duration-500 border group
          ${isFocused 
            ? 'border-white/30 shadow-[0_0_40px_rgba(255,255,255,0.1)] bg-white/10' 
            : 'border-white/10 hover:border-white/20 hover:bg-white/10'}
        `}>
          <div className="pl-5 pr-3 text-gray-400">
            <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-white' : 'group-hover:text-gray-300'}`} />
          </div>
          
          <input
            type="url"
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 text-base py-3 px-2 outline-none font-light tracking-wide"
            placeholder="Enter website URL to analyze..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`
              px-6 py-3 rounded-full font-medium text-sm transition-all duration-300
              flex items-center gap-2 min-w-[130px] justify-center border
              ${isLoading 
                ? 'bg-white/10 text-gray-400 border-transparent cursor-not-allowed' 
                : 'bg-white text-black border-white hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]'}
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-12 left-0 right-0 text-center"
            >
              <span className="inline-block px-4 py-1.5 bg-red-500/10 text-red-200 text-xs font-medium rounded-full border border-red-500/20 backdrop-blur-sm">
                {error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
};

export default UrlInput;
