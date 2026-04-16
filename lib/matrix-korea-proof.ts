/**
 * Per-network “Korea proof” for the Kelly matrix page — EN + KO + explicit “therefore.”
 */
export interface MatrixKoreaRow {
  n: number;
  title: string;
  role: string;
  koreaProof: string;
  /** One-line Korean summary for citizens / 한국 실증. */
  koreaProofKo: string;
  highlight: string;
  highlightKo: string;
  /** Why this lane matters for Korea (argument, not only description). */
  therefore: string;
  thereforeKo: string;
  sourceLabel: string;
  sourceUrl: string;
  /** Optional Korean-primary institutional link. */
  sourceLabelKo?: string;
  sourceUrlKo?: string;
}

export const matrixKoreaRows: MatrixKoreaRow[] = [
  {
    n: 1,
    title: 'Advocacy networks',
    role: 'Articulate and push emerging rights claims across institutions and publics.',
    koreaProof:
      'Korean civil-society legal NGOs and bar associations file cases, submit UPR stakeholder briefs, and work with UNHCR on asylum and detention — transnational advocacy feeding domestic debate.',
    koreaProofKo:
      '시민단체·변호사단체가 소송·UPR 이해관계자 의견서·UNHCR 연계로 난민·구금 이슈를 제기 — 제네바 담론이 국내 의제로 이어짐.',
    highlight: 'UPR stakeholder submissions + litigation-driven advocacy',
    highlightKo: 'UPR 이해관계자 제출 + 소송 기반 옹호',
    therefore:
      'So what: Korean voters see “domestic” fights that are already shaped by Geneva-facing filings — the agenda is not only made in the National Assembly.',
    thereforeKo:
      '그래서 중요한 점: 국회만의 의제가 아니라, 이미 제네바 형식의 제출과 연동된 싸움이 국내 정치에 흡입됩니다.',
    sourceLabel: 'OHCHR — UPR Republic of Korea (stakeholder hub)',
    sourceUrl: 'https://www.ohchr.org/en/hr-bodies/upr/upr-republic-of-korea-stakeholder-info-s14',
    sourceLabelKo: '유엔인권 — UPR 대한민국(이해관계자 자료; 영문 페이지)',
    sourceUrlKo: 'https://www.ohchr.org/en/hr-bodies/upr/upr-republic-of-korea-stakeholder-info-s14',
  },
  {
    n: 2,
    title: 'Research networks',
    role: 'Produce evidence and framing that legitimizes policy change.',
    koreaProof:
      'International research bodies profile Korea’s asylum and detention system with country reports and data gaps; that evidence becomes the baseline for “reform” talking points.',
    koreaProofKo:
      '국제 연구 프로젝트가 한국의 이주·구금을 사례 국가로 정리 — 숫자와 격차가 ‘개선 필요’ 담론의 근거가 됨.',
    highlight: 'Third-party country reports used in global monitoring',
    highlightKo: '글로벌 모니터링에 쓰이는 제3국 보고서',
    therefore:
      'So what: once Korea is a named case study, domestic officials respond to reputational risk — not only to local polls.',
    thereforeKo:
      '그래서 중요한 점: ‘사례 국가’로 이름이 올라가면 국내 관료도 평판 리스크에 반응하게 됩니다.',
    sourceLabel: 'Global Detention Project — Korea report (2020)',
    sourceUrl:
      'https://www.globaldetentionproject.org/immigration-detention-in-the-republic-of-korea-penalising-people-in-need-of-protection',
  },
  {
    n: 3,
    title: 'Policy networks',
    role: 'Translate norms into drafts, administrative practice, and inter-agency alignment.',
    koreaProof:
      'Ministry of Justice runs immigration and refugee administration; deportation rules and legislative drafts track court rulings and treaty dialogue — the bridge between “Geneva language” and 한국 행정.',
    koreaProofKo:
      '법무부가 출입국·난민 행정의 중심 — 송환·보호·입법안이 판결·조약 대화와 연동됩니다.',
    highlight: 'MOJ-led immigration/refugee policy machinery',
    highlightKo: '법무부 중심의 출입국·난민 정책 장치',
    therefore:
      'So what: everyday enforcement policy is where abstract UN norms become deportation letters and detention orders citizens rarely read.',
    thereforeKo:
      '그래서 중요한 점: 추상적 UN 규범이 실제로는 송환 통지·구금 결정이라는 일상 행정으로 구현됩니다.',
    sourceLabel: 'Ministry of Justice (English)',
    sourceUrl: 'https://www.moj.go.kr/english/',
    sourceLabelKo: '대한민국 법무부',
    sourceUrlKo: 'https://www.moj.go.kr',
  },
  {
    n: 4,
    title: 'Standards-setting networks',
    role: 'Declare or adopt soft-law standards outside classic treaty ratification.',
    koreaProof:
      'Korea adopts ISSB-style climate disclosure momentum, CBDC/BIS-style pilots, and regulator-led “best practice” — standards arrive through 금융위/FSC and central bank channels.',
    koreaProofKo:
      '기후 공시·CBDC 시범 등 ‘글로벌 표준’이 금융당국·한국은행 경로로 이식됩니다.',
    highlight: 'Regulatory adoption of global disclosure / fintech norms',
    highlightKo: '공시·핀테크 글로벌 규범의 국내 이식',
    therefore:
      'So what: “voluntary” global standards still harden into filings and audits that firms and citizens pay for.',
    thereforeKo:
      '그래서 중요한 점: ‘자율’ 표준이라도 공시·감사로 굳어 기업과 국민 비용으로 전가됩니다.',
    sourceLabel: 'Financial Services Commission (English)',
    sourceUrl: 'https://www.fsc.go.kr/eng',
    sourceLabelKo: '금융위원회',
    sourceUrlKo: 'https://www.fsc.go.kr',
  },
  {
    n: 5,
    title: 'Interpretive networks',
    role: 'Treaty bodies and expert committees define scope and “correct” implementation.',
    koreaProof:
      'UN treaty bodies issue concluding observations and Views on Korea; those texts set the “correct” reading that the state must answer in follow-up — including ICCPR (자유권규약) dialogue.',
    koreaProofKo:
      '인권조약 기구의 결론적 의견·개별 의견이 ‘올바른 이행’의 기준이 됨 — 자유권규약(ICCPR) 대화 포함.',
    highlight: 'Treaty-body conclusions → national reporting cycle',
    highlightKo: '조약기구 결론 → 국가 보고 의무',
    therefore:
      'So what: Korean ministries draft reports to Geneva to explain domestic law — interpretive networks quietly steer legislative fixes.',
    thereforeKo:
      '그래서 중요한 점: 국내 법을 설명하는 제네바 보고서가 입법 수정 압력으로 되돌아옵니다.',
    sourceLabel: 'OHCHR — Republic of Korea (treaty bodies)',
    sourceUrl: 'https://www.ohchr.org/en/state/korea-republic',
    sourceLabelKo: '유엔인권 — 대한민국 조약기구(영문 허브)',
    sourceUrlKo: 'https://www.ohchr.org/en/state/korea-republic',
  },
  {
    n: 6,
    title: 'Explanatory networks',
    role: 'Train civil society, firms, and officials on the “right” reading of norms.',
    koreaProof:
      'NHRCK (국가인권위원회) investigations on immigration detention and recommendations “explain” rights norms to agencies — shaping what counts as acceptable practice.',
    koreaProofKo:
      '인권위 조사·권고가 이주 구금 관행을 ‘어떻게 읽어야 하는지’ 행정에 각인시킵니다.',
    highlight: 'NHRCK detention findings → administrative expectations',
    highlightKo: '인권위 구금 관련 권고 → 행정 기대치',
    therefore:
      'So what: explanatory networks turn soft findings into checklists that immigration officers and wardens actually train against.',
    thereforeKo:
      '그래서 중요한 점: 연성 권고가 현장 교육·체크리스트로 내려와 관리인·집행관의 기준이 됩니다.',
    sourceLabel: 'National Human Rights Commission of Korea',
    sourceUrl: 'https://www.humanrights.go.kr/',
    sourceLabelKo: '국가인권위원회',
    sourceUrlKo: 'https://www.humanrights.go.kr/',
  },
  {
    n: 7,
    title: 'Implementation networks',
    role: 'Drive legislation, procurement rules, and domestic institutional change.',
    koreaProof:
      'Statutes encode soft-law ideas: 난민법 (Refugee Act), 인공지능기본법 (AI labeling), CBDC pilots — implementation is where Geneva becomes 법령 on paper.',
    koreaProofKo:
      '난민법·AI기본법·CBDC 관련 법령이 국제 소프트로를 국내법으로 전환한 사례 — law.go.kr에서 조문 확인.',
    highlight: 'Acts & decrees: refugee, AI, CBDC (verify on law.go.kr)',
    highlightKo: '난민법·AI기본법·디지털화폐 — 국가법령정보센터에서 조문 확인',
    therefore:
      'So what: this is the citizen-facing layer — if you only watch the National Assembly, you see the implementation network doing the real wiring.',
    thereforeKo:
      '그래서 중요한 점: 국민이 체감하는 층입니다. 국회만 보면 이 배선을 놓치기 쉽습니다.',
    sourceLabel: '국가법령정보센터 law.go.kr',
    sourceUrl: 'https://www.law.go.kr/',
  },
  {
    n: 8,
    title: 'Assessment networks',
    role: 'Monitoring, rankings, and peer review that pressure compliance.',
    koreaProof:
      'UPR cycles and OHCHR compilations grade Korea’s record; civil-society shadow reports add parallel scores — periodic “report cards” that diplomats cite.',
    koreaProofKo:
      'UPR·유엔 자료·시민사회 그림자 보고가 대한민국 기록을 채점 — 외교 무대의 보고서 카드.',
    highlight: 'UPR peer review + stakeholder matrices',
    highlightKo: 'UPR 동료 심사 + 이해관계자 매트릭스',
    therefore:
      'So what: assessment is how “Korea is behind” becomes talking points in Geneva and Seoul at the same time.',
    thereforeKo:
      '그래서 중요한 점: ‘한국이 뒤처졌다’는 말이 제네바와 서울에서 동시에 재생산되는 지점입니다.',
    sourceLabel: 'UPR Info — Korea (Republic of)',
    sourceUrl: 'https://upr-info.org/en/review/korea-republic',
  },
  {
    n: 9,
    title: 'Enforcement networks',
    role: 'Sanctions, litigation, and accountability mechanisms (including transnational).',
    koreaProof:
      'Constitutional Court: 2023 unconstitutional ruling on indefinite detention under 출입국관리법 제63조 제1항; UN Human Rights Committee Views on airport transit — enforcement beyond statutes.',
    koreaProofKo:
      '2023년 헌법재판소 위헌 결정(출입국관리법 제63조 제1항) — 무기한 구금; 인권위원회 개별 의견 등 집행 층.',
    highlight: '2023 Constitutional Court + ICCPR Views (transit detention)',
    highlightKo: '2023년 헌재 위헌(제63조 제1항) + 자유권규약 개별 의견',
    therefore:
      'So what: when courts and treaty bodies bite, citizens see that “soft law” still produces hard remedies — or at least unconstitutional findings.',
    thereforeKo:
      '그래서 중요한 점: 법원·조약기구가 물면 ‘연성법’도 위헌·배상이라는 단단한 결과를 낳습니다.',
    sourceLabel: 'Refworld — Constitutional Court decision (summary)',
    sourceUrl: 'https://www.refworld.org/jurisprudence/caselaw/korcc/2023/ko/149907',
    sourceLabelKo: '헌법재판소 — 결정 상세(한국어)',
    sourceUrlKo: 'https://www.ccourt.go.kr',
  },
  {
    n: 10,
    title: 'Funding networks',
    role: 'Grants and blended finance that keep the other nine layers on life support.',
    koreaProof:
      'UN programmes, multilateral pots, and KOICA/ODA move money into governance and migration-adjacent projects — funding keeps NGOs and UN field offices in the loop.',
    koreaProofKo:
      'UN·다자 기금·KOICA 등이 거버넌스·이주 인접 프로젝트에 자금 — NGO·유엔 현장 유지.',
    highlight: 'UN programme funding + KOICA multilateral flows',
    highlightKo: '유엔 프로그램 + KOICA 다자 자금',
    therefore:
      'So what: follow the budget lines to see which networks stay loud when politics swing — funding is continuity.',
    thereforeKo:
      '그래서 중요한 점: 예산 줄을 따라가면 정권이 바뀌어도 어떤 네트워크가 살아 남는지 보입니다.',
    sourceLabel: 'KOICA — Korea’s ODA agency',
    sourceUrl: 'https://www.koica.go.kr',
  },
];

/** Thesis block: machine metaphor — bilingual. */
export const matrixThesisEn =
  'In Kelly’s account, these networks chain like a machine: advocacy and research seed an idea; policy and standards-setting freeze it as practice; interpretive and explanatory bodies fix meaning; implementation and assessment embed it in law and scorecards; enforcement and funding close the loop. The Korea column below is forensic: where that loop leaves a paper trail in 법령, courts, 행정, and UN files — evidence slices, not hype.';

export const matrixThesisKo =
  '켈리의 설명에 따르면, 이 네트워크들은 사슬처럼 연결되어 작동합니다: 옹호와 연구가 아이디어를 심고, 정책과 기준 설정이 관행으로 굳히며, 해석·설명 기구가 의미를 고정하고, 이행과 평가가 법령과 채점표에 새겨지고, 집행과 자금이 고리를 닫습니다. 아래 한국 열은 그 흔적이 법령·법원·행정기관·유엔 문서 속에 남은 증거의 단면입니다.';

export const matrixChainKo =
  '네트워크는 연쇄 작동합니다: 옹호 → 연구 → 정책 → 기준 설정 → 해석 → 설명 → 이행 → 평가 → 집행 → 자금 조달.';
