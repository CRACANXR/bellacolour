"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface SaveTheDateNotificatorProps {
  initialTargetDate?: string // New prop to pre-fill the date
}

export default function SaveTheDateNotificator({ initialTargetDate }: SaveTheDateNotificatorProps) {
  const [targetDate, setTargetDate] = useState<string>(initialTargetDate || "")
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [isCountingDown, setIsCountingDown] = useState(false)

  // Effect to set targetDate if initialTargetDate changes
  useEffect(() => {
    if (initialTargetDate) {
      setTargetDate(initialTargetDate)
    }
  }, [initialTargetDate])

  const calculateTimeLeft = (dateString: string): TimeLeft | null => {
    const difference = +new Date(dateString) - +new Date()
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    } else {
      return null // Date has passed or is invalid
    }
    return timeLeft
  }

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null)
      setIsCountingDown(false)
      return
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate)
      if (newTimeLeft === null) {
        clearInterval(timer)
        setIsCountingDown(false)
      }
      setTimeLeft(newTimeLeft)
    }, 1000)

    setIsCountingDown(true)

    return () => clearInterval(timer)
  }, [targetDate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetDate(e.target.value)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-serif">Save the Date Notificator</CardTitle>
        <CardDescription>Düğün gününüze kalan süreyi takip edin!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!initialTargetDate && ( // Conditionally render input if no initial date is provided
          <div>
            <Label htmlFor="wedding-date" className="mb-2 block">
              Düğün Tarihi
            </Label>
            <Input id="wedding-date" type="date" value={targetDate} onChange={handleDateChange} className="w-full" />
          </div>
        )}

        {timeLeft ? (
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-rose-600">{timeLeft.days}</span>
              <span className="text-sm text-gray-600">Gün</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-rose-600">{timeLeft.hours}</span>
              <span className="text-sm text-gray-600">Saat</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-rose-600">{timeLeft.minutes}</span>
              <span className="text-sm text-gray-600">Dakika</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-rose-600">{timeLeft.seconds}</span>
              <span className="text-sm text-gray-600">Saniye</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            {targetDate && !isCountingDown ? <p>Tarih geçti veya geçersiz.</p> : <p>Düğün tarihinizi girin.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
