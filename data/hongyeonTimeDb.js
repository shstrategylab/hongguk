/**
 * 홍연기문 시간 기준 데이터베이스 (24절기 및 국수 마스터 데이터)
 * 입력된 생년월일시의 절기를 파악하고 연국/홍국의 기준국수를 도출하기 위한 DB입니다.
 */

const HongYeonTimeDatabase = {
  // 1. 24절기(Solar Terms) 정보 및 각 절기별 기문둔갑 '국수(局數)' 매핑
  // 동지~망종까지는 양둔(陽遁), 하지~대설까지는 음둔(陰遁)으로 치윤/초신접기 계산에 활용됩니다.
  twentyFourJeolgi: {
    // --- 양둔 (陽遁) 구간 : 기운이 일어나는 시기 ---
    dongji: { name: "동지(冬至)", type: "양둔", guksu: { sang: 1, jung: 7, ha: 4 }, desc: "양둔의 시작" },
    sohan: { name: "소한(小寒)", type: "양둔", guksu: { sang: 2, jung: 8, ha: 5 } },
    daehan: { name: "대한(大寒)", type: "양둔", guksu: { sang: 3, jung: 9, ha: 6 } },
    ipsoon: { name: "입춘(立春)", type: "양둔", guksu: { sang: 8, jung: 5, ha: 2 } },
    usu: { name: "우수(雨水)", type: "양둔", guksu: { sang: 9, jung: 6, ha: 3 } },
    gyeongchip: { name: "경칩(驚蟄)", type: "양둔", guksu: { sang: 1, jung: 7, ha: 4 } },
    chunbun: { name: "춘분(春分)", type: "양둔", guksu: { sang: 3, jung: 9, ha: 6 } },
    cheongmyeong: { name: "청명(淸明)", type: "양둔", guksu: { sang: 4, jung: 1, ha: 7 } },
    gogu: { name: "곡우(穀雨)", type: "양둔", guksu: { sang: 5, jung: 2, ha: 8 } },
    iphwa: { name: "입하(立夏)", type: "양둔", guksu: { sang: 4, jung: 1, ha: 7 } },
    sohman: { name: "소만(小滿)", type: "양둔", guksu: { sang: 5, jung: 2, ha: 8 } },
    mangjong: { name: "망종(芒種)", type: "양둔", guksu: { sang: 6, jung: 3, ha: 9 } },

    // --- 음둔 (陰遁) 구간 : 기운이 수렴하는 시기 ---
    haji: { name: "하지(夏至)", type: "음둔", guksu: { sang: 9, jung: 3, ha: 6 }, desc: "음둔의 시작" },
    soseo: { name: "소서(小暑)", type: "음둔", guksu: { sang: 8, jung: 2, ha: 5 } },
    daeseo: { name: "대서(大暑)", type: "음둔", guksu: { sang: 7, jung: 1, ha: 4 } },
    ipchu: { name: "입추(立秋)", type: "음둔", guksu: { sang: 2, jung: 5, ha: 8 } },
    chuseo: { name: "처서(處暑)", type: "음둔", guksu: { sang: 1, jung: 4, ha: 7 } },
    baekro: { name: "백로(白露)", type: "음둔", guksu: { sang: 9, jung: 3, ha: 6 } },
    chubun: { name: "추분(秋分)", type: "음둔", guksu: { sang: 7, jung: 1, ha: 4 } },
    hanro: { name: "한로(寒露)", type: "음둔", guksu: { sang: 6, jung: 9, ha: 3 } },
    sanggang: { name: "상강(霜降)", type: "음둔", guksu: { sang: 5, jung: 8, ha: 2 } },
    ipdong: { name: "입동(立冬)", type: "음둔", guksu: { sang: 6, jung: 9, ha: 3 } },
    soseol: { name: "소설(小雪)", type: "음둔", guksu: { sang: 5, jung: 8, ha: 2 } },
    daeseol: { name: "대설(大雪)", type: "음둔", guksu: { sang: 4, jung: 7, ha: 1 } }
  },

  // 2. 상원/중원/하원(三元) 결정을 위한 일진(日辰) 기호 규칙
  // 당일의 일진 천간/지지에 따라 해당 절기의 상원, 중원, 하원국 중 어떤 숫자를 쓸지 결정합니다.
  samwonRule: {
    sangwon: { description: "갑자, 갑오, 기묘, 기유 일진 기점", targets: ["甲子", "甲午", "己卯", "己酉"] },
    jungwon: { description: "갑인, 갑신, 기사, 기해 일진 기점", targets: ["甲寅", "甲申", "己巳", "己亥"] },
    hawon: { description: "갑진, 갑술, 기축, 기미 일진 기점", targets: ["甲辰", "甲戌", "己丑", "己未"] }
  }
};

// 3. 연산 가이드 헬퍼 함수 (의사 코드 포함)
// 사용자가 입력한 날짜의 천문학적 '절입 시간'과 비교하여 현재 상/중/하원국을 도출하는 핵심 로직 프레임
export const determineGuksu = (jeolgiKey, samwonType) => {
  const targetJeolgi = HongYeonTimeDatabase.twentyFourJeolgi[jeolgiKey];
  if (!targetJeolgi) return null;

  // 상원(sang), 중원(jung), 하원(ha)에 따른 국수 리턴
  const selectedGuksu = targetJeolgi.guksu[samwonType];
  
  return {
    jeolgiName: targetJeolgi.name,
    type: targetJeolgi.type, // 양둔 또는 음둔
    guksu: selectedGuksu      // 포국 엔진의 스타트 숫자가 됨
  };
};

export default HongYeonTimeDatabase;
