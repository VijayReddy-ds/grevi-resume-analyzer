import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Target, Briefcase, Lightbulb, ChevronRight } from 'lucide-react';

export default function Dashboard({ data, onReset }) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to final
    const target = data.match_score;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setScore(current);
      if (current >= target) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [data.match_score]);

  return (
    <div className="max-w-6xl mx-auto w-full pb-20">
      <div className="flex justify-between items-center mb-8 mt-4">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold gradient-text"
        >
          Analysis Results
        </motion.h2>
        <button onClick={onReset} className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" /> Start Over
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* SCORE CARD */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium text-slate-300 mb-6">Resume Match Score</h3>
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="transparent" />
              <circle
                cx="80" cy="80" r="72" stroke="url(#scoreGrad)" strokeWidth="12" fill="transparent"
                strokeLinecap="round" strokeDasharray="452" strokeDashoffset={452 - (452 * score) / 100}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={score > 70 ? "#34D399" : score > 40 ? "#FBBF24" : "#F87171"} />
                  <stop offset="100%" stopColor={score > 70 ? "#059669" : score > 40 ? "#D97706" : "#DC2626"} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">{score}</span>
              <span className="text-xs text-slate-500 mt-1">out of 100</span>
            </div>
          </div>
        </motion.div>

        {/* ROLE COMPARISON */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-8 md:col-span-2 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="text-blue-400"/> Role Alignment</h3>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 bg-slate-900/50 rounded-xl p-4 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Detected Profile</p>
              <p className="text-lg font-medium text-blue-200">{data.role_detected}</p>
            </div>
            <div className="flex-1 bg-slate-900/50 rounded-xl p-4 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Target Job Role</p>
              <p className="text-lg font-medium text-indigo-200">{data.job_role}</p>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg flex items-start gap-3 ${data.match_summary.includes("aligns more with") ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-200'}`}>
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{data.match_summary}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* TOP MISSING SKILLS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-8 border-t-4 border-t-red-500">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><XCircle className="text-red-400"/> Critical Missing Skills</h3>
          {data.top_missing_skills && data.top_missing_skills.length > 0 ? (
            <div className="space-y-3">
              {data.top_missing_skills.map((skill, i) => (
                <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center justify-between">
                  <span className="font-semibold text-red-200 uppercase tracking-wide">{skill}</span>
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">High Priority</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">No critical skills missing!</p>
          )}
        </motion.div>

        {/* PROJECT RECOMMENDATIONS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-8 border-t-4 border-t-indigo-500">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Briefcase className="text-indigo-400"/> Recommended Projects</h3>
          {data.top_project_recommendations && data.top_project_recommendations.length > 0 ? (
            <div className="space-y-3">
              {data.top_project_recommendations.map((proj, i) => (
                <div key={i} className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-300 font-bold">{i+1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-100">{proj}</h4>
                    <p className="text-xs text-indigo-300/70 mt-1">Build this to prove missing skills</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">Your project portfolio looks solid.</p>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SKILLS TAGS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-8">
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="text-emerald-400"/> All Analyzed Skills</h3>
           <div className="flex flex-wrap gap-2">
             {data.analysis.matched_skills.map(s => (
               <span key={s} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full text-sm">{s}</span>
             ))}
             {data.analysis.missing_skills.map(s => (
               <span key={s} className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-300 rounded-full text-sm">{s}</span>
             ))}
             {data.analysis.irrelevant_skills.slice(0, 8).map(s => (
               <span key={s} className="px-3 py-1 bg-slate-500/10 border border-slate-500/30 text-slate-400 rounded-full text-sm">{s}</span>
             ))}
           </div>
        </motion.div>

        {/* RESUME IMPROVEMENTS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel p-8">
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Lightbulb className="text-yellow-400"/> Actionable Improvements</h3>
           <div className="space-y-4 mt-2">
              {data.suggestions.resume_improvements.map((imp, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                  <p className="text-slate-300 text-sm leading-relaxed">{imp}</p>
                </div>
              ))}
           </div>
        </motion.div>
      </div>

    </div>
  );
}
