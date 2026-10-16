export interface SceneObject {
  x: number
  y: number
  width: number
  height: number
  label: string
  tone: 'red' | 'amber' | 'green'
  kind: 'vessel' | 'person' | 'vehicle'
}
export interface SceneData {
  description: string
  sand: boolean
  zone: boolean
  objects: SceneObject[]
}
