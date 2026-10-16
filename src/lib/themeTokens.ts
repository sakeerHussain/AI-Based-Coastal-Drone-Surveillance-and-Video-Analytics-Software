export function readChartTokens() {
  const style = getComputedStyle(document.documentElement)
  const token = (name: string) => style.getPropertyValue(`--color-${name}`).trim()
  return {
    shoal: token('shoal'), land: token('land'), sea: token('sea'), panel: token('panel'),
    ink: token('ink'), red: token('red'), amber: token('amber'), green: token('green'),
  }
}
export type ChartTokens = ReturnType<typeof readChartTokens>
