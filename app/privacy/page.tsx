import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Button>
        </Link>

        <Card className="p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-primary">개인정보처리방침</h1>

          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. 개인정보의 수집 및 이용 목적</h2>
              <p className="text-muted-foreground">
                AfterTrip은 회원가입 기능을 제공하지 않으며, 사용자의 개인 식별 정보(이름, 연락처 등)를 수집하거나 서버에
                저장하지 않습니다. 본 서비스는 여행 후 남은 외화의 환율 계산을 돕기 위한 도구로써 제공됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. 처리하는 데이터의 성격</h2>
              <p className="text-muted-foreground">
                서비스 이용 과정에서 입력하신 '통화 종류, 금액, 날짜' 정보는 환율 계산을 위해 일시적으로 처리되지만, 이는
                특정 개인을 식별할 수 없는 정보이며 계산 완료 후 별도의 데이터베이스(DB)에 저장되지 않고 즉시 파기됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. 개인정보의 보유 및 이용 기간</h2>
              <p className="text-muted-foreground">
                AfterTrip은 사용자의 개인정보를 수집 및 저장하지 않으므로, 별도의 보유 기간이나 파기 절차가 존재하지
                않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. 쿠키(Cookie) 및 자동 수집 장치</h2>
              <div className="text-muted-foreground space-y-2">
                <p>
                  ① AfterTrip은 사용자 경험 개선을 위해 브라우저의 로컬 스토리지 또는 쿠키를 최소한의 범위 내에서 사용할 수
                  있습니다.
                </p>
                <p>
                  ② 사용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다. 다만, 거부할 경우 일부 기능 사용에
                  어려움이 있을 수 있습니다.
                </p>
                <p>
                  ③ 서비스 호스팅 과정(Vercel 등)에서 웹사이트 접속 로그(IP 주소 등)가 생성될 수 있으나, 이는 서비스 안정성
                  확보를 위한 기술적 목적으로만 관리됩니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. 데이터의 제3자 제공 및 위탁</h2>
              <div className="text-muted-foreground space-y-2">
                <p>
                  ① AfterTrip은 사용자의 개인정보를 제3자에게 제공하거나 판매하지 않습니다.
                </p>
                <p>
                  ② 환율 정보 조회를 위해 Frankfurter API를 사용하며, 이 과정에서 개인을 식별할 수 없는 환율 조회 날짜와
                  통화 정보만이 API 제공자에게 전송됩니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. 개인정보 보호책임자</h2>
              <p className="text-muted-foreground">
                서비스 이용과 관련된 문의 사항은{" "}
                <a href="mailto:kkariyong.studio@gmail.com" className="text-primary hover:underline">
                  kkariyong.studio@gmail.com
                </a>
                으로 연락해 주시기 바랍니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. 개인정보처리방침 변경</h2>
              <p className="text-muted-foreground">
                본 방침은 2025년 12월 25일부터 적용됩니다. 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는
                변경사항의 시행 7일 전부터 웹사이트를 통해 고지할 것입니다.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-xs text-muted-foreground">최종 업데이트: 2025년 12월 25일</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
