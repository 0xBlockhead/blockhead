import { serializeEntityId } from '$/schema/$entityId.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { entityCollectionRow } from '$/schema/$EntityCollectionRow.ts'

const listFieldEntityIdKey = (item: unknown) => {
	if (typeof item !== 'object' || item == null) return null
	const id = (item as Record<string, unknown>)[entityCollectionRow.id]
	return id != null && typeof id === 'object' && !Array.isArray(id) ?
			serializeEntityId(id as EntityId)
		:	null
}

/**
 * Merge multiple base rows for the same logical entity (different `$source`) for detail UIs.
 * `$$…` list fields are concatenated and deduped by child `$id`; scalars prefer first defined.
 */
export const mergeEntityCollectionRows = (
	rows: readonly Record<string, unknown>[],
): Record<string, unknown> | undefined => {
	if (rows.length === 0) return undefined
	if (rows.length === 1) return { ...rows[0] }
	const out: Record<string, unknown> = { ...rows[0] }
	delete out[entityCollectionRow.source]
	for (let i = 1; i < rows.length; i++) {
		const r = rows[i]
		for (const [k, v] of Object.entries(r)) {
			if (k === entityCollectionRow.source) continue
			if (v === undefined) continue
			if (k.startsWith('$$') && Array.isArray(v)) {
				const prev = out[k]
				const merged = [...(Array.isArray(prev) ? prev : []), ...v]
				const seen = new Set<string>()
				const deduped: unknown[] = []
				for (const item of merged) {
					const kk = listFieldEntityIdKey(item)
					if (kk == null) {
						deduped.push(item)
						continue
					}
					if (seen.has(kk)) continue
					seen.add(kk)
					deduped.push(item)
				}
				out[k] = deduped
			} else if (out[k] === undefined || out[k] === null) {
				out[k] = v
			}
		}
	}
	return out
}
