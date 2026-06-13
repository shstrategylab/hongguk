/**
 * 홍국기문 생극제화 및 육친(六親) 자동 변환 데이터 및 로직
 */

// ==========================================
// 1. 오행(五行) 변환 매핑 데이터
// ==========================================

// 구궁(九宮) 위치별 고유 오행 매핑
export const PALACE_OHAENG_MAP = {
  1: '水', // 감궁 (북)
  2: '土', // 곤궁 (남서)
  3: '木', // 진궁 (동)
  4: '木', // 손궁 (동남)
  5: '土', // 중궁 (중앙)
  6: '金', // 건궁 (북서)
  7: '金', // 태궁 (서)
  8: '土', // 간궁 (동북)
  9: '火'  // 이궁 (남)
};

// 홍국수(1~10)별 고유 오행 및 음양 매핑 (홍국수는 10까지 존재하며, 0은 10토로 취급)
export const HONGGUK_OHAENG_MAP = {
  1: { ohaeng: '水', yinYang: '陽' },
  2: { ohaeng: '火', yinYang: '陰' },
  3: { ohaeng: '木', yinYang: '陽' },
  4: { ohaeng: '金', yinYang: '陰' },
  5: { ohaeng: '土', yinYang: '陽' },
  6: { ohaeng: '水', yinYang: '陰' },
  7: { ohaeng: '火', yinYang: '陽' },
  8: { ohaeng: '木', yinYang: '陰' },
  9: { ohaeng: '金', yinYang: '陽' },
  10: { ohaeng: '土', yinYang: '陰' },
  0: { ohaeng: '土', yinYang: '陰' } // 0은 10토와 동일 처리
};

// ==========================================
// 2. 오행 생극(生剋) 관계 정의 데이터
// ==========================================
export const OHAENG_RELATIONS = {
  // 상생 관계 (내가 생하는 오행)
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

export const OHAENG_MUTUAL_INJURY = {
  // 상극 관계 (내가 극하는 오행)
  '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
};

// ==========================================
// 3. 육친(六親) 자동 판별 로직
// ==========================================

/**
 * 세궁(기준)의 오행과 타 궁의 오행을 비교하여 육친을 판별합니다.
 * @param {string} selfOhaeng - 세궁(본인)의 오행 ('木', '火', '土', '金', '水')
 * @param {string} targetOhaeng - 비교할 타 궁의 오행
 * @returns {string} 육친 결과 ('형제', '자손', '처재', '관귀', '부모')
 */
export function getYukchin(selfOhaeng, targetOhaeng) {
  if (selfOhaeng === targetOhaeng) {
    return '형제'; // 비겁 (오행이 같음)
  }
  
  // 1. 내가 생해주는가? (자손 / 식상)
  if (OHAENG_RELATIONS[selfOhaeng] === targetOhaeng) {
    return '자손';
  }
  
  // 2. 나를 생해주는가? (부모 / 인성)
  if (OHAENG_RELATIONS[targetOhaeng] === selfOhaeng) {
    return '부모';
  }
  
  // 3. 내가 극하는가? (처재 / 재성)
  if (OHAENG_MUTUAL_INJURY[selfOhaeng] === targetOhaeng) {
    return '처재';
  }
  
  // 4. 나를 극하는가? (관귀 / 관성)
  if (OHAENG_MUTUAL_INJURY[targetOhaeng] === selfOhaeng) {
    return '관귀';
  }
  
  return '미상'; // 예외 방지용
}

/**
 * 홍국수 원천 데이터를 기반으로 한 종합 육친 도출 헬퍼 함수
 * @param {number} selfNum - 세궁의 홍국수
 * @param {number} targetNum - 대상 궁의 홍국수
 * @returns {Object} { ohaeng: 오행, yukchin: 육친 }
 */
export function calculateNumRelation(selfNum, targetNum) {
  const selfInfo = HONGGUK_OHAENG_MAP[selfNum];
  const targetInfo = HONGGUK_OHAENG_MAP[targetNum];
  
  if (!selfInfo || !targetInfo) return null;
  
  const yukchinName = getYukchin(selfInfo.ohaeng, targetInfo.ohaeng);
  
  return {
    targetOhaeng: targetInfo.ohaeng,
    targetYinYang: targetInfo.yinYang,
    yukchin: yukchinName
  };
}
