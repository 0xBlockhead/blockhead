import { stringify } from 'devalue'

import {
	assertEntityFieldResolverResult,
	assertEntityResolverResult,
} from '$/collections/assertLoadedCollectionRows.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { entityDefinitionByType } from '$/schema/index.ts'
import {
	entityFieldResolvers,
	entityResolvers,
} from '$/resolvers/index.ts'
import { Source } from '$/sources/$Source.ts'
import { resolverPublicEnvBySource } from '$/sources/index.ts'

import {
	assertLoadedResolverProbeCategories,
	classifyAssertLoadedResolverProbeCase,
	entityFieldValueForAssert,
	isExpectedAssertLoadedResolverProbeFailure,
	parentEntityIdForFieldResolver,
	probeEntityIdByType,
	resolveProbeEntityId,
	type AssertLoadedResolverProbeCategory,
	type AssertLoadedResolverProbeCategoryBucket,
	type AssertLoadedResolverProbeCategorySummary,
} from './_fixtures.ts'


const resolverContext = {
	filters: [],
	sorts: [],
	limit: 20,
} as const


export type AssertLoadedResolverProbeCase = {
	kind: 'entity' | 'field'
	key: string
	category: AssertLoadedResolverProbeCategory
	resolveRejected: boolean
	resolveError?: string
	assertThrew: boolean
	assertError?: string
}


export type AssertLoadedResolverProbeResult = {
	cases: AssertLoadedResolverProbeCase[]
	/** Resolvers exercised (same process as probes); `cases.length` must equal the sum. */
	entityResolverCount: number
	fieldResolverCount: number
	assertOk: number
	resolveOk: number
	/** Resolve succeeded but assertLoaded* failed — excludes classified expected gaps. */
	fulfilledButAssertFailed: AssertLoadedResolverProbeCase[]
	categorySummary: AssertLoadedResolverProbeCategorySummary
}


const emptyCategoryBucket = (): AssertLoadedResolverProbeCategoryBucket => ({
	total: 0,
	resolveOk: 0,
	resolveRejected: 0,
	assertOk: 0,
	fulfilledButAssertFailed: 0,
})


const emptyCategorySummary = (): AssertLoadedResolverProbeCategorySummary => (
	Object.fromEntries(
		assertLoadedResolverProbeCategories.map((category) => [
			category,
			emptyCategoryBucket(),
		]),
	) as AssertLoadedResolverProbeCategorySummary
)


const finalizeProbeCase = (
	probeCase: Omit<AssertLoadedResolverProbeCase, 'category'>,
): AssertLoadedResolverProbeCase => ({
	...probeCase,
	category: classifyAssertLoadedResolverProbeCase(probeCase),
})


const entityResolvePayloadEmptyForProbe = (
	entityDefinition: EntityDefinition,
	fields: unknown,
	source: Source,
): string | undefined => {
	if (fields == null || typeof fields !== 'object' || Array.isArray(fields)) {
		return 'entity resolve did not return a fields object'
	}

	const record = fields as Record<string, unknown>
	const requiredPrimitivesForSource = entityDefinition.fields.filter((field) => (
		field.type === EntityFieldType.Primitive
		&& field.cardinality === EntityFieldCardinality.One
		&& field.defaultSources?.includes(source)
	))

	for (const field of requiredPrimitivesForSource) {
		if (record[field.name] === undefined) {
			return `entity resolve missing required field ${field.name}`
		}
	}

	return undefined
}


const fieldResolvePayloadEmptyForProbe = (
	fieldDefinition: EntityFieldDefinition,
	raw: unknown,
	source: Source,
): string | undefined => {
	const isListField = (
		fieldDefinition.cardinality === EntityFieldCardinality.Many
		|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
	)
	if (!isListField || !fieldDefinition.defaultSources?.includes(source)) {
		return undefined
	}

	if (
		fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
		&& fieldDefinition.defaultSources.length !== 1
	) {
		return undefined
	}

	return (
		!Array.isArray(raw)
		|| raw.length === 0
	) ?
		'field resolve returned empty array'
	:
		undefined
}


