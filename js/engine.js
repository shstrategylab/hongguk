// =====================================================
// engine.js — 홍연기문 핵심 연산 엔진
// 절기분석 → 포국 → 오행해석 → 프롬프트 조립
// =====================================================

// ── 1. 절기 판별 ──────────────────────────────────
// 생년월일을 받아 해당 절기 키를 반환
function getCurrentJeolgi(month, day) {
  // MMDD 숫자 비교로 절기 판별
  const today = month * 100 + day;
  let currentKey = "dongji";

  for (const key of JEOLGI_ORDER) {
    const [jMonth, jDay] = JEOLGI_APPROX_DATE[key];
    if (jMonth === 1) continue; // 1월 절기는 아래에서 별도 처리
    const jDate = jMonth * 100 + jDay;
    if (today >= jDate) currentKey = key;
  }

  // 1월: 소한(6일)·대한(20일) 별도 처리
  if (month === 1) {
    if (day >= JEOLGI_APPROX_DATE.daehan[1]) return "daehan";
    if (day >= JEOLGI_APPROX_DATE.sohan[1])  return "sohan";
    return "dongji"; // 1월 1~5일은 전년도 동지 구간
  }

  return currentKey;
}

// ── 2. 삼원(三元) 판별 ───────────────────────────
// 일진 지지 기준: 자오묘유=상원, 인신사해=중원, 진술축미=하원
function getSamwon(jijiChar) {
  for (const [key, val] of Object.entries(SAMWON)) {
    if (val.jijiList.includes(jijiChar)) return key;
  }
  return "sang";
}

// ── 3. 기준 국수 도출 ────────────────────────────
function getBaseGuksu(jeolgiKey, samwonKey) {
  const jeolgi = JEOLGI_DATA[jeolgiKey];
  if (!jeolgi) return { guksu: 1, type: "양둔", jeolgiName: "알 수 없음" };
  return {
    guksu: jeolgi.guksu[samwonKey],
    type: jeolgi.type,
    jeolgiName: jeolgi.name,
  };
}

// ── 4. 홍국수(지반수) 산출 ───────────────────────
// 사주 8글자 선천수 합산 후 9로 나눈 나머지
function calcJibansu(saJuArray) {
  // saJuArray: ["갑","자","병","오","무","진","경","신"] 형태
  let total = 0;
  for (const char of saJuArray) {
    if (CHEONGAN[char]) total += CHEONGAN[char].num;
    else if (JIJI[char]) total += JIJI[char].num;
  }
  const remainder = total % 9;
  return remainder === 0 ? 9 : remainder;
}

// 천반수: 천간 4글자만 합산
function calcCheonbansu(cheonganArray) {
  let total = 0;
  for (const char of cheonganArray) {
    if (CHEONGAN[char]) total += CHEONGAN[char].num;
  }
  const remainder = total % 9;
  return remainder === 0 ? 9 : remainder;
}

// ── 5. 구궁 포국 (낙서 경로 배치) ───────────────
// 낙서 순행 경로: [5,6,7,8,9,1,2,3,4]
const NAKSEO_PATH = [5, 6, 7, 8, 9, 1, 2, 3, 4];

function deployBoard(baseGuksu, jibansu, cheonbansu, type) {
  const board = {};
  const isYangdun = type === "양둔";

  for (let i = 0; i < 9; i++) {
    const gungNum = NAKSEO_PATH[i];

    // 지반수: 기준국수 기점으로 순행/역행
    let jiVal = isYangdun
      ? ((baseGuksu + i - 1) % 9) + 1
      : ((baseGuksu - i - 1 + 900) % 9) + 1;

    // 천반수: 지반수 기점에서 추가 오프셋
    const offset = (cheonbansu - jibansu + 9) % 9;
    let chVal = ((jiVal + offset - 1) % 9) + 1;

    board[gungNum] = {
      gungNum,
      gungInfo: GUGUNG[gungNum],
      jibansu: jiVal,
      cheonbansu: chVal,
      relation: getRelationType(chVal, jiVal),
    };
  }
  return board;
}

