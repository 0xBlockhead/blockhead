import { type } from 'arktype'
import type { LoadSubsetOptions } from '@tanstack/svelte-db'

import { fieldPathKey, subsetParsed } from '$/data/tanstackDb/resolverLoadSubset.ts'
import { parseEntityId, serializeEntityId } from '$/schema/$entityId.ts'
import type { EntityDefinition } from '$/schema/$EntityDefinition.ts'
import { entityCollectionRow } from '$/schema/$EntityCollectionRow.ts'
import {
	entityDefinitionByType,
	type EntityId,
	type RegisteredEntityType,
} from '$/schema/$schema.ts'
import type { Source } from '$/sources/$Sources.ts'

const entityDefByRegisteredType = (
	entityDefinitionByType as Record<RegisteredEntityType, EntityDefinition>
)

const entityIdParsedAgainstSchema = (entityType: RegisteredEntityType, raw: EntityId | null) => {
	if (raw == null) return null
	const result = entityDefByRegisteredType[entityType].id(raw)
	if (result instanceof type.errors) return null
	return result as EntityId
}

/** `{}` is only a valid entity id for types whose schema `id` allows it (e.g. `_Global`). */
const globalScopedEntityIdForRegisteredType = (
	entityType: RegisteredEntityType,
): EntityId | null => {
	const r = entityDefByRegisteredType[entityType].id({})
	return r instanceof type.errors ? null : (r as EntityId)
}

const rowKeyEqValue = (
	filters: { field: readonly unknown[]; operator: string; value?: unknown }[],
	rowKey: string,
) =>
	filters.find(
		(f) =>
			f.operator === 'eq' &&
			(
				fieldPathKey(f.field) === rowKey ||
				(f.field.length > 0 && String(f.field[f.field.length - 1]) === rowKey)
			),
	)?.value

export const emptyGlobalScopeKey = serializeEntityId({})

export const isGlobalScopeKey = (idKeyWire: string) => (
	idKeyWire === emptyGlobalScopeKey ||
	idKeyWire === '{}'
)

export const entitySubsetFromLoadSubsetOptions = (
	loadSubset: LoadSubsetOptions | undefined,
	entityType: RegisteredEntityType,
) => {
	const filters = subsetParsed(loadSubset).filters
	const idKeyEq = rowKeyEqValue(filters, entityCollectionRow.idKey)
	const idKeyFromFilter = typeof idKeyEq === 'string' && idKeyEq.length > 0 ? idKeyEq : null

	let entityId = null as EntityId | null
	if (
		idKeyFromFilter != null &&
		idKeyFromFilter !== '{}' &&
		idKeyFromFilter !== emptyGlobalScopeKey
	)
		entityId = parseEntityId(idKeyFromFilter)

	if (entityId == null) {
		const idEq = rowKeyEqValue(filters, entityCollectionRow.id)
		if (idEq != null && typeof idEq === 'object' && idEq !== null && !Array.isArray(idEq))
			entityId = idEq
		else if (typeof idEq === 'string' && idEq.length > 0)
			entityId = parseEntityId(idEq)
	}

	const entityIdParsed = entityIdParsedAgainstSchema(entityType, entityId)

	const idKeyWire = (
		idKeyFromFilter ??
		(
			entityIdParsed != null ?
				serializeEntityId(entityIdParsed)
			: entityId != null ?
				serializeEntityId(entityId)
			:	null
		) ??
		emptyGlobalScopeKey
	)

	const sourceEq = rowKeyEqValue(filters, entityCollectionRow.source)
	const sourceIn = filters.find(
		(f) =>
			f.operator === 'in' &&
			(
				fieldPathKey(f.field) === entityCollectionRow.source ||
				(f.field.length > 0 && String(f.field[f.field.length - 1]) === entityCollectionRow.source)
			),
	)?.value
	const sources = (
		sourceEq != null ?
			[sourceEq as Source]
		: Array.isArray(sourceIn) ?
			sourceIn as Source[]
		:
			undefined
	)

	return { idKeyWire, entityId: entityIdParsed, sources }
}

export const scopedEntityIdFromLoadSubsetOptions = (
	loadSubset: LoadSubsetOptions | undefined,
	entityType: RegisteredEntityType,
): EntityId | null => {
	const { entityId: parsedId, idKeyWire } = entitySubsetFromLoadSubsetOptions(
		loadSubset,
		entityType,
	)
	return (
		parsedId ??
		(
			isGlobalScopeKey(idKeyWire) ?
				globalScopedEntityIdForRegisteredType(entityType)
			:	null
		)
	)
}

const collectionRowKeyTails = new Set<string>([
	entityCollectionRow.id,
	entityCollectionRow.idKey,
	entityCollectionRow.source,
])

const tailFromFieldPath = (field: readonly (string | number)[]) => (
	field.length === 0 ?
		''
	:
		String(field[field.length - 1])
)

export const entityFieldNamesFromLoadSubset = (opts: LoadSubsetOptions | undefined) => {
	const { filters, sorts } = subsetParsed(opts)
	const out = new Set<string>()
	for (const f of filters) {
		const tail = tailFromFieldPath(f.field)
		if (tail !== '' && !collectionRowKeyTails.has(tail)) out.add(tail)
	}
	for (const s of sorts) {
		const tail = tailFromFieldPath(s.field)
		if (tail !== '' && !collectionRowKeyTails.has(tail)) out.add(tail)
	}
	return [...out]
}
