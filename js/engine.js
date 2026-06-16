// =====================================================
// engine.js — 홍연기문 핵심 연산 엔진 v2.2
// 변경: 팔문(八門) 배속 포국 반영, AI 프롬프트 팔문 포함
//
// 의존 파일:
//   data-ganji.js  : CHEONGAN, JIJI, SAMWON, GANJI_60, getHourToSiji
//   data-jeolgi.js : JEOLGI_ORDER, JEOLGI_APPROX_DATE, JEOLGI_DATA
//   data-gugung.js : GUGUNG, PALMUN, PALMUN_ORDER, buildPalmunBoard,
//                    RELATION_TYPE, getRelationType, getOhaengChar
// =====================================================


// ── 1. 절기 판별 ──────────────────────────────────
function getCurrentJeolgi(month, day) {
  const today = month * 100 + day;
  let currentKey = "dongji";

  for (const key of JEOLGI_ORDER) {
    const [jMonth, jDay] = JEOLGI_APPROX_DATE[key];
    if (jMonth === 1) continue;
    if (today >= jMonth * 100 + jDay) currentKey = key;
  }

  if (month === 1) {
    if (day >= JEOLGI_APPROX_DATE.daehan[1]) return "daehan";
    if (day >= JEOLGI_APPROX_DATE.sohan[1])  return "sohan";
    return "dongji";
  }
  return currentKey;
}


// ── 2. 부두일 지지 → 삼원 판별 ───────────────────
// GANJI_60 활용: idx % 5 로 부두일까지 거리 역산
function getBuduJi(dayGan, dayJi) {
  const ganji = dayGan + dayJi;
  const idx = GANJI_60.indexOf(ganji);
  if (idx === -1) return null;
  const buduIdx = idx - (idx % 5);
  return GANJI_60[buduIdx][1];
}

function getSamwon(dayGan, dayJi, monthJi) {
  let targetJi;

  if (dayGan && dayJi) {
    const isBudu = dayGan === "갑" || dayGan === "기";
    targetJi = isBudu ? dayJi : (getBuduJi(dayGan, dayJi) || dayJi);
  } else {
    targetJi = monthJi || "자";
  }

  for (const [key, val] of Object.entries(SAMWON)) {
    if (val.jijiList.includes(targetJi)) return key;
  }
  return "sang";
}


// ── 3. 기준 국수 도출 ─────────────────────────────
function getBaseGuksu(jeolgiKey, samwonKey) {
  const jeolgi = JEOLGI_DATA[jeolgiKey];
  if (!jeolgi) return { guksu: 1, type: "양둔", jeolgiName: "알 수 없음" };
  return {
    guksu:      jeolgi.guksu[samwonKey],
    type:       jeolgi.type,
    jeolgiName: jeolgi.name,
  };
}


// ── 4. 낙서 경로 배치 ─────────────────────────────
const NAKSEO_PATH = [5, 6, 7, 8, 9, 1, 2, 3, 4];

function buildJibanBoard(baseGuksu, type) {
  const isYangdun = type === "양둔";
  const jibanBoard = {};

  for (let i = 0; i < 9; i++) {
    const gungNum = NAKSEO_PATH[i];
    jibanBoard[gungNum] = isYangdun
      ? ((baseGuksu - 1 + i) % 9) + 1
      : ((baseGuksu - 1 - i + 900) % 9) + 1;
  }
  return jibanBoard;
}


// ── 5. 홍국수 산출 ────────────────────────────────
function calcHongguksu(saju8, cheongan4) {
  const sum8 = saju8.reduce((acc, ch) => {
    if (CHEONGAN[ch]) return acc + CHEONGAN[ch].num;
    if (JIJI[ch])     return acc + JIJI[ch].num;
    return acc;
  }, 0);

  const sum4 = cheongan4.reduce((acc, ch) => acc + (CHEONGAN[ch]?.num || 0), 0);

  return {
    jibanHong:    sum8 % 9 === 0 ? 9 : sum8 % 9,
    cheonbanHong: sum4 % 9 === 0 ? 9 : sum4 % 9,
  };
}


