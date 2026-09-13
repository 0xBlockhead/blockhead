import { stringify } from 'devalue'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import { isJsonArray, isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'

export type MessariObservation = {
	coordinate: {
		caip2: { namespace: string; reference: string }
		entityKind: string
		entityId: string
		sourceRevision: string
		blockHash: string | null
	}
	measurement: JsonValue
	metadata?: Readonly<Record<string, string | number | boolean | null>>
}

const canonical = (value: JsonValue): JsonValue => {
	if (isJsonArray(value)) return value.map(canonical)
	if (isJsonObject(value))
		return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]))
	return value
}
const normalizeId = (id: string) => /^0x[0-9a-f]+$/i.test(id) ? id.toLowerCase() : id

/** Caller-owned comparison window. No process-global cache or durable guarantee. */
export const createMessariObservationSession = ({ capacity = 4096 }: { capacity?: number } = {}) => {
	if (!Number.isSafeInteger(capacity) || capacity < 1)
		throw new Error('Messari observation session requires positive integer capacity')
	const seen = new Map<string, { measurement: string; metadata: Record<string, string | number | boolean | null> }>()
	let generation = 0
	let disposed = false
	const assertActive = () => {
		if (disposed) throw new Error('Messari observation session disposed')
	}
	return {
		get size() { return seen.size },
		get disposed() { return disposed },
		reset() { assertActive(); seen.clear(); generation += 1 },
		dispose() { seen.clear(); disposed = true; generation += 1 },
		openRead() {
			assertActive()
			const capturedGeneration = generation
			return ({ coordinate, measurement, metadata = {} }: MessariObservation) => {
				assertActive()
				if (generation !== capturedGeneration)
					throw new Error('Messari observation session reset during read')
				if (coordinate.blockHash == null) return
				const hash = Hash32.assert(coordinate.blockHash).toLowerCase()
				const key = JSON.stringify([
					coordinate.caip2.namespace, coordinate.caip2.reference,
					coordinate.entityKind, normalizeId(coordinate.entityId),
					hash, coordinate.sourceRevision,
				])
				const fingerprint = stringify(canonical(measurement))
				const prior = seen.get(key)
				if (prior && prior.measurement !== fingerprint)
					throw new Error('Messari immutable-coordinate measurement conflict')
				const merged = { ...prior?.metadata }
				for (const [field, value] of Object.entries(metadata)) {
					const known = merged[field]
					if (known != null && value != null && known !== value)
						throw new Error('Messari immutable-coordinate metadata conflict: ' + field)
					if (value != null) merged[field] = value
				}
				if (!prior && seen.size >= capacity)
					throw new Error('Messari observation session capacity reached; reset or dispose this comparison window')
				seen.set(key, { measurement: fingerprint, metadata: merged })
			}
		},
	}
}
export type MessariObservationSession = ReturnType<typeof createMessariObservationSession>
