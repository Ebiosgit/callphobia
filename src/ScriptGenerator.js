import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "daily", label: "일상" },
  { id: "work", label: "업무" },
  { id: "official", label: "공공" },
  { id: "complaint", label: "항의/문의" },
];

const SITUATIONS = [
  // 일상
  {
    id: "hospital",
    label: "🏥 병원/약국 예약",
    icon: "🏥",
    color: "#4ECDC4",
    category: "daily",
    examples: ["진료 예약", "예약 취소/변경", "처방전 문의", "검사 결과 문의"],
    placeholder: "예: 내과 초진 예약, 목요일 오후 원하고 진료 기록은 없어요",
  },
  {
    id: "restaurant",
    label: "🍽️ 식당 예약",
    icon: "🍽️",
    color: "#F97316",
    category: "daily",
    examples: ["좌석 예약", "예약 취소", "단체 예약", "메뉴 사전 문의"],
    placeholder: "예: 토요일 저녁 7시 4명 예약, 창가 자리 요청",
  },
  {
    id: "delivery",
    label: "📦 택배/배송 문의",
    icon: "📦",
    color: "#3B82F6",
    category: "daily",
    examples: ["배송 지연 문의", "위치 확인", "반품/교환", "수령 일정 변경"],
    placeholder: "예: 3일째 배송 조회가 멈춰있어서 현황 확인하고 싶어요",
  },
  {
    id: "beauty",
    label: "💇 미용실/네일샵",
    icon: "💇",
    color: "#EC4899",
    category: "daily",
    examples: ["예약 문의", "가격 문의", "디자이너 지정", "예약 변경"],
    placeholder: "예: 다음 주 토요일 오후 커트+염색 예약, 특정 디자이너 원해요",
  },
  {
    id: "accommodation",
    label: "🏨 숙소/호텔 예약",
    icon: "🏨",
    color: "#8B5CF6",
    category: "daily",
    examples: ["객실 예약", "얼리체크인 요청", "편의시설 문의", "예약 취소"],
    placeholder: "예: 주말 1박 예약, 조식 포함 여부와 주차 가능한지 문의",
  },
  // 업무
  {
    id: "work",
    label: "💼 회사 업무 전화",
    icon: "💼",
    color: "#F59E0B",
    category: "work",
    examples: ["거래처 연락", "미팅 일정 조율", "견적 문의", "담당자 부재 시"],
    placeholder: "예: 처음 거래하는 업체에 제품 견적 요청 전화",
  },
  {
    id: "job",
    label: "🧑‍💼 채용/취업 문의",
    icon: "🧑‍💼",
    color: "#10B981",
    category: "work",
    examples: ["채용 공고 문의", "지원 결과 확인", "면접 일정 조율", "합격 후 처우 문의"],
    placeholder: "예: 지원한 회사에 서류 심사 결과 확인 전화",
  },
  {
    id: "freelance",
    label: "🤝 외주/계약 문의",
    icon: "🤝",
    color: "#6366F1",
    category: "work",
    examples: ["견적 요청", "계약 조건 협의", "작업 범위 확인", "납기 조율"],
    placeholder: "예: 웹사이트 제작 외주 견적 문의, 예산과 기간 논의",
  },
  // 공공
  {
    id: "government",
    label: "🏛️ 관공서 민원",
    icon: "🏛️",
    color: "#A78BFA",
    category: "official",
    examples: ["서류 발급 문의", "민원 접수", "처리 현황 확인", "담당자 연결"],
    placeholder: "예: 주민센터에 전입신고 관련 필요서류 문의",
  },
  {
    id: "bank",
    label: "🏦 은행/금융 문의",
    icon: "🏦",
    color: "#0EA5E9",
    category: "official",
    examples: ["계좌 개설 문의", "대출 상담", "카드 분실 신고", "이체 오류"],
    placeholder: "예: 적금 만기 해지 방법과 필요 서류 문의",
  },
  {
    id: "insurance",
    label: "🛡️ 보험 문의",
    icon: "🛡️",
    color: "#14B8A6",
    category: "official",
    examples: ["보험금 청구", "보장 내용 확인", "계약 변경", "해지 문의"],
    placeholder: "예: 치과 치료 후 실손보험 청구 방법과 필요서류 문의",
  },
  // 항의/문의
  {
    id: "refund",
    label: "💸 환불/교환 요청",
    icon: "💸",
    color: "#EF4444",
    category: "complaint",
    examples: ["불량품 환불", "서비스 불만", "오배송 교환", "취소 환불"],
    placeholder: "예: 받은 제품에 흠집이 있어서 환불 요청, 영수증 있음",
  },
  {
    id: "complaint",
    label: "😤 불편사항 신고",
    icon: "😤",
    color: "#DC2626",
    category: "complaint",
    examples: ["소음 민원", "서비스 불만 신고", "안전 신고", "시설 불편 신고"],
    placeholder: "예: 위층 층간소음이 반복되어 관리사무소에 공식 민원 접수",
  },
  {
    id: "utility",
    label: "🔧 AS/수리 접수",
    icon: "🔧",
    color: "#78716C",
    category: "complaint",
    examples: ["가전 AS 신청", "인터넷 장애", "수도/전기 고장", "방문 일정 조율"],
    placeholder: "예: 에어컨 작동 불량으로 제조사 AS 접수, 방문 수리 요청",
  },
];

