import type {
	EntityDefinition,
	EntityFromDefinition,
} from '$/schema/$EntityDefinition.ts'
import type { Source } from '$/sources/$Sources.ts'

/**
 * TanStack `entityCollections` rows: resolver fields plus these keys (not declared per-entity in `fields[]`).
 * `EntityDefinition.id` types `$id`; `$idKey` is always `serializeEntityId($id)` so live-query `where` can use stable strings.
 * `$source` disambiguates rows when the same `entityType` / field is loaded from multiple `Source`s (`getKey` + live-query `where`).
 */
export const entityCollectionRow = {
	id: '$id',
	idKey: '$idKey',
	source: '$source',
	/** Scoped parent entity for field-collection rows; enables hierarchical live-query joins. */
	fieldScopeKey: '$fieldScopeKey',
} as const

export type EntityCollectionRow<_Def extends EntityDefinition> = (
	EntityFromDefinition<_Def>
	& {
		[entityCollectionRow.idKey]: string
	}
	& {
		[entityCollectionRow.source]?: Source
	}
)
