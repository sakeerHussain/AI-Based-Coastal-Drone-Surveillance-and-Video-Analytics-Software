export interface AuditEntry {
  id: string
  createdAt: number
  actor: string
  action: string
  entityId: string
  before: Record<string, string | number> | null
  after: Record<string, string | number>
}