// ── 6. 천반 오버레이 배치 ─────────────────────────
function buildCheonbanBoard(jibanBoard, jibanHong, cheonbanHong, type) {
  const isYangdun = type === "양둔";
  const anchorGung = Object.keys(jibanBoard).find(g => jibanBoard[g] === jibanHong);
  if (!anchorGung) return {};

  const anchorIdx = NAKSEO_PATH.indexOf(parseInt(anchorGung));
  const cheonbanBoard = {};

  for (let i = 0; i < 9; i++) {
    const gungNum = NAKSEO_PATH[(anchorIdx + i) % 9];
    cheonbanBoard[gungNum] = isYangdun
      ? ((cheonbanHong - 1 + i) % 9) + 1
      : ((cheonbanHong - 1 - i + 900) % 9) + 1;
  }
  return cheonbanBoard;
}


// ── 7. 세궁 도출 ──────────────────────────────────
function getSegung(dayGan, jibanBoard) {
  if (!dayGan || !CHEONGAN[dayGan]) return 5;

  const ohaengToGung = {
    목: [3, 4], 화: [9], 토: [2, 5, 8], 금: [6, 7], 수: [1],
  };
  const candidates = ohaengToGung[CHEONGAN[dayGan].ohaeng] || [5];

  let segung = candidates[0], maxVal = 0;
  for (const g of candidates) {
    if (jibanBoard[g] > maxVal) { maxVal = jibanBoard[g]; segung = g; }
  }
  return segung;
}


// ── 8. 최종 board 조립 (팔문 + 신살 포함) ────────
function assembleBoard(jibanBoard, cheonbanBoard, segungIndex) {
  const palmunBoard = buildPalmunBoard(segungIndex);

  const board = {};
  for (const gungNum of NAKSEO_PATH) {
    const jiban   = jibanBoard[gungNum]    || 5;
    const cheon   = cheonbanBoard[gungNum] || 5;
    const palmunKey = palmunBoard[gungNum] || "복위";

    // 신살 발동 체크
    const sinsal = (typeof getSinsalForGung === "function")
      ? getSinsalForGung(cheon, jiban)
      : [];

    board[gungNum] = {
      gungNum,
      gungInfo:   GUGUNG[gungNum],
      jibansu:    jiban,
      cheonbansu: cheon,
      isSegung:   gungNum === segungIndex,
      relation:   getRelationType(cheon, jiban),
      palmun:     PALMUN[palmunKey],
      palmunKey,
      sinsal,     // 발동된 신살 배열 (없으면 [])
    };
  }
  return board;
}


// ── 9. 메인 포국 함수 ─────────────────────────────
function runHongyeon(input) {
  const {
    year, month, day, hour, siji,
    yearGan, yearJi, monthGan, monthJi,
    dayGan,  dayJi,  hourGan,  hourJi,
  } = input;

  const sijiChar   = hourJi || siji || getHourToSiji(hour || 12);
  const jeolgiKey  = getCurrentJeolgi(month, day);
  const samwonKey  = getSamwon(dayGan, dayJi, monthJi);
  const { guksu: baseGuksu, type, jeolgiName } = getBaseGuksu(jeolgiKey, samwonKey);

  const jibanBoard = buildJibanBoard(baseGuksu, type);

  const saju8     = [yearGan, yearJi, monthGan, monthJi, dayGan, dayJi, hourGan, sijiChar].filter(Boolean);
  const cheongan4 = [yearGan, monthGan, dayGan, hourGan].filter(Boolean);
  const { jibanHong, cheonbanHong } = calcHongguksu(saju8, cheongan4);

  const cheonbanBoard = buildCheonbanBoard(jibanBoard, jibanHong, cheonbanHong, type);
  const segungIndex   = getSegung(dayGan, jibanBoard);
  const board         = assembleBoard(jibanBoard, cheonbanBoard, segungIndex);

  // 길흉 요약 자동 산출
  const giljung = deriveGiljung(board, segungIndex);

  const hasSaju = !!(yearGan && monthGan && dayGan);
  const warning = hasSaju ? null
    : "사주팔자 간지를 입력하지 않아 절기 기반 근사값으로 포국했습니다.";

  return {
    meta:     { jeolgiKey, jeolgiName, type, baseGuksu, samwonKey, sijiChar, warning },
    analysis: {
      jibanHong, cheonbanHong, segungIndex,
      segungName:   GUGUNG[segungIndex]?.name || "",
      dayGanOhaeng: dayGan ? CHEONGAN[dayGan]?.ohaeng : null,
    },
    giljung,
    board,
  };
}


