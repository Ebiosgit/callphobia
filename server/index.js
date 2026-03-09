require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");
const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 진단용 헬스체크
app.get("/api/health", async (req, res) => {
  const keyExists = !!process.env.ANTHROPIC_API_KEY;
  const keyPrefix = process.env.ANTHROPIC_API_KEY?.slice(0, 16) || "없음";
  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 10,
      messages: [{ role: "user", content: "hi" }],
    });
    res.json({ status: "ok", keyExists, keyPrefix, aiTest: "성공", reply: msg.content[0]?.text });
  } catch (e) {
    res.json({ status: "error", keyExists, keyPrefix, aiTest: "실패", error: e.message });
  }
});

// 레벨별 음성 설정 (rate: 숫자, pitch: Hz 문자열)
const VOICE_MAP = {
  "황금치킨 직원": { voice: "ko-KR-SunHiNeural",  rate: 1.05, pitch: "+5Hz"  },
  "연세내과 접수":  { voice: "ko-KR-SunHiNeural",  rate: 1.0,  pitch: "+0Hz"  },
  "주민센터 담당자":{ voice: "ko-KR-InJoonNeural", rate: 1.08, pitch: "-5Hz"  },
  "고객센터 상담사":{ voice: "ko-KR-SunHiNeural",  rate: 1.03, pitch: "-3Hz"  },
  default:          { voice: "ko-KR-SunHiNeural",  rate: 1.0,  pitch: "+0Hz"  },
};

app.post("/api/script", async (req, res) => {
  const { situation, customLabel, detail, tone } = req.body;

  if (!detail || !situation) {
    return res.status(400).json({ error: "situation과 detail은 필수입니다." });
  }

  const sitLabel = situation === "custom" ? (customLabel || "기타 상황") : situation;

  const scriptPrompt = `당신은 전화 통화 대본 작성 전문가입니다. 전화 공포증(콜포비아)이 있는 사람을 위해 실용적이고 자연스러운 한국어 통화 대본을 작성해주세요.

상황 유형: ${sitLabel}
통화 목적: ${detail}
말투 스타일: ${tone}

다음 형식으로 대본을 작성해주세요:

【📞 오프닝 (전화 연결 시)】
상대방이 받았을 때 첫 인사말과 자신 소개

【🎯 본론 (핵심 요청)】
용건을 명확하게 전달하는 대사

【❓ 예상 질문 & 답변】
상대방이 할 수 있는 질문 2-3가지와 자연스러운 답변

【🚫 거절/부정 답변 대응】
이 통화에서 실제로 발생할 수 있는 부정적 상황 3가지를 아래 형식으로 작성:
- 상황: [상대방의 거절/부정적 답변 예시 — 최대한 현실적으로]
  대응: [당황하지 않고 침착하게 할 수 있는 내 대사]
  팁: [이 상황에서 기억할 한 줄 조언]

예시 거절 유형 참고 (상황에 맞게 선택):
· 예약 불가 / 자리 없음 · 규정상 안 된다 · 담당자 부재
· 서류 미비 / 자격 안 됨 · 비용 추가 발생 · 무조건 거절
· 책임 떠넘기기 · 퉁명스러운 응대 · 무한 대기/보류

【✅ 마무리】
통화를 끝내는 인사말 (원하는 결과를 못 얻었을 때 버전도 1줄 포함)

【💡 통화 전 체크리스트】
준비할 것들 (메모할 것, 확인할 번호 등) 3가지를 짧게

각 섹션은 실제로 말할 수 있는 자연스러운 구어체로 작성해주세요. ${tone === "정중한" ? "존댓말을 정확히 사용하고 공손한 표현을 써주세요." : tone === "친근한" ? "부드럽고 친근한 느낌으로 작성해주세요." : "일반적이고 표준적인 존댓말로 작성해주세요."}`;

  const tipsPrompt = `전화 공포증이 있는 사람을 위해 "${detail}" 통화 전 심리적 안정에 도움되는 짧은 팁 3가지를 배열 JSON으로만 응답해주세요. 예: ["팁1", "팁2", "팁3"]`;

  try {
    const [scriptMsg, tipsMsg] = await Promise.all([
      client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [{ role: "user", content: scriptPrompt }],
      }),
      client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        messages: [{ role: "user", content: tipsPrompt }],
      }),
    ]);

    const scriptText = scriptMsg.content.find(b => b.type === "text")?.text || "";
    const tipsRaw = tipsMsg.content.find(b => b.type === "text")?.text || "[]";

    let tips = [];
    try {
      tips = JSON.parse(tipsRaw.replace(/```json|```/g, "").trim());
    } catch {
      tips = [];
    }

    res.json({ scriptText, tips });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "대본 생성 중 오류가 발생했습니다." });
  }
});

// TTS: 뉴럴 음성 합성
app.post("/api/tts", async (req, res) => {
  const { text, role } = req.body;
  if (!text) return res.status(400).json({ error: "text는 필수입니다." });

  const { voice, rate, pitch } = VOICE_MAP[role] || VOICE_MAP.default;

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const chunks = [];
    const { audioStream } = tts.toStream(text, { rate, pitch });
    audioStream.on("data", chunk => chunks.push(chunk));
    audioStream.on("close", () => {
      const audio = Buffer.concat(chunks);
      res.setHeader("Content-Type", "audio/mpeg");
      res.send(audio);
    });
    audioStream.on("error", (e) => {
      console.error("TTS stream error:", e);
      if (!res.headersSent) res.status(500).json({ error: "TTS 오류" });
    });
  } catch (e) {
    console.error("TTS error:", e);
    if (!res.headersSent) res.status(500).json({ error: "TTS 생성 오류가 발생했습니다." });
  }
});

// 음성 트레이너: AI 대화 응답
app.post("/api/voice", async (req, res) => {
  const { systemPrompt, messages } = req.body;
  if (!systemPrompt || !messages) {
    return res.status(400).json({ error: "systemPrompt와 messages는 필수입니다." });
  }
  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      system: systemPrompt,
      messages,
    });
    const text = msg.content.find(b => b.type === "text")?.text || "잠시만요...";
    res.json({ text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI 응답 오류가 발생했습니다." });
  }
});

// 음성 트레이너: AI 코치 피드백
app.post("/api/voice-feedback", async (req, res) => {
  const { feedback, levelTitle } = req.body;
  if (!feedback) return res.status(400).json({ error: "feedback은 필수입니다." });

  const prompt = `전화 스피치 코치로서 이 결과에 대해 한국어로 따뜻하고 구체적인 조언을 3줄로:
연습: ${levelTitle}
총점: ${feedback.totalScore}/유창성: ${feedback.fluencyScore}/자신감: ${feedback.confidenceScore}/반응속도: ${feedback.speedScore}
필러: ${feedback.fillerCount}회, 짧은답변: ${feedback.shortMsgs}회, 평균응답: ${feedback.avgResponseTime}초`;

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });
    const advice = msg.content.find(b => b.type === "text")?.text || "";
    res.json({ advice });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "피드백 생성 오류가 발생했습니다." });
  }
});

// 프로덕션: React 빌드 파일 서빙
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
