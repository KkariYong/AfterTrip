"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, TrendingDown, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { format, subYears, differenceInDays, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import Image from "next/image"

// 각 통화별 수수료율
const SPREAD_RATES = {
  USD: 0.0175,  // 1.75%
  JPY: 0.0175,  // 1.75%
  EUR: 0.0199,  // 1.99%
  CNY: 0.05,    // 5.00%
}

export default function AfterTripPage() {
  const [currency, setCurrency] = useState<keyof typeof SPREAD_RATES>("USD")
  const [amount, setAmount] = useState<string>("")
  const [baseDate, setBaseDate] = useState<Date>(new Date())
  const [comparisonDate, setComparisonDate] = useState<Date>(new Date())

  const [baseRate, setBaseRate] = useState<number>(0)
  const [currentRate, setCurrentRate] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [ratesData, setRatesData] = useState<Record<string, number>>({})

  const maxDate = useMemo(() => new Date(), [])
  const minDate = useMemo(() => subYears(maxDate, 1), [maxDate])

  const totalDays = differenceInDays(maxDate, baseDate)
  const currentDayOffset = differenceInDays(comparisonDate, baseDate)

  const fetchRates = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/exchange?currency=${currency}&startDate=${format(baseDate, "yyyy-MM-dd")}&endDate=${format(maxDate, "yyyy-MM-dd")}`,
      )
      const data = await response.json()

      if (data.rates) {
        const normalizedRates: Record<string, number> = {}

        for (const [date, rateValue] of Object.entries(data.rates)) {
          let numericRate: number = 0

          if (typeof rateValue === 'number') {
            numericRate = rateValue
          } else if (typeof rateValue === 'object' && rateValue !== null) {
            if ('KRW' in rateValue) {
              numericRate = Number((rateValue as any).KRW) || 0
            } else {
              const firstValue = Object.values(rateValue).find(v => typeof v === 'number')
              numericRate = typeof firstValue === 'number' ? firstValue : 0
            }
          } else {
            numericRate = Number(rateValue) || 0
          }

          normalizedRates[date] = numericRate
        }

        setRatesData(normalizedRates)

        const sortedDates = Object.keys(normalizedRates).sort()
        const baseDateStr = format(baseDate, "yyyy-MM-dd")

        // Base Rate 찾기
        const baseDateKey = sortedDates.find(date => date >= baseDateStr) || sortedDates[0]
        setBaseRate(normalizedRates[baseDateKey] || 0)

        // Current Rate 설정 (comparisonDate 기준)
        const currentComparisonDateStr = format(comparisonDate, "yyyy-MM-dd")
        const availableDates = sortedDates.filter(date => date <= currentComparisonDateStr)
        const comparisonDateKey = availableDates.length > 0
          ? availableDates[availableDates.length - 1]
          : sortedDates[sortedDates.length - 1]

        setCurrentRate(normalizedRates[comparisonDateKey] || 0)
      }
    } catch (error) {
      console.error("[AfterTrip] Error fetching exchange rates:", error)
    } finally {
      setLoading(false)
    }
  }, [currency, baseDate, maxDate]) // comparisonDate 제거 (fetch 루프 방지)

  // 통화 또는 날짜가 변경되었을 때 환율 데이터 가져오기
  useEffect(() => {
    if (currency && baseDate) {
      fetchRates()
    }
  }, [currency, baseDate, fetchRates])

  useEffect(() => {
    if (comparisonDate < baseDate) {
      setComparisonDate(baseDate)
    } else if (comparisonDate > maxDate) {
      setComparisonDate(maxDate)
    }
  }, [baseDate, maxDate]) // comparisonDate는 의존성에서 제외(무한루프 방지)

  // 환율 데이터 키 메모이제이션
  const ratesDataKeys = useMemo(() => Object.keys(ratesData), [ratesData])

  useEffect(() => {
    if (ratesDataKeys.length === 0 || !comparisonDate) {
      return
    }

    const comparisonDateStr = format(comparisonDate, "yyyy-MM-dd")
    let rate = ratesData[comparisonDateStr]

    if (!rate) {
      const sortedDates = [...ratesDataKeys].sort()
      const availableDates = sortedDates.filter(date => date <= comparisonDateStr)
      const closestDate = availableDates.length > 0
        ? availableDates[availableDates.length - 1]
        : sortedDates[0]

      rate = ratesData[closestDate] || 0
    }

    if (rate > 0) {
      setCurrentRate(rate)
    } else {
      setCurrentRate(0)
    }
  }, [comparisonDate, ratesData, ratesDataKeys])

  const handleSliderChange = (values: number[]) => {
    const daysToAdd = values[0]
    const newDate = addDays(baseDate, daysToAdd)

    if (newDate > maxDate) setComparisonDate(maxDate)
    else if (newDate < baseDate) setComparisonDate(baseDate)
    else setComparisonDate(newDate)
  }

  const handleDateStep = (direction: "prev" | "next") => {
    const dayOffset = direction === "prev" ? -1 : 1
    const newDate = addDays(comparisonDate, dayOffset)

    if (newDate >= baseDate && newDate <= maxDate) {
      setComparisonDate(newDate)
    }
  }

  // 손익 계산
  const calculateResult = () => {
    const numAmount = Number.parseFloat(amount.replace(/,/g, "")) || 0

    if (numAmount === 0 || ratesDataKeys.length === 0) {
      return { profitLoss: 0 }
    }

    if (!baseRate || !currentRate || baseRate === 0 || currentRate === 0) {
      return { profitLoss: 0 }
    }

    const spreadRate = SPREAD_RATES[currency]

    const buyingPrice = baseRate * (1 + spreadRate) * numAmount
    const sellingPrice = currentRate * (1 - spreadRate) * numAmount
    const profitLoss = sellingPrice - buyingPrice

    if (Number.isNaN(profitLoss) || !Number.isFinite(profitLoss)) {
      return { profitLoss: 0 }
    }

    return {
      profitLoss: Math.round(profitLoss),
    }
  }

  const result = calculateResult()
  const isProfit = result.profitLoss > 0

  const handleAmountChange = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "")
    const formatted = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    setAmount(formatted)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container max-w-md mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Image
              src="/logo.svg"
              alt="AfterTrip Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-3xl font-bold text-[#3182F6]">AfterTrip</h1>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              여행 후 남은 외화, 지금 재환전하면 이득일까?
            </p>
            <p className="text-sm text-muted-foreground text-balance">
              구매 시점과 비교해 지금 재환전하면 얼마가 이득인지 계산해드립니다.
            </p>
            <p className="text-sm text-muted-foreground text-balance">
              <span className="text-[#3182F6] font-semibold">타임 머신</span> 기능을 이용해 현재까지의 추이를 확인해보세요!
            </p>
          </div>
        </div>

        {/* 메인 카드 */}
        <Card className="p-6 mb-6 shadow-lg border-primary/10">
          <div className="space-y-6">
            {/* 통화 선택기 */}
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-semibold">
                어떤 돈인가요?
              </Label>
              <Select value={currency} onValueChange={(val) => setCurrency(val as keyof typeof SPREAD_RATES)}>
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">미국 달러 (USD)</SelectItem>
                  <SelectItem value="JPY">일본 엔 (JPY)</SelectItem>
                  <SelectItem value="EUR">유럽 유로 (EUR)</SelectItem>
                  <SelectItem value="CNY">중국 위안 (CNY)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 남은 금액 입력 */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold">
                남은 금액은?
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0"
                  className="text-lg pr-16"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  {currency}
                </span>
              </div>
            </div>

            {/* 환전일 선택기 */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">언제 환전했나요? (최대 1년 전)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !baseDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {baseDate ? format(baseDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={baseDate}
                    onSelect={(date) => date && setBaseDate(date)}
                    disabled={(date) => date > maxDate || date < minDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>

        {/* 타임 머신 슬라이더 */}
        <Card className="p-6 mb-6 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                타임 머신
              </Label>
              <span className="text-xs text-muted-foreground">{format(comparisonDate, "MMM d, yyyy")}</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDateStep("prev")}
                disabled={currentDayOffset <= 0}
                className="h-9 w-9 shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Slider
                value={[currentDayOffset]}
                onValueChange={handleSliderChange}
                max={Math.max(totalDays, 1)}
                step={1}
                className="w-full"
              />

              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDateStep("next")}
                disabled={currentDayOffset >= totalDays}
                className="h-9 w-9 shrink-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{format(baseDate, "MMM d")}</span>
              <span>{format(maxDate, "MMM d")}</span>
            </div>
          </div>
        </Card>

        {/* 결과 카드 */}
        {amount && (
          <Card
            className={cn(
              "p-6 shadow-lg border-2",
              isProfit ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500",
            )}
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md mb-2">
                {isProfit ? (
                  <TrendingUp className="h-8 w-8 text-green-600" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-600" />
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">{isProfit ? "Potential Gain" : "Potential Loss"}</p>
                <p className={cn("text-4xl font-bold", isProfit ? "text-green-600" : "text-red-600")}>
                  {isProfit ? "+" : ""}
                  {result.profitLoss.toLocaleString()} KRW
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* 유의사항 카드 */}
        <Card className="mt-6 p-6 bg-amber-50/50 border-amber-200 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💡</span>
              <h3 className="font-bold text-amber-900">이용 시 유의사항</h3>
            </div>

            <div className="space-y-3 text-sm text-amber-900/80">
              <div>
                <p className="font-semibold mb-1">환율 데이터 출처</p>
                <p className="text-xs leading-relaxed">
                  본 서비스는 글로벌 환율 정보(Frankfurter API)의 매매기준율을 기반으로 하며, 국내 시중 은행의 실시간
                  고시 환율과 다소 차이가 있을 수 있습니다.
                </p>
              </div>

              <div>
                <p className="font-semibold mb-1">수수료 기준</p>
                <p className="text-xs leading-relaxed">
                  은행별 표준 현찰 수수료율(USD 1.75%, JPY: 1.75%, EUR: 1.99%, CNY: 5.00%)을 적용하여 계산했습니다. 환율 우대(90% 쿠폰 등)나
                  주거래 은행 혜택은 반영되지 않았습니다.
                </p>
              </div>

              <div>
                <p className="font-semibold mb-1">영업일 기준</p>
                <p className="text-xs leading-relaxed">
                  주말 및 공휴일에는 환율 시장이 마감되어 직전 영업일의 종가가 반영됩니다.
                </p>
              </div>

              <div>
                <p className="font-semibold mb-1">면책 조항</p>
                <p className="text-xs leading-relaxed">
                  이 계산 결과는 단순 참고용이며, 실제 환전 시 발생하는 손익을 보장하지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 푸터 */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="space-y-4">
            {/* 링크 */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                개인정보처리방침
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                이용약관
              </a>
              <span className="text-muted-foreground">•</span>
              <a
                href="mailto:kkariyong.studio@gmail.com?subject=[AfterTrip] 문의합니다"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                문의하기
              </a>
            </div>

            {/* 저작권 및 유의사항 */}
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">© 2025 AfterTrip. All rights reserved.</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}