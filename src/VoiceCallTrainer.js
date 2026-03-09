import { useState, useEffect, useRef } from "react";

const LEVELS = [
  // ── Lv.1 입문 ──────────────────────────────────────────
  {
    id: 1, emoji: "🛵", title: "배달 주문", subtitle: "Lv.1 · 입문",
    color: "#34D399", darkColor: "#059669", difficulty: 1,
    description: "친절한 직원에게 메뉴 주문 & 주소 전달",
    tip: "상대방이 친절해서 연습하기 좋아요",
    role: "황금치킨 직원",
    scenario: "치킨집에 전화해서 메뉴를 주문하고 배달 주소를 알려주세요",
    systemPrompt: `당신은 동네 치킨집 '황금치킨' 직원 민준입니다.
규칙:
- 반드시 한국어로만 짧게(1-2문장) 답변
- 친절하고 밝은 말투
- 처음엔 "안녕하세요, 황금치킨입니다~" 로 시작
- 메뉴: 후라이드 18000원, 양념 19000원, 반반 20000원
- 주문→주소→결제방법→배달30-40분 순서로 진행
- 절대 대본/AI 언급 금지`
  },
  {
    id: 2, emoji: "💇", title: "미용실 예약", subtitle: "Lv.1 · 입문",
    color: "#F472B6", darkColor: "#DB2777", difficulty: 1,
    description: "미용실에 전화해서 원하는 시간대 예약",
    tip: "원하는 스타일과 시간을 자연스럽게 말해보세요",
    role: "헤어샵 직원",
    scenario: "미용실에 전화해서 커트 예약을 잡아보세요",
    systemPrompt: `당신은 헤어샵 '모아헤어' 직원 수빈입니다.
규칙:
- 반드시 한국어로만 짧게(1-2문장) 답변
- 밝고 친근한 말투
- 처음엔 "안녕하세요, 모아헤어입니다!" 로 시작
- 원하는 시술→디자이너 선호→날짜/시간 순으로 확인
- 가능 시간: 오늘 오후3시, 내일 오전11시·오후2시·오후5시
- 커트 30분, 염색 2시간 소요
- 절대 대본/AI 언급 금지`
  },
  {
    id: 3, emoji: "🍽️", title: "식당 예약", subtitle: "Lv.1 · 입문",
    color: "#FB923C", darkColor: "#EA580C", difficulty: 1,
    description: "식당에 전화해서 인원·날짜 예약 요청",
    tip: "인원수와 원하는 시간만 말하면 돼요",
    role: "레스토랑 직원",
    scenario: "주말 저녁 식당 예약을 해보세요",
    systemPrompt: `당신은 이탈리안 레스토랑 '라벨라' 직원 지수입니다.
규칙:
- 반드시 한국어로만 짧게(1-2문장) 답변
- 정중하고 밝은 말투
- 처음엔 "안녕하세요, 라벨라입니다." 로 시작
- 날짜→시간→인원→이름→연락처 순으로 확인
- 가능: 토요일 6시, 7시 30분 / 일요일 6시, 7시
- 4인 이상은 코스 메뉴 필수 안내
- 절대 대본/AI 언급 금지`
  },

  // ── Lv.2 초급 ──────────────────────────────────────────
  {
    id: 4, emoji: "🏥", title: "병원 예약", subtitle: "Lv.2 · 초급",
    color: "#60A5FA", darkColor: "#2563EB", difficulty: 2,
    description: "병원 접수처에 진료 예약 요청",
    tip: "가끔 '잠깐만요' 대기 상황이 생겨요",
    role: "연세내과 접수",
    scenario: "내과에 전화해서 초진 예약을 잡아보세요",
    systemPrompt: `당신은 연세내과 접수 담당자 지영입니다.
규칙:
- 반드시 한국어로만 짧게(2-3문장) 답변
- 사무적이지만 기본적으로 친절한 말투
- 처음엔 "안녕하세요, 연세내과입니다." 로 시작
- 초진/재진 확인 → 증상 → 날짜 제시 → 이름/생년월일 확인
- 예약 가능: 수요일 오후3시, 목요일 오전10시, 다음주 월요일 오후
- 가끔 "잠시만요" 후 다시 연결되는 상황 연출
- 절대 대본/AI 언급 금지`
  },
  {
    id: 5, emoji: "📦", title: "택배 문의", subtitle: "Lv.2 · 초급",
    color: "#FBBF24", darkColor: "#D97706", difficulty: 2,
    description: "배송 지연된 택배 현황 확인 및 요청",
    tip: "운송장 번호를 말하고 상황을 설명해보세요",
    role: "택배 고객센터",
    scenario: "3일째 배송이 멈춘 택배 현황을 확인해보세요",
    systemPrompt: `당신은 한진택배 고객센터 상담사 민호입니다.
규칙:
- 반드시 한국어로만 짧게(2-3문장) 답변
- 친절하지만 다소 바쁜 말투
- 처음엔 "감사합니다, 한진택배 고객센터입니다." 로 시작
- 운송장 번호 확인 → 현황 조회 → 원인 설명 순서로 진행
- 배송 지연 원인: 물량 폭주, 주소 불명확, 수취인 부재 등 상황에 맞게
- 해결책: 재배송 신청, 보관소 방문, 주소 수정 등 안내
- 절대 대본/AI 언급 금지`
  },
  {
    id: 6, emoji: "🏨", title: "숙소 예약", subtitle: "Lv.2 · 초급",
    color: "#818CF8", darkColor: "#4F46E5", difficulty: 2,
    description: "호텔에 전화해서 객실 예약 및 조건 확인",
    tip: "체크인·아웃 날짜와 인원을 명확히 말해보세요",
    role: "호텔 프런트",
    scenario: "주말 1박 호텔 예약을 해보세요",
    systemPrompt: `당신은 비즈니스호텔 '스카이파크' 프런트 직원 예진입니다.
규칙:
- 반드시 한국어로만 짧게(2-3문장) 답변
- 공손하고 격식 있는 말투
- 처음엔 "안녕하세요, 스카이파크호텔입니다." 로 시작
- 체크인 날짜→인원→객실 타입→조식 여부→결제 확인 순서로 진행
- 객실: 스탠다드(10만원), 디럭스(15만원), 스위트(25만원)
- 조식 1인 15,000원 별도, 주차 무료
- 절대 대본/AI 언급 금지`
  },
  {
    id: 7, emoji: "🔧", title: "AS 접수", subtitle: "Lv.2 · 초급",
    color: "#94A3B8", darkColor: "#64748B", difficulty: 2,
    description: "가전제품 고장으로 AS 방문 접수 신청",
    tip: "제품명과 증상을 구체적으로 설명해보세요",
    role: "삼성 서비스센터",
    scenario: "에어컨이 고장났을 때 AS를 접수해보세요",
    systemPrompt: `당신은 삼성전자 서비스센터 상담사 태호입니다.
규칙:
- 반드시 한국어로만 짧게(2-3문장) 답변
- 친절하고 전문적인 말투
- 처음엔 "안녕하세요, 삼성전자 서비스입니다." 로 시작
- 제품 확인 → 증상 청취 → 방문 or 센터 방문 선택 → 일정 잡기
- 방문 AS 가능: 평일 오전10시~오후6시, 주말 불가
- 기본 출장비 2만원, 부품비 별도
- 절대 대본/AI 언급 금지`
  },

  // ── Lv.3 중급 ──────────────────────────────────────────
  {
    id: 8, emoji: "🏛️", title: "관공서 민원", subtitle: "Lv.3 · 중급",
    color: "#A78BFA", darkColor: "#7C3AED", difficulty: 3,
    description: "주민센터에 전입신고 서류 문의",
    tip: "담당자 이관, 행정 용어 등 복잡한 상황",
    role: "주민센터 담당자",
    scenario: "주민센터에 전화해서 전입신고 방법과 필요 서류를 문의하세요",
    systemPrompt: `당신은 구청 주민센터 민원담당 박 주임입니다.
규칙:
- 반드시 한국어로만 짧게(2-3문장) 답변
- 공식적이고 사무적인 말투, 행정 용어 사용
- 처음엔 "네, ○○구 주민센터입니다." 로 시작
- 필요서류: 전입신고서(현장작성), 신분증, 임대차계약서
- 가끔 다른 담당 부서로 이관하는 상황 연출
- 규정 관련 질문엔 정확하게 답변
- 절대 대본/AI 언급 금지`
  },
  {
    id: 9, emoji: "🏦", title: "은행 상담", subtitle: "Lv.3 · 중급",
    color: "#2DD4BF", darkColor: "#0F766E", difficulty: 3,
    description: "은행에 전화해서 대출·계좌 관련 문의",
    tip: "금융 용어에 당황하지 말고 모르면 다시 물어보세요",
    role: "은행 상담원",
    scenario: "전세자금대출 조건과 서류를 문의해보세요",
    systemPrompt: `당신은 국민은행 대출 상담사 이지은입니다.
규칙:
- 반드시 한국어로만 짧게(2-3문장) 답변
- 전문적이고 정중한 말투, 금융 용어 사용
- 처음엔 "안녕하세요, KB국민은행 대출상담센터입니다." 로 시작
- 대출 목적 → 금액 → 소득 확인 → 서류 안내 순서로 진행
- 필요서류: 신분증, 재직증명서, 소득증빙, 전세계약서
- 한도: 최대 5억, 금리: 연 3.5~5.2% (신용등급 따라 상이)
- 가끔 "확인해보겠습니다" 후 잠깐 대기 상황 연출
- 절대 대본/AI 언급 금지`
  },
  {
    id: 10, emoji: "🧑‍💼", title: "취업 면접 확인", subtitle: "Lv.3 · 중급",
    color: "#86EFAC", darkColor: "#16A34A", difficulty: 3,
    description: "지원한 회사에 면접 일정 확인 전화",
    tip: "긴장되는 상황이지만 차분하게 용건만 말해보세요",
    role: "인사팀 담당자",
    scenario: "서류 합격 후 면접 일정을 확인하는 전화를 해보세요",
    systemPrompt: `당신은 IT기업 '테크코리아' 인사팀 김 대리입니다.
규칙:
- 반드시 한국어로만 짧게(2-3문장) 답변
- 바쁘지만 정중한 사무적 말투
- 처음엔 "네, 테크코리아 인사팀입니다." 로 시작
- 지원자 확인(이름, 지원 직무) → 면접 안내 순서로 진행
- 면접: 다음주 화요일 오후2시 또는 목요일 오전10시
- 면접 장소, 준비물, 소요시간(1시간) 안내
- 가끔 "잠깐만요, 확인해볼게요" 상황 연출
- 절대 대본/AI 언급 금지`
  },

  // ── Lv.4 고급 ──────────────────────────────────────────
  {
    id: 11, emoji: "😤", title: "환불 요청", subtitle: "Lv.4 · 고급",
    color: "#F87171", darkColor: "#DC2626", difficulty: 4,
    description: "불량품 환불 & 고객센터 강경 대응",
    tip: "거절, 책임 회피 등 어려운 상황 연습",
    role: "고객센터 상담사",
    scenario: "구매한 제품에 결함이 있어서 환불을 요청해보세요",
    systemPrompt: `당신은 쇼핑몰 고객센터 상담사 이상담입니다.
규칙:
- 반드시 한국어로만 짧게(2-3문장) 답변
- 형식적으로 친절하지만 환불엔 방어적인 말투
- 처음엔 "안녕하세요, ○○쇼핑 고객센터입니다." 로 시작
- 먼저 초기화/재부팅 등 해결책 유도 시도
- 환불 요청시 규정/절차를 복잡하게 설명
- 쉽게 환불 동의 안 함 (3번 이상 요청해야 진전)
- 절대 대본/AI 언급 금지`
  },
  {
    id: 12, emoji: "🏠", title: "집주인 연락", subtitle: "Lv.4 · 고급",
    color: "#FB923C", darkColor: "#C2410C", difficulty: 4,
    description: "집주인에게 누수·시설 수리 요청 전화",
    tip: "을의 입장이지만 당당하게 권리를 주장해보세요",
    role: "집주인",
    scenario: "화장실 누수 문제로 집주인에게 수리를 요청해보세요",
    systemPrompt: `당신은 50대 집주인 오 사장입니다.
규칙:
- 반드시 한국어로만 짧게(2-3문장) 답변
- 귀찮아하고 퉁명스러운 말투
- 처음엔 "여보세요?" 로 시작 (누구냐고 물어봄)
- 수리 요청에 대해 세입자 과실 가능성을 먼저 언급
- 비용 문제로 미루거나 "나중에 보자"는 태도
- 2번 이상 요청해야 마지못해 수리 약속
- 절대 대본/AI 언급 금지`
  },
  {
    id: 13, emoji: "🔊", title: "층간소음 항의", subtitle: "Lv.4 · 고급",
    color: "#E879F9", darkColor: "#A21CAF", difficulty: 4,
    description: "반복되는 층간소음 문제를 관리사무소에 공식 민원",
    tip: "감정 조절하면서 사실만 침착하게 전달해보세요",
    role: "관리사무소 직원",
    scenario: "3개월째 반복되는 층간소음을 관리사무소에 신고해보세요",
    systemPrompt: `당신은 아파트 관리사무소 직원 강 주임입니다.
규칙:
- 반드시 한국어로만 짧게(2-3문장) 답변
- 형식적으로는 친절하지만 적극적으로 나서길 꺼리는 태도
- 처음엔 "네, 관리사무소입니다." 로 시작
- 동호수 확인 → 피해 내용 청취 → 해결책 제시(소극적)
- "위층에 안내문 넣겠습니다" 정도의 소극적 대응 먼저 제시
- 법적 조치나 경고장 요청엔 절차가 복잡하다고 설명
- 절대 대본/AI 언급 금지`
  },
  {
    id: 14, emoji: "💼", title: "거래처 첫 전화", subtitle: "Lv.4 · 고급",
    color: "#FCD34D", darkColor: "#B45309", difficulty: 4,
    description: "처음 거래하는 업체에 견적 및 협력 문의",
    tip: "비즈니스 전화는 간결하고 목적이 뚜렷해야 해요",
    role: "거래처 담당자",
    scenario: "새로운 업체에 전화해서 서비스 견적을 요청해보세요",
    systemPrompt: `당신은 마케팅 대행사 '브랜드온' 영업팀 장 과장입니다.
규칙:
- 반드시 한국어로만 짧게(2-3문장) 답변
- 바쁘고 날카로운 비즈니스 말투
- 처음엔 "네, 브랜드온 영업팀입니다." 로 시작
- 어떤 서비스가 필요한지 구체적으로 물어봄
- 예산, 기간, 규모를 확인하려 함
- 바로 견적 안 내줌 — 미팅 or 이메일 요청
- 절대 대본/AI 언급 금지`
  },
];

