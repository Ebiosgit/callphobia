require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 진단용 헬스체크
app.get("/api/health", async (req, res) => {
  const keyExists = !!process.env.ANTHROPIC_API_KEY;
  const keyPrefix = process.env.ANTHROPIC_API_KEY?.slice(0, 16) || "없음";
  let aiTest = "실패", reply = "", aiError = "";
  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 10,
      messages: [{ role: "user", content: "hi" }],
    });
    aiTest = "성공";
    reply = msg.content[0]?.text;
  } catch (e) {
    aiError = e.message;
  }

  const elevenLabsKeyExists = !!process.env.ELEVENLABS_API_KEY;
  const elevenLabsKeyPrefix = process.env.ELEVENLABS_API_KEY?.slice(0, 10) || "없음";
  let elevenLabsTest = "미테스트", elevenLabsError = "";
  if (elevenLabsKeyExists) {
    try {
      const elRes = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
        {
          method: "POST",
          headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({
            text: "안녕하세요",
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        }
      );
      if (elRes.ok) {
        elevenLabsTest = "성공";
      } else {
        const errText = await elRes.text();
        elevenLabsTest = "실패";
        elevenLabsError = `${elRes.status}: ${errText.slice(0, 200)}`;
      }
    } catch (e) {
      elevenLabsTest = "실패";
      elevenLabsError = e.message;
    }
  }

  res.json({
    status: aiTest === "성공" ? "ok" : "error",
    anthropic: { keyExists, keyPrefix, test: aiTest, reply, error: aiError },
    elevenLabsTts: { keyExists: elevenLabsKeyExists, keyPrefix: elevenLabsKeyPrefix, test: elevenLabsTest, error: elevenLabsError },
  });
});


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

각 섹션은 실제로 말할 수 있는 자연스러운 구어체로 작성해주세요. ${tone === "정중한" ? "존댓말을 정확히 사용하고 공손한 표현을 써주세요." : tone === "친근한" ? "부드럽고 친근한 느낌으로 작성해주세요." : "일반적이고 표준적인 존댓말로 작성해주세요."}

중요: 섹션 제목은 반드시 【】 형식만 사용하고, # ## ### 같은 마크다운 헤더를 절대 사용하지 마세요. 코드 블록(\`\`\`)이나 > 인용구도 사용하지 마세요.`;

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

// 역할별 ElevenLabs 음성 매핑
// 여성: Rachel(21m00Tcm4TlvDq8ikWAM), Elli(MF3mGyEYCl7XYWbV9V6O)
// 남성: Adam(pNInz6obpgDQGcFmaJgB), Arnold(VR6AewLTigWG4xSOukaG)
const VOICE_MAP = {
  "황금치킨 직원": "21m00Tcm4TlvDq8ikWAM", // Rachel - 여성, 따뜻
  "헤어샵 직원": "MF3mGyEYCl7XYWbV9V6O", // Elli - 여성, 친근
  "레스토랑 직원": "21m00Tcm4TlvDq8ikWAM", // Rachel - 여성, 전문적
  "연세내과 접수": "21m00Tcm4TlvDq8ikWAM", // Rachel - 여성, 차분
  "호텔 프런트": "MF3mGyEYCl7XYWbV9V6O", // Elli - 여성, 부드러움
  "고객센터 상담사": "21m00Tcm4TlvDq8ikWAM", // Rachel - 여성, 전문적
  "은행 상담원": "21m00Tcm4TlvDq8ikWAM", // Rachel - 여성, 전문적
  "택배 고객센터": "pNInz6obpgDQGcFmaJgB", // Adam - 남성, 차분
  "삼성 서비스센터": "pNInz6obpgDQGcFmaJgB", // Adam - 남성, 전문적
  "주민센터 담당자": "VR6AewLTigWG4xSOukaG", // Arnold - 남성, 묵직
  "인사팀 담당자": "VR6AewLTigWG4xSOukaG", // Arnold - 남성, 표현력
  "집주인": "VR6AewLTigWG4xSOukaG", // Arnold - 남성, 묵직
  "관리사무소 직원": "pNInz6obpgDQGcFmaJgB", // Adam - 남성, 차분
  "거래처 담당자": "VR6AewLTigWG4xSOukaG", // Arnold - 남성, 표현력
};

// TTS: ElevenLabs (자연스러운 사람 목소리, 한국어 지원)
app.post("/api/tts", async (req, res) => {
  const { text, role } = req.body;
  if (!text) return res.status(400).json({ error: "text는 필수입니다." });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = VOICE_MAP[role] || "21m00Tcm4TlvDq8ikWAM"; // 기본: Rachel

  if (apiKey) {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.0,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`ElevenLabs TTS 오류(${response.status}): ${err}`);
      }

      const audioBuffer = await response.arrayBuffer();
      res.setHeader("Content-Type", "audio/mpeg");
      return res.send(Buffer.from(audioBuffer));
    } catch (e) {
      console.error("ElevenLabs TTS error:", e.message);
    }
  }

  // 폴백: Edge TTS
  try {
    const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");
    const tts = new MsEdgeTTS();
    await tts.setMetadata("ko-KR-JiMinNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const parts = [];
    const { audioStream } = tts.toStream(text, { rate: 0.92, pitch: "+0Hz" });
    audioStream.on("data", c => parts.push(c));
    audioStream.on("close", () => {
      res.setHeader("Content-Type", "audio/mpeg");
      res.send(Buffer.concat(parts));
    });
    audioStream.on("error", () => {
      if (!res.headersSent) res.status(500).json({ error: "TTS 오류" });
    });
  } catch {
    if (!res.headersSent) res.status(500).json({ error: "TTS 생성 오류가 발생했습니다." });
  }
});

// 모든 역할에 공통 적용되는 대화 규칙
const COMMON_RULES = `
공통 대화 규칙:
- 주제와 관련 없거나 엉뚱한 말을 하면: "죄송한데요, 다시 한번 말씀해 주시겠어요?" 또는 현재 대화 흐름으로 자연스럽게 유도
- 같은 질문을 반복하면: 다른 표현으로 더 친절하고 쉽게 다시 설명 (앵무새처럼 그대로 반복 금지)
- 대화가 8턴 이상 길어지면: 자연스럽게 마무리 방향으로 유도 ("그럼 정리해드리면..." 식으로)
- 욕설·비상식적 발언엔: "죄송합니다, 정상적인 상담이 어렵습니다." 후 대화 종료 유도`;

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
      system: systemPrompt + COMMON_RULES,
      messages,
    });
    const text = msg.content.find(b => b.type === "text")?.text || "다시 말씀해 주시겠어요?";
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

// React 빌드 파일 서빙
app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
