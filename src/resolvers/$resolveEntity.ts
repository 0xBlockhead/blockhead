import type { LoadSubsetOptions } from '@tanstack/svelte-db'

import { serializeEntityId } from '$/schema/$entityId.ts'
import type { EntityFieldResolverContext } from '$/resolvers/$EntityFieldResolver.ts'
import { entityFieldResolvers, entityResolvers } from '$/resolvers/$resolvers.ts'
import {
	entityFieldNamesFromLoadSubset,
	entitySubsetFromLoadSubsetOptions,
	isGlobalScopeKey,
} from '$/data/tanstackDb/entitySubsetFromLoadSubset.ts'
import { resolverContextFromLoadSubset } from '$/data/tanstackDb/resolverLoadSubset.ts'
import { entityCollectionRow } from '$/schema/$EntityCollectionRow.ts'
import {
	type EntityFieldDefinition,
	EntityFieldType,
} from '$/schema/$EntityDefinition.ts'
import {
	entityDefinitionByType,
	type EntityId,
	type RegisteredEntityType,
} from '$/schema/$schema.ts'
import type { EntityType } from '$/schema/$EntityType.ts'
import type { Source } from '$/sources/$Sources.ts'

const listFieldEntityIdKey = (item: unknown) => {
	if (typeof item !== 'object' || item == null) return null
	const id = (item as Record<string, unknown>)[entityCollectionRow.id]
	return id != null && typeof id === 'object' && !Array.isArray(id) ?
			serializeEntityId(id as EntityId)
		:	null
}

const mergeFieldValuesFromSources = (
	field: EntityFieldDefinition,
	values: unknown[],
): unknown => {
	const present = values.filter((v) => v !== undefined)
	if (present.length === 0) return undefined
	if (field.type === EntityFieldType.EntitiesReference) {
		const seen = new Set<string>()
		const merged: unknown[] = []
		for (const v of present) {
			if (!Array.isArray(v)) continue
			for (const item of v) {
				const k = listFieldEntityIdKey(item)
				if (k == null) {
					merged.push(item)
					continue
				}
				if (seen.has(k)) continue
				seen.add(k)
				merged.push(item)
			}
		}
		return merged
	}
	return present[present.length - 1]
}

/** All matching field resolvers (every `Source`) run in parallel; values merged by field kind. */
export const resolveRegisteredEntityFieldAllSources = async (
	entityType: EntityType,
	field: string,
	entityId: EntityId,
	context?: EntityFieldResolverContext,
	sources?: Source[],
): Promise<unknown> => {
	const fieldDef = entityDefinitionByType[entityType]?.fields.find((f) => f.name === field)
	if (fieldDef == null) return undefined

	const resolvers = entityFieldResolvers.filter(
		(x) => x.entityType === entityType && x.field === field && (sources == null || sources.includes(x.source)),
	)
	if (resolvers.length === 0) return undefined

	const values = await Promise.all(
		resolvers.map((r) => r.resolve(entityId, context)),
	)
	return mergeFieldValuesFromSources(fieldDef, values)
}

export const resolveRegisteredEntityField = resolveRegisteredEntityFieldAllSources

/**
 * Resolves via `entitySubsetFromLoadSubsetOptions` (schema `id` Arktype there) and global `{}` when the
 * wire key is empty. Merges `entityResolvers` then fills missing fields from `entityFieldResolvers`.
 */
export const resolveEntity = async (
	entityType: EntityType,
	loadSubsetOptions?: LoadSubsetOptions,
	sources?: Source[],
): Promise<
	| {
		entity: Record<string, unknown>
		entityId: EntityId
	}
	| null
> => {
	const def = entityDefinitionByType[entityType]
	if (def == null) return null

	const context = resolverContextFromLoadSubset(loadSubsetOptions)
	const { entityId: parsedId, idKeyWire, sources: sourcesFromSubset } = entitySubsetFromLoadSubsetOptions(
		loadSubsetOptions,
		entityType as RegisteredEntityType,
	)
	const sourcesResolved = sources ?? sourcesFromSubset
	const entityId =
		parsedId ??
		(isGlobalScopeKey(idKeyWire) ? ({} as EntityId) : null)
	if (entityId == null) return null
	const schemaNames = def.fields.map((f) => f.name)
	const schemaSet = new Set<string>(schemaNames)
	const fromSubset = entityFieldNamesFromLoadSubset(loadSubsetOptions).filter((n) => schemaSet.has(n))
	const fieldNames = fromSubset.length > 0 ? fromSubset : schemaNames
	const entity: Record<string, unknown> = {}

	const entityPartials = await Promise.all(
		entityResolvers
			.filter((r) => r.entityType === entityType && (sourcesResolved == null || sourcesResolved.includes(r.source)))
			.map((r) => r.resolve(entityId, context)),
	)
	Object.assign(
		entity,
		...entityPartials.filter(
			(p): p is Record<string, unknown> =>
				p != null && typeof p === 'object' && !Array.isArray(p),
		),
	)

	const fieldResults = await Promise.all(
		fieldNames.map(async (name) => (
			name in entity ?
				([name, undefined] as const)
			:	[
					name,
					await resolveRegisteredEntityFieldAllSources(
						entityType,
						name,
						entityId,
						context,
						sourcesResolved,
					),
				] as const
		)),
	)
	for (const [name, value] of fieldResults) {
		if (value !== undefined) entity[name] = value
	}
	return {
		entity,
		entityId,
	}
}
