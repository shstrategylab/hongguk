/**
 * 하락이수 대운 타임라인 데이터베이스
 * 
 * [원리 설명]
 * - 하락이수 대운은 6개의 효(초효~상효)를 순서대로 거치며 나이를 배정합니다.
 * - 양효(ㅡ)는 9년, 음효(--)는 6년 주기로 대운 기간이 산정됩니다.
 * - 본 DB는 1세부터 시작하는 고정된 효 흐름을 기반으로 작성되었으며,
 *   실제 사주의 초년 대운 시작 나이에 따라 전체 나이를 밀어서(shift) 사용하시면 됩니다.
 */
const HalarisooDaewonDB = {
  // 선천운 기준의 전반적인 일생의 틀
  lifeCycle: [
    {
      hyo: "초효",
      yinYang: "양효(ㅡ) 또는 음효(--)",
      duration: "9년 또는 6년",
      startAge: 1,
      endAge: "양효면 9세, 음효면 6세",
      focus: "기초 형성기, 부모/가정 환경, 건강 및 초기 성향"
    },
    {
      hyo: "2효",
      yinYang: "음효(--) 또는 양효(ㅡ)",
      duration: "6년 또는 9년",
      startAge: "초효 종료 다음 나이",
      endAge: "이전 나이 + 해당 효 주기",
      focus: "학업, 사회적 관계의 시작, 진로의 모색"
    },
    {
      hyo: "3효",
      yinYang: "양효(ㅡ) 또는 음효(--)",
      duration: "9년 또는 6년",
      startAge: "2효 종료 다음 나이",
      endAge: "이전 나이 + 해당 효 주기",
      focus: "본격적인 사회 진출, 직업, 경제활동의 기반 마련"
    },
    {
      hyo: "4효",
      yinYang: "음효(--) 또는 양효(ㅡ)",
      duration: "6년 또는 9년",
      startAge: "3효 종료 다음 나이",
      endAge: "이전 나이 + 해당 효 주기",
      focus: "사회적 위치 확립, 중년기 변화, 가정 및 재물 관리"
    },
    {
      hyo: "5효",
      yinYang: "양효(ㅡ) 또는 음효(--)",
      duration: "9년 또는 6년",
      startAge: "4효 종료 다음 나이",
      endAge: "이전 나이 + 해당 효 주기",
      focus: "인생의 최전성기, 리더십 발휘, 명예 및 권력의 시기"
    },
    {
      hyo: "상효",
      yinYang: "음효(--) 또는 양효(ㅡ)",
      duration: "6년 또는 9년",
      startAge: "5효 종료 다음 나이",
      endAge: "이전 나이 + 해당 효 주기",
      focus: "활동의 마무리, 노년기 건강, 정신적 성숙과 업적 정리"
    }
  ],
  
  // 후천운(체용관계) 참고용 괘의 성격
  afterheaven: {
    description: "선천운의 기본 틀 위에서 후천괘의 흐름이 체용관계(명궁과 신궁처럼)로 함께 작용함",
    usage: "선천괘 효의 나이별 대운을 살필 때, 후천괘의 해당 시기 괘상을 겹쳐서 길흉을 해석"
  }
};

// 특정 사주의 초년 대운 시작 나이(보통 1~10세 사이)에 맞춰 타임라인을 계산하는 함수
function calculateTimeline(startAge) {
  let currentAge = startAge;
  const timeline = [];
  
  HalarisooDaewonDB.lifeCycle.forEach((period, index) => {
    // 9년 또는 6년을 판별하는 로직은 실제 사주의 각 효의 음양 데이터를 기반으로 동적 할당하여 사용
    let years = index % 2 === 0 ? 9 : 6; 
    let endAge = currentAge + years - 1;
    
    timeline.push({
      hyo: period.hyo,
      ageRange: `${currentAge}세 ~ ${endAge}세`,
      period: `${years}년 주기`,
      theme: period.focus
    });
    
    currentAge = endAge + 1;
  });

  return timeline;
}

// 테스트 실행
const userTimeline = calculateTimeline(1);
console.log(userTimeline);