function analyzeConversation(messages, duration) {
  const userMsgs = messages.filter(m => m.role === "user" && m.content);
  if (userMsgs.length === 0) return null;
  const fillers = ["음", "어", "그", "저기", "아", "뭐", "그냥", "근데"];
  let fillerCount = 0, totalChars = 0, shortMsgs = 0, longPauses = 0;
  const responseTimes = [];
  userMsgs.forEach(msg => {
    totalChars += msg.content.length;
    if (msg.content.length < 8) shortMsgs++;
    fillers.forEach(w => { fillerCount += (msg.content.match(new RegExp(w, "g")) || []).length; });
    if (msg.thinkTime > 8000) longPauses++;
    if (msg.thinkTime) responseTimes.push(msg.thinkTime);
  });
  const avg = responseTimes.length ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 1000 : 0;
  const fluency = Math.max(0, Math.min(100, 100 - fillerCount * 10 - shortMsgs * 6));
  const confidence = Math.min(100, Math.max(10, (totalChars / userMsgs.length) * 3.5));
  const speed = avg === 0 ? 70 : avg < 4 ? 95 : avg < 8 ? 82 : avg < 15 ? 65 : 42;
  return {
    totalScore: Math.min(100, Math.round(fluency * 0.3 + confidence * 0.4 + speed * 0.3)),
    fluencyScore: Math.round(fluency), confidenceScore: Math.min(100, Math.round(confidence)),
    speedScore: Math.round(speed), fillerCount, shortMsgs, longPauses,
    avgLength: Math.round(totalChars / userMsgs.length),
    avgResponseTime: Math.round(avg), turnCount: userMsgs.length,
    duration: Math.round(duration / 1000)
  };
}

