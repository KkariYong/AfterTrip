# 프로젝트: 애프터트립 (AfterTrip) - 여행 외화 환전 계산기

## 1. 프로젝트 개요 (Project Overview)
- **목표**: 여행 후 남은 외화를 현재 환율 기준으로 재환전했을 때의 손익(Profit/Loss)을 계산해주는 원페이지 웹 서비스.
- **가치 제안**: "타임머신" 기능(과거 vs 현재 비교)을 통해 사용자가 외화를 지금 팔아야 할지, 아니면 가지고 있어야 할지(존버) 결정하도록 돕습니다.
- **핵심 기능**: 슬라이더와 화살표로 날짜를 이동하며, 해당 시점에 팔았을 때의 손익금을 실시간으로 보여줍니다.

## 2. 기술 스택 (Tech Stack)
- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS + Shadcn UI
- **아이콘**: Lucide React
- **상태 관리**: React Hooks (useState, useEffect)
- **배포**: Vercel

## 3. 핵심 기능 및 로직 (Core Features & Logic)

### A. 입력 (사용자 액션)
1.  **통화 선택 (Currency Selector)**: USD(미국), JPY(일본), EUR(유럽), CNY(중국).
2.  **금액 (Amount)**: 숫자 입력 (천 단위 콤마 포맷팅 적용).
3.  **최초 환전일 (Base Date)**: 날짜 선택기 (Date Picker, 최대 1년 전까지만 선택 가능).

### B. 타임머신 슬라이더 & 컨트롤 (인터랙티브)
-   **범위 (Range)**: [최초 환전일] 부터 [오늘] 까지.
-   **슬라이더 (Slider)**: 드래그하여 날짜를 빠르게 이동.
-   **미세 조정 (Stepper)**: 좌/우 화살표 버튼을 클릭하여 **1일 단위**로 날짜를 정밀하게 이동.
-   **실시간 반응**: 날짜가 변할 때마다 해당 일자의 환율 정보를 가져와 손익을 재계산.

### C. 계산 로직 (현찰 살때/팔때 기준)
은행의 '현찰 살 때(Cash Buying)'와 '현찰 팔 때(Cash Selling)' 환율을 적용하여 실질적인 손익을 계산합니다.
(API는 보통 매매기준율만 제공하므로, 아래 스프레드 로직을 수동 적용합니다.)

-   **통화별 수수료율 (Spread Rates 가정)**:
    -   USD: 1.75%
    -   JPY: 1.75% (엔화는 보통 달러와 비슷하거나 조금 높음, 계산 편의상 1.75% 적용)
    -   EUR: 1.99%
    -   CNY: 5.00% (위안화는 수수료가 높음)
    
-   **상세 공식**:
    1.  **매수 금액 (Total Cost)** = 과거 내 지갑에서 나간 돈
        -   `과거 기준율 * (1 + 수수료율) * 입력 금액`
        -   *설명: 과거에 환전할 때 수수료를 더해서 비싸게 샀음을 반영.*
        
    2.  **매도 금액 (Current Value)** = 지금 팔면 받을 돈
        -   `비교 시점 기준율 * (1 - 수수료율) * 입력 금액`
        -   *설명: 지금 팔 때는 수수료를 떼고 싸게 팔아야 함을 반영.*
        
    3.  **최종 손익 (Profit/Loss)**
        -   `매도 금액 - 매수 금액`

### D. 결과 표시 (Result Display)
-   **손익금 (Profit/Loss)**: 원화(KRW)로 표시.
    -   이익 (>0): 초록색 텍스트 + "이득 (Gain)" + 📈 아이콘
    -   손해 (<0): 빨간색 텍스트 + "손해 (Loss)" + 📉 아이콘

## 4. UI/디자인 가이드라인 (Mobile First)
-   **레이아웃**: 싱글 컬럼, 모바일 최적화 (iPhone SE 너비 기준).
-   **테마**: 깔끔함(Clean), 모던함(Modern), 신뢰감(Trustworthy).
-   **색상**:
    -   Primary (강조색): 파란색 (`#3182F6`) - Toss 스타일
    -   Background: 아주 연한 회색 (Slate-50) 또는 흰색.
    -   Card: 흰색 배경에 은은한 그림자.
-   **컴포넌트 (Shadcn UI 사용)**:
    -   `Card`: 각 섹션(입력, 결과 등) 그룹화.
    -   `Slider`: 타임머신 타임라인 조절.
    -   `Button`: 좌우 화살표 아이콘(`ChevronLeft`, `ChevronRight`) 적용.
    -   `Select`: 통화 선택.
    -   `Input`: 금액 입력.
    -   `Popover` + `Calendar`: 날짜 선택.
-   **Footer (법적 필수 요소)**:
    -   Layout: Simple and clean at the bottom.
    -   Links:
        1.  **Privacy Policy** (개인정보처리방침)
        2.  **Terms of Service** (이용약관)
        3.  **Contact** (문의하기 - 이메일 표시)
    -   Copyright: "© 2025 AfterTrip. All rights reserved."
    -   Disclaimer: (위에 정한 한 줄 면책 조항 포함)

## 5. API 전략 (API Strategy)
-   **소스 (Source)**: Frankfurter API (`https://api.frankfurter.app`) - 무료, 키 필요 없음.
-   **프록시 (Proxy)**: Next.js Route Handler (`app/api/exchange/route.ts`)를 생성하여 데이터 호출.
    -   이유: CORS 에러 방지 및 API 로직 은닉.
-   **데이터 페칭 최적화**: 
    -   사용자가 '최초 환전일'을 선택하는 순간, `{최초환전일}..{오늘}` 까지의 **전체 일자별 환율 데이터**를 한 번에 불러옵니다.
    -   이후 슬라이더나 화살표를 움직일 때는 API를 다시 부르지 않고, 이미 받아온 데이터 배열(`Array`)에서 날짜만 찾아 즉시 보여줍니다. (반응 속도 극대화)

## 6. Page Structure 
-   `/` (Home): Main Calculator
-   `/privacy`: Privacy Policy text page
-   `/terms`: Terms of Service text page