import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface IssueCardProps {
  title: string;
  description: string;
  suggested_fix: string;
  index: number;
}

const IssueCard: React.FC<IssueCardProps> = ({ title, description, suggested_fix, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:bg-white/10"
    >
      <div className="flex items-start gap-5">
        <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-white/5">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-gray-200 transition-colors">
              {title}
            </h3>
            <p className="text-gray-400 leading-relaxed text-sm font-light">
              {description}
            </p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 border-l-2 border-white/20">
            <h4 className="text-sm font-medium text-gray-200 mb-1 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              Suggested Fix
            </h4>
            <p className="text-sm text-gray-400 font-light">
              {suggested_fix}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IssueCard;
