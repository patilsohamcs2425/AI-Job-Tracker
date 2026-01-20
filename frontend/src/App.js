import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, MapPin, Star, ExternalLink, Zap, Layout, Settings, User, MessageSquare, CheckCircle, X, Send } from 'lucide-react';

function App() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(() => JSON.parse(localStorage.getItem('applied')) || []);
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastJob, setLastJob] = useState(null);
  const [view, setView] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // URL of your deployed backend on Render
  const BACKEND_URL = 'https://ai-job-tracker-rvv0.onrender.com';

  // Save applications to LocalStorage
  useEffect(() => {
    localStorage.setItem('applied', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  // Critical Thinking: Tracking Logic
  useEffect(() => {
    const handleReturn = () => {
      if (lastJob) {
        if (window.confirm(`Did you finish your application for ${lastJob.title}?`)) {
          setAppliedJobs(prev => [...prev, { ...lastJob, date: new Date().toLocaleDateString() }]);
          alert("Job successfully added to your Applied list!");
        }
        setLastJob(null);
      }
    };
    window.addEventListener('focus', handleReturn);
    return () => window.removeEventListener('focus', handleReturn);
  }, [lastJob]);

  const fetchJobs = async () => {
    if (!resume.trim()) return alert("Enter skills first!");
    setLoading(true);
    try {
      // Updated to use Live Render URL
      const res = await axios.post(`${BACKEND_URL}/jobs`, { resumeText: resume });
      setJobs(res.data);
      setView('home');
    } catch (err) { 
      alert("Backend is waking up or offline. Please wait 30-60 seconds and try again."); 
    }
    setLoading(false);
  };

  const sendChat = async () => {
    const msg = chatMsg;
    setChatMsg("");
    setChatHistory([...chatHistory, { role: 'user', text: msg }]);
    try {
      // Updated to use Live Render URL
      const res = await axios.post(`${BACKEND_URL}/chat`, { message: msg });
      setChatHistory(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (err) { alert("AI Coach is temporarily unavailable."); }
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar Navigation */}
      <nav style={{ width: '85px', background: '#1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0', gap: '40px', position: 'fixed', height: '100vh', zIndex: 1000 }}>
        <div style={{ color: '#38bdf8' }}><Zap size={35} /></div>
        <Layout color={view === 'home' ? '#38bdf8' : '#94a3b8'} onClick={() => {setView('home'); setShowChat(false);}} style={{ cursor: 'pointer' }} />
        <CheckCircle color={view === 'applied' ? '#38bdf8' : '#94a3b8'} onClick={() => {setView('applied'); setShowChat(false);}} style={{ cursor: 'pointer' }} />
        <MessageSquare color={showChat ? '#38bdf8' : '#94a3b8'} onClick={() => setShowChat(!showChat)} style={{ cursor: 'pointer' }} />
        <User color="#94a3b8" style={{ marginTop: 'auto' }} />
      </nav>

      <main style={{ flex: 1, padding: '50px', marginLeft: '85px', marginRight: showChat ? '350px' : 0, transition: '0.3s' }}>
        <div style={{ maxWidth: '1200px', margin: 'auto' }}>
          
          {view === 'home' ? (
            <>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a' }}>Job Match Dashboard</h1>
              <section style={{ background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', margin: '30px 0' }}>
                <textarea 
                  placeholder="Paste professional skills (React, Node, etc.)..."
                  style={{ width: '100%', height: '100px', borderRadius: '16px', padding: '15px', border: '1px solid #e2e8f0' }}
                  onChange={(e) => setResume(e.target.value)}
                />
                <button onClick={fetchJobs} style={{ width: '100%', marginTop: '20px', background: '#0284c7', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {loading ? "AI Analyzing..." : "Find Best Matches"}
                </button>
              </section>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {jobs.map((job) => (
                  <div key={job.id} style={{ background: '#fff', padding: '25px', borderRadius: '24px', border: '1px solid #f1f5f9', position: 'relative' }}>
                    <div style={{ background: '#dcfce7', color: '#166534', display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800' }}>{job.matchScore}% Match</div>
                    <h3 style={{ margin: '15px 0 5px 0' }}>{job.title}</h3>
                    <p style={{ fontSize: '14px', color: '#64748b' }}><Briefcase size={14}/> {job.company}</p>
                    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', fontSize: '13px', margin: '15px 0' }}>{job.reason}</div>
                    <a href={job.link} target="_blank" rel="noreferrer" onClick={() => setLastJob(job)} style={{ display: 'block', textAlign: 'center', background: '#0f172a', color: '#fff', padding: '12px', borderRadius: '10px', textDecoration: 'none' }}>Apply Now</a>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>My Applications</h2>
              <div style={{ marginTop: '30px', display: 'grid', gap: '15px' }}>
                {appliedJobs.length === 0 ? <p>No applications tracked yet.</p> : appliedJobs.map((job, i) => (
                  <div key={i} style={{ background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: 0 }}>{job.title}</h4>
                    <p style={{ margin: 0, color: '#64748b' }}>{job.company} — Applied on {job.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI SIDEBAR */}
      {showChat && (
        <aside style={{ width: '350px', background: '#fff', position: 'fixed', right: 0, height: '100vh', boxShadow: '-5px 0 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', zIndex: 1100 }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            <strong>AI Career Coach</strong>
            <X cursor="pointer" onClick={() => setShowChat(false)} />
          </div>
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chatHistory.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#0284c7' : '#f1f5f9', color: m.role === 'user' ? '#fff' : '#000', padding: '10px', borderRadius: '10px', fontSize: '14px' }}>{m.text}</div>
            ))}
          </div>
          <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
            <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="Ask for career tips..." />
            <button onClick={sendChat} style={{ background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px' }}><Send size={18} /></button>
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;