// ── 6. 세궁(世宮) 도출 ───────────────────────────
// 출생연도 납음오행수 + 시지 가중치
function getSegung(birthYear, sijiChar) {
  // 납음오행: 연도 기반 간단 근사 (60갑자 주기)
  const idx60 = (birthYear - 1924) % 60;
  const napumMap = [2,2,1,1,9,9,7,7,5,5,3,3,8,8,6,6,4,4,9,9,2,2,7,7,5,5,3,3,8,8,
                    6,6,1,1,9,9,4,4,2,2,7,7,5,5,3,3,8,8,6,6,1,1,9,9,4,4,2,2,7,7];
  const N = napumMap[Math.max(0, idx60)] || 5;
  const W = JIJI[sijiChar]?.siOrder || 1;

  const pointer = (N + W - 1) % 9;
  return NAKSEO_PATH[pointer];
}

// ── 7. 메인 포국 함수 ────────────────────────────
// 입력: { year, month, day, hour, yearGan, yearJi, monthGan, monthJi,
//         dayGan, dayJi, hourGan, hourJi }
function runHongyeon(input) {
  const {
    year, month, day, hour,
    yearGan, yearJi, monthGan, monthJi,
    dayGan, dayJi, hourGan, hourJi,
  } = input;

  // 시지 계산
  const sijiChar = hourJi || getHourToSiji(hour);

  // 절기 판별
  const jeolgiKey = getCurrentJeolgi(month, day);

  // 삼원 판별 (일지 기준 — 여기선 월지로 근사)
  const samwonKey = getSamwon(monthJi || dayJi || "자");

  // 기준 국수
  const { guksu: baseGuksu, type, jeolgiName } = getBaseGuksu(jeolgiKey, samwonKey);

  // 사주 8글자 배열
  const saju8 = [yearGan, yearJi, monthGan, monthJi, dayGan, dayJi, hourGan, hourJi]
    .filter(Boolean);

  // 홍국수 산출
  const jibansu = calcJibansu(saju8);
  const cheonbansu = calcCheonbansu([yearGan, monthGan, dayGan, hourGan].filter(Boolean));

  // 포국
  const board = deployBoard(baseGuksu, jibansu, cheonbansu, type);

  // 세궁
  const segungIndex = getSegung(year, sijiChar);

  return {
    meta: { jeolgiKey, jeolgiName, type, baseGuksu, samwonKey },
    analysis: {
      jibansu,
      cheonbansu,
      segungIndex,
      segungName: GUGUNG[segungIndex]?.name || "",
    },
    board,
  };
}

// ── 8. AI 프롬프트 조립 ───────────────────────────
function buildAiPrompt(result, userInput) {
  const { meta, analysis, board } = result;

  const boardText = Object.values(board)
    .sort((a, b) => a.gungNum - b.gungNum)
    .map(g => {
      const r = g.relation;
      return `  ${g.gungInfo.name}(${g.gungInfo.direction}): 지반${g.jibansu} 천반${g.cheonbansu} → ${r.label} ${r.score}점 / ${r.summary}`;
    })
    .join("\n");

  return `당신은 홍연기문(홍국기문) 전문 역술가입니다. 아래 포국 데이터를 바탕으로 심층 운세 해석을 해주세요.

## 기본 정보
- 생년월일시: ${userInput.year}년 ${userInput.month}월 ${userInput.day}일 ${userInput.hour}시
- 절기: ${meta.jeolgiName} / ${meta.type} ${meta.baseGuksu}국
- 삼원: ${meta.samwonKey === 'sang' ? '상원' : meta.samwonKey === 'jung' ? '중원' : '하원'}

## 사주 홍국수
- 지반수(地盤數): ${analysis.jibansu}
- 천반수(天盤數): ${analysis.cheonbansu}
- 세궁(世宮): ${analysis.segungIndex}번 ${analysis.segungName}

## 구궁 포국 결과
${boardText}

## 해석 요청
1. 세궁(${analysis.segungName}) 중심으로 현재 전반적인 운세 흐름을 설명해주세요.
2. 가장 길한 방위 TOP 3와 활용 방법을 알려주세요.
3. 주의해야 할 흉방과 회피 방법을 알려주세요.
4. 올해 중점적으로 집중해야 할 분야(재물/직장/건강/인간관계)를 제안해주세요.

한국어로, 실용적이고 구체적으로 답해주세요.`;
}
