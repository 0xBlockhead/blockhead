import { stringify } from 'devalue'

import {
	materializeResolverOutput,
	ResolverOutputMaterialization,
} from '$/collections/assertLoadedCollectionRows.ts'
import {
	entityFieldAddressKey,
	entitySelectorKey,
	evaluateEntityFacetConditionPlan,
	indexSchema,
	ProjectionResolution,
	type EntityFacetConditionPlan,
} from '$/schema/$schema.ts'
import { entityDefinitionByType } from '$/schema/index.ts'
import { schema } from '$/schema/index.ts'
import {
	indexResolvers,
	type ResolverContext,
	type ResolverPart,
	type ResolverValue,
	type SourceResolverDefinition,
} from '$/resolvers/$resolvers.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import { Source } from '$/sources/Source.ts'
import type { EntityType as SchemaEntityType } from '$/schema/$schema.ts'
import {
	enabledSources,
	resolverPublicEnvBySource,
} from '$/sources/index.ts'

import {
	assertLoadedResolverProbeCategories,
	classifyAssertLoadedResolverProbeCase,
	resolverPartProbeKey,
	resolveProbeEntitySelector,
	type AssertLoadedResolverProbeCategory,
	type AssertLoadedResolverProbeCategoryBucket,
	type AssertLoadedResolverProbeCategorySummary,
} from './_fixtures.ts'

const resolvers = await loadResolvers()

const {
	resolverDefinitions,
	resolverCountPartsByEntityTypeAndFieldName,
	resolverLivePartsByEntityTypeAndFieldName,
	resolverRootLivePartsByEntityType,
	resolverValuePartsByEntityTypeAndFieldName,
} = indexResolvers(
	schema,
	resolvers,
	enabledSources
)
const schemaIndex = indexSchema(schema)

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

type ResolverPartProbe = Pick<
	ResolverPart<typeof schema, Source, ResolverContext>,
	'entityType' | 'facetPath' | 'fieldName' | 'source'
> & {
	index: number
	resolverIndex: number
	parentSelectorName: string
	parentSelectorCount: number
	select?: NonNullable<ResolverPart<typeof schema, Source, ResolverContext>['select']>
	resolveCount?: NonNullable<ResolverPart<typeof schema, Source, ResolverContext>['resolveCount']>
}

type ResolverSnapshotProbe = ResolverDefinitionProbe & {
	selectorName: string
	valueParts: ResolverPartProbe[]
	countParts: ResolverPartProbe[]
}

const probeTimeoutMs = 30_000

const withProbeTimeout = async <_Value>(
	key: string,
	resolve: () => _Value | Promise<_Value>
) => {
	let timeoutId: ReturnType<typeof setTimeout> | undefined

	try {
		return await Promise.race([
			resolve(),
			new Promise<never>((_resolve, reject) => {
				timeoutId = setTimeout(
					() => reject(new Error(`resolver probe timed out: ${key}`)),
					probeTimeoutMs
				)
		}),
		])
	} finally {
		if (timeoutId != null)
			clearTimeout(timeoutId)
	}
}

const runProbeBatch = async <_Probe, _Case>(
	probes: readonly _Probe[],
	run: (probe: _Probe) => Promise<_Case>,
	concurrency = 8
) => {
	const cases: _Case[] = []
	for (let index = 0; index < probes.length; index += concurrency)
		cases.push(...await Promise.all(probes.slice(index, index + concurrency).map(run)))

	return cases
}

export const resolverSnapshotCoordinates = <
	_Resolver extends {
		resolve: Partial<Record<string, (...arguments_: never[]) => unknown>>
	},
>(resolverDefinitions: readonly _Resolver[]) => resolverDefinitions.flatMap((resolver) => (
	Object.keys(resolver.resolve).map((selectorName) => ({
		resolver,
		selectorName,
	}))
))

