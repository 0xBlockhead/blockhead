import { stringify } from 'devalue'

import {
	assertResolverDefinitionResult,
	assertResolverValuePartResult,
} from '$/collections/assertLoadedCollectionRows.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
	entityFieldDefinitions,
	EntityMetaKey,
	validateEntitySelector,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { entityDefinitionByType } from '$/schema/index.ts'
import { schema } from '$/schema/index.ts'
import {
	indexResolvers,
	type ResolverContext,
	type ResolverPart,
	type ResolverValue,
	type SourceResolverDefinition,
} from '$/resolvers/$resolvers.ts'
import { resolvers } from '$/resolvers/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	EntitySelector,
	EntityType as SchemaEntityType,
} from '$/schema/$schema.ts'
import { env as publicEnv } from '$env/dynamic/public'
import { indexSourceProviders } from '$/sources/$sources.ts'
import { sourceProviders } from '$/sources/index.ts'

import {
	assertLoadedResolverProbeCategories,
	classifyAssertLoadedResolverProbeCase,
	entityFieldValueForAssert,
	isExpectedAssertLoadedResolverProbeFailure,
	parentEntitySelectorForResolverValuePart,
	probeEntitySelectorByType,
	resolveProbeEntitySelector,
	type AssertLoadedResolverProbeCategory,
	type AssertLoadedResolverProbeCategoryBucket,
	type AssertLoadedResolverProbeCategorySummary,
} from './_fixtures.ts'

const {
	enabledSources,
	resolverPublicEnvBySource,
} = indexSourceProviders(sourceProviders, publicEnv)

const {
	resolverDefinitions,
	resolverCountPartsByEntityTypeAndFieldName,
	resolverDiscriminatorPartsByEntityTypeAndConditionKey,
	resolverLivePartsByEntityTypeAndFieldName,
	resolverRootLivePartsByEntityType,
	resolverValuePartsByEntityTypeAndFieldName,
} = indexResolvers(
	schema,
	resolvers,
	enabledSources,
)

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 20,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
} satisfies ResolverContext

type ResolverDefinitionProbe = Pick<
	SourceResolverDefinition<
		typeof schema,
		Source,
		SchemaEntityType<typeof schema>,
		ResolverContext
	>,
	'entityType' | 'source' | 'resolve'
> & {
	index: number
}

type ResolverValuePartProbe = Pick<
	ResolverPart<typeof schema, Source, ResolverContext>,
	'entityType' | 'fieldName' | 'source'
> & {
	index: number
	resolve: (
		entitySelector: EntitySelector<typeof schema, SchemaEntityType<typeof schema>>,
		context: ResolverContext,
	) => ResolverValue | Promise<ResolverValue>
}

const probeTimeoutMs = 30_000

const withProbeTimeout = async <_Value>(
	key: string,
	resolve: () => _Value | Promise<_Value>,
) => {
	let timeoutId: ReturnType<typeof setTimeout> | undefined

	try {
		return await Promise.race([
			resolve(),
			new Promise<never>((_resolve, reject) => {
				timeoutId = setTimeout(
					() => reject(new Error(`resolver probe timed out: ${key}`)),
					probeTimeoutMs,
				)
		}),
		])
	} finally {
		if (timeoutId != null)
			clearTimeout(timeoutId)
	}
}

const resolverDefinitionProbes: ResolverDefinitionProbe[] = []
for (const [index, resolver] of resolverDefinitions.entries())
	resolverDefinitionProbes.push({
		index,
		entityType: resolver.entityType,
		source: resolver.source,
		resolve: resolver.resolve,
	})

const resolverValuePartProbes: ResolverValuePartProbe[] = []
for (const parts of Object.values(resolverValuePartsByEntityTypeAndFieldName))
	for (const [index, part] of parts.entries()) {
		if (part.select == null)
			continue

		const select = part.select
		resolverValuePartProbes.push({
			index,
			entityType: part.entityType,
			fieldName: part.fieldName,
			source: part.source,
			resolve: async (
				entitySelector,
				context,
			) => {
					const selectorName = validateEntitySelector(
						schema,
						entityDefinitionByType[part.entityType],
						entitySelector,
					).name
					const resolve = part.resolver.resolve[selectorName]
					if (
						!(
							part.parentSelectors
							?? Object.keys(part.resolver.resolve)
						).includes(selectorName)
						|| resolve == null
					)
						throw new Error(`resolver probe skipped unsupported parent ${stringify(entitySelector)}`)

					return select(
						await resolve(
							entitySelector,
							context,
						),
						entitySelector,
						context,
					)
				},
		})
	}


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
	resolverDefinitionCount: number
	resolverValuePartCount: number
	conditionalScalarDiscriminatorCount: number
	conditionalItemDiscriminatorCount: number
	countResolverPartCount: number
	countResolverFields: string[]
	fieldLiveResolverPartCount: number
	rootLiveResolverCount: number
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
	{
		catalog: emptyCategoryBucket(),
		networkLive: emptyCategoryBucket(),
		envGated: emptyCategoryBucket(),
		knownUpstreamGap: emptyCategoryBucket(),
		unsupportedField: emptyCategoryBucket(),
	}
)


