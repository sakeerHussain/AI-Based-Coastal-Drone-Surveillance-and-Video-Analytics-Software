const paths: Record<string, string> = {
  '/datasets': 'M4 3h16v18H4z M7 7h10 M7 11h4 M7 15h10 M7 18h6',
  '/watch-floor': 'M3 5h18v12H3z M8 21h8 M12 17v4 M7 11l3-3 4 5 3-3',
  '/feed-wall': 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  '/incidents': 'M12 3 2 21h20L12 3z M12 9v5 M12 17v1',
  '/zones-rules': 'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6z M9 3v15 M15 6v15',
  '/models': 'M4 4h16v16H4z M8 4V1 M16 4V1 M8 23v-3 M16 23v-3 M1 8h3 M1 16h3 M20 8h3 M20 16h3 M8 8h8v8H8z',
  '/video-sources': 'M3 5h12v14H3z M15 10l6-4v12l-6-4 M6 9h6 M6 13h4',
  '/fleet': 'M9 9h6v6H9z M9 9 5 5 M15 9l4-4 M9 15l-4 4 M15 15l4 4 M2 2h6v6H2z M16 2h6v6h-6z M2 16h6v6H2z M16 16h6v6h-6z',
  '/archive': 'M3 3h18v5H3z M5 8v13h14V8 M10 12l5 3-5 3v-6z',
  '/reports': 'M5 3h10l4 4v14H5V3z M14 3v5h5 M9 17v-4 M12 17v-6 M15 17v-2',
  '/users-audit': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M17 4a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-4',
  'Demo data only': 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 M12 11v6 M12 7v1',
  collapse: 'M3 4h18v16H3z M8 4v16 M16 9l-3 3 3 3',
  expand: 'M3 4h18v16H3z M8 4v16 M13 9l3 3-3 3',
}

export function SidebarIcon({ name }: { name: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 shrink-0"
    >
      <path d={paths[name]} />
    </svg>
  )
}
