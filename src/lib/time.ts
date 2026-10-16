export const currentTime = () => Date.now()
export const appLoadedAt = currentTime()

const timeOptions: Intl.DateTimeFormatOptions = {
  timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
}
const timeFormatter = new Intl.DateTimeFormat('en-GB', timeOptions)
const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  ...timeOptions, day: '2-digit', month: 'short', year: 'numeric',
})

export function formatIstTime(timestamp: number, includeDate = false): string {
  return (includeDate ? dateTimeFormatter : timeFormatter).format(timestamp)
}
