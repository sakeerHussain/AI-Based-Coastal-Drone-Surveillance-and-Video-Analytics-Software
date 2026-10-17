import { z } from 'zod'

export const sourceSchema = z.object({
  name: z.string().trim().min(2, 'Enter a source name.').max(80, 'Use 80 characters or fewer.'),
  droneId: z.string().trim().min(1, 'Select a drone.'),
  protocol: z.enum(['RTSP', 'RTMP', 'SRT']),
  endpoint: z.string().trim().min(1, 'Enter a demo stream address.').max(300, 'Use 300 characters or fewer.'),
  enabled: z.boolean(),
}).superRefine((value, context) => {
  try {
    const url = new URL(value.endpoint)
    if (!url.hostname || url.protocol !== `${value.protocol.toLowerCase()}:` || url.username || url.password) throw new Error()
  } catch {
    context.addIssue({ code: 'custom', path: ['endpoint'], message: `Use a valid ${value.protocol} address without embedded credentials.` })
  }
}).transform((value) => ({ ...value, endpoint: new URL(value.endpoint).href }))

export type SourceInput = z.infer<typeof sourceSchema>
export interface VideoSource extends SourceInput {
  id: string
  status: 'Connected' | 'Not tested' | 'Disabled'
  lastTested: number | null
  feedIndex: number | null
}
export interface SourceDrone { id: string; location: string }
export interface SourcesData { sources: VideoSource[]; drones: SourceDrone[] }
export interface RecordingMetadata { name: string; size: number; droneId: string }
export interface RecordingImport extends RecordingMetadata {
  id: string; createdAt: number; progress: number; status: 'Processing' | 'Complete'
}
export type SourceResult = { ok: true; message: string } | { ok: false; message: string }
