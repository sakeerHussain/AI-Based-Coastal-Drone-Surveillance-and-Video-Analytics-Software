export function focusFirstInvalid(form: HTMLFormElement | null) {
  requestAnimationFrame(() => {
    if (!form?.isConnected) return
    form.querySelector<HTMLElement>('input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"]')?.focus()
  })
}
