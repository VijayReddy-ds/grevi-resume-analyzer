import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import UploadPanel from './components/UploadPanel';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';

function App() {
  const [appState, setAppState] = useState('upload'); // 'upload', 'loading', 'results'
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalyze = async (formData) => {
    setAppState('loading');
    
    try {
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAnalysisData(response.data);
      // Note: We don't change state to 'results' here immediately.
      // We wait for the 5-second LoadingScreen to call handleLoadingComplete.
    } catch (error) {
      console.error("Error analyzing:", error);
      alert("An error occurred during analysis. Make sure the backend is running on port 8000.");
      setAppState('upload');
    }
  };

  const handleLoadingComplete = () => {
    if (analysisData) {
      setAppState('results');
    } else {
      // If backend failed, this handles edge case
      setAppState('upload');
    }
  };

  const resetState = () => {
    setAppState('upload');
    setAnalysisData(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 overflow-x-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="pt-12 pb-6 px-6 text-center z-10 relative">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 gradient-text drop-shadow-sm inline-block">
            Grevi Resume Analyzer
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Smart AI-powered Resume & Job Match Analyzer. Get actionable insights to land your dream job.
          </p>
        </motion.div>
      </header>

      {/* Main Content Area */}
      <main className="px-6 relative z-10">
        <AnimatePresence mode="wait">
          {appState === 'upload' && (
            <motion.div key="upload" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
              <UploadPanel onAnalyze={handleAnalyze} />
            </motion.div>
          )}

          {appState === 'loading' && (
            <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
          )}

          {appState === 'results' && analysisData && (
            <motion.div key="results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Dashboard data={analysisData} onReset={resetState} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
