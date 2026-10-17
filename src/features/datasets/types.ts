export interface AnnotationBox { id: string; label: string; x: number; y: number; width: number; height: number }
export interface DatasetFrame { id: string; name: string; shore: boolean; boxes: AnnotationBox[]; reviewed: boolean }
export interface DatasetVersion { id: string; name: string; createdAt: string; frames: DatasetFrame[] }
export interface DatasetRecord { id: string; name: string; source: string; frameCount: number; frames: DatasetFrame[]; versions: DatasetVersion[] }
export interface DatasetsData { datasets: DatasetRecord[]; classes: string[]; maxImportBytes: number }
