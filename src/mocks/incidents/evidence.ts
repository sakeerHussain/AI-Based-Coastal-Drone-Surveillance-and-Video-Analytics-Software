import type { EvidencePack } from '../../features/incidents'
import { incidentRecords } from './records'

const mockHashes = [
  'e1b51ee319d925dd27260e4c7fd6a2a41f6e35e79d3663ba56ac442fd867eccb',
  '4455996a3bb4850aa6ff84e27268eef26f4f41239af6d05f50a2874f2cc5e64d',
  '2e9e4862b9fec6f0ef51edca49f3c3133e9e978b312e7609a3e405b6224fb7ba',
  '9d32cc8046a0993a8470fcd2f693e283429a1f04ed9ec78c7ebaf9b6add44b17',
  '9640ff78dd7b3c096db971b0e7e54b2d9f3e7541d8a1dabe1b409ad004a16a8c',
  'db060cedad3854bb250c0d3f41ce5529f99d454d16c0c2a147ceffa10e92f67a',
  '75cf528e79de1d6cfb4a75843b3962f14b58cbf6b4b95d50575f139632348e22',
  'f1d2a003528d03ba2651469e3d59bd4c918776f7fd828cd4a7977940f49f95ad',
  'e991bbab5212deaa0063b5e4304d87bf67a033152643534c319b1afa84889dce',
  '9d16043297c0846e139ccb460ab0fb60f33093617665c2734071143b86844235',
  '31668fc684f0407e07fd2e243ede084bf5c7f6eda544fd9ee9a640ffdaf02c4b',
  'b3bd433fa14aa703a6c16efa4dae82071de50c7552a3123b19d86f45d728d14a',
  'd3072ad4cd882e2bd6d683466480077e3da0eb9228d2a1432ee1a07ad1c50e51',
  'c67104450da1b24b63ae058abaa9e0369b51553fac519f23f6530259db0173b7',
  'f4a5959af6e6409aafacaf18d1c67a1baa110e98ca6059706a52cefe6cd1c458',
  '5a5d6353409ecc8840be9e928eecb86aff5f15f9c9d8e3776c1f9cd078d7f074',
]
const counts: Record<string, [number, number]> = {
  'vessel-z04': [3, 12], 'crowd-cherai': [2, 6], 'jetty-kochi': [2, 8], 'zone-clear': [1, 3],
}
export const incidentEvidence: Record<string, EvidencePack> = Object.fromEntries(
  Object.values(incidentRecords).map((incident) => {
    const [clips, stills] = counts[incident.id]
    return [incident.id, {
      sha256: mockHashes[15], sealedAt: incident.detectedAt + 4_000,
      files: [
        ...Array.from({ length: clips }, (_, index) => ({
          name: `${incident.id}-clip-${String(index + 1).padStart(2, '0')}.mp4`,
          kind: 'clip' as const, sha256: mockHashes[index],
        })),
        ...Array.from({ length: stills }, (_, index) => ({
          name: `${incident.id}-still-${String(index + 1).padStart(2, '0')}.jpg`,
          kind: 'still' as const, sha256: mockHashes[clips + index],
        })),
      ],
    } satisfies EvidencePack]
  }),
)
