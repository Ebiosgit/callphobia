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
    level: "정상 범위",
    grade: "A",
    emoji: "😊",
    color: "#34D399",
    darkColor: "#059669",
    description: "전화 통화에 큰 어려움이 없어요. 가끔 긴장하는 건 누구나 마찬가지예요.",
    detail: "전화에 대한 불안이 일상에 영향을 주지 않는 수준입니다. 자신감 있게 전화하고 계세요!",
    recommendation: "현재 수준을 유지하며 더 어려운 상황도 도전해보세요.",
    recommendedLevels: ["Lv.3 중급", "Lv.4 고급"],
    tips: ["어려운 상황(환불, 민원)도 직접 도전해보세요", "연습을 통해 비즈니스 전화 실력을 키워보세요"],
  };
  if (score <= 22) return {
    level: "경미한 콜포비아",
    grade: "B",
    emoji: "😟",
    color: "#60A5FA",
    darkColor: "#2563EB",
    description: "전화가 가끔 부담스럽지만 생활에 큰 지장은 없어요.",
    detail: "의식적으로 전화를 피하거나 불안을 느끼는 경향이 있습니다. 조금만 연습하면 금세 나아질 거예요.",
    recommendation: "쉬운 상황부터 연습하며 성공 경험을 쌓아보세요.",
    recommendedLevels: ["Lv.1 입문", "Lv.2 초급", "Lv.3 중급"],
    tips: ["친절한 상대(배달, 미용실)부터 시작하세요", "통화 전 키워드 2~3개만 적어두면 훨씬 편해요"],
  };
  if (score <= 32) return {
    level: "중등도 콜포비아",
    grade: "C",
    emoji: "😰",
    color: "#FBBF24",
    darkColor: "#D97706",
    description: "전화 때문에 중요한 일을 미루거나 스트레스를 많이 받고 있어요.",
    detail: "전화 회피가 일상에 영향을 주는 수준입니다. 체계적인 연습이 효과적입니다.",
    recommendation: "Lv.1부터 차근차근 반복하며 자신감을 쌓아보세요.",
    recommendedLevels: ["Lv.1 입문", "Lv.2 초급"],
    tips: ["매일 1개 연습을 목표로 해보세요", "통화 전 호흡을 3번 깊게 하면 심박수가 낮아져요", "대본 생성기로 스크립트를 미리 준비하세요"],
  };
  return {
    level: "심한 콜포비아",
    grade: "D",
    emoji: "😱",
    color: "#F87171",
    darkColor: "#DC2626",
    description: "전화에 대한 두려움이 일상생활에 상당한 영향을 주고 있어요.",
    detail: "전화 공포가 심한 수준입니다. 하지만 걱정 마세요 — 점진적 노출 연습으로 반드시 나아질 수 있어요.",
    recommendation: "Lv.1 입문부터 천천히, 매일 한 번씩 연습해보세요.",
    recommendedLevels: ["Lv.1 입문"],
    tips: ["지금 당장 잘 못해도 괜찮아요, 연습이 목적이에요", "Lv.1 배달 주문처럼 친절한 상황부터 시작하세요", "대본 생성기로 할 말을 미리 준비하면 훨씬 편해요", "통화 전 4-7-8 호흡법: 4초 들이쉬고, 7초 참고, 8초 내쉬기"],
  };
}