const PhoneRing = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
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

function NegativeBlock({ label, content, color }) {
  const [copied, setCopied] = useState(false);
  const [openIdx, setOpenIdx] = useState(0);
  const scenarios = parseNegativeScenarios(content);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: "white", borderRadius: "16px",
      border: "1.5px solid #FCA5A530", overflow: "hidden",
      marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 16px",
        background: "linear-gradient(135deg, #FEF2F2, #FFF7ED)",
        borderBottom: "1px solid #FCA5A525"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#DC2626", letterSpacing: "0.5px" }}>{label}</span>
          <span style={{ fontSize: "10px", background: "#FEE2E2", color: "#DC2626", borderRadius: "6px", padding: "1px 6px", fontWeight: "600" }}>
            {scenarios.length > 0 ? `${scenarios.length}가지 상황` : ""}
          </span>
        </div>
        <button onClick={handleCopy} style={{
          display: "flex", alignItems: "center", gap: "4px",
          background: copied ? "#DC2626" : "white", color: copied ? "white" : "#DC2626",
          border: "1px solid #DC2626", borderRadius: "8px", padding: "4px 10px",
          fontSize: "11px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease"
        }}>
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "복사됨" : "복사"}
        </button>
      </div>

      {scenarios.length > 0 ? (
        <div style={{ padding: "12px" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => setOpenIdx(i)} style={{
                flex: 1, padding: "6px 4px", borderRadius: "10px", fontSize: "12px",
                fontWeight: openIdx === i ? "700" : "500",
                border: `1.5px solid ${openIdx === i ? "#DC2626" : "#E5E7EB"}`,
                background: openIdx === i ? "#FEF2F2" : "white",
                color: openIdx === i ? "#DC2626" : "#9CA3AF",
                cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit"
              }}>상황 {i + 1}</button>
            ))}
          </div>

          {scenarios[openIdx] && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{
                background: "#FEF2F2", borderRadius: "12px 12px 12px 4px",
                padding: "12px 14px", borderLeft: "3px solid #EF4444"
              }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#EF4444", marginBottom: "4px", letterSpacing: "0.5px" }}>
                  🗣 상대방 말
                </div>
                <div style={{ fontSize: "13px", color: "#7F1D1D", lineHeight: "1.6", fontStyle: "italic" }}>
                  "{scenarios[openIdx].situation}"
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{
                  background: "#F0FDF4", borderRadius: "12px 12px 4px 12px",
                  padding: "12px 14px", borderRight: "3px solid #22C55E",
                  maxWidth: "90%"
                }}>
                  <div style={{ fontSize: "10px", fontWeight: "700", color: "#16A34A", marginBottom: "4px", letterSpacing: "0.5px" }}>
                    💬 나의 대응
                  </div>
                  <div style={{ fontSize: "13px", color: "#14532D", lineHeight: "1.6" }}>
                    {scenarios[openIdx].response}
                  </div>
                </div>
              </div>

              {scenarios[openIdx].tip && (
                <div style={{
                  background: "#FFFBEB", borderRadius: "10px",
                  padding: "10px 12px", display: "flex", gap: "8px", alignItems: "flex-start"
                }}>
                  <span style={{ fontSize: "14px" }}>💡</span>
                  <span style={{ fontSize: "12px", color: "#92400E", lineHeight: "1.5", fontWeight: "500" }}>
                    {scenarios[openIdx].tip}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{
          padding: "14px 16px", fontSize: "14px", lineHeight: "1.8",
          color: "#374151", whiteSpace: "pre-wrap", fontFamily: "'Noto Sans KR', sans-serif"
        }}>{content}</div>
      )}
    </div>
  );
}