export const runAssertLoadedResolverProbes = async (): Promise<AssertLoadedResolverProbeResult> => {
	for (const resolver of entityResolvers) {
		if (
			probeEntityIdByType[resolver.entityType] === undefined
			&& resolver.entityType !== EntityType.Coin_Timestamp
		) {
			throw new Error(
				`Missing probeEntityIdByType[${resolver.entityType}] (${resolver.source})`,
			)
		}
	}

	const entityCases = await Promise.all(
		entityResolvers.map(async (resolver) => {
			let entityId: Awaited<ReturnType<typeof resolveProbeEntityId>>
			try {
				entityId = await resolveProbeEntityId(resolver.entityType)
			} catch (error) {
				return finalizeProbeCase({
					kind: 'entity',
					key: `entity:${resolver.entityType}:${resolver.source}`,
					resolveRejected: true,
					resolveError: error instanceof Error ? error.message : String(error),
					assertThrew: false,
				})
			}
			const entityDef = entityDefinitionByType[resolver.entityType]
			if (entityDef == null) {
				throw new Error(`No entityDefinitionByType[${resolver.entityType}]`)
			}

			const key = `entity:${resolver.entityType}:${resolver.source}`

			let fields: unknown
			try {
				fields = await resolver.resolve(
					entityId,
					{
						...resolverContext,
						publicEnv: resolverPublicEnvBySource.get(resolver.source) ?? {},
					},
				)
			} catch (error) {
				return finalizeProbeCase({
					kind: 'entity',
					key,
					resolveRejected: true,
					resolveError: error instanceof Error ? error.message : String(error),
					assertThrew: false,
				})
			}

			const emptyPayloadError = entityResolvePayloadEmptyForProbe(
				entityDef,
				fields,
				resolver.source,
			)
			if (emptyPayloadError != null) {
				return finalizeProbeCase({
					kind: 'entity',
					key,
					resolveRejected: false,
					assertThrew: true,
					assertError: emptyPayloadError,
				})
			}

			const row = {
				...(
					fields != null && typeof fields === 'object' && !Array.isArray(fields) ?
						fields
					:
						{}
				),
				[EntityMetaKey.Id]: entityId,
				[EntityMetaKey.IdKey]: stringify(entityId),
				[EntityMetaKey.Source]: resolver.source,
				[EntityMetaKey.Fields]: fields,
			}

			try {
				assertEntityResolverResult(entityDef, row)
			} catch (error) {
				return finalizeProbeCase({
					kind: 'entity',
					key,
					resolveRejected: false,
					assertThrew: true,
					assertError: error instanceof Error ? error.message : String(error),
				})
			}

			return finalizeProbeCase({
				kind: 'entity',
				key,
				resolveRejected: false,
				assertThrew: false,
			})
		}),
	)

	const fieldCases = await Promise.all(
		entityFieldResolvers.map(async (fieldResolver) => {
			const parentEntityId = parentEntityIdForFieldResolver(fieldResolver.entityType)
			const entityDef = entityDefinitionByType[fieldResolver.entityType]
			if (entityDef == null) {
				throw new Error(`No entityDefinitionByType[${fieldResolver.entityType}]`)
			}
			const fieldDef = entityDef.fields.find((f) => f.name === fieldResolver.fieldName)
			if (fieldDef == null) {
				throw new Error(
					`No field ${fieldResolver.fieldName} on ${fieldResolver.entityType}`,
				)
			}

			const key = (
				`field:${fieldResolver.entityType}.${String(fieldResolver.fieldName)}:${fieldResolver.source}`
			)

			let raw: unknown
			try {
				raw = await fieldResolver.resolve(
					parentEntityId,
					{
						...resolverContext,
						publicEnv: resolverPublicEnvBySource.get(fieldResolver.source) ?? {},
					},
				)
			} catch (error) {
				return finalizeProbeCase({
					kind: 'field',
					key,
					resolveRejected: true,
					resolveError: error instanceof Error ? error.message : String(error),
					assertThrew: false,
				})
			}

			const emptyPayloadError = fieldResolvePayloadEmptyForProbe(
				fieldDef,
				raw,
				fieldResolver.source,
			)
			if (emptyPayloadError != null) {
				return finalizeProbeCase({
					kind: 'field',
					key,
					resolveRejected: false,
					assertThrew: true,
					assertError: emptyPayloadError,
				})
			}

			const innerValues = (
				fieldDef.cardinality === EntityFieldCardinality.ZeroOrMany
				|| fieldDef.cardinality === EntityFieldCardinality.Many ?
					Array.isArray(raw) ?
						raw
					:
						[]
				: raw == null ?
					[]
				:
					[raw]
			)

			let assertThrew = false
			let assertError: string | undefined
			for (const inner of innerValues) {
				const value = entityFieldValueForAssert(inner)
				const row = {
					[EntityMetaKey.ParentId]: parentEntityId,
					[EntityMetaKey.ParentIdKey]: stringify(parentEntityId),
					[EntityMetaKey.Source]: fieldResolver.source,
					[EntityMetaKey.Value]: value,
				}
				try {
					assertEntityFieldResolverResult(
						String(fieldResolver.entityType),
						fieldDef,
						row,
					)
				} catch (error) {
					assertThrew = true
					assertError = error instanceof Error ? error.message : String(error)
					break
				}
			}

			return finalizeProbeCase({
				kind: 'field',
				key,
				resolveRejected: false,
				assertThrew,
				assertError,
			})
		}),
	)

	const cases = [...entityCases, ...fieldCases]

	const fulfilledButAssertFailed = cases.filter((c) => (
		!c.resolveRejected
		&& c.assertThrew
		&& !isExpectedAssertLoadedResolverProbeFailure(c)
	))
	const assertOk = cases.filter((c) => !c.resolveRejected && !c.assertThrew).length
	const resolveOk = cases.filter((c) => !c.resolveRejected).length

	const categorySummary = emptyCategorySummary()
	for (const probeCase of cases) {
		const bucket = categorySummary[probeCase.category]
		bucket.total += 1
		if (probeCase.resolveRejected) {
			bucket.resolveRejected += 1
		} else {
			bucket.resolveOk += 1
			if (!probeCase.assertThrew) {
				bucket.assertOk += 1
			} else if (!isExpectedAssertLoadedResolverProbeFailure(probeCase)) {
				bucket.fulfilledButAssertFailed += 1
			}
		}
	}

	return {
		cases,
		entityResolverCount: entityResolvers.length,
		fieldResolverCount: entityFieldResolvers.length,
		assertOk,
		resolveOk,
		fulfilledButAssertFailed,
		categorySummary,
	}
}
