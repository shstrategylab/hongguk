/**
 * 홍연기문 세궁(世宮) 및 명궁 도출 엔진
 * 사용자의 생년 간지와 태어난 시를 기반으로 사주의 주인공 궁(Index)을 정밀 추적합니다.
 */
const HongYeonSegungFinder = {
  // 1. 육십갑자별 납음오행(納音五行) 마스터 데이터베이스 (예시 일부 및 규칙화)
  // 홍연기문은 태어난 해(年)의 납음오행 숫자를 기준으로 세궁을 산출하는 기준을 잡습니다.
  nabeomOhaengNumbers: {
    "갑자": 1, "을축": 1, "병인": 6, "정묘": 6, "무진": 5, "기사": 5,
    "경오": 4, "신미": 4, "임신": 3, "계유": 3, "갑술": 2, "을해": 2,
    "병자": 9, "정축": 9, "무인": 8, "기묘": 8, "경진": 7, "신사": 7,
    "임오": 6, "계미": 6, "갑신": 5, "을유": 5, "병술": 4, "정해": 4,
    // ... 실제 상용 엔진 개발 시 60갑자 전체 매핑 테이블이 적용됩니다.
    // 팁: 계산 편의를 위해 디폴트 폴백(Fallback) 수식을 지원하도록 설계합니다.
  },

  // 2. 십이지지 시(時)별 낙서 구궁 이동 가중치 Index (자=1, 축=2 ... 해=12)
  jijiIndex: {
    "子": 1, "丑": 2, "寅": 3, "卯": 4, "辰": 5, "巳": 6,
    "午": 7, "未": 8, "申": 9, "酉": 10, "戌": 11, "亥": 12
  },

  // 3. 낙서 순행 고정 경로 (순회 알고리즘용)
  nakseoPath:,

  /**
   * 고도화된 세궁(世宮) 산출 알고리즘
   * 홍범오행 수리와 출생 시(時)의 자리를 낙서 역학적 공식으로 연산합니다.
   * 
   * @param {string} birthYearGanji - 태어난 해의 간지 (예: "갑자")
   * @param {string} birthSiJiji - 태어난 시의 지지 (예: "子", "午", "寅")
   * @returns {number} 최종 세궁의 구궁 위치 번호 (1~9)
   */
  findSegungIndex: function(birthYearGanji, birthSiJiji) {
    // 1단계: 년간지에 해당하는 기본 홍범 마스터 숫자 획득
    let baseNabeomNum = this.nabeomOhaengNumbers[birthYearGanji] || 5; // 없는 경우 중궁(5) 폴백

    // 2단계: 출생 시(時)의 지지 가중치 환산 (자시=1 ~ 해시=12)
    let siWeight = this.jijiIndex[birthSiJiji] || 1;

    // 3단계: 홍연기문 정통 수리 공식 적용
    // (기본 납음수 + 시의 가중치 - 1) 값을 구궁(9)으로 나눈 나머지로 위치 순환 연산
    let pathPointer = (baseNabeomNum + siWeight - 1) % 9;
    
    // 4단계: 낙서 순행 경로배열에서 최종 주인공 궁의 인덱스 추출
    let finalSegung = this.nakseoPath[pathPointer];

    return finalSegung;
  },

  /**
   * 세궁 중심의 3x3 판 해단 확장 함수
   * @param {Object} interpretedBoard - 앞서 완성된 전체 구궁 해석 보드 객체
   * @param {number} segungIndex - 위 알고리즘으로 찾아낸 세궁 번호 (1~9)
   * @returns {Object} 주인공(세궁) 중심의 맞춤형 개인화 사주 데이터
   */
  injectPersonalizedInterpretation: function(interpretedBoard, segungIndex) {
    const board = interpretedBoard.board;
    const segungData = board[segungIndex];

    // 세궁(나)의 지반수를 기준으로 타 궁과의 육친(십신: 재물, 직장, 부모 등) 관계 정의 뼈대 생성
    let myNumber = segungData.jibansu;
    
    // 분석 결과 래핑
    return {
      ...interpretedBoard,
      analysis: {
        segungIndex: segungIndex,
        segungName: segungData.gungInfo.name,
        characterSummary: `사주의 주인공(世)이 ${segungData.gungInfo.name}에 위치해 있습니다.`,
        myJibansu: myNumber,
        myCheonbansu: segungData.cheonbansu,
        // 주인공 방의 길흉 등급 산출
        fortuneGrade: segungData.interpretation.score >= 70 ? "우수" : segungData.interpretation.score <= 30 ? "주의" : "보통"
      }
    };
  }
};

export default HongYeonSegungFinder;

// ==========================================
// [통합 실행 테스트 코드 흐름]
// ==========================================
// 1. 앞서 구현한 엔진으로 3x3 보드를 생성하고 해석을 마침
// const fullBoard = HongYeonInterpreter.interpretFullBoard(rawEngineBoard);
// 
// 2. 사용자의 사주 조건(갑자년 오시 태생)으로 주인공 방(세궁) 검색
// const segungIdx = HongYeonSegungFinder.findSegungIndex("갑자", "午"); 
// 
// 3. 전체 보드에 주인공 중심의 개인화 레이어 추가
// const finalProductData = HongYeonSegungFinder.injectPersonalizedInterpretation(fullBoard, segungIdx);
// console.log(finalProductData.analysis);
