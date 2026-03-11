import { useState } from "react";

const CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "daily", label: "일상" },
  { id: "work", label: "업무" },
  { id: "official", label: "공공" },
  { id: "complaint", label: "항의/문의" },
];

const SITUATIONS = [
  { id: "hospital",      icon: "🏥", color: "#4ECDC4", category: "daily",     label: "병원/약국 예약",   placeholder: "예: 내과 초진 예약, 목요일 오후 원하고 진료 기록은 없어요" },
  { id: "restaurant",   icon: "🍽️", color: "#F97316", category: "daily",     label: "식당 예약",        placeholder: "예: 토요일 저녁 7시 4명 예약, 창가 자리 요청" },
  { id: "delivery",     icon: "📦", color: "#3B82F6", category: "daily",     label: "택배/배송 문의",   placeholder: "예: 3일째 배송 조회가 멈춰있어서 현황 확인하고 싶어요" },
  { id: "beauty",       icon: "💇", color: "#EC4899", category: "daily",     label: "미용실/네일샵",    placeholder: "예: 다음 주 토요일 오후 커트+염색 예약, 특정 디자이너 원해요" },
  { id: "accommodation",icon: "🏨", color: "#8B5CF6", category: "daily",     label: "숙소/호텔 예약",   placeholder: "예: 주말 1박 예약, 조식 포함 여부와 주차 가능한지 문의" },
  { id: "work",         icon: "💼", color: "#F59E0B", category: "work",      label: "회사 업무 전화",   placeholder: "예: 처음 거래하는 업체에 제품 견적 요청 전화" },
  { id: "job",          icon: "🧑‍💼", color: "#10B981", category: "work",      label: "채용/취업 문의",   placeholder: "예: 지원한 회사에 서류 심사 결과 확인 전화" },
  { id: "freelance",    icon: "🤝", color: "#6366F1", category: "work",      label: "외주/계약 문의",   placeholder: "예: 웹사이트 제작 외주 견적 문의, 예산과 기간 논의" },
  { id: "government",   icon: "🏛️", color: "#A78BFA", category: "official",  label: "관공서 민원",      placeholder: "예: 주민센터에 전입신고 관련 필요서류 문의" },
  { id: "bank",         icon: "🏦", color: "#0EA5E9", category: "official",  label: "은행/금융 문의",   placeholder: "예: 적금 만기 해지 방법과 필요 서류 문의" },
  { id: "insurance",    icon: "🛡️", color: "#14B8A6", category: "official",  label: "보험 문의",        placeholder: "예: 치과 치료 후 실손보험 청구 방법과 필요서류 문의" },
  { id: "refund",       icon: "💸", color: "#EF4444", category: "complaint", label: "환불/교환 요청",   placeholder: "예: 받은 제품에 흠집이 있어서 환불 요청, 영수증 있음" },
  { id: "complaint",    icon: "😤", color: "#DC2626", category: "complaint", label: "불편사항 신고",    placeholder: "예: 위층 층간소음이 반복되어 관리사무소에 공식 민원 접수" },
  { id: "utility",      icon: "🔧", color: "#78716C", category: "complaint", label: "AS/수리 접수",     placeholder: "예: 에어컨 작동 불량으로 제조사 AS 접수, 방문 수리 요청" },
];

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

function parseNegativeScenarios(content) {
  const scenarios = [];
  const lines = content.split("\n");
  let current = null;
  for (const line of lines) {
    if (line.trim().startsWith("- 상황:")) {
      if (current) scenarios.push(current);
      current = { situation: line.replace(/^- 상황:\s*/, "").trim(), response: "", tip: "" };
    } else if (line.trim().startsWith("대응:") && current) {
      current.response = line.replace(/^대응:\s*/, "").trim();
    } else if (line.trim().startsWith("팁:") && current) {
      current.tip = line.replace(/^팁:\s*/, "").trim();
    }
  }
  if (current) scenarios.push(current);
  return scenarios;
}

