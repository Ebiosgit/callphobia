import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 모바일 에러 진단: 흰 화면 시 에러 메시지를 화면에 표시
window.addEventListener('error', (e) => {
  document.body.style.background = '#fff';
  document.body.innerHTML =
    `<pre style="color:red;padding:20px;font-size:13px;white-space:pre-wrap">
ERROR: ${e.message}
FILE: ${e.filename}
LINE: ${e.lineno}
    </pre>`;
});

window.addEventListener('unhandledrejection', (e) => {
  document.body.style.background = '#fff';
  document.body.innerHTML =
    `<pre style="color:red;padding:20px;font-size:13px;white-space:pre-wrap">
PROMISE ERROR: ${e.reason}
    </pre>`;
});

class ErrorBoundary extends React.Component {
  state = { error: null };
  componentDidCatch(error, info) {
    console.error(error, info);
    this.setState({ error: error.message });
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: 'red', background: '#fff', fontFamily: 'monospace', fontSize: 14, whiteSpace: 'pre-wrap' }}>
          <h2>앱 오류 발생</h2>
          <pre>{this.state.error}</pre>
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

// PWA 서비스 워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
