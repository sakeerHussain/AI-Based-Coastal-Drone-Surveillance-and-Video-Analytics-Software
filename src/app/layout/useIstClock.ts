import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export function useIstClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    function scheduleTick() {
      timer = setTimeout(() => {
        setNow(new Date())
        scheduleTick()
      }, 60_000 - (Date.now() % 60_000))
    }
    scheduleTick()
    return () => clearTimeout(timer)
  }, [])

  return { dateTime: now.toISOString(), label: `${formatter.format(now)} IST` }
}
