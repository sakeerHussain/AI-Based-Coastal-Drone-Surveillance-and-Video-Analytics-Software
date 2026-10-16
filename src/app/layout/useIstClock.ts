import { useEffect, useState } from 'react'
import { currentTime, formatIstTime } from '../../lib/time'

export function useIstClock() {
  const [now, setNow] = useState(currentTime)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    function scheduleTick() {
      timer = setTimeout(() => {
        setNow(currentTime())
        scheduleTick()
      }, 60_000 - (currentTime() % 60_000))
    }
    scheduleTick()
    return () => clearTimeout(timer)
  }, [])

  return { dateTime: new Date(now).toISOString(), label: `${formatIstTime(now, true)} IST` }
}
