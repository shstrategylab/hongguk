/**
 * 기문둔갑 신살 및 기문 요소 배치 규칙 (포국 룰셋)
 */

// ==========================================
// 1. 삼기육의 (三奇六儀) 데이터 및 배치 패턴
// ==========================================
// 삼기육의 기본 순서 (戊 -> 己 -> 庚 -> 辛 -> 壬 -> 癸 -> 丁 -> 丙 -> 乙)
export const SAMGI_YUGUI_BASE = ['무', '기', '경', '신', '임', '계', '정', '병', '을'];

/**
 * 국수(1국~9국)와 양둔/음둔에 따른 삼기육의 구궁 배치 맵을 반환합니다.
 * @param {number} guk - 국수 (1 ~ 9)
 * @param {string} direction - FLOW_DIRECTIONS.YANG_DUN 또는 EUM_DUN
 * @returns {Object} 궁 번호(1~9)를 키로 하고 삼기육의를 값으로 하는 객체
 */
export function getSamgiYuguiLayout(guk, direction) {
  const layout = {};
  // 양둔은 순행(1->9), 음둔은 역행(9->1)으로 구궁을 순회하며 삼기육의를 배치
  const palaceSequence = (direction === 'FORWARD') 
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9] 
    :;

  // 무(戊)가 시작하는 궁의 인덱스를 국수를 통해 계산
  let currentPalaceIdx = palaceSequence.indexOf(guk);

  SAMGI_YUGUI_BASE.forEach((element) => {
    const palace = palaceSequence[currentPalaceIdx];
    layout[palace] = element;
    
    // 다음 궁으로 이동 (인덱스 순환)
    currentPalaceIdx = (currentPalaceIdx + 1) % 9;
  });

  return layout;
}

// ==========================================
// 2. 팔문 (八門) 데이터 및 회전 규칙
// ==========================================
// 팔문의 고유 순서 (시계방향 순환 구조)
export const PALMUN_BASE = ['휴문', '생문', '상문', '두문', '경문', '사문', '경문2', '개문']; 
// *주의: 경문(景門)과 경문(驚門)은 한자가 다르므로 내부 데이터 구분 필요 (예: '경문', '사문', '사문_驚')
export const PALMUN_LIST = ['휴문', '생문', '상문', '두문', '경문', '사문', '경문_驚', '개문'];

// 팔문의 고유 원위치 (지반 고유 궁 매핑)
export const PALMUN_HOME_PALACE = {
  '휴문': 1, '생문': 8, '상문': 3, '두문': 4,
  '경문': 9, '사문': 2, '경문_驚': 7, '개문': 6
  // 5궁(중궁)은 대궁인 2궁 사문이나 8궁 생문에 기생함
};

/**
 * 시지(時支) 및 직사(直使) 기준으로 팔문을 회전시키는 규칙 데이터
 * (실제 구현 시에는 해당 시주의 천간/지지가 속한 순수(旬首)와 직사를 계산하여 궁을 이동시킵니다)
 */
export const PALMUN_ROTATION_RULE = {
  YANG_DUN_ORDER:, // 양둔 시 팔문이 이동하는 궁 순서
  EUM_DUN_ORDER: [9, 2, 7, 6, 1, 8, 3, 4]   // 음둔 시 팔문이 이동하는 궁 순서
};

// ==========================================
// 3. 구성 (九星) 및 팔장 (八將) 데이터
// ==========================================

// 구성 (九星) 고유 리스트 및 원천 번호 (구궁 고유 위치)
export const GUSEONG_DATA = {
  '천봉성': 1, '천예성': 2, '천충성': 3, '천보성': 4,
  '천금성': 5, '천심성': 6, '천주성': 7, '천임성': 8, '천영성': 9
};

// 팔장 (八將) 고유 리스트 (양둔과 음둔에 따라 순서가 바뀜)
export const PALJANG_BASE = ['직부', '등사', '태음', '육합', '구천', '구지', '주작', '현무'];
// *음둔일 때는 주작 대신 '구진', 현무 대신 '백호'를 사용하기도 하는 규칙 반영
export const PALJANG_EUM_DUN_BASE = ['직부', '등사', '태음', '육합', '구천', '구지', '구진', '백호'];

/**
 * 구성과 팔장 배치를 위한 흐름 제어 규칙
 */
export const SHINSAL_PLACEMENT_RULES = {
  // 구성은 항상 시지(時支)가 만나는 천반의 직부(直符)성치에서 시작하여 시계방향 배열
  GUSEONG_ROTATION:, 
  
  // 팔장은 항상 천반 직부(直符)가 있는 궁 위에 대가리를 두고 시작함
  PALJANG_DIRECTION: {
    FORWARD: 'CLOCKWISE',     // 양둔: 시계방향 배치
    REVERSE: 'COUNTER_CLOCKWISE' // 음둔: 반시계방향 배치
  }
};
