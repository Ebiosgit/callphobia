import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


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