export const resolveSnapshotOnceThenProject = async <_Snapshot, _Projection>(
	resolveSnapshot: () => _Snapshot | Promise<_Snapshot>,
	projectSnapshot: readonly ((snapshot: _Snapshot) => _Projection | Promise<_Projection>)[]
) => {
	const snapshot = await resolveSnapshot()
	const projections: _Projection[] = []
	for (const project of projectSnapshot)
		projections.push(await project(snapshot))

	return {
		snapshot,
		projections,
	}
}

export const resolveFacetConditions = async ({
	conditionPlan,
	resolveDependency,
}: {
	conditionPlan: EntityFacetConditionPlan
	resolveDependency: (facetPath: readonly string[], fieldName: string) => ResolverValue | Promise<ResolverValue>
}): Promise<ProjectionResolution> => {
	return evaluateEntityFacetConditionPlan(
		conditionPlan,
		await Promise.all(conditionPlan.dependencies.map((dependency) => (
			resolveDependency(dependency.facetPath, dependency.fieldName)
		)))
	)
}

export const resolveIndexedConditionalFacetDependency = async <_Part extends {
	entityType: string
	facetPath: readonly string[]
	fieldName: PropertyKey
	select?: unknown
}>({
	entityType,
	facetPath,
	fieldName,
	indexedParts,
	entitySelector,
	rootFields,
	resolvePart,
}: {
	entityType: string
	facetPath: readonly string[]
	fieldName: string
	indexedParts: readonly _Part[]
	entitySelector: Partial<Record<string, ResolverValue>>
	rootFields?: ResolverValue
	resolvePart: (part: _Part) => ResolverValue | Promise<ResolverValue>
}) => {
	if (fieldName in entitySelector)
		return entitySelector[fieldName]

	const rootFieldValue = Object.getOwnPropertyDescriptor(Object(rootFields), fieldName)?.value
	if (rootFieldValue !== undefined)
		return rootFieldValue

	const matchesAddress = (candidate: _Part) => (
		candidate.entityType === entityType
		&& candidate.fieldName === fieldName
		&& candidate.facetPath.length === facetPath.length
		&& candidate.facetPath.every((segment, index) => segment === facetPath[index])
	)
	const indexedPart = indexedParts.find(matchesAddress)
	if (indexedPart?.select != null)
		return resolvePart(indexedPart)

	throw new Error(`Unsupported conditional facet dependency ${entityType}.${[...facetPath, fieldName].join('.')}`)
}

const resolverDefinitionProbes: ResolverDefinitionProbe[] = []
for (const resolver of resolverDefinitions)
	resolverDefinitionProbes.push({
		index: resolver.definitionIndex,
		entityType: resolver.entityType,
		source: resolver.source,
		resolve: resolver.resolve,
	})

const resolverValuePartProbes: ResolverPartProbe[] = []
for (const parts of Object.values(resolverValuePartsByEntityTypeAndFieldName))
	for (const [index, part] of parts.entries()) {
		if (part.select == null)
			continue

		const parentSelectorNames = (
			part.parentSelectors
			?? Object.keys(part.resolver.resolve)
		)
		for (const parentSelectorName of parentSelectorNames)
			resolverValuePartProbes.push({
				index,
				resolverIndex: part.resolver.definitionIndex,
				parentSelectorName,
				parentSelectorCount: parentSelectorNames.length,
				entityType: part.entityType,
				facetPath: part.facetPath,
				fieldName: part.fieldName,
				source: part.source,
				select: part.select,
			})
	}

const resolverCountPartProbes: ResolverPartProbe[] = []
for (const parts of Object.values(resolverCountPartsByEntityTypeAndFieldName))
	for (const [index, part] of parts.entries()) {
		if (part.resolveCount == null)
			continue

		const parentSelectorNames = (
			part.parentSelectors
			?? Object.keys(part.resolver.resolve)
		)
		for (const parentSelectorName of parentSelectorNames)
			resolverCountPartProbes.push({
				index,
				resolverIndex: part.resolver.definitionIndex,
				parentSelectorName,
				parentSelectorCount: parentSelectorNames.length,
				entityType: part.entityType,
				facetPath: part.facetPath,
				fieldName: part.fieldName,
				source: part.source,
				resolveCount: part.resolveCount,
			})
	}

