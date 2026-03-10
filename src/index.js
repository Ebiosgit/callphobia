import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error: error.message };
  }
  componentDidCatch(error, info) {
    console.error('App Error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: 32, textAlign: 'center', fontFamily: "'Noto Sans KR', sans-serif",
          minHeight: '100vh', background: '#0F172A', color: 'white',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😵</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>앱 오류 발생</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, margin: '0 0 20px' }}>{this.state.error}</p>
          <button
            onClick={() => { window.location.reload(); }}
            style={{
              padding: '12px 24px', borderRadius: 12, border: 'none',
              background: '#6366F1', color: 'white', fontSize: 15,
              fontWeight: 700, cursor: 'pointer'
            }}
          >새로고침</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();

// 기존 서비스워커 해제 — 캐시 문제 방지
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(r => r.unregister());
  });
  caches.keys().then(keys => {
    keys.forEach(k => caches.delete(k));
  });
}
