export function FormErrorSummary({ count, attempt }: { count: number; attempt: number }) {
  if (!count) return null
  return <p key={attempt} role="alert" aria-atomic="true"
    className="mt-3 border-l-4 border-red bg-paper px-3 py-2 text-sm text-ink">
    {count === 1 ? 'Correct the field marked below.' : `Correct the ${count} fields marked below.`}
  </p>
}