function FeedbackAdvice({ feedback, level }) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/voice-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback, levelTitle: level.title })
    })
      .then(r => r.json())
      .then(d => setAdvice(d.advice || ""))
      .catch(() => setAdvice("수고하셨어요! 꾸준히 연습하면 반드시 늘어납니다."))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div style={{ background: `${level.color}12`, borderRadius: "16px", padding: "16px", border: `1px solid ${level.color}25` }}>
      <div style={{ fontSize: "12px", fontWeight: "700", color: level.color, marginBottom: "10px" }}>🤖 AI 코치 피드백</div>
      {loading
        ? <div style={{ color: "#64748B", fontSize: "13px" }}>분석 중...</div>
        : <div style={{ fontSize: "13px", color: "#CBD5E1", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>{advice}</div>
      }
    </div>
  );
}

export default function VoiceCallTrainer({ onBack }) {
  const [screen, setScreen] = useState("home");
  const [level, setLevel] = useState(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [customDifficulty, setCustomDifficulty] = useState(2);
  const [customDirection, setCustomDirection] = useState("calling"); // "calling" | "receiving"
  const [messages, setMessages] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [voiceState, setVoiceState] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [sttSupported, setSttSupported] = useState(true);
  const [volume, setVolume] = useState(0);
  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [micError, setMicError] = useState("");

  // 핵심 refs — 클로저 문제 없이 항상 최신값
  const isEndingRef = useRef(false);
  const isListeningRef = useRef(false); // STT 루프 중복 방지
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const accumulatedRef = useRef(""); // 누적 텍스트
  const startTimeRef = useRef(null);
  const historyRef = useRef([]);
  const levelRef = useRef(null);
  const timerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const volumeIntervalRef = useRef(null);
  const micStreamRef = useRef(null);
  const currentAudioRef = useRef(null);

  const SILENCE_MS = 2000; // 침묵 후 전송까지 대기

  useEffect(() => {
    setMounted(true);
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) setSttSupported(false);
  }, []);

  useEffect(() => {
    if (screen === "calling") {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, voiceState]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── 볼륨 모니터 ──────────────────────────────────────────
  const startVolumeMonitor = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      volumeIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(buf);
        setVolume(Math.min(100, buf.reduce((a, b) => a + b, 0) / buf.length * 2));
      }, 100);
    } catch {
      setMicError("마이크 권한이 없어요. 텍스트 입력으로 연습할 수 있어요.");
      setTextMode(true);
    }
  };

  const stopVolumeMonitor = () => {
    clearInterval(volumeIntervalRef.current);
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    setVolume(0);
  };

  // 타임아웃 유틸
  const withTimeout = (promise, ms) =>
    Promise.race([promise, new Promise(resolve => setTimeout(resolve, ms))]);

  // ── TTS ───────────────────────────────────────────────────
  const speak = async (text, lv) => {
    currentAudioRef.current?.pause();
    currentAudioRef.current = null;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, role: lv?.role }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error("TTS 실패");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      await withTimeout(new Promise((resolve) => {
        audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        audio.play().catch(resolve);
      }), 30000);
    } catch (e) {
      console.warn("TTS 오류:", e.message);
      // 서버 TTS 실패 시 그냥 다음으로 진행 (기계음 폴백 제거)
    }
  };

  // ── AI 응답 ───────────────────────────────────────────────
  const sendToAI = async (history, lv) => {
    setVoiceState("processing");
    let aiText = "잠깐 연결이 불안정하네요.";
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000); // 20초 타임아웃
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: lv.systemPrompt,
          messages: history.map(m => ({ role: m.role, content: m.content === "[CALL_START]" ? "(전화 연결됨. 지금 바로 첫 인사를 시작하세요.)" : m.content }))
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      aiText = data.text || "잠시만요...";
    } catch (e) {
      console.warn("AI 응답 오류:", e.message);
    }

    if (isEndingRef.current) return;
    const newHistory = [...history, { role: "assistant", content: aiText, time: Date.now() }];
    historyRef.current = newHistory;
    setMessages(newHistory);
    setVoiceState("ai-speaking");
    await speak(aiText, lv);
    if (!isEndingRef.current) startListeningLoop(lv, newHistory);
  };

  // ── STT 루프 (핵심) ───────────────────────────────────────
  // 단순하게: recognition 하나를 생성하고, onend 시 재시작
  // 침묵 타이머가 발동하면 전송
  const startListeningLoop = (lv, history) => {
    if (isEndingRef.current || isListeningRef.current) return;
    if (!sttSupported) { setTextMode(true); return; }

    levelRef.current = lv;
    historyRef.current = history;
    accumulatedRef.current = "";
    startTimeRef.current = Date.now();
    isListeningRef.current = true;
    setTranscript("");
    setInterimTranscript("");

    launchRec();
  };

  const launchRec = () => {
    if (isEndingRef.current || !isListeningRef.current) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setTextMode(true); return; }

    const rec = new SR();
    rec.lang = "ko-KR";
    rec.continuous = false;
    rec.interimResults = true;
    recognitionRef.current = rec;

    rec.onstart = () => setVoiceState("listening");

    rec.onresult = (e) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setInterimTranscript(interim);
      if (final) {
        accumulatedRef.current += (accumulatedRef.current ? " " : "") + final;
        setTranscript(accumulatedRef.current);
      }
      // 말이 올 때마다 침묵 타이머 리셋
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(submitAccumulated, SILENCE_MS);
    };

    rec.onend = () => {
      if (isEndingRef.current || !isListeningRef.current) return;
      // 침묵 타이머가 아직 살아있으면 → 계속 듣기 위해 재시작
      // 타이머가 없으면(발동했거나 아직 말 안 함) → 재시작
      setTimeout(launchRec, 100);
    };

    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "permission-denied") {
        setMicError("마이크 권한이 거부됐어요. 텍스트 입력으로 전환할게요.");
        setTextMode(true);
        isListeningRef.current = false;
        return;
      }
      // no-speech, aborted 등 → 재시작
      if (!isEndingRef.current && isListeningRef.current) {
        setTimeout(launchRec, 200);
      }
    };

    try { rec.start(); } catch {
      setTimeout(launchRec, 300);
    }
  };

  const submitAccumulated = () => {
    clearTimeout(silenceTimerRef.current);
    isListeningRef.current = false;
    recognitionRef.current?.abort();

    const said = accumulatedRef.current.trim();
    accumulatedRef.current = "";
    setInterimTranscript("");
    setTranscript("");

    if (!said) {
      // 말이 없었으면 다시 듣기
      isListeningRef.current = false;
      setTimeout(() => {
        if (!isEndingRef.current) startListeningLoop(levelRef.current, historyRef.current);
      }, 300);
      return;
    }

    const thinkTime = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
    const userMsg = { role: "user", content: said, time: Date.now(), thinkTime };
    const newHistory = [...historyRef.current, userMsg];
    historyRef.current = newHistory;
    setMessages(newHistory);
    sendToAI(newHistory, levelRef.current);
  };

  // ── 전화 시작/끝 ──────────────────────────────────────────
  const startCall = async (lv) => {
    isEndingRef.current = false;
    isListeningRef.current = false;
    accumulatedRef.current = "";
    clearTimeout(silenceTimerRef.current);
    setLevel(lv); setIsConnecting(true);
    setMessages([]); setCallDuration(0);
    setVoiceState("idle"); setTranscript("");
    await startVolumeMonitor();
    setTimeout(async () => {
      setIsConnecting(false);
      setScreen("calling");
      const initHistory = [{ role: "user", content: "[CALL_START]", time: Date.now() }];
      historyRef.current = initHistory;
      await sendToAI(initHistory, lv);
    }, 2000);
  };

  const stopAll = () => {
    isEndingRef.current = true;
    isListeningRef.current = false;
    clearTimeout(silenceTimerRef.current);
    currentAudioRef.current?.pause();
    currentAudioRef.current = null;
    recognitionRef.current?.abort();
    window.speechSynthesis?.cancel();
    clearInterval(timerRef.current);
    stopVolumeMonitor();
    setVoiceState("idle");
  };

  const endCall = () => {
    stopAll();
    const result = analyzeConversation(messages, callDuration * 1000);
    setFeedback(result);
    setScreen("feedback");
  };

  const resetAll = () => {
    stopAll();
    setScreen("home"); setLevel(null); setMessages([]);
    setFeedback(null); setCallDuration(0); setTranscript(""); setInterimTranscript("");
    setShowCustom(false);
  };

  const startCustomCall = () => {
    if (!customTitle.trim() || !customRole.trim() || !customScenario.trim()) return;
    const isCalling = customDirection === "calling";
    const customLevel = {
      id: "custom",
      emoji: "✏️",
      title: customTitle.trim(),
      subtitle: `Lv.${customDifficulty} · 직접 입력`,
      color: "#F472B6",
      darkColor: "#DB2777",
      difficulty: customDifficulty,
      description: customScenario.trim(),
      tip: "직접 만든 상황으로 연습해보세요",
      role: customRole.trim(),
      scenario: customScenario.trim(),
      systemPrompt: isCalling
        ? `당신은 ${customRole.trim()}입니다. 상대방(사용자)이 지금 당신에게 전화를 걸었습니다.
규칙:
- 반드시 한국어로만 짧게(1-3문장) 답변
- 실제 통화처럼 자연스럽게 응대
- 처음엔 전화를 받은 사람처럼 자연스럽게 인사 (예: "여보세요?", "안녕하세요, ${customRole.trim()}입니다")
- 상황: ${customScenario.trim()}
- 절대 대본/AI 언급 금지`
        : `당신은 ${customRole.trim()}입니다. 당신이 먼저 상대방(사용자)에게 전화를 건 상황입니다.
규칙:
- 반드시 한국어로만 짧게(1-3문장) 답변
- 실제 통화처럼 자연스럽게 응대
- 처음엔 전화를 건 사람처럼 자신을 소개하고 용건을 말함 (예: "안녕하세요, 저는 ${customRole.trim()}인데요, ~때문에 연락드렸습니다")
- 상황: ${customScenario.trim()}
- 절대 대본/AI 언급 금지`,
    };
    startCall(customLevel);
  };

  const col = level?.color || "#34D399";
  const stateLabel = voiceState === "ai-speaking" ? `${level?.role} 말하는 중...`
    : voiceState === "listening" ? `말씀하세요 🎙️ · ${SILENCE_MS / 1000}초 침묵 시 전송`
    : voiceState === "processing" ? "AI 응답 중..."
    : "대기 중";
  const stateColor = voiceState === "listening" ? "#34D399" : voiceState === "ai-speaking" ? col : "#64748B";

  return (
    <div style={{
      fontFamily: "'Noto Sans KR', sans-serif", minHeight: "100dvh",
      background: "#070B16", color: "white",
      opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease"
    }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes ring{0%,100%{transform:rotate(0)}20%{transform:rotate(-15deg)}40%{transform:rotate(15deg)}60%{transform:rotate(-10deg)}80%{transform:rotate(10deg)}}
        @keyframes ripple{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.2);opacity:0}}
        @keyframes bar{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .msg{animation:slideUp .3s ease}
        .scrollbar-hide::-webkit-scrollbar{display:none}
      `}</style>

      {/* HOME */}
      {screen === "home" && !isConnecting && (
        <div style={{ maxWidth: "460px", margin: "0 auto", padding: "24px 16px 60px", animation: "fadeUp .5s ease" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#475569", fontSize: "14px", cursor: "pointer", padding: "0 0 20px", display: "block", fontFamily: "inherit" }}>← 홈으로</button>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", width: "72px", height: "72px", borderRadius: "24px", background: "linear-gradient(135deg,#34D399,#3B82F6)", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "16px", boxShadow: "0 8px 32px rgba(52,211,153,.3)" }}>🎙️</div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 8px", letterSpacing: "-.5px" }}>음성 통화 트레이너</h1>
            <p style={{ fontSize: "13px", color: "#64748B", margin: 0, lineHeight: "1.7" }}>실제 목소리로 AI와 통화 연습을 하고<br />상세한 피드백을 받아보세요</p>
            {!sttSupported && (
              <div style={{ marginTop: "12px", padding: "10px 14px", background: "#FEF3C7", borderRadius: "10px", color: "#92400E", fontSize: "12px" }}>
                ⚠️ 이 브라우저는 음성인식을 지원하지 않아요. Chrome을 사용해주세요.
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {LEVELS.map((lv, i) => (
              <button key={lv.id} onClick={() => startCall(lv)}
                style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: "20px", padding: "18px 20px", cursor: "pointer", textAlign: "left", color: "white", transition: "all .2s ease", animation: `fadeUp .5s ease ${i * .08}s both` }}
                onMouseEnter={e => { e.currentTarget.style.background = `${lv.color}12`; e.currentTarget.style.borderColor = `${lv.color}50`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: `${lv.color}18`, border: `1px solid ${lv.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{lv.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: "700", fontSize: "15px" }}>{lv.title}</span>
                      <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "6px", background: `${lv.color}20`, color: lv.color, fontWeight: "700" }}>{lv.subtitle}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "6px" }}>{lv.description}</div>
                    <div style={{ display: "flex", gap: "3px" }}>
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} style={{ width: "18px", height: "3px", borderRadius: "2px", background: j < lv.difficulty ? lv.color : "rgba(255,255,255,.1)" }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,.05)", fontSize: "11px", color: "#475569" }}>💡 {lv.tip}</div>
              </button>
            ))}

            {/* ── 직접 입력 카드 ── */}
            {!showCustom ? (
              <button
                onClick={() => setShowCustom(true)}
                style={{ background: "rgba(244,114,182,.04)", border: "1px dashed rgba(244,114,182,.35)", borderRadius: "20px", padding: "18px 20px", cursor: "pointer", textAlign: "left", color: "white", transition: "all .2s ease", animation: `fadeUp .5s ease ${LEVELS.length * .08}s both` }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(244,114,182,.1)"; e.currentTarget.style.borderColor = "rgba(244,114,182,.6)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(244,114,182,.04)"; e.currentTarget.style.borderColor = "rgba(244,114,182,.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(244,114,182,.15)", border: "1px solid rgba(244,114,182,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>✏️</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>직접 상황 입력</div>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>내가 원하는 상황을 직접 만들어서 연습해요</div>
                  </div>
                  <div style={{ fontSize: "18px", color: "#F472B6", opacity: 0.7 }}>+</div>
                </div>
              </button>
            ) : (
              <div style={{ background: "rgba(244,114,182,.06)", border: "1px solid rgba(244,114,182,.3)", borderRadius: "20px", padding: "20px", animation: "fadeUp .3s ease" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "20px" }}>✏️</span>
                    <span style={{ fontWeight: "700", fontSize: "15px" }}>직접 상황 입력</span>
                  </div>
                  <button onClick={() => setShowCustom(false)} style={{ background: "none", border: "none", color: "#64748B", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>×</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {/* 상황 이름 */}
                  <div>
                    <label style={{ fontSize: "11px", color: "#F472B6", fontWeight: "700", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>상황 이름 *</label>
                    <input
                      value={customTitle}
                      onChange={e => setCustomTitle(e.target.value)}
                      placeholder="예: 치과 예약, 전기요금 문의"
                      maxLength={20}
                      style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                      onFocus={e => e.target.style.borderColor = "rgba(244,114,182,.6)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"}
                    />
                  </div>

                  {/* 상대방 역할 */}
                  <div>
                    <label style={{ fontSize: "11px", color: "#F472B6", fontWeight: "700", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>상대방 역할 *</label>
                    <input
                      value={customRole}
                      onChange={e => setCustomRole(e.target.value)}
                      placeholder="예: 치과 접수 직원, 전기회사 상담사"
                      maxLength={30}
                      style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                      onFocus={e => e.target.style.borderColor = "rgba(244,114,182,.6)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"}
                    />
                  </div>

                  {/* 시나리오 */}
                  <div>
                    <label style={{ fontSize: "11px", color: "#F472B6", fontWeight: "700", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>연습할 상황 설명 *</label>
                    <textarea
                      value={customScenario}
                      onChange={e => setCustomScenario(e.target.value)}
                      placeholder="예: 충치 치료 때문에 이번 주 진료 예약을 하려고 전화한다"
                      maxLength={100}
                      rows={3}
                      style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit", lineHeight: "1.6" }}
                      onFocus={e => e.target.style.borderColor = "rgba(244,114,182,.6)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"}
                    />
                    <div style={{ textAlign: "right", fontSize: "11px", color: "#475569", marginTop: "4px" }}>{customScenario.length}/100</div>
                  </div>

                  {/* 통화 방향 */}
                  <div>
                    <label style={{ fontSize: "11px", color: "#F472B6", fontWeight: "700", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>나의 입장</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { v: "calling", emoji: "📞", label: "전화 거는 입장", desc: "내가 먼저 전화함" },
                        { v: "receiving", emoji: "📲", label: "전화 받는 입장", desc: "상대방이 먼저 전화함" },
                      ].map(({ v, emoji, label, desc }) => (
                        <button key={v} onClick={() => setCustomDirection(v)}
                          style={{ flex: 1, padding: "10px 8px", borderRadius: "12px", border: "1px solid", cursor: "pointer", fontFamily: "inherit", transition: "all .15s ease", textAlign: "center",
                            borderColor: customDirection === v ? "#F472B6" : "rgba(255,255,255,.1)",
                            background: customDirection === v ? "rgba(244,114,182,.2)" : "rgba(255,255,255,.04)",
                          }}
                        >
                          <div style={{ fontSize: "18px", marginBottom: "4px" }}>{emoji}</div>
                          <div style={{ fontSize: "11px", fontWeight: "700", color: customDirection === v ? "#F472B6" : "#94A3B8" }}>{label}</div>
                          <div style={{ fontSize: "10px", color: customDirection === v ? "#F472B6" : "#475569", marginTop: "2px", opacity: 0.8 }}>{desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 난이도 */}
                  <div>
                    <label style={{ fontSize: "11px", color: "#F472B6", fontWeight: "700", letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>난이도</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { v: 1, label: "Lv.1 입문" },
                        { v: 2, label: "Lv.2 초급" },
                        { v: 3, label: "Lv.3 중급" },
                        { v: 4, label: "Lv.4 고급" },
                      ].map(({ v, label }) => (
                        <button key={v} onClick={() => setCustomDifficulty(v)}
                          style={{ flex: 1, padding: "8px 4px", borderRadius: "10px", border: "1px solid", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "all .15s ease",
                            borderColor: customDifficulty === v ? "#F472B6" : "rgba(255,255,255,.1)",
                            background: customDifficulty === v ? "rgba(244,114,182,.2)" : "rgba(255,255,255,.04)",
                            color: customDifficulty === v ? "#F472B6" : "#64748B",
                          }}
                        >{label}</button>
                      ))}
                    </div>
                  </div>

                  {/* 시작 버튼 */}
                  <button
                    onClick={startCustomCall}
                    disabled={!customTitle.trim() || !customRole.trim() || !customScenario.trim()}
                    style={{ padding: "15px", borderRadius: "14px", border: "none", fontFamily: "inherit",
                      background: (!customTitle.trim() || !customRole.trim() || !customScenario.trim()) ? "rgba(255,255,255,.06)" : "linear-gradient(135deg, #F472B6, #DB2777)",
                      color: (!customTitle.trim() || !customRole.trim() || !customScenario.trim()) ? "#475569" : "white",
                      fontSize: "15px", fontWeight: "800", cursor: (!customTitle.trim() || !customRole.trim() || !customScenario.trim()) ? "not-allowed" : "pointer",
                      transition: "all .2s ease",
                    }}
                  >
                    📞 이 상황으로 통화 연습 시작
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONNECTING */}
      {isConnecting && level && (
        <div className="min-vh-full" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", animation: "fadeIn .3s ease" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {[1, 2, 3].map(i => <div key={i} style={{ position: "absolute", width: `${i * 50}px`, height: `${i * 50}px`, borderRadius: "50%", border: `2px solid ${level.color}`, animation: `ripple 2s ease ${i * .5}s infinite` }} />)}
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `${level.color}25`, border: `2px solid ${level.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", animation: "ring 1.2s ease infinite", zIndex: 1 }}>{level.emoji}</div>
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>연결 중...</div>
            <div style={{ fontSize: "13px", color: "#64748B" }}>{level.role}에게 전화하는 중</div>
          </div>
        </div>
      )}

      {/* CALLING */}
      {screen === "calling" && level && (
        <div className="vh-full" style={{ maxWidth: "460px", margin: "0 auto", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 16px 14px", background: `linear-gradient(180deg,${col}18 0%,transparent)`, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: `${col}20`, border: `2px solid ${col}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{level.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "15px" }}>{level.role}</div>
                <div style={{ fontSize: "12px", color: col, display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: col, display: "inline-block", animation: "pulse 2s infinite" }} />
                  통화 중 · {formatTime(callDuration)}
                </div>
              </div>
            </div>
            <div style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(255,255,255,.04)", borderRadius: "10px", fontSize: "11px", color: "#64748B" }}>📋 {level.scenario}</div>
          </div>

          <div className="scrollbar-hide" style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.filter(m => m.content !== "[CALL_START]").map((msg, i) => (
              <div key={i} className="msg" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${col}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", marginRight: "7px", flexShrink: 0, alignSelf: "flex-end" }}>{level.emoji}</div>
                )}
                <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? `linear-gradient(135deg,${col},${level.darkColor})` : "rgba(255,255,255,.08)", fontSize: "13px", lineHeight: "1.65", color: "white" }}>
                  {msg.content}
                  {msg.role === "user" && msg.thinkTime > 0 && (
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,.35)", marginTop: "4px", textAlign: "right" }}>{(msg.thinkTime / 1000).toFixed(1)}초 후 답변</div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="safe-area-bottom" style={{ padding: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,.06)", background: "rgba(0,0,0,.4)" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "16px", gap: "12px" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {voiceState === "listening" && <div style={{ position: "absolute", width: "72px", height: "72px", borderRadius: "50%", border: "2px solid #34D399", animation: "ripple 1.5s ease infinite" }} />}
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: voiceState === "listening" ? "rgba(52,211,153,.2)" : voiceState === "ai-speaking" ? `${col}20` : "rgba(255,255,255,.05)", border: `2px solid ${stateColor}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", transition: "all .3s ease" }}>
                  {voiceState === "listening" ? "🎙️" : voiceState === "ai-speaking" ? "🔊" : voiceState === "processing" ? "⚙️" : "📞"}
                </div>
              </div>
              {voiceState === "listening" && (
                <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "28px" }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} style={{ width: "3px", borderRadius: "2px", background: "#34D399", transformOrigin: "bottom", animation: `bar ${0.4 + Math.random() * 0.4}s ease ${i * 0.05}s infinite`, height: `${8 + (volume / 100) * 20 + Math.sin(i) * 4}px`, opacity: 0.5 + (volume / 200) }} />
                  ))}
                </div>
              )}
              {voiceState === "ai-speaking" && (
                <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "28px" }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} style={{ width: "3px", borderRadius: "2px", background: col, transformOrigin: "bottom", animation: `bar ${0.5 + i * 0.06}s ease ${i * 0.08}s infinite`, height: "16px" }} />
                  ))}
                </div>
              )}
              {voiceState === "processing" && <div style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,.2)", borderTopColor: col, borderRadius: "50%", animation: "spin .8s linear infinite" }} />}
              <div style={{ textAlign: "center", minHeight: "18px" }}>
                <span style={{ fontSize: "12px", color: stateColor, fontWeight: "600" }}>{stateLabel}</span>
                {(transcript || interimTranscript) && (
                  <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px", maxWidth: "280px", fontStyle: "italic" }}>"{transcript}{interimTranscript}"</div>
                )}
              </div>
            </div>

            {micError && (
              <div style={{ marginBottom: "10px", padding: "8px 12px", background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.3)", borderRadius: "10px", fontSize: "11px", color: "#FCD34D", display: "flex", alignItems: "center", gap: "6px" }}>
                ⚠️ {micError}
                <button onClick={() => { setTextMode(false); setMicError(""); }} style={{ marginLeft: "auto", background: "none", border: "1px solid rgba(251,191,36,.4)", borderRadius: "6px", padding: "2px 8px", color: "#FCD34D", fontSize: "10px", cursor: "pointer", fontFamily: "inherit" }}>재시도</button>
              </div>
            )}

            {(textMode || !sttSupported) && voiceState !== "ai-speaking" && voiceState !== "processing" && (
              <div style={{ marginBottom: "10px", display: "flex", gap: "8px" }}>
                <input value={textInput} onChange={e => setTextInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && textInput.trim()) {
                      const thinkTime = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
                      const userMsg = { role: "user", content: textInput.trim(), time: Date.now(), thinkTime };
                      const newHistory = [...historyRef.current, userMsg];
                      historyRef.current = newHistory;
                      setMessages(newHistory);
                      setTextInput("");
                      sendToAI(newHistory, levelRef.current);
                    }
                  }}
                  placeholder="텍스트로 입력하세요 (Enter 전송)"
                  style={{ flex: 1, background: "rgba(255,255,255,.07)", border: `1px solid ${col}50`, borderRadius: "12px", padding: "10px 14px", color: "white", fontSize: "13px", outline: "none", fontFamily: "inherit" }}
                />
                <button onClick={() => {
                  if (!textInput.trim()) return;
                  const thinkTime = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
                  const userMsg = { role: "user", content: textInput.trim(), time: Date.now(), thinkTime };
                  const newHistory = [...historyRef.current, userMsg];
                  historyRef.current = newHistory;
                  setMessages(newHistory);
                  setTextInput("");
                  sendToAI(newHistory, levelRef.current);
                }} style={{ width: "40px", height: "40px", borderRadius: "50%", background: col, border: "none", color: "white", fontSize: "16px", cursor: "pointer", flexShrink: 0 }}>▶</button>
              </div>
            )}

            {sttSupported && (
              <button onClick={() => setTextMode(t => !t)} style={{ width: "100%", marginBottom: "8px", padding: "9px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "12px", color: "#94A3B8", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>
                {textMode ? "🎙️ 음성 입력으로 전환" : "⌨️ 텍스트 입력으로 전환"}
              </button>
            )}

            <button onClick={endCall} style={{ width: "100%", padding: "13px", background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.35)", borderRadius: "14px", color: "#FCA5A5", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,.28)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,.15)"}
            >📵 전화 끊기 & 피드백 보기</button>
          </div>
        </div>
      )}

      {/* FEEDBACK */}
      {screen === "feedback" && feedback && level && (
        <div style={{ maxWidth: "460px", margin: "0 auto", padding: "28px 16px max(60px, env(safe-area-inset-bottom))", animation: "fadeUp .5s ease" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "11px", color: "#64748B", letterSpacing: "1px", marginBottom: "8px" }}>통화 결과 분석</div>
            <div style={{ fontSize: "76px", fontWeight: "800", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, color: feedback.totalScore >= 70 ? "#34D399" : feedback.totalScore >= 50 ? "#FBBF24" : "#F87171" }}>{feedback.totalScore}</div>
            <div style={{ fontSize: "14px", color: "#94A3B8", marginTop: "6px" }}>
              {feedback.totalScore >= 80 ? "🏆 훌륭해요! 실전도 거뜬해요" : feedback.totalScore >= 60 ? "👍 잘 하셨어요! 조금만 더 연습해봐요" : feedback.totalScore >= 40 ? "💪 분명 늘고 있어요. 다시 도전해봐요" : "🌱 처음이니까 괜찮아요!"}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {[
              { label: "유창성", score: feedback.fluencyScore, icon: "🗣️", desc: `필러 ${feedback.fillerCount}회` },
              { label: "자신감", score: feedback.confidenceScore, icon: "💪", desc: `평균 ${feedback.avgLength}자` },
              { label: "반응속도", score: feedback.speedScore, icon: "⚡", desc: `평균 ${feedback.avgResponseTime}초` }
            ].map(item => (
              <div key={item.label} style={{ background: "rgba(255,255,255,.04)", borderRadius: "14px", padding: "14px 10px", border: "1px solid rgba(255,255,255,.07)", textAlign: "center" }}>
                <div style={{ fontSize: "18px", marginBottom: "5px" }}>{item.icon}</div>
                <div style={{ fontSize: "22px", fontWeight: "800", fontFamily: "'JetBrains Mono',monospace", color: item.score >= 70 ? "#34D399" : item.score >= 50 ? "#FBBF24" : "#F87171" }}>{item.score}</div>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#94A3B8", marginTop: "2px" }}>{item.label}</div>
                <div style={{ fontSize: "10px", color: "#475569", marginTop: "3px" }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,.04)", borderRadius: "14px", padding: "14px", border: "1px solid rgba(255,255,255,.07)", marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", marginBottom: "10px", letterSpacing: ".5px" }}>통화 통계</div>
            {[
              { label: "통화 시간", value: `${Math.floor(feedback.duration / 60)}분 ${feedback.duration % 60}초` },
              { label: "발화 횟수", value: `${feedback.turnCount}회` },
              { label: "짧은 답변", value: `${feedback.shortMsgs}회`, warn: feedback.shortMsgs > 2 },
              { label: "긴 침묵 (8초↑)", value: `${feedback.longPauses}회`, warn: feedback.longPauses > 1 },
              { label: "필러워드", value: `${feedback.fillerCount}회`, warn: feedback.fillerCount > 3 },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>{item.label}</span>
                <span style={{ fontSize: "12px", fontWeight: "700", color: item.warn ? "#FBBF24" : "white", fontFamily: "'JetBrains Mono',monospace" }}>{item.value}</span>
              </div>
            ))}
          </div>
          <FeedbackAdvice feedback={feedback} level={level} />
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button onClick={() => startCall(level)} style={{ flex: 1, padding: "13px", borderRadius: "13px", background: `linear-gradient(135deg,${col},${level.darkColor})`, border: "none", color: "white", fontWeight: "700", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>🔄 다시 연습</button>
            <button onClick={resetAll} style={{ flex: 1, padding: "13px", borderRadius: "13px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "white", fontWeight: "700", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>📋 레벨 선택</button>
          </div>
          <button onClick={onBack} style={{ width: "100%", marginTop: "10px", padding: "13px", borderRadius: "13px", background: "none", border: "1px solid rgba(255,255,255,.08)", color: "#475569", fontWeight: "600", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>← 홈으로</button>
        </div>
      )}
    </div>
  );
}