// ── 10. 길흉 요약 도출 ────────────────────────────
function deriveGiljung(board, segungIndex) {
  const scored = Object.values(board).map(g => {
    const relationScore = g.relation.score;
    const palmunScore   = g.palmun?.score ?? 55;
    // 신살 패널티 합산
    const sinsalPenalty = (g.sinsal || []).reduce((acc, s) => acc + (s.score || 0), 0);
    const combined = Math.max(0, Math.round(relationScore * 0.45 + palmunScore * 0.45 + sinsalPenalty * 0.1));
    return {
      gungNum:       g.gungNum,
      name:          g.gungInfo.name,
      direction:     g.gungInfo.direction,
      palmunLabel:   g.palmun?.label || "",
      palmunDesc:    g.palmun?.desc  || "",
      relationLabel: g.relation.label,
      sinsalLabels:  (g.sinsal || []).map(s => s.label),
      combined,
      isSegung: g.isSegung,
    };
  });

  // 세궁 제외하고 길방·흉방 분류
  const others = scored.filter(g => !g.isSegung);
  others.sort((a, b) => b.combined - a.combined);

  return {
    gilbang: others.slice(0, 3),          // 상위 3개 = 길방
    hyungbang: others.slice(-3).reverse(), // 하위 3개 = 흉방
    segung: scored.find(g => g.isSegung),
  };
}


// ── 11. AI 프롬프트 조립 (팔문 포함) ─────────────
function buildAiPrompt(result, userInput, topic) {
  const { meta, analysis, board } = result;
  // giljung 없는 구버전 sessionStorage 데이터 호환 — 없으면 빈 구조로 폴백
  const giljung = result.giljung || deriveGiljung(board, analysis.segungIndex);

  const samwonLabel = { sang: "상원(上元)", jung: "중원(中元)", ha: "하원(下元)" };

  // 구궁 포국 텍스트 (팔문 포함)
  const boardText = NAKSEO_PATH.map(gungNum => {
    const g = board[gungNum];
    const segMark    = g.isSegung ? " ★세궁" : "";
    const palmunStr  = g.palmun
      ? ` [${g.palmun.label} ${g.palmun.score}점]` : "";
    const sinsalStr  = (g.sinsal && g.sinsal.length > 0)
      ? ` ⚡신살: ${g.sinsal.map(s => s.label).join("·")}` : "";
    return `  ${g.gungInfo.name}(${g.gungInfo.direction}): 지반${g.jibansu} 천반${g.cheonbansu} [${g.relation.label} ${g.relation.score}점]${palmunStr}${sinsalStr}${segMark}`;
  }).join("\n");

  // 길방·흉방 요약 텍스트
  const gilText = giljung.gilbang.map((g, i) =>
    `  ${i+1}위 ${g.name}(${g.direction}): ${g.palmunLabel} · ${g.relationLabel} — ${g.palmunDesc}`
  ).join("\n");

  const hyungText = giljung.hyungbang.map((g, i) =>
    `  ${i+1}위 ${g.name}(${g.direction}): ${g.palmunLabel} · ${g.relationLabel} — ${g.palmunDesc}`
  ).join("\n");

  const topicMap = {
    general:   "전반적인 운세 흐름, 길흉 방위, 주의사항, 추천 행동",
    money:     "재물운과 투자 타이밍에 집중하여 구체적 조언",
    career:    "직장·사업·승진 관련 운세와 최적 행동 시기",
    health:    "건강 주의사항과 건강 회복에 좋은 방위·시기",
    love:      "인간관계·애정운, 좋은 인연을 만나는 방위와 시기",
    direction: "이사·여행에 가장 길한 방위 TOP3와 피해야 할 방위",
  };
  const topicGuide = topicMap[topic] || topicMap.general;

  const hasSaju = !!(userInput.yearGan && userInput.monthGan && userInput.dayGan);
  const hasAnySaju = !!(userInput.yearGan || userInput.monthGan || userInput.dayGan || userInput.hourGan);

  const accuracyNote = hasSaju ? "" : `\
[내부 지침 — 응답에 이 내용을 그대로 출력하지 마세요]
이 포국은 사주팔자 간지 없이 절기 기반 근사값으로 산출되었습니다.
- 단정적 표현보다 "가능성", "경향" 위주로 서술하세요.
- 해석 본문에 정확도 한계를 언급하지 마세요.
- 응답 마지막 한 줄에만: "📌 만세력으로 일진 간지를 입력하시면 정밀 분석이 가능합니다."
`;

  const precisionNote = hasSaju ? `\
[내부 지침 — 응답에 이 내용을 그대로 출력하지 마세요]
사주팔자 간지가 모두 입력되었습니다.
- 일간(${analysis.dayGanOhaeng} 오행) 기준 용신·기신 관계를 세궁 분석에 반드시 반영하세요.
- 팔문과 생극 관계를 결합해 방위별 구체적 조언을 제공하세요.
- 단정적이고 구체적인 시기·방위 조언을 제공하세요.
` : "";

  // 동처 분석 텍스트
  const dongcheoText = Object.values(board)
    .filter(g => !g.isSegung)
    .map(g => {
      let score = 0;
      if (g.relation.label.includes("천극지")) score += 40;
      else if (g.relation.label.includes("지극천")) score += 25;
      if ((g.palmun?.score ?? 50) <= 15) score += 35;
      else if ((g.palmun?.score ?? 50) >= 95) score += 25;
      score += (g.sinsal || []).length * 20;
      return { g, score };
    })
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ g }) => {
      const reasons = [];
      if (g.relation.label.includes("극")) reasons.push(g.relation.label);
      if (g.palmun?.score <= 15 || g.palmun?.score >= 95) reasons.push(g.palmun.label);
      if (g.sinsal?.length) reasons.push(g.sinsal.map(s => s.label).join("·"));
      return `  ${g.gungInfo.name}(${g.gungInfo.direction}): ${reasons.join(", ")}`;
    }).join("\n") || "  특이 동처 없음";

  return `[시스템 역할]
당신은 홍연기문(홍국기문) 전문 역술가입니다. 아래 포국 데이터와 내부 지침을 바탕으로 심층 운세 해석을 제공하세요.

${accuracyNote}${precisionNote}
---

## 기본 정보
- 생년월일시: ${userInput.year}년 ${userInput.month}월 ${userInput.day}일 (${meta.sijiChar}시)
- 양력/음력: ${userInput.calType === 'solar' ? '양력' : userInput.calType === 'lunar' ? '음력' : '음력 윤달'}
- 성별: ${userInput.gender || '미입력'}

## 사주팔자 (간지)
${hasAnySaju
  ? `- 연주: ${userInput.yearGan || '?'}${userInput.yearJi || '?'}
