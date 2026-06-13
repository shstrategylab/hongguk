// =====================================================
// data-ganji.js — 천간·지지 선천수 및 간지 데이터
// 홍연기문 홍국수 산출의 기초 매핑 테이블
// =====================================================

// ── 천간(天干) 선천수 ─────────────────────────────
const CHEONGAN = {
  갑: { hanja: "甲", num: 9,  ohaeng: "목", eumsound: "양" },
  을: { hanja: "乙", num: 10, ohaeng: "목", eumsound: "음" },
  병: { hanja: "丙", num: 7,  ohaeng: "화", eumsound: "양" },
  정: { hanja: "丁", num: 8,  ohaeng: "화", eumsound: "음" },
  무: { hanja: "戊", num: 5,  ohaeng: "토", eumsound: "양" },
  기: { hanja: "己", num: 5,  ohaeng: "토", eumsound: "음" },  // 갑·기 동일 9 아닌 5 (홍연 기준)
  경: { hanja: "庚", num: 10, ohaeng: "금", eumsound: "양" },
  신: { hanja: "辛", num: 7,  ohaeng: "금", eumsound: "음" },
  임: { hanja: "壬", num: 8,  ohaeng: "수", eumsound: "양" },
  계: { hanja: "癸", num: 5,  ohaeng: "수", eumsound: "음" },
};

// ── 지지(地支) 선천수 ─────────────────────────────
const JIJI = {
  자: { hanja: "子", num: 9, ohaeng: "수", direction: "북",  siOrder: 1  },
  축: { hanja: "丑", num: 8, ohaeng: "토", direction: "북동", siOrder: 2  },
  인: { hanja: "寅", num: 7, ohaeng: "목", direction: "동북", siOrder: 3  },
  묘: { hanja: "卯", num: 6, ohaeng: "목", direction: "동",  siOrder: 4  },
  진: { hanja: "辰", num: 5, ohaeng: "토", direction: "동남", siOrder: 5  },
  사: { hanja: "巳", num: 4, ohaeng: "화", direction: "남동", siOrder: 6  },
  오: { hanja: "午", num: 9, ohaeng: "화", direction: "남",  siOrder: 7  },
  미: { hanja: "未", num: 8, ohaeng: "토", direction: "남서", siOrder: 8  },
  신: { hanja: "申", num: 7, ohaeng: "금", direction: "서남", siOrder: 9  },
  유: { hanja: "酉", num: 6, ohaeng: "금", direction: "서",  siOrder: 10 },
  술: { hanja: "戌", num: 5, ohaeng: "토", direction: "서북", siOrder: 11 },
  해: { hanja: "亥", num: 4, ohaeng: "수", direction: "북서", siOrder: 12 },
};

// ── 삼원(三元) 판별 — 부두일 지지 기준 ───────────
// 부두일: 일간이 甲 또는 己인 날
const SAMWON = {
  sang:  { jijiList: ["자","오","묘","유"], label: "상원(上元)" },
  jung:  { jijiList: ["인","신","사","해"], label: "중원(中元)" },
  ha:    { jijiList: ["진","술","축","미"], label: "하원(下元)" },
};

// ── 60갑자 순서 ───────────────────────────────────
const GANJI_60 = [
  "갑자","을축","병인","정묘","무진","기사","경오","신미","임신","계유",
  "갑술","을해","병자","정축","무인","기묘","경진","신사","임오","계미",
  "갑신","을유","병술","정해","무자","기축","경인","신묘","임진","계사",
  "갑오","을미","병신","정유","무술","기해","경자","신축","임인","계묘",
  "갑진","을사","병오","정미","무신","기유","경술","신해","임자","계축",
  "갑인","을묘","병진","정사","무오","기미","경신","신유","임술","계해",
];

// ── 시지(時支) → 시간 범위 ───────────────────────
const SI_TIME = {
  자: { label: "자시(子時)", start: 23, end: 1  },
  축: { label: "축시(丑時)", start: 1,  end: 3  },
  인: { label: "인시(寅時)", start: 3,  end: 5  },
  묘: { label: "묘시(卯時)", start: 5,  end: 7  },
  진: { label: "진시(辰時)", start: 7,  end: 9  },
  사: { label: "사시(巳時)", start: 9,  end: 11 },
  오: { label: "오시(午時)", start: 11, end: 13 },
  미: { label: "미시(未時)", start: 13, end: 15 },
  신: { label: "신시(申時)", start: 15, end: 17 },
  유: { label: "유시(酉時)", start: 17, end: 19 },
  술: { label: "술시(戌時)", start: 19, end: 21 },
  해: { label: "해시(亥時)", start: 21, end: 23 },
};

// 시간(hour) → 시지 변환 함수
function getHourToSiji(hour) {
  if (hour === 23 || hour === 0) return "자";
  const siKeys = Object.keys(SI_TIME);
  for (const key of siKeys) {
    const { start, end } = SI_TIME[key];
    if (start < end && hour >= start && hour < end) return key;
  }
  return "자";
}