function ScriptBlock({ label, content, color }) {
  const [copied, setCopied] = useState(false);

  const isNegative = label.includes("거절") || label.includes("부정");
  if (isNegative) return <NegativeBlock label={label} content={content} color={color} />;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      border: `1.5px solid ${color}30`,
      overflow: "hidden",
      marginBottom: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 16px",
        background: `${color}12`,
        borderBottom: `1px solid ${color}20`
      }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color, letterSpacing: "0.5px" }}>
          {label}
        </span>
        <button
          onClick={handleCopy}
          style={{
            display: "flex", alignItems: "center", gap: "4px",
            background: copied ? color : "white",
            color: copied ? "white" : color,
            border: `1px solid ${color}`,
            borderRadius: "8px", padding: "4px 10px",
            fontSize: "11px", fontWeight: "600", cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
      <div style={{
        padding: "14px 16px",
        fontSize: "14px", lineHeight: "1.8",
        color: "#374151", whiteSpace: "pre-wrap",
        fontFamily: "'Noto Sans KR', sans-serif"
      }}>
        {content}
      </div>
    </div>
  );
}

function parseScript(text) {
  const blocks = [];
  const lines = text.split("\n");
  let currentLabel = null;
  let currentContent = [];

  for (const line of lines) {
    const match = line.match(/^(?:#{1,3}\s*)?【(.+?)】\s*$/) || line.match(/^(?:#{1,3}\s*)?\[(.+?)\]\s*$/);
    if (match) {
      if (currentLabel) blocks.push({ label: currentLabel, content: currentContent.join("\n").trim() });
      currentLabel = match[1];
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentLabel) blocks.push({ label: currentLabel, content: currentContent.join("\n").trim() });
  if (blocks.length === 0) blocks.push({ label: "통화 대본", content: text.trim() });
  return blocks;
}

export default function ScriptGenerator({ onBack }) {
  const [step, setStep] = useState(1);
  const [selectedSit, setSelectedSit] = useState(null);
  const [detail, setDetail] = useState("");
  const [tone, setTone] = useState("보통");
  const [loading, setLoading] = useState(false);
  const [scriptBlocks, setScriptBlocks] = useState([]);
  const [error, setError] = useState("");
  const [tips, setTips] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [customLabel, setCustomLabel] = useState("");

  useEffect(() => {
    setMounted(true);
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const CUSTOM_SIT = { id: "custom", icon: "✏️", color: "#6366F1", label: `✏️ ${customLabel || "직접 입력"}`, placeholder: "예: 이웃에게 주차 양보 부탁, 처음 통화라 어색해요" };
  const sit = selectedSit === "custom" ? CUSTOM_SIT : SITUATIONS.find(s => s.id === selectedSit);

  const generateScript = async () => {
    if (!detail.trim()) return;
    setLoading(true);
    setError("");
    setStep(3);

    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: selectedSit,
          customLabel,
          detail,
          tone,
        }),
      });

      if (!res.ok) throw new Error("서버 오류");

      const data = await res.json();
      setScriptBlocks(parseScript(data.scriptText));
      setTips(data.tips || []);
    } catch (e) {
      setError("대본 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1); setSelectedSit(null); setDetail("");
    setTone("보통"); setScriptBlocks([]); setTips([]); setError(""); setActiveCategory("all"); setCustomLabel("");
  };

  const accent = sit?.color || "#4ECDC4";

  return (
    <div style={{
      fontFamily: "'Noto Sans KR', -apple-system, sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(145deg, #F0F9F8 0%, #F5F0FF 50%, #FFF9F0 100%)",
      padding: "0 0 max(60px, env(safe-area-inset-bottom))",
      opacity: mounted ? 1 : 0,
      transition: "opacity 0.5s ease"
    }}>
      {/* Header */}
      <div style={{
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "16px 20px",
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "12px",
            background: "linear-gradient(135deg, #4ECDC4, #A78BFA)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "white"
          }}>
            <PhoneRing />
          </div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "16px", color: "#1F2937", letterSpacing: "-0.3px" }}>
              콜스크립트
            </div>
            <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>
              전화 대본 생성기
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {step > 1 && (
            <button onClick={reset} style={{
              background: "none", border: "1.5px solid #E5E7EB", borderRadius: "10px",
              padding: "6px 14px", fontSize: "13px", color: "#6B7280",
              cursor: "pointer", fontWeight: "600"
            }}>처음으로</button>
          )}
          <button onClick={onBack} style={{
            background: "none", border: "1.5px solid #E5E7EB", borderRadius: "10px",
            padding: "6px 14px", fontSize: "13px", color: "#6B7280",
            cursor: "pointer", fontWeight: "600"
          }}>← 홈</button>
        </div>
      </div>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>

        {/* STEP 1: Choose situation */}
        {step === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <style>{`
              @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
            `}</style>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "42px", marginBottom: "12px" }}>📞</div>
              <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#1F2937", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
                어떤 전화를 하실 건가요?
              </h1>
              <p style={{ fontSize: "14px", color: "#9CA3AF", margin: 0 }}>
                상황을 선택하면 맞춤 대본을 만들어드려요
              </p>
            </div>

            {/* Category filter */}
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px", marginBottom: "16px", scrollbarWidth: "none" }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: "7px 14px", borderRadius: "20px", whiteSpace: "nowrap",
                    border: `1.5px solid ${activeCategory === cat.id ? "#4ECDC4" : "#E5E7EB"}`,
                    background: activeCategory === cat.id ? "#4ECDC4" : "white",
                    color: activeCategory === cat.id ? "white" : "#6B7280",
                    fontWeight: "600", fontSize: "13px", cursor: "pointer",
                    transition: "all 0.15s", fontFamily: "inherit"
                  }}
                >{cat.label}</button>
              ))}
            </div>

            {/* Situation grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {SITUATIONS.filter(s => activeCategory === "all" || s.category === activeCategory).map(s => (
                <button key={s.id} onClick={() => { setSelectedSit(s.id); setStep(2); }}
                  style={{
                    background: "white", border: `2px solid ${s.color}25`,
                    borderRadius: "18px", padding: "16px 14px",
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = s.color;
                    e.currentTarget.style.boxShadow = `0 6px 20px ${s.color}30`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = `${s.color}25`;
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "14px",
                    background: `${s.color}15`, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "22px", marginBottom: "10px"
                  }}>{s.icon}</div>
                  <div style={{ fontWeight: "700", fontSize: "13px", color: "#1F2937", marginBottom: "6px", lineHeight: "1.3" }}>
                    {s.label.split(" ").slice(1).join(" ")}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                    {s.examples.slice(0, 2).map(ex => (
                      <span key={ex} style={{
                        fontSize: "10px", padding: "2px 6px",
                        background: `${s.color}12`, color: s.color,
                        borderRadius: "5px", fontWeight: "600"
                      }}>{ex}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom input card */}
            <button onClick={() => { setSelectedSit("custom"); setStep(2); }}
              style={{
                width: "100%", marginTop: "10px",
                background: "white", border: "2px dashed #C7D2FE",
                borderRadius: "18px", padding: "16px 18px",
                cursor: "pointer", textAlign: "left",
                transition: "all 0.2s ease",
                display: "flex", alignItems: "center", gap: "14px"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#6366F1";
                e.currentTarget.style.background = "#EEF2FF";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#C7D2FE";
                e.currentTarget.style.background = "white";
              }}
            >
              <div style={{
                width: "44px", height: "44px", borderRadius: "14px",
                background: "#EEF2FF", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "22px", flexShrink: 0
              }}>✏️</div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "#4338CA", marginBottom: "2px" }}>
                  직접 상황 입력하기
                </div>
                <div style={{ fontSize: "12px", color: "#818CF8" }}>
                  목록에 없는 상황도 대본을 만들 수 있어요
                </div>
              </div>
              <div style={{ marginLeft: "auto", color: "#6366F1", fontSize: "20px" }}>›</div>
            </button>
          </div>
        )}

        {/* STEP 2: Fill details */}
        {step === 2 && sit && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{
              background: `${accent}12`, borderRadius: "16px",
              padding: "16px", marginBottom: "20px",
              display: "flex", alignItems: "center", gap: "10px"
            }}>
              <span style={{ fontSize: "24px" }}>{sit.icon}</span>
              <span style={{ fontWeight: "700", color: accent, fontSize: "15px" }}>
                {selectedSit === "custom" ? "직접 상황 입력" : sit.label}
              </span>
            </div>

            {/* Custom: situation name input */}
            {selectedSit === "custom" && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "700", fontSize: "14px", color: "#374151", marginBottom: "8px" }}>
                  어떤 종류의 전화인가요? *
                </label>
                <input
                  type="text"
                  value={customLabel}
                  onChange={e => setCustomLabel(e.target.value)}
                  placeholder="예: 이웃집에 소음 양해 요청, 헬스장 환불 요청, 집주인께 누수 신고..."
                  maxLength={40}
                  style={{
                    width: "100%", padding: "13px 14px",
                    border: `2px solid ${customLabel ? "#6366F1" : "#E5E7EB"}`,
                    borderRadius: "14px", fontSize: "14px", lineHeight: "1.5",
                    outline: "none", transition: "border-color 0.2s",
                    fontFamily: "inherit", boxSizing: "border-box", color: "#374151"
                  }}
                />
                <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "5px", textAlign: "right" }}>
                  {customLabel.length}/40
                </div>
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: "700", fontSize: "14px", color: "#374151", marginBottom: "8px" }}>
                {selectedSit === "custom" ? "구체적인 상황을 알려주세요 *" : "어떤 내용으로 전화하실 건가요? *"}
              </label>
              <textarea
                value={detail}
                onChange={e => setDetail(e.target.value)}
                placeholder={selectedSit === "custom"
                  ? "예: 윗집에서 매일 밤 11시 이후에 쿵쿵 소리가 나는데, 공손하게 양해를 구하고 싶어요"
                  : sit.placeholder}
                rows={4}
                style={{
                  width: "100%", padding: "14px", border: `2px solid ${detail ? accent : "#E5E7EB"}`,
                  borderRadius: "14px", fontSize: "14px", lineHeight: "1.6",
                  resize: "none", outline: "none", transition: "border-color 0.2s",
                  fontFamily: "inherit", boxSizing: "border-box", color: "#374151"
                }}
              />
              <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "6px" }}>
                💡 구체적일수록 더 정확한 대본이 나와요
              </div>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontWeight: "700", fontSize: "14px", color: "#374151", marginBottom: "10px" }}>
                말투 스타일
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["정중한", "보통", "친근한"].map(t => (
                  <button key={t} onClick={() => setTone(t)}
                    style={{
                      flex: 1, padding: "10px", borderRadius: "12px",
                      border: `2px solid ${tone === t ? accent : "#E5E7EB"}`,
                      background: tone === t ? `${accent}12` : "white",
                      color: tone === t ? accent : "#6B7280",
                      fontWeight: tone === t ? "700" : "500",
                      fontSize: "14px", cursor: "pointer", transition: "all 0.15s"
                    }}>{t}</button>
                ))}
              </div>
            </div>

            <button
              onClick={generateScript}
              disabled={!detail.trim() || (selectedSit === "custom" && !customLabel.trim())}
              style={{
                width: "100%", padding: "16px",
                background: (detail.trim() && (selectedSit !== 'custom' || customLabel.trim())) ? `linear-gradient(135deg, ${accent}, ${accent}CC)` : "#E5E7EB",
                color: (detail.trim() && (selectedSit !== "custom" || customLabel.trim())) ? "white" : "#9CA3AF",
                border: "none", borderRadius: "16px", fontSize: "16px",
                fontWeight: "700", cursor: (detail.trim() && (selectedSit !== "custom" || customLabel.trim())) ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: detail.trim() ? `0 6px 20px ${accent}40` : "none",
                transition: "all 0.2s", fontFamily: "inherit"
              }}
            >
              <SparkleIcon />
              대본 생성하기
            </button>
          </div>
        )}

        {/* STEP 3: Result */}
        {step === 3 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px", animation: "pulse 1.5s infinite" }}>✍️</div>
                <div style={{ fontWeight: "700", fontSize: "16px", color: "#374151", marginBottom: "8px" }}>
                  대본을 만들고 있어요...
                </div>
                <div style={{ fontSize: "13px", color: "#9CA3AF" }}>
                  {sit?.label} 상황에 맞는 대본을 작성 중이에요
                </div>
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>😔</div>
                <div style={{ color: "#EF4444", fontWeight: "600", marginBottom: "16px" }}>{error}</div>
                <button onClick={() => { setStep(2); setError(""); }} style={{
                  background: accent, color: "white", border: "none",
                  borderRadius: "12px", padding: "12px 24px", fontWeight: "700", cursor: "pointer"
                }}>다시 시도</button>
              </div>
            ) : (
              <>
                <div style={{
                  background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
                  borderRadius: "20px", padding: "18px", marginBottom: "20px",
                  border: `1.5px solid ${accent}25`
                }}>
                  <div style={{ fontWeight: "700", fontSize: "15px", color: accent, marginBottom: "4px" }}>
                    {sit?.icon} {sit?.label.split(" ").slice(1).join(" ")} 대본 완성!
                  </div>
                  <div style={{ fontSize: "13px", color: "#6B7280" }}>
                    "{detail.length > 40 ? detail.slice(0, 40) + "..." : detail}"
                  </div>
                </div>

                {scriptBlocks.map((block, i) => (
                  <ScriptBlock key={i} label={block.label} content={block.content} color={accent} />
                ))}

                {tips.length > 0 && (
                  <div style={{
                    background: "white", borderRadius: "16px",
                    border: "1.5px solid #FDE68A", padding: "16px", marginTop: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                  }}>
                    <div style={{ fontWeight: "700", fontSize: "13px", color: "#D97706", marginBottom: "12px" }}>
                      🌿 통화 전 마음 안정 팁
                    </div>
                    {tips.map((tip, i) => (
                      <div key={i} style={{
                        display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start"
                      }}>
                        <span style={{
                          background: "#FEF3C7", color: "#D97706",
                          borderRadius: "50%", width: "22px", height: "22px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: "700", flexShrink: 0, marginTop: "1px"
                        }}>{i + 1}</span>
                        <span style={{ fontSize: "13px", color: "#374151", lineHeight: "1.6" }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={reset} style={{
                  width: "100%", marginTop: "20px", padding: "14px",
                  background: "white", border: "2px solid #E5E7EB",
                  borderRadius: "14px", fontWeight: "700", fontSize: "14px",
                  color: "#6B7280", cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#6B7280"; }}
                >
                  + 새 대본 만들기
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