- 월주: ${userInput.monthGan || '?'}${userInput.monthJi || '?'}
- 일주: ${userInput.dayGan || '?'}${userInput.dayJi || '?'}
- 시주: ${userInput.hourGan || '?'}${userInput.hourJi || meta.sijiChar || '?'}`
  : `- 간지 미입력 (절기 기반 근사 포국)`}

## 절기·포국 정보
- 절기: ${meta.jeolgiName} / ${meta.type} ${meta.baseGuksu}국
- 삼원: ${samwonLabel[meta.samwonKey]}
- 일간 오행: ${analysis.dayGanOhaeng || '미입력 (근사 포국)'}

## 홍국수
- 지반 홍국수: ${analysis.jibanHong}
- 천반 홍국수: ${analysis.cheonbanHong}
- 세궁(世宮): ${analysis.segungIndex}번 ${analysis.segungName}

## 구궁 포국 결과 (지반 / 천반 / 생극관계 / 팔문)
${boardText}

## 자동 산출 길흉 요약
▶ 길방 TOP3
${gilText}

▶ 흉방 TOP3 (주의)
${hyungText}

## 동처(動處) — 현재 가장 활성화된 방위
${dongcheoText}

--- (주제: ${topicGuide})
1. 세궁(${analysis.segungName})의 팔문·천반·지반 관계를 종합해 현재 운세 전체 흐름을 설명해주세요.
2. 길방 TOP3의 팔문과 생극을 결합한 구체적 활용법(이동 방향·사무실 배치·기도 방위 등)을 알려주세요.
3. 흉방의 팔문과 그 위험성을 설명하고 회피 방법을 알려주세요.
4. 신살(탕화살·수옥살·겁살·백호살 등)이 발동된 궁이 있다면, 어떤 위험인지 구체적으로 설명하고 대처법을 알려주세요.
5. ${topicGuide}에 맞춰 실용적이고 구체적인 조언을 해주세요.

한국어로, 실용적이고 구체적으로 답해주세요.`;
}
