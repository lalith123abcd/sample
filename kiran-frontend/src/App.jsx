import { useState } from 'react'
import KiranAI from './KiranAI'
import ChatWithPandu from './ChatWithPandu'

function App() {
  const [screen, setScreen] = useState('home')

  if (screen === 'kiran') return <KiranAI onBack={() => setScreen('home')} />
  if (screen === 'chat') return <ChatWithPandu onBack={() => setScreen('home')} />

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2d 50%, #0a0a1a 100%)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      fontFamily: "'Segoe UI', Arial, sans-serif", color: 'white', padding: '20px',
    }}>
      <div style={{
        width: '100%', maxWidth: '680px',
        background: 'linear-gradient(160deg, #0b0b1f 0%, #10102a 100%)',
        border: '1px solid #7c3aed44', borderRadius: '20px', padding: '35px 30px',
        textAlign: 'center', boxShadow: '0 0 60px #7c3aed33, 0 0 120px #7c3aed11',
      }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '6px' }}>👑</span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#a78bfa', margin: '0 0 4px 0', textShadow: '0 0 20px #a78bfaaa', letterSpacing: '1px' }}>
          KiranAI
        </h1>
        <p style={{ color: '#c4b5fd', fontSize: '0.9rem', marginBottom: '28px', opacity: 0.8 }}>
          Choose your experience
        </p>
        <button
          style={{ padding: '18px', border: '1px solid #7c3aed55', borderRadius: '14px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, background: '#0f0f25', color: 'white', width: '100%', marginBottom: '12px', textAlign: 'left' }}
          onClick={() => setScreen('kiran')}
        >
          <div style={{ fontSize: '1.5rem' }}>👑</div>
          <div style={{ fontWeight: 800, marginTop: '4px', color: '#a78bfa' }}>KiranAI Full App</div>
          <div style={{ fontSize: '0.8rem', color: '#c4b5fd', marginTop: '2px' }}>Kiran mode + Lalith mode + Chat with Pandu (needs backend)</div>
        </button>
        <button
          style={{ padding: '18px', border: '1px solid #7c3aed55', borderRadius: '14px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, background: '#0f0f25', color: 'white', width: '100%', textAlign: 'left' }}
          onClick={() => setScreen('chat')}
        >
          <div style={{ fontSize: '1.5rem' }}>💬</div>
          <div style={{ fontWeight: 800, marginTop: '4px', color: '#a78bfa' }}>Chat with Pandu (Free)</div>
          <div style={{ fontSize: '0.8rem', color: '#c4b5fd', marginTop: '2px' }}>No backend needed · Works offline ✨</div>
        </button>
      </div>
    </div>
  )
}

export default App
