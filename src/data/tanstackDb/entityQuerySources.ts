import type { LoadSubsetOptions } from '@tanstack/svelte-db'

import { entitySubsetFromLoadSubsetOptions } from '$/data/tanstackDb/entitySubsetFromLoadSubset.ts'
import { entityFieldResolvers, entityResolvers } from '$/resolvers/$resolvers.ts'
import type { EntityDefinition } from '$/schema/$EntityDefinition.ts'
import {
	entityDefinitionByType,
	type RegisteredEntityType,
} from '$/schema/$schema.ts'
import type { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Sources.ts'

const entityDefByRegisteredType = (
	entityDefinitionByType as Record<RegisteredEntityType, EntityDefinition>
)

const defaultSourcesUnionForEntity = (entityType: RegisteredEntityType): Source[] => {
	const def = entityDefByRegisteredType[entityType]
	const set = new Set<Source>()
	for (const f of def.fields) {
		if ('defaultSources' in f && f.defaultSources != null) {
			for (const s of f.defaultSources) set.add(s)
		}
	}
	return [...set]
}

const defaultSourcesForField = (
	entityType: RegisteredEntityType,
	fieldName: string,
): Source[] => {
	const def = entityDefByRegisteredType[entityType]
	const field = def.fields.find((f) => f.name === fieldName)
	if (field == null || !('defaultSources' in field) || field.defaultSources == null) return []
	return [...new Set(field.defaultSources)]
}

const sourcesFromEntityRegistry = (entityType: EntityType): Source[] => {
	const set = new Set<Source>()
	for (const r of entityResolvers) {
		if (r.entityType === entityType) set.add(r.source)
	}
	for (const r of entityFieldResolvers) {
		if (r.entityType === entityType) set.add(r.source)
	}
	return [...set]
}

const sourcesFromFieldRegistry = (entityType: EntityType, fieldName: string): Source[] => (
	[
		...new Set(
			entityFieldResolvers
				.filter((r) => r.entityType === entityType && r.field === fieldName)
				.map((r) => r.source),
		),
	]
)

/** Base entity rows: explicit `$source` filter wins; else schema `defaultSources` union; else resolver registry. */
export const sourcesForEntityBaseLoad = (
	loadSubset: LoadSubsetOptions | undefined,
	entityType: RegisteredEntityType,
): Source[] => {
	const { sources: explicit } = entitySubsetFromLoadSubsetOptions(loadSubset, entityType)
	if (explicit != null && explicit.length > 0) return [...new Set(explicit)]
	const fromSchema = defaultSourcesUnionForEntity(entityType)
	if (fromSchema.length > 0) return fromSchema
	const fromRegistry = sourcesFromEntityRegistry(entityType)
	return fromRegistry.length > 0 ? fromRegistry : [Source.Local]
}

/** Field rows: explicit `$source` filter wins; else that field’s `defaultSources`; else registry for `(entityType, field)`. */
export const sourcesForEntityFieldLoad = (
	loadSubset: LoadSubsetOptions | undefined,
	entityType: RegisteredEntityType,
	fieldName: string,
): Source[] => {
	const { sources: explicit } = entitySubsetFromLoadSubsetOptions(loadSubset, entityType)
	if (explicit != null && explicit.length > 0) return [...new Set(explicit)]
	const fromSchema = defaultSourcesForField(entityType, fieldName)
	if (fromSchema.length > 0) return fromSchema
	const fromRegistry = sourcesFromFieldRegistry(entityType, fieldName)
	return fromRegistry.length > 0 ? fromRegistry : [Source.Local]
}

export const sourcesForEntityBaseLiveQuery = (
	entityType: RegisteredEntityType,
): Source[] => sourcesForEntityBaseLoad(undefined, entityType)

export const sourcesForEntityFieldLiveQuery = (
	entityType: RegisteredEntityType,
	fieldName: string,
): Source[] => sourcesForEntityFieldLoad(undefined, entityType, fieldName)
