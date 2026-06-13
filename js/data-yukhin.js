// =====================================================
// data-yukhin.js — 십신(十神)·육친(六親) 매핑 데이터
// 유료 결제 후 잠금 해제되는 프리미엄 해석 데이터
// =====================================================

// ── 십신 도출 규칙 ────────────────────────────────
// 세궁(나)의 오행을 기준으로 타 궁 오행과 비교
const YUKHIN_RULE = {
  // 나와 같은 오행
  같음: {
    양: { name: "비견(比肩)", label: "동료·형제·독립심", businessLabel: "나와 같은 편" },
    음: { name: "겁재(劫財)", label: "경쟁자·강한 자아", businessLabel: "라이벌" },
  },
  // 내가 생해주는 오행
  내가생: {
    양: { name: "식신(食神)", label: "재능·활동력·자식", businessLabel: "내 실력 발휘" },
    음: { name: "상관(傷官)", label: "창의력·말솜씨·자유", businessLabel: "아이디어" },
  },
  // 내가 극하는 오행
  내가극: {
    양: { name: "편재(偏財)", label: "횡재수·투자·사업", businessLabel: "대박 재물운" },
    음: { name: "정재(正財)", label: "고정 수입·자산", businessLabel: "안정 재물운" },
  },
  // 나를 극하는 오행
  나를극: {
    양: { name: "편관(偏官)", label: "직장·스트레스·권력", businessLabel: "직장·승진운" },
    음: { name: "정관(正官)", label: "명예·규범·남편", businessLabel: "명예·관직운" },
  },
  // 나를 생해주는 오행
  나를생: {
    양: { name: "편인(偏印)", label: "직관·종교·이동", businessLabel: "자격·합격운" },
    음: { name: "정인(正印)", label: "학문·문서·어머니", businessLabel: "계약·문서운" },
  },
};

// 세궁 오행 기준 타궁 오행 → 십신 관계 코드 도출
function getYukhinRelCode(segungOhaeng, targetOhaeng) {
  if (segungOhaeng === targetOhaeng) return "같음";
  if (OHAENG_RULE.생[segungOhaeng] === targetOhaeng) return "내가생";
  if (OHAENG_RULE.극[segungOhaeng] === targetOhaeng) return "내가극";
  if (OHAENG_RULE.생[targetOhaeng] === segungOhaeng) return "나를생";
  if (OHAENG_RULE.극[targetOhaeng] === segungOhaeng) return "나를극";
  return "같음";
}

// ── 운세 영역별 대표 십신 ──────────────────────────
const FORTUNE_AREA = {
  재물: {
    label: "재물운",
    icon: "💰",
    relCodes: ["내가극"],
    desc: "편재·정재가 있는 방이 재물 창고입니다.",
  },
  직장: {
    label: "직장·명예운",
    icon: "🏆",
    relCodes: ["나를극"],
    desc: "편관·정관이 있는 방이 직장·승진과 연결됩니다.",
  },
  학업: {
    label: "학업·합격운",
    icon: "📚",
    relCodes: ["나를생"],
    desc: "편인·정인이 있는 방에서 문서·시험 운이 열립니다.",
  },
  인간관계: {
    label: "인간관계",
    icon: "🤝",
    relCodes: ["같음"],
    desc: "비견·겁재가 있는 방이 동료·협력자와의 인연입니다.",
  },
  활동: {
    label: "활동·창의운",
    icon: "✨",
    relCodes: ["내가생"],
    desc: "식신·상관이 있는 방에서 재능과 표현력이 빛납니다.",
  },
};

// ── 프리미엄 해석 문구 템플릿 ─────────────────────
// {궁명}, {방향}, {십신명}, {점수}, {상태} 치환용
const PREMIUM_TEMPLATE = {
  high: (궁명, 방향, 십신명) =>
    `당신의 ${방향} ${궁명}은 <strong>${십신명}</strong> 방입니다. 현재 하늘의 기운이 강하게 밀어주는 형국으로, 이 방향으로의 움직임과 결정이 큰 이득을 가져옵니다.`,
  mid: (궁명, 방향, 십신명) =>
    `${방향} ${궁명}의 <strong>${십신명}</strong> 기운이 보통 수준입니다. 노력한 만큼의 성과를 기대할 수 있으나, 과욕은 금물입니다.`,
  low: (궁명, 방향, 십신명) =>
    `${방향} ${궁명}의 <strong>${십신명}</strong> 방이 현재 억눌려 있습니다. 이 영역의 결정은 신중히 미루고 때를 기다리는 것이 현명합니다.`,
};
