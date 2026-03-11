import { useState, useEffect } from "react";
import ScriptGenerator from "./ScriptGenerator";
import VoiceCallTrainer from "./VoiceCallTrainer";
import PhobiaTest from "./PhobiaTest";

export default function App() {
  const [mode, setMode] = useState(null);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const iconLink = document.createElement("link");
    iconLink.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
    iconLink.rel = "stylesheet";
    document.head.appendChild(iconLink);
  }, []);

  if (mode === "script") return <ScriptGenerator onBack={() => setMode(null)} />;
  if (mode === "voice") return <VoiceCallTrainer onBack={() => setMode(null)} />;
  if (mode === "test") return <PhobiaTest onBack={() => setMode(null)} />;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif", minHeight: "100vh", background: "#f7f8f5", color: "#0f172a", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        .msicon { font-family:'Material Symbols Outlined'; font-style:normal; font-weight:normal; display:inline-block; line-height:1; text-transform:none; letter-spacing:normal; white-space:nowrap; direction:ltr; -webkit-font-smoothing:antialiased; font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
        .msicon-fill { font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24; }
        .card-btn:active { transform:translateY(1px); box-shadow:0 2px 0 #469e02 !important; }
      `}</style>

      {/* ── 상단 네비게이션 ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(247,248,245,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(89,202,2,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", maxWidth: "480px", margin: "0 auto" }}>
          <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span className="msicon" style={{ fontSize: "26px", color: "#59ca02" }}>menu</span>
          </div>
          <h1 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: 0, letterSpacing: "-0.2px" }}>콜포비아 트레이너</h1>
          <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span className="msicon" style={{ fontSize: "26px", color: "#59ca02" }}>notifications</span>
          </div>
        </div>
      </header>

      {/* ── 메인 콘텐츠 ── */}
      <main style={{ flex: 1, maxWidth: "480px", margin: "0 auto", width: "100%", padding: "32px 16px 100px" }}>

        {/* Hero */}
        <section style={{ textAlign: "center", marginBottom: "32px", animation: "fadeUp .5s ease" }}>
          <div style={{ display: "inline-flex", padding: "18px", borderRadius: "50%", background: "rgba(89,202,2,0.1)", marginBottom: "16px", animation: "float 3s ease-in-out infinite" }}>
            <span className="msicon" style={{ fontSize: "48px", color: "#59ca02" }}>phone_forwarded</span>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.5px", lineHeight: "1.2" }}>콜포비아 극복 센터</h2>
          <p style={{ fontSize: "15px", color: "#64748b", margin: 0, fontWeight: "500" }}>전화 공포증을 단계별로 극복해보세요.</p>
        </section>

        {/* Feature Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Card 1 — 자가진단 */}
          <div
            style={{ position: "relative", display: "flex", flexDirection: "column", gap: "16px", borderRadius: "16px", background: "white", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden", animation: "fadeUp .5s ease .05s both", cursor: "pointer" }}
            onClick={() => setMode("test")}
          >
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                <span className="msicon" style={{ fontSize: "28px", color: "#9333ea" }}>psychology</span>
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>콜포비아 자가진단</h3>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>나의 증상을 확인해보세요</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setMode("test"); }}
              className="card-btn"
              style={{ alignSelf: "flex-start", padding: "10px 20px", borderRadius: "9999px", border: "none", background: "#59ca02", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 0 #469e02", transition: "all .15s" }}
            >시작하기</button>
            {/* 배경 아이콘 */}
            <span className="msicon" style={{ position: "absolute", right: "-12px", bottom: "-12px", fontSize: "96px", color: "#9333ea", opacity: 0.07, zIndex: 0 }}>psychology</span>
          </div>

          {/* Card 2 — 대본 생성기 */}
          <div
            style={{ position: "relative", display: "flex", flexDirection: "column", gap: "16px", borderRadius: "16px", background: "white", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden", animation: "fadeUp .5s ease .12s both", cursor: "pointer" }}
            onClick={() => setMode("script")}
          >
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                <span className="msicon" style={{ fontSize: "28px", color: "#2563eb" }}>edit_note</span>
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>대본 생성기</h3>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>상황별 완벽한 대본을 준비하세요</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setMode("script"); }}
              className="card-btn"
              style={{ alignSelf: "flex-start", padding: "10px 20px", borderRadius: "9999px", border: "none", background: "#59ca02", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 0 #469e02", transition: "all .15s" }}
            >대본 만들기</button>
            <span className="msicon" style={{ position: "absolute", right: "-12px", bottom: "-12px", fontSize: "96px", color: "#2563eb", opacity: 0.07, zIndex: 0 }}>edit_note</span>
          </div>

          {/* Card 3 — 음성 트레이너 */}
          <div
            style={{ position: "relative", display: "flex", flexDirection: "column", gap: "16px", borderRadius: "16px", background: "white", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", overflow: "hidden", animation: "fadeUp .5s ease .19s both", cursor: "pointer" }}
            onClick={() => setMode("voice")}
          >
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                <span className="msicon" style={{ fontSize: "28px", color: "#16a34a" }}>mic</span>
              </div>
              <h3 style={{ fontSize: "19px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>음성 통화 트레이너</h3>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>AI와 함께 실전처럼 연습하세요</p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setMode("voice"); }}
              className="card-btn"
              style={{ alignSelf: "flex-start", padding: "10px 20px", borderRadius: "9999px", border: "none", background: "#59ca02", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 0 #469e02", transition: "all .15s" }}
            >훈련 시작</button>
            <span className="msicon" style={{ position: "absolute", right: "-12px", bottom: "-12px", fontSize: "96px", color: "#16a34a", opacity: 0.07, zIndex: 0 }}>mic</span>
          </div>

        </div>

        <footer style={{ marginTop: "40px", textAlign: "center", fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>
          Powered by AI
        </footer>
      </main>

      {/* ── 하단 네비게이션 ── */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #e2e8f0", padding: "8px 0 max(20px, env(safe-area-inset-bottom))", zIndex: 50 }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex" }}>
          {[
            { key: "home", icon: "home", label: "홈" },
            { key: "voice", icon: "exercise", label: "훈련" },
            { key: "script", icon: "description", label: "대본" },
            { key: "my", icon: "person", label: "마이" },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => {
                setActiveNav(item.key);
                if (item.key === "voice") setMode("voice");
                else if (item.key === "script") setMode("script");
                else if (item.key === "home") setMode(null);
              }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "inherit" }}
            >
              <span
                className={`msicon${activeNav === item.key ? " msicon-fill" : ""}`}
                style={{ fontSize: "24px", color: activeNav === item.key ? "#59ca02" : "#94a3b8" }}
              >{item.icon}</span>
              <span style={{ fontSize: "11px", fontWeight: activeNav === item.key ? "700" : "500", color: activeNav === item.key ? "#59ca02" : "#94a3b8" }}>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
