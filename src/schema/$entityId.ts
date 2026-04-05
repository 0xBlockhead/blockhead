import type { EntityId } from '$/schema/$schema.ts'
import { parse, stringify } from 'devalue'

export const serializeEntityId = (entityId: EntityId) => stringify(entityId)

export const parseEntityId = (key: string): EntityId | null => {
	if (!key || key === '{}') return null
	try {
		const parsed = parse(key)
		if (parsed == null) return null
		if (typeof parsed !== 'object' || Array.isArray(parsed)) return null
		return parsed as EntityId
	} catch {
		return null
	}
}