const finalizeProbeCase = (
	probeCase: Omit<AssertLoadedResolverProbeCase, 'category'>,
): AssertLoadedResolverProbeCase => ({
	...probeCase,
	category: classifyAssertLoadedResolverProbeCase(probeCase),
})


const entityResolvePayloadEmptyForProbe = (
	entityDefinition: EntityDefinition,
	fields: ResolverValue,
	source: Source,
): string | undefined => {
	if (fields == null || typeof fields !== 'object')
		return 'entity resolve did not return a fields object'
	if (Array.isArray(fields))
		return 'entity resolve did not return a fields object'

	const requiredPrimitivesForSource = entityFieldDefinitions(entityDefinition).filter((field) => (
		field.type === EntityFieldType.Primitive
		&& field.cardinality === EntityFieldCardinality.One
		&& field.defaultSources?.includes(source)
	))

	for (const field of requiredPrimitivesForSource) {
		if (!Object.hasOwn(fields, field.name)) {
			return `entity resolve missing required field ${field.name}`
		}
	}

	return undefined
}


const fieldResolvePayloadEmptyForProbe = (
	fieldDefinition: EntityFieldDefinition,
	raw: ResolverValue,
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
	for (const resolver of resolverDefinitionProbes) {
		if (
			probeEntitySelectorByType[resolver.entityType] === undefined
			&& resolver.entityType !== EntityType.Coin_Timestamp
		) {
			throw new Error(
				`Missing probeEntitySelectorByType[${resolver.entityType}] (${resolver.source})`,
			)
		}
	}

	const entityCases: AssertLoadedResolverProbeCase[] = []
	for (const resolver of resolverDefinitionProbes) {
		let entitySelector: Awaited<ReturnType<typeof resolveProbeEntitySelector>>
		try {
			entitySelector = await resolveProbeEntitySelector(resolver.entityType)
		} catch (error) {
			entityCases.push(finalizeProbeCase({
				kind: 'entity',
				key: `entity:${resolver.index}:${resolver.entityType}:${resolver.source}`,
				resolveRejected: true,
				resolveError: error instanceof Error ? error.message : String(error),
				assertThrew: false,
			}))
			continue
		}

		const entityDef = entityDefinitionByType[resolver.entityType]
		if (entityDef == null) {
			throw new Error(`No entityDefinitionByType[${resolver.entityType}]`)
		}

		const key = `entity:${resolver.index}:${resolver.entityType}:${resolver.source}`

		let fields: ResolverValue
		try {
			const selectorName = validateEntitySelector(
				schema,
				entityDef,
				entitySelector,
			).name
			const resolve = resolver.resolve[selectorName]
			if (resolve == null)
				throw new Error(`resolver probe skipped unsupported entity ${stringify(entitySelector)}`)

			fields = await withProbeTimeout(
				key,
				() => resolve(
					entitySelector,
					{
						...resolverContext,
						publicEnv: resolverPublicEnvBySource.get(resolver.source) ?? {},
					},
				),
			)
		} catch (error) {
			entityCases.push(finalizeProbeCase({
				kind: 'entity',
				key,
				resolveRejected: true,
				resolveError: error instanceof Error ? error.message : String(error),
				assertThrew: false,
			}))
			continue
		}

		const emptyPayloadError = entityResolvePayloadEmptyForProbe(
			entityDef,
			fields,
			resolver.source,
		)
		if (emptyPayloadError != null) {
			entityCases.push(finalizeProbeCase({
				kind: 'entity',
				key,
				resolveRejected: false,
				assertThrew: true,
				assertError: emptyPayloadError,
			}))
			continue
		}

		const row = {
			...(
				fields != null && typeof fields === 'object' && !Array.isArray(fields) ?
					fields
				:
					{}
			),
			[EntityMetaKey.Selector]: entitySelector,
			[EntityMetaKey.SelectorKey]: stringify(entitySelector),
			[EntityMetaKey.Source]: resolver.source,
			[EntityMetaKey.Fields]: fields,
		}

		try {
			assertResolverDefinitionResult(entityDef, row)
		} catch (error) {
			entityCases.push(finalizeProbeCase({
				kind: 'entity',
				key,
				resolveRejected: false,
				assertThrew: true,
				assertError: error instanceof Error ? error.message : String(error),
			}))
			continue
		}

		entityCases.push(finalizeProbeCase({
			kind: 'entity',
			key,
			resolveRejected: false,
			assertThrew: false,
		}))
	}

	const fieldCases: AssertLoadedResolverProbeCase[] = []
	for (const fieldResolver of resolverValuePartProbes) {
			const parentEntitySelector = parentEntitySelectorForResolverValuePart(fieldResolver.entityType)
			const entityDef = entityDefinitionByType[fieldResolver.entityType]
			if (entityDef == null) {
				throw new Error(`No entityDefinitionByType[${fieldResolver.entityType}]`)
			}

			const fieldDef = entityFieldDefinitions(entityDef).find((field: EntityFieldDefinition) => (
				field.name === fieldResolver.fieldName
			))
			if (fieldDef == null) {
				throw new Error(
					`No field ${fieldResolver.fieldName} on ${fieldResolver.entityType}`,
				)
			}

			const key = (
				`field:${fieldResolver.index}:${fieldResolver.entityType}.${String(fieldResolver.fieldName)}:${fieldResolver.source}`
			)

			let raw: ResolverValue
			try {
				raw = await withProbeTimeout(
					key,
					() => fieldResolver.resolve(
						parentEntitySelector,
						{
							...resolverContext,
							publicEnv: resolverPublicEnvBySource.get(fieldResolver.source) ?? {},
						},
					),
				)
			} catch (error) {
				fieldCases.push(finalizeProbeCase({
					kind: 'field',
					key,
					resolveRejected: true,
					resolveError: error instanceof Error ? error.message : String(error),
					assertThrew: false,
				}))
				continue
			}

			const emptyPayloadError = fieldResolvePayloadEmptyForProbe(
				fieldDef,
				raw,
				fieldResolver.source,
			)
			if (emptyPayloadError != null) {
				fieldCases.push(finalizeProbeCase({
					kind: 'field',
					key,
					resolveRejected: false,
					assertThrew: true,
					assertError: emptyPayloadError,
				}))
				continue
			}

			const innerValues: ResolverValue[] = (
				fieldDef.cardinality === EntityFieldCardinality.ZeroOrMany
				|| fieldDef.cardinality === EntityFieldCardinality.Many ?
					Array.isArray(raw) ?
						[...raw]
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
					[EntityMetaKey.ParentSelector]: parentEntitySelector,
					[EntityMetaKey.ParentSelectorKey]: stringify(parentEntitySelector),
					[EntityMetaKey.Source]: fieldResolver.source,
					[EntityMetaKey.Value]: value,
				}
				try {
					assertResolverValuePartResult(
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

			fieldCases.push(finalizeProbeCase({
				kind: 'field',
				key,
				resolveRejected: false,
				assertThrew,
				assertError,
			}))
	}

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
			resolverDefinitionCount: resolverDefinitionProbes.length,
			resolverValuePartCount: resolverValuePartProbes.length,
			conditionalScalarDiscriminatorCount: Object.values(resolverDiscriminatorPartsByEntityTypeAndConditionKey)
				.flatMap((partsByConditionKey) => Object.entries(partsByConditionKey))
				.filter(([conditionKey, parts]) => (
					!conditionKey.includes('[')
					&& parts.length > 0
				))
				.length,
			conditionalItemDiscriminatorCount: Object.values(resolverDiscriminatorPartsByEntityTypeAndConditionKey)
				.flatMap((partsByConditionKey) => Object.entries(partsByConditionKey))
				.filter(([conditionKey, parts]) => (
					conditionKey.includes('[')
					&& parts.length > 0
				))
			.length,
		countResolverPartCount: Object.values(resolverCountPartsByEntityTypeAndFieldName)
			.flatMap((parts) => parts)
			.length,
		countResolverFields: Object.entries(resolverCountPartsByEntityTypeAndFieldName)
			.flatMap(([key, parts]) => (
				parts.length === 0 ? [] : [String(key).replace('\x1E', '.')]
			))
			.sort(),
		fieldLiveResolverPartCount: Object.values(resolverLivePartsByEntityTypeAndFieldName)
			.flatMap((parts) => parts)
			.length,
		rootLiveResolverCount: Object.values(resolverRootLivePartsByEntityType)
			.flatMap((resolvers) => resolvers)
			.length,
		assertOk,
		resolveOk,
		fulfilledButAssertFailed,
		categorySummary,
	}
}