const resolverSnapshotProbes: ResolverSnapshotProbe[] = resolverSnapshotCoordinates(
	resolverDefinitionProbes
).map(({ resolver, selectorName }) => ({
	...resolver,
	selectorName,
	valueParts: resolverValuePartProbes.filter((part) => (
		part.resolverIndex === resolver.index
		&& part.parentSelectorName === selectorName
	)),
	countParts: resolverCountPartProbes.filter((part) => (
		part.resolverIndex === resolver.index
		&& part.parentSelectorName === selectorName
	)),
}))
const unassignedResolverPartProbes = [
	...resolverValuePartProbes,
	...resolverCountPartProbes,
].filter((part) => !resolverSnapshotProbes.some((snapshotProbe) => (
	snapshotProbe.index === part.resolverIndex
	&& snapshotProbe.selectorName === part.parentSelectorName
)))


export type AssertLoadedResolverProbeCase = {
	kind: 'entity' | 'field' | 'count'
	key: string
	category: AssertLoadedResolverProbeCategory
	resolveRejected: boolean
	resolveError?: string
	assertThrew: boolean
	assertError?: string
}


export type AssertLoadedResolverProbeResult = {
	cases: AssertLoadedResolverProbeCase[]
	/** Resolver-definition and exact-selector snapshots exercised. */
	resolverDefinitionCount: number
	resolverValuePartCount: number
	countResolverPartCount: number
	countResolverFields: string[]
	fieldLiveResolverPartCount: number
	rootLiveResolverCount: number
	assertOk: number
	resolveOk: number
	/** Resolve succeeded but materialization failed. Fulfilled violations are never expected upstream gaps. */
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
	probeCase: Omit<AssertLoadedResolverProbeCase, 'category'>
): AssertLoadedResolverProbeCase => ({
	...probeCase,
	category: classifyAssertLoadedResolverProbeCase(probeCase),
})

export const assertNoFulfilledButAssertFailed = (
	fulfilledButAssertFailed: readonly AssertLoadedResolverProbeCase[]
) => {
	if (fulfilledButAssertFailed.length > 0)
		throw new Error(`Resolver materialization failures: ${fulfilledButAssertFailed.map(({ key, assertError }) => `${key}: ${assertError}`).join('; ')}`)
}


