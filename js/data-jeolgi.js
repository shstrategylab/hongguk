// =====================================================
// data-jeolgi.js — 24절기 기준국수 테이블
// 홍연기문 초신접기법 기반 양둔/음둔 국수 매핑
// =====================================================

const JEOLGI_DATA = {
  // ── 양둔 (동지 ~ 망종) ──────────────────────────
  dongji:   { name: "동지(冬至)", type: "양둔", guksu: { sang: 1, jung: 7, ha: 4 } },
  sohan:    { name: "소한(小寒)", type: "양둔", guksu: { sang: 2, jung: 8, ha: 5 } },
  daehan:   { name: "대한(大寒)", type: "양둔", guksu: { sang: 3, jung: 9, ha: 6 } },
  ipchun:   { name: "입춘(立春)", type: "양둔", guksu: { sang: 8, jung: 5, ha: 2 } },
  usu:      { name: "우수(雨水)", type: "양둔", guksu: { sang: 4, jung: 1, ha: 7 } },
  gyeongchip: { name: "경칩(驚蟄)", type: "양둔", guksu: { sang: 1, jung: 7, ha: 4 } },
  chunbun:  { name: "춘분(春分)", type: "양둔", guksu: { sang: 3, jung: 9, ha: 6 } },
  cheongmyeong: { name: "청명(淸明)", type: "양둔", guksu: { sang: 4, jung: 1, ha: 7 } },
  gogu:     { name: "곡우(穀雨)", type: "양둔", guksu: { sang: 5, jung: 2, ha: 8 } },
  ipha:     { name: "입하(立夏)", type: "양둔", guksu: { sang: 4, jung: 9, ha: 2 } },
  soman:    { name: "소만(小滿)", type: "양둔", guksu: { sang: 5, jung: 2, ha: 8 } },
  mangjong: { name: "망종(芒種)", type: "양둔", guksu: { sang: 6, jung: 3, ha: 9 } },

  // ── 음둔 (하지 ~ 대설) ──────────────────────────
  haji:     { name: "하지(夏至)", type: "음둔", guksu: { sang: 9, jung: 3, ha: 6 } },
  soseo:    { name: "소서(小暑)", type: "음둔", guksu: { sang: 8, jung: 2, ha: 5 } },
  daeseo:   { name: "대서(大暑)", type: "음둔", guksu: { sang: 7, jung: 1, ha: 4 } },
  ipchu:    { name: "입추(立秋)", type: "음둔", guksu: { sang: 2, jung: 5, ha: 8 } },
  cheoseo:  { name: "처서(處暑)", type: "음둔", guksu: { sang: 1, jung: 4, ha: 7 } },
  baengno:  { name: "백로(白露)", type: "음둔", guksu: { sang: 9, jung: 3, ha: 6 } },
  chubun:   { name: "추분(秋分)", type: "음둔", guksu: { sang: 7, jung: 1, ha: 4 } },
  hallo:    { name: "한로(寒露)", type: "음둔", guksu: { sang: 1, jung: 4, ha: 7 } },
  sanggang: { name: "상강(霜降)", type: "음둔", guksu: { sang: 6, jung: 9, ha: 3 } },
  ipdong:   { name: "입동(立冬)", type: "음둔", guksu: { sang: 6, jung: 1, ha: 4 } },
  soseol:   { name: "소설(小雪)", type: "음둔", guksu: { sang: 6, jung: 9, ha: 3 } },
  daeseol:  { name: "대설(大雪)", type: "음둔", guksu: { sang: 4, jung: 7, ha: 1 } },
};

// 절기 순서 배열 (날짜 순)
const JEOLGI_ORDER = [
  "ipchun", "usu", "gyeongchip", "chunbun", "cheongmyeong", "gogu",
  "ipha", "soman", "mangjong", "haji", "soseo", "daeseo",
  "ipchu", "cheoseo", "baengno", "chubun", "hallo", "sanggang",
  "ipdong", "soseol", "daeseol", "dongji", "sohan", "daehan"
];

// 각 절기의 대략적인 양력 날짜 (월, 일) — 연도별 오차 ±1일
const JEOLGI_APPROX_DATE = {
  ipchun:       [2,  4],  usu:          [2, 19],
  gyeongchip:   [3,  6],  chunbun:      [3, 21],
  cheongmyeong: [4,  5],  gogu:         [4, 20],
  ipha:         [5,  6],  soman:        [5, 21],
  mangjong:     [6,  6],  haji:         [6, 21],
  soseo:        [7,  7],  daeseo:       [7, 23],
  ipchu:        [8,  7],  cheoseo:      [8, 23],
  baengno:      [9,  8],  chubun:       [9, 23],
  hallo:        [10, 8],  sanggang:     [10,23],
  ipdong:       [11, 7],  soseol:       [11,22],
  daeseol:      [12, 7],  dongji:       [12,22],
  sohan:        [1,  6],  daehan:       [1, 20],
};
