import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
                    <h1 className="text-3xl font-bold mb-6 text-primary">이용약관</h1>

                    <div className="space-y-6 text-sm leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">제1조 (목적)</h2>
                            <p className="text-muted-foreground">
                                본 약관은 AfterTrip(이하 "서비스")이 제공하는 환율 계산 서비스의 이용조건 및 절차, 이용자와 서비스 간의
                                권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">제2조 (서비스의 제공 및 변경)</h2>
                            <div className="space-y-2 text-muted-foreground">
                                <p>1. 서비스는 다음과 같은 기능을 제공합니다.</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>외화 환전 시점에 따른 손익 계산</li>
                                    <li>과거 환율 데이터 조회 및 시뮬레이션</li>
                                    <li>은행 수수료를 반영한 실질 환전 금액 정보</li>
                                </ul>
                                <p className="mt-2">
                                    2. 서비스는 운영상의 필요에 따라 제공하는 기능의 일부 또는 전부를 수정, 변경하거나 종료할 수 있으며, 이에
                                    대하여 사용자에게 별도의 보상을 하지 않습니다.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">제3조 (서비스 이용)</h2>
                            <p className="text-muted-foreground">
                                본 서비스는 무료로 제공되며, 별도의 회원가입 없이 누구나 이용할 수 있습니다. 사용자는 본 서비스를 이용함으로써
                                약관에 동의한 것으로 간주합니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">제4조 (데이터의 성격)</h2>
                            <div className="space-y-2 text-muted-foreground">
                                <p>
                                    ① 제공되는 환율 데이터는 Frankfurter API를 기반으로 하며, 국내 시중 은행의 실시간 고시 환율과 일치하지 않을 수
                                    있습니다.
                                </p>
                                <p>
                                    ② 계산 결과에 적용된 수수료율은 일반적인 은행 기준을 적용한 추정치이며, 우대율이나 은행 정책에 따라 실제와 다를 수
                                    있습니다.
                                </p>
                                <p>③ 주말 및 공휴일에는 외환 시장이 마감되어 직전 영업일의 종가 환율이 반영됩니다.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">제5조 (면책 조항)</h2>
                            <div className="space-y-2 text-muted-foreground">
                                <p>
                                    ① 본 서비스의 결과는 단순 참고용이며, 서비스 이용으로 인해 발생하는 어떠한 금전적 손실이나 손해에 대해서도 책임을
                                    지지 않습니다.
                                </p>
                                <p>
                                    ② 서비스는 외부 API의 상태나 통신망의 장애 등 기술적 사유로 인해 일시적으로 중단되거나 오류가 발생할 수
                                    있습니다.
                                </p>
                                <p>
                                    ③ 사용자가 서비스를 통해 얻은 정보를 바탕으로 내린 투자 결정이나 행동에 대한 최종 책임은 사용자 본인에게
                                    있습니다.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">제6조 (지식재산권)</h2>
                            <p className="text-muted-foreground">
                                서비스가 제공하는 디자인, 텍스트, 로고, 소스 코드 및 UI 구성에 대한 지식재산권은 AfterTrip 운영자에게
                                있습니다. 사용자는 운영자의 사전 승낙 없이 이를 복제, 배포, 상업적으로 이용하거나 자동화된 도구(크롤러 등)를
                                이용해 데이터를 수집할 수 없습니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">제7조 (약관의 변경)</h2>
                            <p className="text-muted-foreground">
                                본 약관은 관련 법령 또는 서비스 정책 변경에 따라 수정될 수 있으며, 중요한 변경 사항이 있을 경우 웹사이트를 통해
                                공지합니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">제8조 (준거법 및 관할)</h2>
                            <p className="text-muted-foreground">
                                본 약관의 해석 및 분쟁에 대해서는 대한민국 법률을 적용하며, 서비스 이용과 관련하여 발생한 분쟁은 운영자의 주소지를
                                관할하는 법원을 전속 관할로 합니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">제9조 (문의)</h2>
                            <p className="text-muted-foreground">
                                서비스 이용과 관련한 문의사항은{" "}
                                <a href="mailto:kkariyong.studio@gmail.com" className="text-primary hover:underline">
                                    kkariyong.studio@gmail.com
                                </a>
                                으로 연락해 주시기 바랍니다.
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 pt-6 border-t">
                        <p className="text-xs text-muted-foreground">시행일: 2025년 12월 25일</p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