function NegativeBlock({ label, content }) {
  const [copied, setCopied] = useState(false);
  const [openIdx, setOpenIdx] = useState(0);
  const scenarios = parseNegativeScenarios(content);
  const handleCopy = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ background: "white", borderRadius: "16px", border: "2px solid #fee2e2", overflow: "hidden", marginBottom: "10px", boxShadow: "0 2px 0 0 #fca5a5" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#fff7f7", borderBottom: "1px solid #fee2e2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: "800", color: "#dc2626" }}>{label}</span>
          {scenarios.length > 0 && <span style={{ fontSize: "11px", background: "#fee2e2", color: "#dc2626", borderRadius: "6px", padding: "1px 8px", fontWeight: "700" }}>{scenarios.length}가지</span>}
        </div>
        <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: "4px", background: copied ? "#dc2626" : "white", color: copied ? "white" : "#dc2626", border: "1px solid #dc2626", borderRadius: "8px", padding: "4px 10px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
          {copied ? <CheckIcon /> : <CopyIcon />} {copied ? "복사됨" : "복사"}
        </button>
      </div>
      {scenarios.length > 0 ? (
        <div style={{ padding: "12px" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setOpenIdx(i)} style={{ flex: 1, padding: "6px 4px", borderRadius: "10px", fontSize: "12px", fontWeight: openIdx === i ? "800" : "500", border: `2px solid ${openIdx === i ? "#dc2626" : "#e2e8f0"}`, background: openIdx === i ? "#fef2f2" : "white", color: openIdx === i ? "#dc2626" : "#94a3b8", cursor: "pointer", fontFamily: "inherit" }}>상황 {i + 1}</button>
            ))}
          </div>
          {scenarios[openIdx] && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ background: "#fef2f2", borderRadius: "12px 12px 12px 4px", padding: "12px 14px", borderLeft: "3px solid #ef4444" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#ef4444", marginBottom: "4px" }}>🗣 상대방 말</div>
                <div style={{ fontSize: "13px", color: "#7f1d1d", lineHeight: "1.6", fontStyle: "italic" }}>"{scenarios[openIdx].situation}"</div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ background: "#f0fdf4", borderRadius: "12px 12px 4px 12px", padding: "12px 14px", borderRight: "3px solid #22c55e", maxWidth: "90%" }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#16a34a", marginBottom: "4px" }}>💬 나의 대응</div>
                  <div style={{ fontSize: "13px", color: "#14532d", lineHeight: "1.6" }}>{scenarios[openIdx].response}</div>
                </div>
              </div>
              {scenarios[openIdx].tip && (
                <div style={{ background: "#fffbeb", borderRadius: "10px", padding: "10px 12px", display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "14px" }}>💡</span>
                  <span style={{ fontSize: "12px", color: "#92400e", lineHeight: "1.5", fontWeight: "500" }}>{scenarios[openIdx].tip}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: "14px 16px", fontSize: "14px", lineHeight: "1.8", color: "#374151", whiteSpace: "pre-wrap" }}>{content}</div>
      )}
    </div>
  );
}

function ScriptBlock({ label, content, color }) {
  const [copied, setCopied] = useState(false);
  if (label.includes("거절") || label.includes("부정")) return <NegativeBlock label={label} content={content} />;
  const handleCopy = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ background: "white", borderRadius: "16px", border: `2px solid ${color}30`, overflow: "hidden", marginBottom: "10px", boxShadow: `0 2px 0 0 ${color}50` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: `${color}10`, borderBottom: `1px solid ${color}20` }}>
        <span style={{ fontSize: "13px", fontWeight: "800", color }}>{label}</span>
        <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: "4px", background: copied ? color : "white", color: copied ? "white" : color, border: `1px solid ${color}`, borderRadius: "8px", padding: "4px 10px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
          {copied ? <CheckIcon /> : <CopyIcon />} {copied ? "복사됨" : "복사"}
        </button>
      </div>
      <div style={{ padding: "14px 16px", fontSize: "14px", lineHeight: "1.8", color: "#374151", whiteSpace: "pre-wrap" }}>{content}</div>
    </div>
  );
}

