import { describe, expect, test } from 'vitest'
import { EntityType } from '$/schema/EntityType.ts'

import {
	entityFieldAddressKey,
	indexSchema,
	ProjectionResolution,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { indexResolvers } from '$/resolvers/$resolvers.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import { Source } from '$/sources/Source.ts'

import {
	assertLoadedResolverProbeCategories,
	classifyAssertLoadedResolverProbeCase,
	resolveProbeEntitySelector,
} from './_fixtures.ts'
import {
	resolveFacetConditions,
	resolveIndexedConditionalFacetDependency,
	resolverSnapshotCoordinates,
	resolveSnapshotOnceThenProject,
	assertNoFulfilledButAssertFailed,
	resolverProbeSourceIndex,
} from './_runProbes.ts'

const resolvers = await loadResolvers()


describe('resolver snapshot probes', () => {
	test('addresses NEAR account observations by their block rather than a refresh timestamp', async () => {
		await expect(resolveProbeEntitySelector(
			EntityType.NearAccount_Block,
			'AccountBlock',
			Source.NearRpc_JsonRpc
		)).resolves.toEqual({
			$account: {
				$network: { slug: 'near' },
				accountId: 'near',
			},
			$block: {
				$network: { slug: 'near' },
				height: 100_000_000n,
				hash: 'e2e-probe-near-block-hash',
			},
		})
	})

	test('resolves alternate selectors from exact selector-addressed fixtures', async () => {
		await expect(resolveProbeEntitySelector(
			'AtprotoActor',
			'Handle',
			Source.Atproto_Xrpc
		)).resolves.toEqual({
			handle: 'bsky.app',
		})
	})

	test('creates one coordinate for every exact supported selector', () => {
		const firstResolver = {
			resolve: {
				ByHash: () => 'hash',
				ByHeight: () => 'height',
			},
		}
		const secondResolver = {
			resolve: {
				ById: () => 'id',
			},
		}

		expect(resolverSnapshotCoordinates([
			firstResolver,
			secondResolver,
		])).toEqual([
			{
				resolver: firstResolver,
				selectorName: 'ByHash',
			},
			{
				resolver: firstResolver,
				selectorName: 'ByHeight',
			},
			{
				resolver: secondResolver,
				selectorName: 'ById',
			},
		])
	})

	test('resolves each selector snapshot once before applying every projection', async () => {
		const rootCalls: string[] = []
		const projectionSnapshots: { selectorName: string }[] = []
		const coordinates = resolverSnapshotCoordinates([{
			resolve: {
				ByHash: () => 'hash',
				ByHeight: () => 'height',
			},
		}])

		const executions = await Promise.all(coordinates.map(({ selectorName }) => (
			resolveSnapshotOnceThenProject(
				() => {
					rootCalls.push(selectorName)

					return { selectorName }
				},
				[
					(snapshot) => {
						projectionSnapshots.push(snapshot)

						return `field:${snapshot.selectorName}`
					},
					(snapshot) => {
						projectionSnapshots.push(snapshot)

						return `count:${snapshot.selectorName}`
					},
				]
			)
		)))

		expect(rootCalls).toEqual([
			'ByHash',
			'ByHeight',
		])
		for (const execution of executions)
			expect(projectionSnapshots.filter((snapshot) => snapshot === execution.snapshot)).toHaveLength(2)
		expect(projectionSnapshots).toHaveLength(executions.length * 2)
		expect(executions.map(({ projections }) => projections)).toEqual([
			[
				'field:ByHash',
				'count:ByHash',
			],
			[
				'field:ByHeight',
				'count:ByHeight',
			],
		])
	})

	test('awaits projections in order without overlapping unrelated materialization', async () => {
		const events: string[] = []

		expect((await resolveSnapshotOnceThenProject(
			() => 'snapshot',
			[
				async () => {
					events.push('conditional:start')
					await Promise.resolve()
					events.push('conditional:end')

					return 'conditional'
				},
				() => {
					events.push('ordinary')

					return 'ordinary'
				},
			]
		)).projections).toEqual([
			'conditional',
			'ordinary',
		])
		expect(events).toEqual([
			'conditional:start',
			'conditional:end',
			'ordinary',
		])
	})

	test('materializes an unconditional field without resolving dependencies', async () => {
		let dependencyResolutions = 0

		await expect(resolveFacetConditions({
			conditionPlan: {
				dependencies: [],
				predicates: [],
			},
			resolveDependency: () => {
				dependencyResolutions += 1

				throw new Error('unrelated dependency was pulled')
			},
		})).resolves.toBe(ProjectionResolution.Applicable)
		expect(dependencyResolutions).toBe(0)
	})

	test('does not materialize a NotApplicable conditional facet value', async () => {
		await expect(resolveFacetConditions({
			conditionPlan: {
				dependencies: [{
					entityType: 'Event',
					facetPath: [],
					fieldName: 'kind',
				}],
				predicates: [{
					dependencyIndex: 0,
					is: 'transaction',
				}],
			},
			resolveDependency: () => 'block',
		})).resolves.toBe(ProjectionResolution.NotApplicable)
	})

	test('distinguishes blocked and rejected conditional facet dependencies', async () => {
		const input = {
			conditionPlan: {
				dependencies: [{
					entityType: 'Event',
					facetPath: [],
					fieldName: 'kind',
				}],
				predicates: [{
					dependencyIndex: 0,
					is: 'transaction' as const,
				}],
			},
		}

		await expect(resolveFacetConditions({
			...input,
			resolveDependency: () => undefined,
		})).resolves.toBe(ProjectionResolution.Blocked)
		await expect(resolveFacetConditions({
			...input,
			resolveDependency: () => {
				throw new Error('dependency transport failed')
			},
		})).rejects.toThrow('dependency transport failed')
	})

	test('resolves selector and indexed cross-resolver dependencies', async () => {
		const tokenTransferKindPart = {
			entityType: 'Event',
			facetPath: [
				'TokenTransfer',
			],
			fieldName: 'kind',
			select: () => 'erc20',
		}

		await expect(resolveIndexedConditionalFacetDependency({
			entityType: 'Event',
			facetPath: [
				'TokenTransfer',
			],
			fieldName: 'kind',
			indexedParts: [tokenTransferKindPart],
			entitySelector: {
				id: 'event-id',
			},
			resolvePart: (part) => part.select(),
		})).resolves.toBe('erc20')
		await expect(resolveIndexedConditionalFacetDependency({
			entityType: 'Event',
			facetPath: ['Nested'],
			fieldName: 'id',
			indexedParts: [],
			entitySelector: {
				id: 'event-id',
			},
			resolvePart: () => undefined,
		})).resolves.toBe('event-id')
		await expect(resolveIndexedConditionalFacetDependency({
			entityType: 'Event',
			facetPath: ['Nested'],
			fieldName: 'kind',
			indexedParts: [],
			entitySelector: {},
			rootFields: {
				kind: 'root-kind',
			},
			resolvePart: () => undefined,
		})).resolves.toBe('root-kind')
	})

	test('indexes real nested EvmLog Event TokenTransfer transitive dependencies and resolver parts', () => {
		const projection = indexSchema(schema).projectionDefinitionByEntityTypeAndPath[
			entityFieldAddressKey('EvmLog', [
				'Event',
				'TokenTransfer',
			], '')
		]
		const resolverIndex = indexResolvers(schema, resolvers, resolverProbeSourceIndex.enabledSources)

		expect(projection?.transitiveDependencies).toEqual([
			{
				entityType: 'EvmLog',
				facetPath: [],
				fieldName: 'topic0',
			},
			{
				entityType: 'EvmLog',
				facetPath: ['Event'],
				fieldName: 'signatureHash',
			},
		])
		for (const dependency of projection?.transitiveDependencies ?? []) {
			const parts = resolverIndex.resolverValuePartsByEntityTypeAndFieldName[
				entityFieldAddressKey(
					dependency.entityType,
					dependency.facetPath,
					dependency.fieldName
				)
			]

			expect(parts).not.toBeUndefined()
			expect(parts?.every((part) => (
				part.entityType === dependency.entityType
				&& part.fieldName === dependency.fieldName
				&& part.facetPath.length === dependency.facetPath.length
				&& part.facetPath.every((segment, index) => segment === dependency.facetPath[index])
			))).toBe(true)
		}
	})

	test('gives blocked dependencies precedence over false predicates', async () => {
		await expect(resolveFacetConditions({
			conditionPlan: {
				dependencies: [
					{
						entityType: 'Event',
						facetPath: [],
						fieldName: 'blocked',
					},
					{
						entityType: 'Event',
						facetPath: [],
						fieldName: 'notApplicable',
					},
				],
				predicates: [
					{
						dependencyIndex: 0,
						is: 'applicable',
					},
					{
						dependencyIndex: 1,
						is: 'applicable',
					},
				],
			},
			resolveDependency: (_facetPath, fieldName) => fieldName === 'blocked' ? undefined : 'other',
		})).resolves.toBe(ProjectionResolution.Blocked)
	})

	test('evaluates indexed array conditions without repeating dependency selection', async () => {
		let evaluations = 0

		await expect(resolveFacetConditions({
			conditionPlan: {
				dependencies: [{
					entityType: 'Event',
					facetPath: [],
					fieldName: 'types',
				}],
				predicates: [
					{
						dependencyIndex: 0,
						itemIndex: 1,
						is: 'erc20',
					},
					{
						dependencyIndex: 0,
						includes: 'erc20',
					},
				],
			},
			resolveDependency: () => {
				evaluations += 1

				return [
					'native',
					'erc20',
				]
			},
		})).resolves.toBe(ProjectionResolution.Applicable)
		expect(evaluations).toBe(1)
	})

	test('still materializes and rejects an undefined required Applicable value', async () => {
		await expect(resolveFacetConditions({
			conditionPlan: {
				dependencies: [{
					entityType: 'Event',
					facetPath: [],
					fieldName: 'kind',
				}],
				predicates: [{
					dependencyIndex: 0,
					is: 'transaction',
				}],
			},
			resolveDependency: () => 'transaction',
		})).resolves.toBe(ProjectionResolution.Applicable)

		expect(() => {
			throw new Error('required value is undefined')
		}).toThrow('required value is undefined')
	})

	test.each(assertLoadedResolverProbeCategories)(
		'rejects fulfilled materialization failures for the %s category',
		(category) => {
			expect(() => assertNoFulfilledButAssertFailed([{
				kind: 'field',
				key: `field:0:Event.kind:${category}`,
				category,
				resolveRejected: false,
				assertThrew: true,
				assertError: 'required value is undefined',
			}])).toThrow('Resolver materialization failures')
		}
	)

	test('classifies capitalized unsupported resolver failures separately from live upstream failures', () => {
		expect(classifyAssertLoadedResolverProbeCase({
			key: 'field:0:Event.kind:Source',
			resolveRejected: true,
			resolveError: 'Unsupported conditional facet dependency Event.kind',
		})).toBe('unsupportedField')
	})
})
