import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const currency = searchParams.get("currency")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  if (!currency || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    // Frankfurter API로 환율 데이터 가져오기기
    const response = await fetch(`https://api.frankfurter.app/${startDate}..${endDate}?to=KRW&from=${currency}`)

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates")
    }

    const data = await response.json()

    return NextResponse.json({
      rates: data.rates,
      currency: data.base,
    })
  } catch (error) {
    console.error("[v0] Exchange API error:", error)
    return NextResponse.json({ error: "Failed to fetch exchange rates" }, { status: 500 })
  }
}
