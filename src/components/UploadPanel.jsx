import React, { useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadPanel({ onAnalyze }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [jdMode, setJdMode] = useState("text"); // text or file

  const handleAnalyze = () => {
    if (!resumeFile) {
      alert("Please upload a resume.");
      return;
    }
    if (jdMode === "text" && !jdText) {
      alert("Please enter a job description.");
      return;
    }
    if (jdMode === "file" && !jdFile) {
      alert("Please upload a job description file.");
      return;
    }
    
    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    formData.append("jd_type", jdMode);
    if (jdMode === "text") {
      formData.append("jd_text", jdText);
    } else {
      formData.append("jd_file", jdFile);
    }
    
    onAnalyze(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
    >
      {/* Resume Upload */}
      <div className="glass-panel p-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="text-blue-400" />
          Upload Resume
        </h3>
        
        <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:bg-slate-800/50 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            accept=".pdf,.docx"
            onChange={(e) => setResumeFile(e.target.files[0])}
          />
          <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300 font-medium">Drag & drop or click to browse</p>
          <p className="text-slate-500 text-sm mt-2">Supports PDF and DOCX</p>
          {resumeFile && (
            <div className="mt-4 p-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm truncate">
              {resumeFile.name}
            </div>
          )}
        </div>
      </div>

      {/* JD Upload */}
      <div className="glass-panel p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <UploadCloud className="text-indigo-400" />
            Job Description
          </h3>
          <div className="flex gap-2 bg-slate-900 rounded-lg p-1">
            <button 
              className={`px-3 py-1 rounded-md text-sm transition-colors ${jdMode === 'text' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setJdMode('text')}
            >Text</button>
            <button 
              className={`px-3 py-1 rounded-md text-sm transition-colors ${jdMode === 'file' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setJdMode('file')}
            >File</button>
          </div>
        </div>

        {jdMode === 'text' ? (
          <textarea 
            className="w-full h-40 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Paste the job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          ></textarea>
        ) : (
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:bg-slate-800/50 transition-colors cursor-pointer relative h-40 flex flex-col justify-center">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              accept=".pdf,.docx,.txt"
              onChange={(e) => setJdFile(e.target.files[0])}
            />
            <p className="text-slate-300 font-medium">Upload Job Description File</p>
            {jdFile && (
              <div className="mt-4 p-2 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm truncate">
                {jdFile.name}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 px-12 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] text-lg"
          onClick={handleAnalyze}
        >
          🚀 Analyze Resume
        </motion.button>
      </div>
    </motion.div>
  );
}
