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
	entityFieldValueForAssert,
	parentEntityIdForFieldResolver,
	probeEntityIdByType,
	resolveProbeEntityId,
} from './_fixtures.ts'


const resolverContext = {
	filters: [],
	sorts: [],
	limit: 20,
} as const


export type AssertLoadedResolverProbeCase = {
	kind: 'entity' | 'field'
	key: string
	resolveRejected: boolean
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
	fulfilledButAssertFailed: AssertLoadedResolverProbeCase[]
}


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
	:	undefined
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
			const entityId = await resolveProbeEntityId(resolver.entityType)
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
			} catch {
				return ({
					kind: 'entity',
					key,
					resolveRejected: true,
					assertThrew: false,
				} satisfies AssertLoadedResolverProbeCase)
			}

			const emptyPayloadError = entityResolvePayloadEmptyForProbe(
				entityDef,
				fields,
				resolver.source,
			)
			if (emptyPayloadError != null) {
				return ({
					kind: 'entity',
					key,
					resolveRejected: false,
					assertThrew: true,
					assertError: emptyPayloadError,
				} satisfies AssertLoadedResolverProbeCase)
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
				return ({
					kind: 'entity',
					key,
					resolveRejected: false,
					assertThrew: true,
					assertError: error instanceof Error ? error.message : String(error),
				} satisfies AssertLoadedResolverProbeCase)
			}

			return ({
				kind: 'entity',
				key,
				resolveRejected: false,
				assertThrew: false,
			} satisfies AssertLoadedResolverProbeCase)
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
			} catch {
				return ({
					kind: 'field',
					key,
					resolveRejected: true,
					assertThrew: false,
				} satisfies AssertLoadedResolverProbeCase)
			}

			const emptyPayloadError = fieldResolvePayloadEmptyForProbe(
				fieldDef,
				raw,
				fieldResolver.source,
			)
			if (emptyPayloadError != null) {
				return ({
					kind: 'field',
					key,
					resolveRejected: false,
					assertThrew: true,
					assertError: emptyPayloadError,
				} satisfies AssertLoadedResolverProbeCase)
			}

			const innerValues = (
				fieldDef.cardinality === EntityFieldCardinality.ZeroOrMany
				|| fieldDef.cardinality === EntityFieldCardinality.Many ?
					Array.isArray(raw) ?
						raw
					:	[]
				: raw == null ?
					[]
				:	[raw]
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

			return ({
				kind: 'field',
				key,
				resolveRejected: false,
				assertThrew,
				assertError,
			} satisfies AssertLoadedResolverProbeCase)
		}),
	)

	const cases = [...entityCases, ...fieldCases]

	const fulfilledButAssertFailed = cases.filter((c) => (
		!c.resolveRejected
		&& c.assertThrew
	))
	const assertOk = cases.filter((c) => !c.resolveRejected && !c.assertThrew).length
	const resolveOk = cases.filter((c) => !c.resolveRejected).length

	return {
		cases,
		entityResolverCount: entityResolvers.length,
		fieldResolverCount: entityFieldResolvers.length,
		assertOk,
		resolveOk,
		fulfilledButAssertFailed,
	}
}