function parseScript(text) {
  const blocks = [];
  const lines = text.split("\n");
  let currentLabel = null, currentContent = [];
  for (const line of lines) {
    const match = line.match(/^(?:#{1,3}\s*)?【(.+?)】\s*$/) || line.match(/^(?:#{1,3}\s*)?\[(.+?)\]\s*$/);
    if (match) {
      if (currentLabel) blocks.push({ label: currentLabel, content: currentContent.join("\n").trim() });
      currentLabel = match[1]; currentContent = [];
    } else { currentContent.push(line); }
  }
  if (currentLabel) blocks.push({ label: currentLabel, content: currentContent.join("\n").trim() });
  if (blocks.length === 0) blocks.push({ label: "통화 대본", content: text.trim() });
  return blocks;
}

const STYLES = `
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.5;} }
  .msicon { font-family:'Material Symbols Outlined'; font-style:normal; font-weight:normal; display:inline-block; line-height:1; text-transform:none; letter-spacing:normal; white-space:nowrap; direction:ltr; -webkit-font-smoothing:antialiased; font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
  .msicon-fill { font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24; }
  .sit-card:active { transform: translateY(2px); }
  .cat-btn::-webkit-scrollbar { display: none; }
`;

export default function ScriptGenerator({ onBack }) {
  const [view, setView] = useState("form");
  const [selectedSit, setSelectedSit] = useState(null);
  const [customLabel, setCustomLabel] = useState("");
  const [detail, setDetail] = useState("");
  const [tone, setTone] = useState("보통");
  const [loading, setLoading] = useState(false);
  const [scriptBlocks, setScriptBlocks] = useState([]);
  const [tips, setTips] = useState([]);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const sit = selectedSit === "custom"
    ? { id: "custom", icon: "✏️", color: "#6366F1", label: customLabel || "직접 입력", placeholder: "예: 이웃에게 주차 양보 부탁, 처음 통화라 어색해요" }
    : SITUATIONS.find(s => s.id === selectedSit);
  const accent = sit?.color || "#59ca02";

  const progress = selectedSit
    ? (detail.trim() ? (selectedSit === "custom" && !customLabel.trim() ? 50 : 80) : 40)
    : 5;

  const canGenerate = !!detail.trim() && !!selectedSit && (selectedSit !== "custom" || !!customLabel.trim());

  const generateScript = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setError("");
    setView("result");
    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: selectedSit, customLabel, detail, tone }),
      });
      if (!res.ok) throw new Error("서버 오류");
      const data = await res.json();
      setScriptBlocks(parseScript(data.scriptText));
      setTips(data.tips || []);
    } catch {
      setError("대본 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setView("form"); setSelectedSit(null); setCustomLabel(""); setDetail("");
    setTone("보통"); setScriptBlocks([]); setTips([]); setError(""); setActiveCategory("all");
  };

  const filteredSituations = SITUATIONS.filter(s => activeCategory === "all" || s.category === activeCategory);

  // ── FORM VIEW ──────────────────────────────────────────────────
  if (view === "form") {
    return (
      <div style={{ background: "#f7f8f5", minHeight: "100dvh", fontFamily: "'Plus Jakarta Sans','Noto Sans KR',sans-serif", display: "flex", flexDirection: "column" }}>
        <style>{STYLES}</style>

        {/* Sticky header */}
        <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(247,248,245,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(89,202,2,0.1)", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <button onClick={onBack} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", border: "none", background: "none", cursor: "pointer", color: "#475569" }}>
            <span className="msicon" style={{ fontSize: "24px" }}>arrow_back</span>
          </button>
          <h1 style={{ flex: 1, fontSize: "19px", fontWeight: "800", margin: 0, color: "#0f172a", letterSpacing: "-0.3px" }}>대본 생성기</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "white", padding: "6px 12px", borderRadius: "9999px", boxShadow: "0 2px 4px rgba(0,0,0,0.08)" }}>
            <span className="msicon msicon-fill" style={{ fontSize: "20px", color: "#f97316" }}>local_fire_department</span>
            <span style={{ fontWeight: "800", fontSize: "14px", color: "#0f172a" }}>3</span>
          </div>
        </header>

        {/* Progress bar */}
        <div style={{ width: "100%", height: "12px", background: "#e2e8f0", overflow: "hidden", maxWidth: "480px", margin: "0 auto", alignSelf: "stretch" }}>
          <div style={{ height: "100%", background: "#59ca02", width: `${progress}%`, transition: "width .5s ease", borderRadius: "0 9999px 9999px 0" }} />
        </div>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "20px 16px 120px", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* Section 1: 상황 선택 */}
          <section>
            <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "19px", fontWeight: "800", margin: "0 0 16px", color: "#0f172a" }}>
              <span style={{ color: "#59ca02", fontSize: "22px" }}>1.</span> 상황 선택
            </h2>

            {/* Category pills */}
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px", marginBottom: "14px", scrollbarWidth: "none" }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                  padding: "7px 14px", borderRadius: "9999px", whiteSpace: "nowrap",
                  border: `2px solid ${activeCategory === cat.id ? "#59ca02" : "#e2e8f0"}`,
                  background: activeCategory === cat.id ? "#59ca02" : "white",
                  color: activeCategory === cat.id ? "white" : "#64748b",
                  fontWeight: "700", fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
                  transition: "all .15s",
                }}>{cat.label}</button>
              ))}
            </div>

            {/* 2-col situation grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {filteredSituations.map(s => {
                const isSelected = selectedSit === s.id;
                return (
                  <label key={s.id} className="sit-card" onClick={() => setSelectedSit(s.id)} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 12px",
                    borderRadius: "16px", border: `2px solid ${isSelected ? "#59ca02" : "#e2e8f0"}`,
                    background: isSelected ? "#f0fdf4" : "white",
                    boxShadow: isSelected ? "0 4px 0 0 #59ca02" : "0 4px 0 0 rgba(0,0,0,0.07)",
                    cursor: "pointer", transition: "all .15s ease",
                  }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: isSelected ? `${s.color}20` : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "10px" }}>{s.icon}</div>
                    <span style={{ fontWeight: "700", fontSize: "13px", textAlign: "center", color: isSelected ? "#0f172a" : "#475569", lineHeight: "1.3" }}>{s.label}</span>
                  </label>
                );
              })}

              {/* Custom option */}
              {(activeCategory === "all") && (
                <label className="sit-card" onClick={() => setSelectedSit("custom")} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 12px",
                  borderRadius: "16px", border: `2px dashed ${selectedSit === "custom" ? "#59ca02" : "#c7d2fe"}`,
                  background: selectedSit === "custom" ? "#f0fdf4" : "white",
                  boxShadow: selectedSit === "custom" ? "0 4px 0 0 #59ca02" : "0 4px 0 0 rgba(0,0,0,0.07)",
                  cursor: "pointer", transition: "all .15s ease",
                }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "10px" }}>✏️</div>
                  <span style={{ fontWeight: "700", fontSize: "13px", textAlign: "center", color: "#4338ca" }}>직접 입력</span>
                </label>
              )}
            </div>
          </section>

          {/* Section 2: 말투 스타일 */}
          <section>
            <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "19px", fontWeight: "800", margin: "0 0 16px", color: "#0f172a" }}>
              <span style={{ color: "#59ca02", fontSize: "22px" }}>2.</span> 말투 스타일
            </h2>
            <div style={{ display: "flex", padding: "4px", background: "#e2e8f0", borderRadius: "14px", gap: "4px" }}>
              {["정중한", "보통", "친근한"].map(t => (
                <button key={t} onClick={() => setTone(t)} style={{
                  flex: 1, padding: "12px", textAlign: "center", borderRadius: "12px",
                  fontWeight: "800", fontSize: "14px", border: "none", cursor: "pointer",
                  fontFamily: "inherit", transition: "all .15s ease",
                  background: tone === t ? "white" : "transparent",
                  color: tone === t ? "#59ca02" : "#64748b",
                  boxShadow: tone === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}>{t}</button>
              ))}
            </div>
          </section>

          {/* Section 3: 통화 내용 */}
          <section>
            <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "19px", fontWeight: "800", margin: "0 0 16px", color: "#0f172a" }}>
              <span style={{ color: "#59ca02", fontSize: "22px" }}>3.</span> 통화 내용
            </h2>

            {/* Custom situation name */}
            {selectedSit === "custom" && (
              <div style={{ marginBottom: "12px" }}>
                <input
                  type="text"
                  value={customLabel}
                  onChange={e => setCustomLabel(e.target.value)}
                  placeholder="어떤 종류의 전화인가요? (예: 헬스장 환불 요청)"
                  maxLength={40}
                  style={{
                    width: "100%", padding: "14px 16px",
                    background: "white", border: `2px solid ${customLabel ? "#59ca02" : "#e2e8f0"}`,
                    borderRadius: "14px", fontSize: "14px", outline: "none",
                    fontFamily: "inherit", boxSizing: "border-box", color: "#0f172a",
                    boxShadow: "0 4px 0 0 rgba(0,0,0,0.07)", transition: "border-color .2s",
                  }}
                />
              </div>
            )}

            <div style={{ position: "relative" }}>
              <textarea
                value={detail}
                onChange={e => setDetail(e.target.value)}
                placeholder={sit?.placeholder || "예: 어떤 내용으로 전화하실 건가요?"}
                rows={4}
                style={{
                  width: "100%", padding: "14px 16px",
                  background: "white", border: `2px solid ${detail.trim() ? "#59ca02" : "#e2e8f0"}`,
                  borderRadius: "14px", fontSize: "14px", lineHeight: "1.6",
                  resize: "none", outline: "none", fontFamily: "inherit",
                  boxSizing: "border-box", color: "#0f172a",
                  boxShadow: "0 4px 0 0 rgba(0,0,0,0.07)", transition: "border-color .2s",
                }}
              />
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px", fontWeight: "600" }}>
              💡 구체적일수록 더 정확한 대본이 나와요
            </p>
          </section>
        </main>

        {/* Fixed footer */}
        <footer style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px", paddingBottom: "max(24px, env(safe-area-inset-bottom))", background: "rgba(247,248,245,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(89,202,2,0.1)", zIndex: 40 }}>
          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            <button
              onClick={generateScript}
              disabled={!canGenerate}
              style={{
                width: "100%", height: "60px", borderRadius: "14px", border: "none",
                background: canGenerate ? "#59ca02" : "#e2e8f0",
                color: canGenerate ? "white" : "#94a3b8",
                fontWeight: "900", fontSize: "18px", letterSpacing: "0.02em",
                cursor: canGenerate ? "pointer" : "default",
                fontFamily: "inherit", transition: "all .15s ease",
                boxShadow: canGenerate ? "0 4px 0 0 #46a302" : "0 4px 0 0 #d1d5db",
              }}
              onMouseDown={e => { if (canGenerate) { e.currentTarget.style.transform = "translateY(4px)"; e.currentTarget.style.boxShadow = "none"; }}}
              onMouseUp={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = canGenerate ? "0 4px 0 0 #46a302" : "0 4px 0 0 #d1d5db"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = canGenerate ? "0 4px 0 0 #46a302" : "0 4px 0 0 #d1d5db"; }}
            >
              대본 만들기
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // ── RESULT VIEW ──────────────────────────────────────────────────
  return (
    <div style={{ background: "#f7f8f5", minHeight: "100dvh", fontFamily: "'Plus Jakarta Sans','Noto Sans KR',sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{STYLES}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(247,248,245,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(89,202,2,0.1)", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <button onClick={() => setView("form")} style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", border: "none", background: "none", cursor: "pointer", color: "#475569" }}>
          <span className="msicon" style={{ fontSize: "24px" }}>arrow_back</span>
        </button>
        <h1 style={{ flex: 1, fontSize: "19px", fontWeight: "800", margin: 0, color: "#0f172a", letterSpacing: "-0.3px" }}>대본 생성기</h1>
        {!loading && !error && scriptBlocks.length > 0 && (
          <button onClick={reset} style={{ background: "none", border: "2px solid #e2e8f0", borderRadius: "10px", padding: "6px 14px", fontSize: "13px", color: "#64748b", cursor: "pointer", fontWeight: "700", fontFamily: "inherit" }}>처음으로</button>
        )}
      </header>

      {/* Progress bar — full */}
      <div style={{ width: "100%", height: "12px", background: "#e2e8f0", overflow: "hidden", maxWidth: "480px", margin: "0 auto", alignSelf: "stretch" }}>
        <div style={{ height: "100%", background: "#59ca02", width: loading ? "60%" : "100%", transition: "width 1s ease", borderRadius: "0 9999px 9999px 0" }} />
      </div>

      {/* Content */}
      <main style={{ flex: 1, padding: "20px 16px max(40px,env(safe-area-inset-bottom))", maxWidth: "480px", margin: "0 auto", width: "100%", boxSizing: "border-box", animation: "fadeUp .4s ease" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(89,202,2,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <span className="msicon" style={{ fontSize: "36px", color: "#59ca02", animation: "pulse 1.5s ease-in-out infinite" }}>edit_note</span>
            </div>
            <div style={{ fontWeight: "800", fontSize: "18px", color: "#0f172a", marginBottom: "8px" }}>대본을 만들고 있어요...</div>
            <div style={{ fontSize: "14px", color: "#64748b" }}>{sit?.label} 상황에 맞는 대본을 작성 중이에요</div>
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "24px" }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#59ca02", animation: `pulse 1s ease ${d}s infinite` }} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>😔</div>
            <div style={{ color: "#ef4444", fontWeight: "700", fontSize: "15px", marginBottom: "20px" }}>{error}</div>
            <button onClick={() => { setError(""); generateScript(); }} style={{ background: "#59ca02", color: "white", border: "none", borderRadius: "14px", padding: "14px 28px", fontWeight: "800", cursor: "pointer", fontFamily: "inherit", fontSize: "15px", boxShadow: "0 4px 0 #46a302" }}>다시 시도</button>
          </div>
        ) : (
          <>
            {/* Summary card */}
            <div style={{ background: "white", borderRadius: "16px", border: `2px solid ${accent}25`, padding: "16px 18px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "14px", boxShadow: `0 4px 0 0 ${accent}40` }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{sit?.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "800", fontSize: "15px", color: "#0f172a", marginBottom: "3px" }}>{sit?.label} 대본 완성!</div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>"{detail.length > 40 ? detail.slice(0, 40) + "..." : detail}"</div>
              </div>
              <span className="msicon msicon-fill" style={{ fontSize: "26px", color: "#59ca02" }}>check_circle</span>
            </div>

            {scriptBlocks.map((block, i) => (
              <ScriptBlock key={i} label={block.label} content={block.content} color={accent} />
            ))}

            {tips.length > 0 && (
              <div style={{ background: "white", borderRadius: "16px", border: "2px solid #fde68a", padding: "16px 18px", marginTop: "4px", boxShadow: "0 2px 0 0 #fbbf24" }}>
                <div style={{ fontWeight: "800", fontSize: "14px", color: "#d97706", marginBottom: "12px" }}>🌿 통화 전 마음 안정 팁</div>
                {tips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <span style={{ background: "#fef3c7", color: "#d97706", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: "13px", color: "#374151", lineHeight: "1.6" }}>{tip}</span>
                  </div>
                ))}
              </div>
            )}

            <button onClick={reset} style={{
              width: "100%", marginTop: "16px", padding: "16px", background: "white",
              border: "2px solid #e2e8f0", borderRadius: "14px", fontWeight: "800",
              fontSize: "15px", color: "#64748b", cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 0 0 #e2e8f0", transition: "all .15s",
            }}>+ 새 대본 만들기</button>
          </>
        )}
      </main>
    </div>
  );
}
