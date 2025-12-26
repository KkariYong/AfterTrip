# AfterTrip ✈️

> **"여행 후 서랍 속에 잠자고 있는 외화, 지금 재환전하면 이득일까?"**

**AfterTrip**은 여행 후 남은 외화를 다시 원화(KRW)로 환전할 때 발생하는 실질적인 손익(Profit/Loss)을 계산해주는 웹 서비스입니다.
은행 수수료를 반영한 정교한 계산과 과거 시점 비교 기능을 제공합니다.

<br/>

## 서비스 바로가기 
  **[AfterTrip 사용해보기](https://aftertrip.com)**

<br/>

## 주요 기능 

-   **실질 손익 계산**: 단순 매매기준율이 아닌, 은행 현찰 수수료(스프레드)를 반영한 실제 손익 계산
-   **타임 머신 (Time Machine)**: 슬라이더를 통해 과거 환전 시점부터 현재까지의 손익 변화 흐름 파악
-   **4대 주요 통화 지원**: USD, JPY, EUR, CNY
-   **직관적인 UI**: 이득/손실 여부를 색상과 아이콘으로 즉시 확인 가능

<br/>

## 기술 스택 (Tech Stack)

-   **Framework**: Next.js 14 (App Router), TypeScript
-   **Styling**: Tailwind CSS, shadcn/ui
-   **Data**: Frankfurter API (Exchange Rates)
-   **Deployment**: Vercel

<br/>

## 환율 계산 로직

사용자의 정확한 손익 계산을 위해 다음과 같은 로직을 사용합니다.

1.  **매수 금액 (과거)**: `환율 × (1 + 수수료율) × 외화` (여행 갈 때 비싸게 산 금액)
2.  **매도 금액 (현재)**: `환율 × (1 - 수수료율) × 외화` (지금 팔 때 싸게 파는 금액)
3.  **최종 손익**: `매도 금액 - 매수 금액`

> **참고**: 수수료율은 시중 은행의 일반적인 현찰 환전 수수료(USD 1.75%, JPY: 1.75%, EUR: 1.99%, CNY: 5.00%)를 적용했습니다.

<br/>

## Contact

-   **Email**: [kkariyong.studio@gmail.com](mailto:kkariyong.studio@gmail.com)