import { useState } from "react";
import ScriptGenerator from "./ScriptGenerator";
import VoiceCallTrainer from "./VoiceCallTrainer";
import PhobiaTest from "./PhobiaTest";

export default function App() {
  const [mode, setMode] = useState(null);

  if (mode === "script") return <ScriptGenerator onBack={() => setMode(null)} />;
  if (mode === "voice") return <VoiceCallTrainer onBack={() => setMode(null)} />;
  if (mode === "test") return <PhobiaTest onBack={() => setMode(null)} />;

  return (
    <div style={{
      fontFamily: "'Noto Sans KR', -apple-system, sans-serif",
      minHeight: "100dvh",
      background: "linear-gradient(145deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px 16px max(24px, env(safe-area-inset-bottom)) 16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: "48px", animation: "fadeUp .5s ease" }}>
        <div style={{ fontSize: "56px", marginBottom: "16px", animation: "float 3s ease infinite" }}>📞</div>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "white", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
          콜포비아 극복 센터
        </h1>
        <p style={{ fontSize: "14px", color: "#94A3B8", margin: 0, lineHeight: "1.7" }}>
          전화 공포증을 단계별로 극복해보세요
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "400px" }}>
        {/* 자가진단 테스트 */}
        <button
          onClick={() => setMode("test")}
          style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "22px", padding: "24px", cursor: "pointer", textAlign: "left",
            color: "white", transition: "all .2s ease", animation: "fadeUp .5s ease .05s both"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "18px", flexShrink: 0,
              background: "linear-gradient(135deg, #6366F1, #A78BFA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "26px", boxShadow: "0 4px 20px rgba(99,102,241,0.3)"
            }}>🧠</div>
            <div>
              <div style={{ fontWeight: "800", fontSize: "17px", marginBottom: "4px" }}>콜포비아 자가진단</div>
              <div style={{ fontSize: "13px", color: "#94A3B8", lineHeight: "1.5" }}>
                10문항으로 내 전화 공포증 수준 측정
              </div>
              <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["2분 소요", "4단계 결과", "1달 후 비교"].map(tag => (
                  <span key={tag} style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(99,102,241,0.15)", color: "#A78BFA", borderRadius: "6px", fontWeight: "600" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </button>

        {/* 대본 생성기 */}
        <button
          onClick={() => setMode("script")}
          style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "22px", padding: "24px", cursor: "pointer", textAlign: "left",
            color: "white", transition: "all .2s ease", animation: "fadeUp .5s ease .15s both"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(78,205,196,0.12)"; e.currentTarget.style.borderColor = "rgba(78,205,196,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "18px", flexShrink: 0,
              background: "linear-gradient(135deg, #4ECDC4, #A78BFA)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "26px", boxShadow: "0 4px 20px rgba(78,205,196,0.3)"
            }}>📝</div>
            <div>
              <div style={{ fontWeight: "800", fontSize: "17px", marginBottom: "4px" }}>대본 생성기</div>
              <div style={{ fontSize: "13px", color: "#94A3B8", lineHeight: "1.5" }}>
                상황별 통화 대본을 AI가 만들어줘요
              </div>
              <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["병원 예약", "환불 요청", "업무 전화"].map(tag => (
                  <span key={tag} style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(78,205,196,0.15)", color: "#4ECDC4", borderRadius: "6px", fontWeight: "600" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </button>

        {/* 음성 트레이너 */}
        <button
          onClick={() => setMode("voice")}
          style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "22px", padding: "24px", cursor: "pointer", textAlign: "left",
            color: "white", transition: "all .2s ease", animation: "fadeUp .5s ease .25s both"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.12)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "18px", flexShrink: 0,
              background: "linear-gradient(135deg, #34D399, #3B82F6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "26px", boxShadow: "0 4px 20px rgba(52,211,153,0.3)"
            }}>🎙️</div>
            <div>
              <div style={{ fontWeight: "800", fontSize: "17px", marginBottom: "4px" }}>음성 통화 트레이너</div>
              <div style={{ fontSize: "13px", color: "#94A3B8", lineHeight: "1.5" }}>
                AI와 실제 목소리로 통화 연습 후 피드백
              </div>
              <div style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {["Lv.1 배달 주문", "Lv.2 병원 예약", "Lv.4 환불 요청"].map(tag => (
                  <span key={tag} style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(52,211,153,0.15)", color: "#34D399", borderRadius: "6px", fontWeight: "600" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </button>
      </div>

      <div style={{ marginTop: "32px", fontSize: "12px", color: "#334155", animation: "fadeUp .5s ease .35s both" }}>
        Powered by Claude AI
      </div>
    </div>
  );
}
