import type { EntityCollectionItem } from '$/collections/$collections.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityFieldValues, EntityType } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import type { Source } from '$/sources/$Source.ts'


/**
 * Merges `__fields` from every collection row for the same entity id.
 * `sourcePriority` is best-first; later entries in the list overwrite earlier ones on key collisions
 * (so the preferred source wins for fields present in multiple rows).
 */
export const mergeEntityCollectionRowFields = <
	_E extends EntityType<typeof schema>,
>(
	_rows: { row: EntityCollectionItem<typeof schema, _E> }[] | undefined,
	sourcePriority: readonly Source[],
): Partial<EntityFieldValues<typeof schema, _E>> => {
	if (_rows == null || _rows.length === 0) {
		return {}
	}
	const rank = new Map(sourcePriority.map((s, i) => [s, i]))
	const sorted = [..._rows].sort((a, b) => (
		(rank.get(b.row[EntityMetaKey.Source]) ?? 1_000_000)
		- (rank.get(a.row[EntityMetaKey.Source]) ?? 1_000_000)
	))
	const out: Partial<EntityFieldValues<typeof schema, _E>> = {}
	for (const { row } of sorted) {
		Object.assign(out, row[EntityMetaKey.Fields])
	}
	return out
}