export const runAssertLoadedResolverProbes = async (
	includes?: string
): Promise<AssertLoadedResolverProbeResult> => {
	if (unassignedResolverPartProbes.length > 0)
		throw new Error(`Resolver parts reference unsupported selectors: ${unassignedResolverPartProbes.map((part) => `${part.entityType}.${part.parentSelectorName}.${part.fieldName} (${part.source})`).join(', ')}`)

	const fixtures = await Promise.all(resolverSnapshotProbes
		.filter((probe) => (
			includes == null
			|| `${probe.entityType}.${probe.selectorName}:${probe.source}`.includes(includes)
			|| [...probe.valueParts, ...probe.countParts].some((part) => part.fieldName.includes(includes))
		))
		.map(async (probe) => {
		try {
			return {
				kind: 'Ready' as const,
				probe,
				entitySelector: await resolveProbeEntitySelector(
					probe.entityType,
					probe.selectorName,
					probe.source
				),
			}
		} catch (error) {
			return {
				kind: 'Missing' as const,
				probe,
				error: error instanceof Error ? error.message : String(error),
			}
		}
	}))
	const missingFixtures = fixtures.filter((fixture) => fixture.kind === 'Missing')
	if (missingFixtures.length > 0)
		throw new Error(`Missing resolver probe fixtures: ${missingFixtures.map(({ probe, error }) => `${probe.entityType}.${probe.selectorName} (${probe.source}): ${error}`).join('; ')}`)

	const cases = (await runProbeBatch(
		fixtures.filter((fixture) => fixture.kind === 'Ready'),
		async ({ probe, entitySelector }) => {
			const entityDefinition = entityDefinitionByType[probe.entityType]
			const entityKey = `entity:${probe.index}:${probe.entityType}.${probe.selectorName}:${probe.source}`
			const context = {
				...resolverContext,
				publicEnv: resolverPublicEnvBySource.get(probe.source) ?? {},
			}
			const dependencyValueByAddress = new Map<string, Promise<ResolverValue>>()
			const dependencySnapshotByCoordinate = new Map<string, Promise<ResolverValue>>()
			const resolveDependency = (
				rootSnapshot: ResolverValue,
				facetPath: readonly string[],
				fieldName: string
			) => {
				const address = entityFieldAddressKey(probe.entityType, facetPath, fieldName)
				const cachedValue = dependencyValueByAddress.get(address)
				if (cachedValue != null)
					return cachedValue

				const value = resolveIndexedConditionalFacetDependency({
					entityType: probe.entityType,
					facetPath,
					fieldName,
					indexedParts: resolverValuePartProbes.filter((candidate) => candidate.parentSelectorName === probe.selectorName),
					entitySelector,
					rootFields: rootSnapshot,
					resolvePart: async (dependencyPart) => {
						const dependencyProbe = resolverSnapshotProbes.find((candidate) => (
							candidate.index === dependencyPart.resolverIndex
							&& candidate.selectorName === dependencyPart.parentSelectorName
						))
						if (dependencyProbe == null || dependencyPart.select == null)
							throw new Error(`Unsupported conditional facet dependency ${probe.entityType}.${[...facetPath, fieldName].join('.')}`)

						const coordinate = `${dependencyProbe.index}:${dependencyProbe.selectorName}`
						let dependencySnapshot = dependencySnapshotByCoordinate.get(coordinate)
						if (dependencySnapshot == null) {
							dependencySnapshot = dependencyProbe.index === probe.index && dependencyProbe.selectorName === probe.selectorName ?
								Promise.resolve(rootSnapshot)
							:
								Promise.resolve(dependencyProbe.resolve[dependencyProbe.selectorName]?.(
									entitySelector,
									{
										...resolverContext,
										publicEnv: resolverPublicEnvBySource.get(dependencyProbe.source) ?? {},
									}
								))
							dependencySnapshotByCoordinate.set(coordinate, dependencySnapshot)
						}

						return dependencyPart.select(
							await dependencySnapshot,
							entitySelector,
							{
								...resolverContext,
								publicEnv: resolverPublicEnvBySource.get(dependencyProbe.source) ?? {},
							}
						)
					},
				})
				dependencyValueByAddress.set(address, value)

				return value
			}
			const partKey = (kind: 'field' | 'count', part: ResolverPartProbe) => {
				const key = resolverPartProbeKey(
					kind,
					part.index,
					part.entityType,
					part.facetPath,
					String(part.fieldName),
					part.source
				)

				return part.parentSelectorCount === 1 ? key : key.replace(
					`:${part.source}`,
					`:${probe.selectorName}:${part.source}`
				)
			}
			const rejectedCases = (resolveError: string) => [
				finalizeProbeCase({
					kind: 'entity' as const,
					key: entityKey,
					resolveRejected: true,
					resolveError,
					assertThrew: false,
				}),
				...probe.valueParts.map((part) => finalizeProbeCase({
					kind: 'field' as const,
					key: partKey('field', part),
					resolveRejected: true,
					resolveError,
					assertThrew: false,
				})),
				...probe.countParts.map((part) => finalizeProbeCase({
					kind: 'count' as const,
					key: partKey('count', part),
					resolveRejected: true,
					resolveError,
					assertThrew: false,
				})),
			]

			try {
				return (await resolveSnapshotOnceThenProject(
					() => {
						const resolve = probe.resolve[probe.selectorName]
						if (resolve == null)
							throw new Error(`resolver probe skipped unsupported entity ${probe.selectorName}`)

						return withProbeTimeout(
							entityKey,
							() => resolve(entitySelector, context)
						)
					},
					[
						(snapshot) => {
							try {
								materializeResolverOutput({
									kind: ResolverOutputMaterialization.Entity,
									schema,
									schemaIndex,
									entityDefinition,
									selector: entitySelector,
									selectorKey: entitySelectorKey(schema, entityDefinition, entitySelector),
									source: probe.source,
									snapshot,
								})

								return finalizeProbeCase({
									kind: 'entity',
									key: entityKey,
									resolveRejected: false,
									assertThrew: false,
								})
							} catch (error) {
								return finalizeProbeCase({
									kind: 'entity',
									key: entityKey,
									resolveRejected: false,
									assertThrew: true,
									assertError: error instanceof Error ? error.message : String(error),
								})
							}
						},
						...probe.valueParts.map((part) => async (snapshot: ResolverValue) => {
							const key = partKey('field', part)
							let value: ResolverValue
							try {
								if (part.select == null)
									throw new Error(`No field selector ${part.fieldName} on ${part.entityType}`)

								value = part.select(snapshot, entitySelector, context)
							} catch (error) {
								return finalizeProbeCase({
									kind: 'field',
									key,
									resolveRejected: true,
									resolveError: error instanceof Error ? error.message : String(error),
									assertThrew: false,
								})
							}

							let projectionResolution: ProjectionResolution
							try {
								projectionResolution = await resolveFacetConditions({
									conditionPlan: schemaIndex.projectionDefinitionByEntityTypeAndPath[
										entityFieldAddressKey(part.entityType, part.facetPath, '')
									]?.conditionPlan ?? {
										dependencies: [],
										predicates: [],
									},
									resolveDependency: (facetPath, fieldName) => resolveDependency(snapshot, facetPath, fieldName),
								})
							} catch (error) {
								return finalizeProbeCase({
									kind: 'field',
									key,
									resolveRejected: true,
									resolveError: error instanceof Error ? error.message : String(error),
									assertThrew: false,
								})
							}

							if (projectionResolution === ProjectionResolution.Blocked || projectionResolution === ProjectionResolution.NotApplicable)
								return finalizeProbeCase({
									kind: 'field',
									key,
									resolveRejected: false,
									assertThrew: false,
								})

							try {
								if (projectionResolution === ProjectionResolution.Unsupported)
									throw new Error(`Unsupported conditional facet dependency ${part.entityType}.${part.facetPath.join('.')}`)

								const fieldDefinition = (
									schemaIndex.entityFieldDefinitionByEntityTypePathAndName[part.entityType][
										entityFieldAddressKey(
											part.entityType,
											part.facetPath,
											part.fieldName
										)
									]
								)
								if (fieldDefinition == null)
									throw new Error(`No field ${part.fieldName} on ${part.entityType}`)

								materializeResolverOutput({
									kind: ResolverOutputMaterialization.Field,
									schema,
									schemaIndex,
									entityDefinition,
									parentSelector: entitySelector,
									parentSelectorKey: entitySelectorKey(schema, entityDefinition, entitySelector),
									source: part.source,
									fieldDefinition,
									value,
								})

								return finalizeProbeCase({
									kind: 'field',
									key,
									resolveRejected: false,
									assertThrew: false,
								})
							} catch (error) {
								return finalizeProbeCase({
									kind: 'field',
									key,
									resolveRejected: false,
									assertThrew: true,
									assertError: error instanceof Error ? error.message : String(error),
								})
							}
						}),
						...probe.countParts.map((part) => async (snapshot: ResolverValue) => {
							const key = partKey('count', part)
							let value: number
							try {
								if (part.resolveCount == null)
									throw new Error(`No count selector ${part.fieldName} on ${part.entityType}`)

								value = part.resolveCount(snapshot, entitySelector, context)
							} catch (error) {
								return finalizeProbeCase({
									kind: 'count',
									key,
									resolveRejected: true,
									resolveError: error instanceof Error ? error.message : String(error),
									assertThrew: false,
								})
							}

							let projectionResolution: ProjectionResolution
							try {
								projectionResolution = await resolveFacetConditions({
									conditionPlan: schemaIndex.projectionDefinitionByEntityTypeAndPath[
										entityFieldAddressKey(part.entityType, part.facetPath, '')
									]?.conditionPlan ?? {
										dependencies: [],
										predicates: [],
									},
									resolveDependency: (facetPath, fieldName) => resolveDependency(snapshot, facetPath, fieldName),
								})
							} catch (error) {
								return finalizeProbeCase({
									kind: 'count',
									key,
									resolveRejected: true,
									resolveError: error instanceof Error ? error.message : String(error),
									assertThrew: false,
								})
							}

							if (projectionResolution === ProjectionResolution.Blocked || projectionResolution === ProjectionResolution.NotApplicable)
								return finalizeProbeCase({
									kind: 'count',
									key,
									resolveRejected: false,
									assertThrew: false,
								})

							try {
								if (projectionResolution === ProjectionResolution.Unsupported)
									throw new Error(`Unsupported conditional facet dependency ${part.entityType}.${part.facetPath.join('.')}`)

								const fieldDefinition = (
									schemaIndex.entityFieldDefinitionByEntityTypePathAndName[part.entityType][
										entityFieldAddressKey(
											part.entityType,
											part.facetPath,
											part.fieldName
										)
									]
								)
								if (fieldDefinition == null)
									throw new Error(`No count field ${part.fieldName} on ${part.entityType}`)

								materializeResolverOutput({
									kind: ResolverOutputMaterialization.Count,
									schema,
									schemaIndex,
									entityDefinition,
									parentSelector: entitySelector,
									parentSelectorKey: entitySelectorKey(schema, entityDefinition, entitySelector),
									source: part.source,
									fieldDefinition,
									value,
									filterKey: stringify({}),
								})

								return finalizeProbeCase({
									kind: 'count',
									key,
									resolveRejected: false,
									assertThrew: false,
								})
							} catch (error) {
								return finalizeProbeCase({
									kind: 'count',
									key,
									resolveRejected: false,
									assertThrew: true,
									assertError: error instanceof Error ? error.message : String(error),
								})
							}
						}),
					]
				)).projections
			} catch (error) {
				return rejectedCases(error instanceof Error ? error.message : String(error))
			}
		}
	)).flat()

	const fulfilledButAssertFailed = cases.filter((c) => (
		!c.resolveRejected
		&& c.assertThrew
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
			} else {
				bucket.fulfilledButAssertFailed += 1
			}
		}
	}

	if (resolveOk === 0 || assertOk === 0)
		throw new Error(`Resolver probes were vacuous: resolveOk=${resolveOk}, assertOk=${assertOk}`)
	assertNoFulfilledButAssertFailed(fulfilledButAssertFailed)

	return {
		cases,
		resolverDefinitionCount: resolverSnapshotProbes.length,
		resolverValuePartCount: resolverSnapshotProbes
			.flatMap((probe) => probe.valueParts)
			.length,
		countResolverPartCount: resolverSnapshotProbes
			.flatMap((probe) => probe.countParts)
			.length,
		countResolverFields: [...new Set(resolverSnapshotProbes
			.flatMap((snapshotProbe) => snapshotProbe.countParts)
			.map((probe) => [
				probe.entityType,
				...probe.facetPath,
				String(probe.fieldName),
			].join('.')))]
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
