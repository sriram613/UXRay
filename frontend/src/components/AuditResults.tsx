import React from 'react';
import IssueCard from './IssueCard';
import { AlertCircle, Sparkles } from 'lucide-react';
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

interface AuditResultsProps {
  report: AuditReport;
}

const AuditResults: React.FC<AuditResultsProps> = ({ report }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Audit Summary
          </h2>
        </div>
        <div className="p-8">
          <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap font-light">
            {report.audit_summary}
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white flex items-center gap-3 px-2"
        >
          <div className="p-2 bg-white/10 rounded-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          Identified Issues 
          <span className="px-3 py-1 bg-white/10 text-gray-300 text-sm rounded-full font-medium border border-white/5">
            {report.issues.length}
          </span>
        </motion.h2>
        
        <div className="grid gap-6">
          {report.issues.map((issue, index) => (
            <IssueCard
              key={index}
              index={index}
              title={issue.title}
              description={issue.description}
              suggested_fix={issue.suggested_fix}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditResults;