function daysBetween(dateStr) {
  const past = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - past) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function PhobiaTest({ onBack }) {
  const [phase, setPhase] = useState("intro"); // intro | test | result
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

  function handleSelect(value) {
    setSelected(value);
    setTimeout(() => {
      const newAnswers = { ...answers, [QUESTIONS[current].id]: value };
      setAnswers(newAnswers);
      setSelected(null);
      if (current < QUESTIONS.length - 1) {
        setCurrent(current + 1);
      } else {
        const total = Object.values(newAnswers).reduce((a, b) => a + b, 0);
        setFinalScore(total);
        // 히스토리 저장
        const entry = { score: total, date: new Date().toISOString() };
        const saved = localStorage.getItem("phobiaTestHistory");
        const history = saved ? JSON.parse(saved) : [];
        history.push(entry);
        // 최근 10회만 보관
        if (history.length > 10) history.shift();
        localStorage.setItem("phobiaTestHistory", JSON.stringify(history));
        setPhase("result");
      }
    }, 250);
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
  const daysSince = prevData ? daysBetween(prevData.date) : null;

  // ── INTRO ──────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={pageStyle}>
        <GlobalStyle />
        <div style={containerStyle}>
          {/* 뒤로가기 */}
          <button onClick={onBack} style={backBtnStyle}>← 홈으로</button>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px", animation: "float 3s ease infinite" }}>🧠</div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "white", margin: "0 0 8px" }}>
              콜포비아 자가진단
            </h1>
            <p style={{ fontSize: "14px", color: "#94A3B8", margin: 0, lineHeight: "1.7" }}>
              10문항으로 내 전화 공포증 수준을 확인해보세요
            </p>
          </div>

          {/* 이전 결과 알림 */}
          {prevData && (
            <div style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", padding: "16px", marginBottom: "20px"
            }}>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "6px" }}>
                📋 마지막 검사: {formatDate(prevData.date)}
                {daysSince !== null && (
                  <span style={{ marginLeft: "8px", color: daysSince >= 30 ? "#34D399" : "#60A5FA" }}>
                    ({daysSince >= 30 ? "✅ 재검사 권장" : `${daysSince}일 전`})
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>{prevResult?.emoji}</span>
                <div>
                  <span style={{ color: prevResult?.color, fontWeight: "700", fontSize: "14px" }}>
                    {prevResult?.level}
                  </span>
                  <span style={{ color: "#64748B", fontSize: "13px", marginLeft: "8px" }}>
                    {prevData.score}점 / 50점
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 안내 카드 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
            {[
              { icon: "📝", text: "총 10문항, 약 2분 소요" },
              { icon: "🔒", text: "결과는 내 기기에만 저장돼요" },
              { icon: "📅", text: "1달 후 재검사로 변화를 확인하세요" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "12px 16px"
              }}>
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span style={{ fontSize: "13px", color: "#CBD5E1" }}>{item.text}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase("test")}
            style={{
              width: "100%", padding: "18px", borderRadius: "18px", border: "none",
              background: "linear-gradient(135deg, #6366F1, #A78BFA)",
              color: "white", fontSize: "17px", fontWeight: "800", cursor: "pointer",
              boxShadow: "0 4px 24px rgba(99,102,241,0.4)", transition: "transform .15s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            진단 시작하기
          </button>
        </div>
      </div>
    );
  }

  // ── TEST ──────────────────────────────────────────────────────
  if (phase === "test") {
    const progress = ((current) / QUESTIONS.length) * 100;
    const q = QUESTIONS[current];

    return (
      <div style={pageStyle}>
        <GlobalStyle />
        <div style={containerStyle}>
          {/* 헤더 */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <button onClick={onBack} style={backBtnStyle}>← 홈으로</button>
              <span style={{ fontSize: "13px", color: "#94A3B8" }}>{Math.round(progress)}%</span>
            </div>
            {/* 프로그레스 바 */}
            <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "3px",
                background: "linear-gradient(90deg, #6366F1, #A78BFA)",
                width: `${progress}%`, transition: "width .4s ease"
              }} />
            </div>
            <div style={{ marginTop: "6px", fontSize: "12px", color: "#64748B", textAlign: "right" }}>
              문항 {current + 1} / {QUESTIONS.length}
            </div>
          </div>

          {/* 질문 */}
          <div style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px", padding: "28px 24px", marginBottom: "24px",
            animation: "fadeUp .3s ease"
          }}>
            <div style={{ fontSize: "12px", color: "#6366F1", fontWeight: "700", marginBottom: "12px", letterSpacing: "0.5px" }}>
              Q{current + 1}
            </div>
            <p style={{ fontSize: "17px", color: "white", fontWeight: "600", lineHeight: "1.65", margin: 0 }}>
              {q.text}
            </p>
          </div>

          {/* 보기 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {OPTIONS.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    padding: "16px 20px", borderRadius: "14px", border: "1px solid",
                    borderColor: isSelected ? "#A78BFA" : "rgba(255,255,255,0.1)",
                    background: isSelected ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.04)",
                    color: isSelected ? "#A78BFA" : "#CBD5E1",
                    fontSize: "15px", fontWeight: isSelected ? "700" : "500",
                    cursor: "pointer", textAlign: "left", transition: "all .15s ease",
                    display: "flex", alignItems: "center", gap: "14px"
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)";
                      e.currentTarget.style.background = "rgba(167,139,250,0.08)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }
                  }}
                >
                  <span style={{
                    width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                    background: isSelected ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: "800", color: isSelected ? "#A78BFA" : "#64748B"
                  }}>
                    {opt.value}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──────────────────────────────────────────────────────
  if (phase === "result" && result) {
    const maxScore = QUESTIONS.length * 5;
    const pct = Math.round((finalScore / maxScore) * 100);

    return (
      <div style={pageStyle}>
        <GlobalStyle />
        <div style={{ ...containerStyle, paddingBottom: "40px" }}>
          {/* 뒤로가기 */}
          <button onClick={onBack} style={backBtnStyle}>← 홈으로</button>

          {/* 결과 헤더 */}
          <div style={{
            textAlign: "center", marginBottom: "28px", animation: "fadeUp .4s ease"
          }}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>{result.emoji}</div>
            <div style={{
              display: "inline-block", padding: "4px 14px", borderRadius: "20px",
              background: `${result.color}20`, border: `1px solid ${result.color}50`,
              color: result.color, fontSize: "13px", fontWeight: "700", marginBottom: "10px"
            }}>
              {result.level}
            </div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "white", marginBottom: "8px" }}>
              {finalScore}점 <span style={{ fontSize: "15px", color: "#64748B", fontWeight: "500" }}>/ {maxScore}점</span>
            </div>
            <p style={{ fontSize: "14px", color: "#94A3B8", margin: 0, lineHeight: "1.7", padding: "0 8px" }}>
              {result.description}
            </p>
          </div>

          {/* 점수 게이지 */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "18px", padding: "20px", marginBottom: "16px", animation: "fadeUp .4s ease .1s both"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>낮음 (10점)</span>
              <span style={{ fontSize: "12px", color: result.color, fontWeight: "700" }}>{pct}%</span>
              <span style={{ fontSize: "12px", color: "#64748B" }}>높음 (50점)</span>
            </div>
            <div style={{ height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "5px", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "5px",
                background: `linear-gradient(90deg, #34D399, ${result.color})`,
                width: `${Math.max(4, ((finalScore - 10) / 40) * 100)}%`,
                transition: "width .8s ease", boxShadow: `0 0 10px ${result.color}60`
              }} />
            </div>
            {/* 4단계 레이블 */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
              {["정상", "경미", "중등도", "심함"].map((label, i) => (
                <span key={i} style={{ fontSize: "10px", color: "#475569" }}>{label}</span>
              ))}
            </div>
          </div>

          {/* 이전 대비 변화 */}
          {prevData && scoreDiff !== null && (
            <div style={{
              background: scoreDiff < 0 ? "rgba(52,211,153,0.08)" : scoreDiff > 0 ? "rgba(248,113,113,0.08)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${scoreDiff < 0 ? "rgba(52,211,153,0.2)" : scoreDiff > 0 ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "16px", padding: "16px", marginBottom: "16px",
              animation: "fadeUp .4s ease .15s both"
            }}>
              <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "8px" }}>
                📅 {formatDate(prevData.date)} 대비 변화
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "2px" }}>이전</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: prevResult?.color }}>{prevData.score}점</div>
                </div>
                <div style={{ flex: 1, textAlign: "center", fontSize: "20px" }}>
                  {scoreDiff < 0 ? "→" : scoreDiff > 0 ? "→" : "→"}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "2px" }}>현재</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: result.color }}>{finalScore}점</div>
                </div>
                <div style={{
                  marginLeft: "auto", padding: "6px 12px", borderRadius: "10px",
                  background: scoreDiff < 0 ? "rgba(52,211,153,0.15)" : scoreDiff > 0 ? "rgba(248,113,113,0.15)" : "rgba(255,255,255,0.1)",
                  color: scoreDiff < 0 ? "#34D399" : scoreDiff > 0 ? "#F87171" : "#94A3B8",
                  fontWeight: "800", fontSize: "15px"
                }}>
                  {scoreDiff < 0 ? `▼ ${Math.abs(scoreDiff)}` : scoreDiff > 0 ? `▲ ${scoreDiff}` : "변화 없음"}
                </div>
              </div>
              {scoreDiff < 0 && (
                <div style={{ marginTop: "10px", fontSize: "13px", color: "#34D399" }}>
                  🎉 점수가 낮아졌어요! 연습의 효과가 나타나고 있어요.
                </div>
              )}
              {scoreDiff > 0 && (
                <div style={{ marginTop: "10px", fontSize: "13px", color: "#94A3B8" }}>
                  괜찮아요. 연습을 꾸준히 계속하면 반드시 나아져요.
                </div>
              )}
            </div>
          )}

          {/* 세부 설명 */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "16px", marginBottom: "16px",
            animation: "fadeUp .4s ease .2s both"
          }}>
            <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "8px", fontWeight: "700" }}>📊 결과 해석</div>
            <p style={{ fontSize: "13px", color: "#CBD5E1", margin: "0 0 12px", lineHeight: "1.7" }}>{result.detail}</p>
            <div style={{ fontSize: "12px", color: "#64748B", fontWeight: "700", marginBottom: "6px" }}>💡 극복 전략</div>
            <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0, lineHeight: "1.6" }}>{result.recommendation}</p>
          </div>

          {/* 추천 연습 레벨 */}
          <div style={{
            background: `${result.color}10`, border: `1px solid ${result.color}25`,
            borderRadius: "16px", padding: "16px", marginBottom: "16px",
            animation: "fadeUp .4s ease .25s both"
          }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: result.color, marginBottom: "10px" }}>
              🎯 추천 연습 레벨
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {result.recommendedLevels.map(lv => (
                <span key={lv} style={{
                  padding: "6px 14px", borderRadius: "20px",
                  background: `${result.color}20`, border: `1px solid ${result.color}40`,
                  color: result.color, fontSize: "13px", fontWeight: "700"
                }}>{lv}</span>
              ))}
            </div>
          </div>

          {/* 팁 목록 */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "16px", marginBottom: "28px",
            animation: "fadeUp .4s ease .3s both"
          }}>
            <div style={{ fontSize: "12px", color: "#64748B", fontWeight: "700", marginBottom: "10px" }}>📌 실천 팁</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {result.tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ color: result.color, fontSize: "13px", fontWeight: "700", flexShrink: 0, marginTop: "1px" }}>
                    {i + 1}.
                  </span>
                  <span style={{ fontSize: "13px", color: "#CBD5E1", lineHeight: "1.6" }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 재검사 안내 */}
          <div style={{
            background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "14px", padding: "14px", marginBottom: "20px",
            animation: "fadeUp .4s ease .35s both"
          }}>
            <div style={{ fontSize: "12px", color: "#A78BFA", fontWeight: "700", marginBottom: "4px" }}>📅 1달 후 재검사</div>
            <p style={{ fontSize: "12px", color: "#64748B", margin: 0, lineHeight: "1.6" }}>
              꾸준히 연습하고 한 달 후 다시 검사해보세요. 점수 변화로 성장을 확인할 수 있어요!
            </p>
          </div>

          {/* 버튼 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", animation: "fadeUp .4s ease .4s both" }}>
            <button
              onClick={onBack}
              style={{
                padding: "16px", borderRadius: "16px", border: "none",
                background: `linear-gradient(135deg, ${result.darkColor}, ${result.color})`,
                color: "white", fontSize: "16px", fontWeight: "800", cursor: "pointer",
                boxShadow: `0 4px 20px ${result.color}40`
              }}
            >
              🎙️ 음성 트레이너 연습하러 가기
            </button>
            <button
              onClick={restart}
              style={{
                padding: "14px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "#94A3B8", fontSize: "14px", fontWeight: "600", cursor: "pointer"
              }}
            >
              다시 검사하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ── 공통 스타일 ──────────────────────────────────────────────────
const pageStyle = {
  fontFamily: "'Noto Sans KR', -apple-system, sans-serif",
  minHeight: "100vh",
  background: "linear-gradient(145deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)",
  display: "flex", justifyContent: "center",
  padding: "24px 16px max(24px, env(safe-area-inset-bottom)) 16px",
};

const containerStyle = {
  width: "100%", maxWidth: "420px", paddingTop: "16px"
};

const backBtnStyle = {
  background: "none", border: "none", color: "#64748B",
  fontSize: "14px", cursor: "pointer", padding: "0 0 20px",
  display: "block", fontFamily: "inherit"
};

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&display=swap');
      @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes float  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    `}</style>
  );
}
