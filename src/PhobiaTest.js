import { useState, useEffect } from "react";

const QUESTIONS = [
  { id: 1,  text: "전화를 걸기 전 너무 걱정돼서 오랫동안 망설인다" },
  { id: 2,  text: "모르는 번호로 전화가 오면 받기가 두렵다" },
  { id: 3,  text: "전화 통화 대신 문자나 카카오톡을 선택한다" },
  { id: 4,  text: "통화 중 할 말이 떠오르지 않아 얼어붙은 적이 있다" },
  { id: 5,  text: "전화 통화 생각만 해도 심장이 빨리 뛰거나 손에 땀이 난다" },
  { id: 6,  text: "업무·예약 등 꼭 필요한 전화를 며칠 동안 미룬 적이 있다" },
  { id: 7,  text: "전화를 걸기 전 할 말을 글로 써두거나 혼자 연습한다" },
  { id: 8,  text: "통화가 끝난 후 내가 한 말이 이상했을까 봐 걱정된다" },
  { id: 9,  text: "전화 때문에 중요한 일(병원 예약, 민원 등)을 못 처리한 적이 있다" },
  { id: 10, text: "전화보다 직접 찾아가는 게 훨씬 편하다고 느낀다" },
];

const OPTIONS = [
  { value: 1, label: "전혀 아니다" },
  { value: 2, label: "가끔 그렇다" },
  { value: 3, label: "종종 그렇다" },
  { value: 4, label: "자주 그렇다" },
  { value: 5, label: "항상 그렇다" },
];

function getResult(score) {
  if (score <= 15) return {
    level: "정상 범위", grade: "A", emoji: "😊",
    color: "#34D399", darkColor: "#059669",
    description: "전화 통화에 큰 어려움이 없어요. 가끔 긴장하는 건 누구나 마찬가지예요.",
    detail: "전화에 대한 불안이 일상에 영향을 주지 않는 수준입니다. 자신감 있게 전화하고 계세요!",
    recommendation: "현재 수준을 유지하며 더 어려운 상황도 도전해보세요.",
    recommendedLevels: ["Lv.3 중급", "Lv.4 고급"],
    tips: ["어려운 상황(환불, 민원)도 직접 도전해보세요", "연습을 통해 비즈니스 전화 실력을 키워보세요"],
  };
  if (score <= 22) return {
    level: "경미한 콜포비아", grade: "B", emoji: "😟",
    color: "#60A5FA", darkColor: "#2563EB",
    description: "전화가 가끔 부담스럽지만 생활에 큰 지장은 없어요.",
    detail: "의식적으로 전화를 피하거나 불안을 느끼는 경향이 있습니다. 조금만 연습하면 금세 나아질 거예요.",
    recommendation: "쉬운 상황부터 연습하며 성공 경험을 쌓아보세요.",
    recommendedLevels: ["Lv.1 입문", "Lv.2 초급", "Lv.3 중급"],
    tips: ["친절한 상대(배달, 미용실)부터 시작하세요", "통화 전 키워드 2~3개만 적어두면 훨씬 편해요"],
  };
  if (score <= 32) return {
    level: "중등도 콜포비아", grade: "C", emoji: "😰",
    color: "#FBBF24", darkColor: "#D97706",
    description: "전화 때문에 중요한 일을 미루거나 스트레스를 많이 받고 있어요.",
    detail: "전화 회피가 일상에 영향을 주는 수준입니다. 체계적인 연습이 효과적입니다.",
    recommendation: "Lv.1부터 차근차근 반복하며 자신감을 쌓아보세요.",
    recommendedLevels: ["Lv.1 입문", "Lv.2 초급"],
    tips: ["매일 1개 연습을 목표로 해보세요", "통화 전 호흡을 3번 깊게 하면 심박수가 낮아져요", "대본 생성기로 스크립트를 미리 준비하세요"],
  };
  return {
    level: "심한 콜포비아", grade: "D", emoji: "😱",
    color: "#F87171", darkColor: "#DC2626",
    description: "전화에 대한 두려움이 일상생활에 상당한 영향을 주고 있어요.",
    detail: "전화 공포가 심한 수준입니다. 하지만 걱정 마세요 — 점진적 노출 연습으로 반드시 나아질 수 있어요.",
    recommendation: "Lv.1 입문부터 천천히, 매일 한 번씩 연습해보세요.",
    recommendedLevels: ["Lv.1 입문"],
    tips: ["지금 당장 잘 못해도 괜찮아요, 연습이 목적이에요", "Lv.1 배달 주문처럼 친절한 상황부터 시작하세요", "대본 생성기로 할 말을 미리 준비하면 훨씬 편해요", "통화 전 4-7-8 호흡법: 4초 들이쉬고, 7초 참고, 8초 내쉬기"],
  };
}

function daysBetween(dateStr) {
  return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
}
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

const BASE = {
  fontFamily: "'Plus Jakarta Sans','Noto Sans KR',sans-serif",
  minHeight: "100dvh",
  background: "#f7f8f5",
  color: "#0f172a",
};

export default function PhobiaTest({ onBack }) {
  const [phase, setPhase] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [prevData, setPrevData] = useState(null);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("phobiaTestHistory");
    if (saved) {
      const history = JSON.parse(saved);
      if (history.length > 0) setPrevData(history[history.length - 1]);
    }
  }, []);

  function handleContinue() {
    if (selected === null) return;
    const newAnswers = { ...answers, [QUESTIONS[current].id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      const total = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      setFinalScore(total);
      const entry = { score: total, date: new Date().toISOString() };
      const saved = localStorage.getItem("phobiaTestHistory");
      const history = saved ? JSON.parse(saved) : [];
      history.push(entry);
      if (history.length > 10) history.shift();
      localStorage.setItem("phobiaTestHistory", JSON.stringify(history));
      setPhase("result");
    }
  }

  function handlePrev() {
    if (current === 0) { setPhase("intro"); return; }
    const prev = current - 1;
    setCurrent(prev);
    setSelected(answers[QUESTIONS[prev].id] ?? null);
  }

  function restart() {
    setPhase("intro");
    setCurrent(0);
    setAnswers({});
    setSelected(null);
    setFinalScore(0);
  }

  const result = finalScore > 0 ? getResult(finalScore) : null;
  const prevResult = prevData ? getResult(prevData.score) : null;
  const scoreDiff = prevData ? finalScore - prevData.score : null;

  // ── INTRO ──────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={{ ...BASE, display: "flex", flexDirection: "column" }}>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
          .msicon { font-family:'Material Symbols Outlined'; font-style:normal; font-weight:normal; display:inline-block; line-height:1; text-transform:none; letter-spacing:normal; white-space:nowrap; direction:ltr; -webkit-font-smoothing:antialiased; font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
          .msicon-fill { font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24; }
        `}</style>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 8px", gap: "16px", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", padding: 0 }}>
            <span className="msicon" style={{ fontSize: "26px" }}>close</span>
          </button>
          <div style={{ flex: 1, height: "16px", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#59ca02", borderRadius: "9999px", width: "0%", transition: "width .3s ease" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#59ca02" }}>
            <span className="msicon msicon-fill" style={{ fontSize: "22px" }}>psychology</span>
            <span style={{ fontWeight: "800", fontSize: "18px" }}>10</span>
          </div>
        </div>

        {/* Scroll content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          {/* Mascot */}
          <div style={{ position: "relative", width: "200px", height: "200px", marginBottom: "32px", marginTop: "16px" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(89,202,2,0.1)", borderRadius: "50%", transform: "scale(1.1)" }} />
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "rgba(89,202,2,0.08)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", animation: "float 3s ease-in-out infinite" }}>
              <span className="msicon" style={{ fontSize: "88px", color: "#59ca02" }}>psychology</span>
            </div>
          </div>

          {/* Intro bubble */}
          <div style={{ position: "relative", width: "100%", background: "white", border: "2px solid #e2e8f0", borderRadius: "16px", padding: "20px", marginBottom: "32px" }}>
            <div style={{ position: "absolute", bottom: "-12px", left: "40px", width: "24px", height: "24px", background: "white", border: "0 solid #e2e8f0", borderBottom: "2px solid #e2e8f0", borderRight: "2px solid #e2e8f0", transform: "rotate(45deg)" }} />
            <h2 style={{ fontSize: "20px", fontWeight: "800", textAlign: "center", margin: 0, lineHeight: "1.4", color: "#0f172a" }}>
              콜포비아 자가진단
            </h2>
            <p style={{ textAlign: "center", color: "#64748b", fontSize: "14px", margin: "10px 0 0", lineHeight: "1.6" }}>
              10문항으로 내 전화 공포증 수준을 확인해보세요
            </p>
          </div>

          {/* Info items */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
            {[
              { icon: "edit_note", text: "총 10문항, 약 2분 소요" },
              { icon: "lock", text: "결과는 내 기기에만 저장돼요" },
              { icon: "calendar_month", text: "1달 후 재검사로 변화를 확인하세요" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", background: "white", borderRadius: "14px", border: "2px solid #f1f5f9", padding: "14px 16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(89,202,2,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="msicon" style={{ fontSize: "22px", color: "#59ca02" }}>{item.icon}</span>
                </div>
                <span style={{ fontSize: "14px", color: "#475569", fontWeight: "600" }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Previous result */}
          {prevData && (
            <div style={{ width: "100%", background: "white", border: "2px solid #f1f5f9", borderRadius: "14px", padding: "14px 16px", marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px", fontWeight: "700" }}>
                📋 마지막 검사: {formatDate(prevData.date)}
                <span style={{ marginLeft: "8px", color: daysBetween(prevData.date) >= 30 ? "#34D399" : "#60A5FA" }}>
                  {daysBetween(prevData.date) >= 30 ? "✅ 재검사 권장" : `(${daysBetween(prevData.date)}일 전)`}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "22px" }}>{prevResult?.emoji}</span>
                <span style={{ color: prevResult?.color, fontWeight: "800", fontSize: "15px" }}>{prevResult?.level}</span>
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>{prevData.score}점 / 50점</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", paddingBottom: "max(32px, env(safe-area-inset-bottom))", borderTop: "2px solid #f1f5f9", background: "#f7f8f5", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <button
            onClick={() => setPhase("test")}
            style={{
              width: "100%", padding: "18px 24px", borderRadius: "16px", border: "none",
              background: "#59ca02", color: "white", fontSize: "16px", fontWeight: "900",
              cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em", textTransform: "uppercase",
              boxShadow: "0 4px 0 0 #46a302", transition: "all .15s ease",
            }}
            onMouseDown={e => { e.currentTarget.style.transform = "translateY(4px)"; e.currentTarget.style.boxShadow = "none"; }}
            onMouseUp={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 0 0 #46a302"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 0 0 #46a302"; }}
          >
            진단 시작하기
          </button>
        </div>
      </div>
    );
  }

  // ── TEST ──────────────────────────────────────────────────────
  if (phase === "test") {
    const progress = (current / QUESTIONS.length) * 100;
    const q = QUESTIONS[current];

    return (
      <div style={{ ...BASE, display: "flex", flexDirection: "column" }}>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
          .msicon { font-family:'Material Symbols Outlined'; font-style:normal; font-weight:normal; display:inline-block; line-height:1; text-transform:none; letter-spacing:normal; white-space:nowrap; direction:ltr; -webkit-font-smoothing:antialiased; font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
          .msicon-fill { font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24; }
          .opt-btn:active { transform: scale(0.98); }
        `}</style>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 8px 16px", gap: "16px", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#64748b", padding: 0 }}>
            <span className="msicon" style={{ fontSize: "26px" }}>close</span>
          </button>
          <div style={{ flex: 1, height: "16px", background: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#59ca02", borderRadius: "9999px", width: `${progress}%`, transition: "width .4s ease" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#59ca02" }}>
            <span className="msicon msicon-fill" style={{ fontSize: "20px" }}>favorite</span>
            <span style={{ fontWeight: "800", fontSize: "18px" }}>{QUESTIONS.length - current}</span>
          </div>
        </div>

        {/* Scroll content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          {/* Mascot */}
          <div style={{ position: "relative", width: "180px", height: "180px", marginBottom: "28px", marginTop: "8px" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(89,202,2,0.1)", borderRadius: "50%", transform: "scale(1.1)" }} />
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "rgba(89,202,2,0.08)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <span className="msicon" style={{ fontSize: "80px", color: "#59ca02" }}>psychology</span>
            </div>
          </div>

          {/* Question bubble */}
          <div key={current} style={{ position: "relative", width: "100%", background: "white", border: "2px solid #e2e8f0", borderRadius: "16px", padding: "20px", marginBottom: "32px", animation: "fadeUp .25s ease" }}>
            <div style={{ position: "absolute", bottom: "-12px", left: "40px", width: "24px", height: "24px", background: "white", borderBottom: "2px solid #e2e8f0", borderRight: "2px solid #e2e8f0", transform: "rotate(45deg)" }} />
            <p style={{ fontSize: "18px", fontWeight: "800", textAlign: "center", margin: 0, lineHeight: "1.5", color: "#0f172a" }}>
              {q.text}
            </p>
          </div>

          {/* Options */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "16px" }}>
            {OPTIONS.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <label
                  key={opt.value}
                  className="opt-btn"
                  onClick={() => setSelected(opt.value)}
                  style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    borderRadius: "16px", border: `2px solid ${isSelected ? "#59ca02" : "#e2e8f0"}`,
                    padding: "16px", background: isSelected ? "rgba(89,202,2,0.05)" : "white",
                    cursor: "pointer", transition: "all .15s ease",
                  }}
                >
                  <div style={{
                    width: "40px", height: "40px", flexShrink: 0, borderRadius: "10px",
                    border: `2px solid ${isSelected ? "#59ca02" : "#e2e8f0"}`,
                    background: isSelected ? "#59ca02" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "800", fontSize: "16px",
                    color: isSelected ? "white" : "#94a3b8",
                    transition: "all .15s ease",
                  }}>
                    {opt.value}
                  </div>
                  <span style={{ fontSize: "16px", fontWeight: "700", color: isSelected ? "#0f172a" : "#475569", flex: 1 }}>
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: "12px", padding: "16px 24px", paddingBottom: "max(32px, env(safe-area-inset-bottom))", borderTop: "2px solid #f1f5f9", background: "#f7f8f5", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <button
            onClick={handlePrev}
            style={{
              flex: 1, padding: "16px 20px", borderRadius: "14px",
              border: "2px solid #e2e8f0", background: "white",
              color: "#64748b", fontWeight: "800", fontSize: "14px",
              cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em", textTransform: "uppercase",
              transition: "all .15s ease",
            }}
          >
            이전
          </button>
          <button
            onClick={handleContinue}
            disabled={selected === null}
            style={{
              flex: 2, padding: "16px 20px", borderRadius: "14px", border: "none",
              background: selected !== null ? "#59ca02" : "#e2e8f0",
              color: selected !== null ? "white" : "#94a3b8",
              fontWeight: "900", fontSize: "14px",
              cursor: selected !== null ? "pointer" : "default",
              fontFamily: "inherit", letterSpacing: "0.05em", textTransform: "uppercase",
              boxShadow: selected !== null ? "0 4px 0 0 #46a302" : "0 4px 0 0 #d1d5db",
              transition: "all .15s ease",
            }}
            onMouseDown={e => { if (selected !== null) { e.currentTarget.style.transform = "translateY(4px)"; e.currentTarget.style.boxShadow = "none"; }}}
            onMouseUp={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = selected !== null ? "0 4px 0 0 #46a302" : "0 4px 0 0 #d1d5db"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = selected !== null ? "0 4px 0 0 #46a302" : "0 4px 0 0 #d1d5db"; }}
          >
            {current < QUESTIONS.length - 1 ? "계속" : "결과 보기"}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULT ──────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const maxScore = QUESTIONS.length * 5;
    const pct = Math.round(((finalScore - 10) / 40) * 100);

    return (
      <div style={{ ...BASE, display: "flex", flexDirection: "column" }}>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          .msicon { font-family:'Material Symbols Outlined'; font-style:normal; font-weight:normal; display:inline-block; line-height:1; text-transform:none; letter-spacing:normal; white-space:nowrap; direction:ltr; -webkit-font-smoothing:antialiased; font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
          .msicon-fill { font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24; }
        `}</style>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px 16px 8px", gap: "16px", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#64748b", padding: 0 }}>
            <span className="msicon" style={{ fontSize: "26px" }}>close</span>
          </button>
          <h2 style={{ flex: 1, textAlign: "center", fontSize: "17px", fontWeight: "800", margin: 0, color: "#0f172a" }}>진단 결과</h2>
          <div style={{ width: "40px" }} />
        </div>

        {/* Scroll content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Score card */}
          <div style={{ background: "white", border: "2px solid #f1f5f9", borderRadius: "20px", padding: "28px 24px", textAlign: "center", animation: "fadeUp .4s ease" }}>
            <div style={{ fontSize: "56px", marginBottom: "10px" }}>{result.emoji}</div>
            <div style={{
              display: "inline-block", padding: "4px 16px", borderRadius: "9999px",
              background: `${result.color}20`, border: `1px solid ${result.color}50`,
              color: result.color, fontSize: "13px", fontWeight: "800", marginBottom: "14px",
              letterSpacing: "0.03em",
            }}>
              {result.level}
            </div>
            <div style={{ fontSize: "48px", fontWeight: "900", lineHeight: 1, color: result.color, marginBottom: "4px" }}>
              {finalScore}
              <span style={{ fontSize: "18px", color: "#94a3b8", fontWeight: "600" }}>점</span>
              <span style={{ fontSize: "18px", color: "#cbd5e1", fontWeight: "500" }}> / {maxScore}</span>
            </div>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "12px 0 0", lineHeight: "1.7" }}>{result.description}</p>

            {/* Gauge */}
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>낮음 (10)</span>
                <span style={{ fontSize: "11px", color: result.color, fontWeight: "800" }}>{Math.max(0, pct)}%</span>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>높음 (50)</span>
              </div>
              <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "9999px",
                  background: `linear-gradient(90deg, #34D399, ${result.color})`,
                  width: `${Math.max(4, pct)}%`,
                  transition: "width .8s ease",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                {["정상", "경미", "중등도", "심함"].map((lb, i) => (
                  <span key={i} style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "600" }}>{lb}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Score change */}
          {prevData && scoreDiff !== null && (
            <div style={{
              background: "white", border: `2px solid ${scoreDiff < 0 ? "rgba(52,211,153,0.3)" : scoreDiff > 0 ? "rgba(248,113,113,0.3)" : "#f1f5f9"}`,
              borderRadius: "16px", padding: "16px 20px", animation: "fadeUp .4s ease .1s both",
            }}>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px", fontWeight: "700" }}>
                📅 {formatDate(prevData.date)} 대비 변화
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "2px" }}>이전</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: prevResult?.color }}>{prevData.score}점</div>
                </div>
                <span style={{ flex: 1, textAlign: "center", fontSize: "20px", color: "#cbd5e1" }}>→</span>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "2px" }}>현재</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: result.color }}>{finalScore}점</div>
                </div>
                <div style={{
                  marginLeft: "auto", padding: "6px 14px", borderRadius: "10px",
                  background: scoreDiff < 0 ? "rgba(52,211,153,0.1)" : scoreDiff > 0 ? "rgba(248,113,113,0.1)" : "#f8fafc",
                  color: scoreDiff < 0 ? "#34D399" : scoreDiff > 0 ? "#F87171" : "#94a3b8",
                  fontWeight: "900", fontSize: "16px",
                }}>
                  {scoreDiff < 0 ? `▼ ${Math.abs(scoreDiff)}` : scoreDiff > 0 ? `▲ ${scoreDiff}` : "변화 없음"}
                </div>
              </div>
              {scoreDiff < 0 && <div style={{ marginTop: "10px", fontSize: "13px", color: "#34D399", fontWeight: "600" }}>🎉 점수가 낮아졌어요! 연습의 효과가 나타나고 있어요.</div>}
              {scoreDiff > 0 && <div style={{ marginTop: "10px", fontSize: "13px", color: "#94a3b8" }}>괜찮아요. 연습을 꾸준히 계속하면 반드시 나아져요.</div>}
            </div>
          )}

          {/* Detail */}
          <div style={{ background: "white", border: "2px solid #f1f5f9", borderRadius: "16px", padding: "18px 20px", animation: "fadeUp .4s ease .15s both" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "800", marginBottom: "8px", letterSpacing: "0.05em" }}>📊 결과 해석</div>
            <p style={{ fontSize: "14px", color: "#475569", margin: "0 0 12px", lineHeight: "1.7" }}>{result.detail}</p>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "800", marginBottom: "6px", letterSpacing: "0.05em" }}>💡 극복 전략</div>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>{result.recommendation}</p>
          </div>

          {/* Recommended levels */}
          <div style={{ background: "white", border: `2px solid ${result.color}30`, borderRadius: "16px", padding: "18px 20px", animation: "fadeUp .4s ease .2s both" }}>
            <div style={{ fontSize: "12px", fontWeight: "800", color: result.color, marginBottom: "12px", letterSpacing: "0.05em" }}>🎯 추천 연습 레벨</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {result.recommendedLevels.map(lv => (
                <span key={lv} style={{
                  padding: "6px 16px", borderRadius: "9999px",
                  background: `${result.color}15`, border: `1px solid ${result.color}40`,
                  color: result.color, fontSize: "13px", fontWeight: "800",
                }}>{lv}</span>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div style={{ background: "white", border: "2px solid #f1f5f9", borderRadius: "16px", padding: "18px 20px", animation: "fadeUp .4s ease .25s both" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "800", marginBottom: "12px", letterSpacing: "0.05em" }}>📌 실천 팁</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {result.tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: `${result.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                    <span style={{ color: result.color, fontSize: "12px", fontWeight: "900" }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Retry notice */}
          <div style={{ background: "rgba(89,202,2,0.06)", border: "2px solid rgba(89,202,2,0.15)", borderRadius: "14px", padding: "14px 16px", animation: "fadeUp .4s ease .3s both" }}>
            <div style={{ fontSize: "12px", color: "#59ca02", fontWeight: "800", marginBottom: "4px" }}>📅 1달 후 재검사</div>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
              꾸준히 연습하고 한 달 후 다시 검사해보세요. 점수 변화로 성장을 확인할 수 있어요!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: "12px", padding: "16px 24px", paddingBottom: "max(32px, env(safe-area-inset-bottom))", borderTop: "2px solid #f1f5f9", background: "#f7f8f5", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <button
            onClick={restart}
            style={{
              flex: 1, padding: "16px", borderRadius: "14px",
              border: "2px solid #e2e8f0", background: "white",
              color: "#64748b", fontWeight: "800", fontSize: "13px",
              cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em", textTransform: "uppercase",
            }}
          >
            다시 검사
          </button>
          <button
            onClick={onBack}
            style={{
              flex: 2, padding: "16px", borderRadius: "14px", border: "none",
              background: "#59ca02", color: "white", fontWeight: "900", fontSize: "14px",
              cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em", textTransform: "uppercase",
              boxShadow: "0 4px 0 0 #46a302", transition: "all .15s ease",
            }}
            onMouseDown={e => { e.currentTarget.style.transform = "translateY(4px)"; e.currentTarget.style.boxShadow = "none"; }}
            onMouseUp={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 0 0 #46a302"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 0 0 #46a302"; }}
          >
            🎙️ 훈련 시작하기
          </button>
        </div>
      </div>
    );
  }

  return null;
}
