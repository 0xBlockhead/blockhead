import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/query-core'

import { app } from '../../APP.ts'
import {
	compileApp,
	type CompiledSourceClaim,
} from '../../scripts/app/generate.ts'

import {
	materializeResolverOutput,
	ResolverOutputMaterialization,
} from '$/collections/assertLoadedCollectionRows.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { resolverAccountabilityReport } from '$/resolvers/accountability.ts'
import {
	indexResolvers,
	validateResolverDefinitions,
	type SourceResolverDefinition,
	type SourceResolverDefinitionCandidate,
} from '$/resolvers/$resolvers.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	entityFieldDefinitions,
	entitySelectorKey,
	indexSchema,
	type EntitySelector,
	type Schema,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { type as arktype } from 'arktype'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import sourceProviders, { sourceBindings } from '$/sources/$sourceProviders.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import { CoinId } from '$/constants/Coin.ts'
import { networkBySlug } from '$/constants/Network.ts'
import voltaireJsonRpc from '$/resolvers/Voltaire-JsonRpc.ts'

const resolvers = await loadResolvers()
const declaredBrowserSources = new Set(
	sourceBindings
		.filter((binding) => (
			binding.delivery === SourceDelivery.BrowserDirect
				|| binding.delivery === SourceDelivery.HttpProxy
				|| binding.delivery === SourceDelivery.RemoteLive
				|| binding.delivery === SourceDelivery.RemoteQuery
		))
		.map((binding) => binding.source)
)
const {
	resolverDefinitions,
	resolverParts,
	resolverValuePartsByEntityTypeAndFieldName,
	resolverCountPartsByEntityTypeAndFieldName,
	resolverLivePartsByEntityTypeAndFieldName,
	resolverRootLivePartsByEntityType,
	fieldNamesWithLiveResolverByEntityType,
} = indexResolvers(
	schema,
	resolvers,
	declaredBrowserSources
)
const compiledSourceClaims = compileApp(app).sourceClaims
const schemaIndex = indexSchema(schema)
const {
	resolverDefinitions: allSourceResolverDefinitions,
	resolverParts: allSourceResolverParts,
} = indexResolvers(
	schema,
	resolvers,
	new Set(sourceProviders.flatMap((sourceProvider) => (
		Object.keys(sourceProvider.sources)
	)))
)

const resolverFieldNames = (
	resolver: typeof allSourceResolverDefinitions[number] | undefined
) => [
	...resolverParts,
	...allSourceResolverParts,
]
	.filter((resolverPart) => resolverPart.resolver === resolver)
	.map((resolverPart) => resolverPart.fieldName)

const resolverFieldSelector = (
	resolver: typeof allSourceResolverDefinitions[number] | undefined,
	fieldName: string
) => [
	...resolverParts,
	...allSourceResolverParts,
].find((resolverPart) => (
	resolverPart.resolver === resolver
	&& resolverPart.fieldName === fieldName
))?.select

const resolverSourceClaimKey = (claim: CompiledSourceClaim) => [
	claim.publicRoute,
	claim.source,
	claim.entityType,
	claim.selectorName,
	claim.facetPath.join('.'),
	claim.fieldName,
].filter((part) => part != null && part !== '').join(':')

const resolverSourceClaimGaps = (
	claims: readonly CompiledSourceClaim[]
) => claims.flatMap((claim) => {
	const resolverDefinitionsForClaim = allSourceResolverDefinitions.filter((resolver) => (
		resolver.source === claim.source
		&& resolver.entityType === claim.entityType
	))
	const routeSelectorMaterialized = (
		claim.selectorName != null
		&& resolverDefinitionsForClaim.some((resolver) => resolver.resolve[claim.selectorName] != null)
	)
	if (claim.fieldName == null)
		return routeSelectorMaterialized ? [] : [resolverSourceClaimKey(claim)]

	const fieldMaterialized = allSourceResolverParts.some((resolverPart) => (
		resolverPart.source === claim.source
		&& resolverPart.entityType === claim.entityType
		&& resolverPart.fieldName === claim.fieldName
		&& resolverPart.facetPath.length === claim.facetPath.length
		&& resolverPart.facetPath.every((facetName, index) => facetName === claim.facetPath[index])
		&& (
			claim.selectorName == null
			|| (
				resolverPart.parentSelectors
				?? Object.keys(resolverPart.resolver.resolve)
			).includes(claim.selectorName)
		)
	))
	const selectorFieldMaterialized = claim.facetPath.length === 0 && resolverDefinitionsForClaim.some((resolver) => (
		(
			claim.selectorName == null ? Object.keys(resolver.resolve) : [claim.selectorName]
		).some((selectorName) => (
			resolver.resolve[selectorName] != null
			&& schema.find((entityDefinition) => entityDefinition.entityType === claim.entityType)
				?.selectors.find((selector) => selector.name === selectorName)
				?.fields.includes(claim.fieldName) === true
		))
	))

	return fieldMaterialized || selectorFieldMaterialized ? [] : [resolverSourceClaimKey(claim)]
})

const sourceClaimParentMaterializers = (claim: CompiledSourceClaim) => allSourceResolverParts.filter((resolverPart) => {
	if (
		resolverPart.source !== claim.source
		|| (
			resolverPart.select == null
			&& resolverPart.resolveLive == null
		)
	)
		return false

	const fieldDefinition = schemaIndex.entityFieldDefinitionByEntityTypePathAndName[resolverPart.entityType][
		entityFieldAddressKey(
			resolverPart.entityType,
			resolverPart.facetPath,
			resolverPart.fieldName
		)
	]
	return (
		(
			fieldDefinition?.type === EntityFieldType.EntityReference
			|| fieldDefinition?.type === EntityFieldType.EntitiesReference
		)
		&& fieldDefinition.entityType === claim.entityType
	)
})

const compiledResolverSourceClaimGapKeys = new Set(resolverSourceClaimGaps(compiledSourceClaims))
const compiledResolverSourceClaimGaps = compiledSourceClaims.filter((claim) => (
	compiledResolverSourceClaimGapKeys.has(resolverSourceClaimKey(claim))
))

const fieldDefinitionByEntityTypeAndFieldName = Object.fromEntries(
	schema.map((entityDefinition) => [
		entityDefinition.entityType,
		Object.fromEntries(
			entityFieldDefinitions(entityDefinition).map((fieldDefinition) => [
				fieldDefinition.name,
				fieldDefinition,
			])
		),
	])
)

enum FixtureEntitySelector {
	Slug = 'slug',
}

const fixtureSchema = [
	{
		entityType: 'FixtureEntity',
		label: 'Fixture entity',
		labelPlural: 'Fixture entities',
		selectors: [
			{
				name: FixtureEntitySelector.Slug,
				fields: ['slug'],
			},
		],
		fields: [
			{
				name: 'slug',
				type: EntityFieldType.Primitive,
				primitiveType: arktype('string'),
				cardinality: EntityFieldCardinality.One,
			},
			{
				name: 'name',
				type: EntityFieldType.Primitive,
				primitiveType: arktype('string'),
				cardinality: EntityFieldCardinality.One,
			},
			{
				name: 'segments',
				type: EntityFieldType.Primitive,
				primitiveType: arktype('string[]'),
				cardinality: EntityFieldCardinality.One,
			},
			{
				name: '$$children',
				type: EntityFieldType.EntitiesReference,
				entityType: 'FixtureEntity',
				cardinality: EntityFieldCardinality.ZeroOrMany,
			},
		],
	},
] as const satisfies Schema

const validFixtureResolver = {
	definitionIndex: 0,
	source: 'Fixture',
	entityType: 'FixtureEntity',
	resolve: {
		[FixtureEntitySelector.Slug]: {
			resolve: async () => ({}),
		},
	},
	projections: {
		name: () => 'Ada',
		segments: () => ['kind'],
	},
} satisfies SourceResolverDefinitionCandidate<typeof fixtureSchema, 'Fixture'>

describe('resolver registry live resolver architecture', () => {
	it('registers only resolver modules with at least one definition', () => {
		expect(resolvers.every((resolverModule) => resolverModule.resolvers.length > 0)).toBe(true)
		const activeResolverSources = resolvers.map((resolverModule) => resolverModule.source)

		expect(activeResolverSources.length).toBeGreaterThan(0)
		expect(new Set(activeResolverSources).size).toBe(activeResolverSources.length)
		expect(activeResolverSources.every((source) => (
			sourceProviders.some((sourceProvider) => (
				Object.hasOwn(sourceProvider.sources, source)
			))
		))).toBe(true)
	})

	it('assigns each selector field capability to one resolver definition', () => {
		const ownershipKeys = allSourceResolverParts.flatMap((part) => (
			Object.keys(part.resolver.resolve).flatMap((selectorName) => [
				...(part.select == null ? [] : ['value']),
				...(part.resolveCount == null ? [] : ['count']),
				...(part.resolveLive == null ? [] : ['live']),
			].map((capability) => [
				part.source,
				part.entityType,
				selectorName,
				...part.facetPath,
				part.fieldName,
				capability,
			].join('\0')))
		))

		expect(ownershipKeys.filter((ownershipKey, index) => (
			ownershipKeys.indexOf(ownershipKey) !== index
		))).toEqual([])
	})

	it('rejects invalid resolver definitions before runtime reads', () => {
		for (const [label, resolver, message] of [
			[
				'unknown entity',
				{
					...validFixtureResolver,
					entityType: 'MissingEntity',
				},
				/references unknown entity/,
			],
			[
				'unknown selector',
				{
					...validFixtureResolver,
					resolve: {
						missingSelector: {
							resolve: async () => ({}),
						},
					},
				},
				/references unknown selector missingSelector/,
			],
			[
				'empty fields',
				{
					...validFixtureResolver,
					projections: {},
				},
				/declares no fields/,
			],
			[
				'unknown field',
				{
					...validFixtureResolver,
					projections: {
						missingField: () => undefined,
					},
				},
				/references unknown projection path missingField/,
			],
			[
				'unknown parent selector',
				{
					...validFixtureResolver,
					projections: {
						$$children: {
							parentSelectors: ['missingSelector'],
							select: () => [],
						},
					},
				},
				/references unknown parent selector missingSelector/,
			],
			[
				'count on scalar field',
				{
					...validFixtureResolver,
					projections: {
						name: {
							resolveCount: () => 1,
						},
					},
				},
				/has resolveCount but is not multiple-cardinality/,
			],
			[
				'unknown root live field',
				{
					...validFixtureResolver,
					resolveLive: {
						clock: {
							facetPath: [],
							publishes: {
								missingField: true,
							},
							start: () => {},
						},
					},
				},
				/publishes undeclared live field .*missingField/,
			],
			[
				'undeclared root live field',
				{
					...validFixtureResolver,
					resolveLive: {
						clock: {
							facetPath: [],
							publishes: {
								$$children: true,
							},
							start: () => {},
						},
					},
				},
				/publishes undeclared live field .*\$\$children/,
			],
			[
				'async field selector',
				{
					...validFixtureResolver,
					projections: {
						name: async () => 'Ada',
					},
				},
				/has async field selector/,
			],
			[
				'async count selector',
				{
					...validFixtureResolver,
					projections: {
						$$children: {
							resolveCount: async () => 1,
						},
					},
				},
				/has async count selector/,
			],
			] satisfies readonly (readonly [
				label: string,
				resolver: SourceResolverDefinitionCandidate<typeof fixtureSchema, 'Fixture', string>,
				message: RegExp,
			])[]) {
			expect(
				() => validateResolverDefinitions(fixtureSchema, [resolver]),
				label
			).toThrow(message)
		}
	})

	it('keeps live resolver identity out of declarative resolver definitions', () => {
		expect(
			resolverDefinitions.some((resolver) => (
				'id' in resolver
			))
		).toBe(false)
	})

	it('requires concrete resolver declarations to name every supported field facet', () => {
		expect(() => {
			defineResolver({
				entityType: EntityType.Network,
				resolve: {
					// @ts-expect-error Resolver keys must be selector names declared by the entity schema.
					Missing: {
						resolve: async () => ({}),
					},
				},
			})({})
		}).toBeTypeOf('function')
		expect(() => {
			defineResolver({
				entityType: EntityType.Network,
				resolve: {
					Caip2: {
						resolve: async () => ({}),
					},
				},
				resolveLive: {
					invalid: {
						facetPath: [
							'Evm',
						],
						publishes: {
							// @ts-expect-error Live publisher field names are scoped by facetPath.
							missingField: true,
						},
						start: ({ fields }) => {
							fields.$$blocks.invalidate()
							// @ts-expect-error Live field handles are scoped by facetPath.
							fields.missingField.invalidate()
						},
					},
				},
			})({})
		}).toBeTypeOf('function')
		expect(() => {
			defineResolver({
				entityType: EntityType.Network,
				resolve: {
					Caip2: {
						resolve: async () => [],
					},
				},
			})({
				Evm: {
					$$blocks: () => [{
						[EntityMetaKey.Selector]: {
							$network: {
								caip2: {
									namespace: 'eip155',
									reference: '1',
								},
							},
							blockNumber: 1n,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.EvmBlock, [], 'hash')]: '0x01',
						},
						// @ts-expect-error Facet reference writers cannot emit direct sibling fields.
						hash: '0x01',
					}],
				},
			})
		}).toBeTypeOf('function')

		expect(allSourceResolverDefinitions.length).toBeGreaterThan(0)
		expect(allSourceResolverDefinitions.every((resolver) => (
			Object.keys(resolver.projections).length > 0
		))).toBe(true)
		expect(Object.values(resolverRootLivePartsByEntityType).flat().every((part) => (
			Object.keys(part.publisher.publishes).every((fieldName) => (
				resolverFieldNames(part.resolver).includes(fieldName)
			))
		))).toBe(true)
	})

	it('types projection fields declared by nested facets', () => {
		expect(
			defineResolver({
				entityType: EntityType.EvmLog,
				resolve: {
					TransactionIndexInTransaction: {
						resolve: async () => [],
					},
				},
			})({
				Event: {
					TokenTransfer: {
						$$tokenTransfers: (transfers) => transfers,
					},
				},
			}).projections.Event.TokenTransfer.$$tokenTransfers
		).toBeTypeOf('function')
	})

	it('indexes live definitions by materialized position instead of source/entity/field identity', () => {
		const liveDefinitions = Object.values(resolverRootLivePartsByEntityType).flat()

		expect(liveDefinitions.length).toBeGreaterThan(0)
			expect(new Set(liveDefinitions.map((part) => part.resolver.definitionIndex)).size).toBe(
				liveDefinitions.length
			)
			expect(liveDefinitions.every((part) => (
				resolverDefinitions[part.resolver.definitionIndex] === part.resolver
			))).toBe(true)
	})

	it('keeps resolver parts anchored to materialized resolver and field positions', () => {
		expect(resolverParts.length).toBeGreaterThan(0)
		expect(resolverParts.every((resolverPart) => (
			resolverDefinitions[resolverPart.resolver.definitionIndex] === resolverPart.resolver
			&& resolverParts.filter((candidate) => candidate.resolver === resolverPart.resolver)[resolverPart.partIndex] === resolverPart
		))).toBe(true)
		expect(
			resolverParts.some((resolverPart, resolverPartIndex) => (
				resolverParts.some((otherResolverPart, otherResolverPartIndex) => (
					otherResolverPartIndex !== resolverPartIndex
					&& otherResolverPart.source === resolverPart.source
					&& otherResolverPart.entityType === resolverPart.entityType
					&& otherResolverPart.fieldName === resolverPart.fieldName
					&& (
						otherResolverPart.resolver.definitionIndex !== resolverPart.resolver.definitionIndex
						|| otherResolverPart.partIndex !== resolverPart.partIndex
					)
				))
			))
		).toBe(true)
	})

	it('exposes Voltaire blockstream as EVM network timestamp live rows', () => {
		const evmNetworkRootLiveParts = resolverRootLivePartsByEntityType[EntityType.Network] ?? []

		expect(fieldNamesWithLiveResolverByEntityType[EntityType.Network]).toContain('$$timestamps')
		expect(evmNetworkRootLiveParts.some((part) => (
			part.facetPath.join('.') === 'Evm'
			&& part.publisher.publishes.$$timestamps === true
		))).toBe(true)
		expect(resolverParts.some((part) => (
			part.entityType === EntityType.EvmNetwork_Timestamp
			&& part.fieldName === 'blockHeight'
			&& part.select != null
		))).toBe(true)
	})

	it('indexes live entity and field keys alphabetically without reordering resolver parts', () => {
		expect(Object.keys(fieldNamesWithLiveResolverByEntityType)).toEqual(
			Object.keys(fieldNamesWithLiveResolverByEntityType).toSorted((left, right) => left.localeCompare(right, 'en'))
		)
		for (const fieldNames of Object.values(fieldNamesWithLiveResolverByEntityType))
			expect(fieldNames).toEqual(fieldNames.toSorted((left, right) => left.localeCompare(right, 'en')))
	})

	it('publishes Voltaire live EVM network Many fields as one source row containing an array', async () => {
		const replaceTimestampRows = vi.fn()
		const replaceBlockRows = vi.fn()
		const getRecentBlockWires = vi.fn(async () => ({
			head: 12n,
			blockNumbers: [12n],
			wires: [{
				number: '0xc',
				hash: `0x${'12'.repeat(32)}`,
				parentHash: `0x${'34'.repeat(32)}`,
				timestamp: '0x64',
				miner: `0x${'56'.repeat(20)}`,
				gasUsed: '0x1',
				gasLimit: '0x2',
				transactions: [],
			}],
		}))
		const iterateBlockStreamEvents = vi.fn(async function* ({
			fromBlock,
			signal,
		}: {
			fromBlock: bigint
			signal: AbortSignal
		}) {
			expect(fromBlock).toBe(12n)
			yield {
				type: 'blocks',
				blocks: [],
				metadata: {
					chainHead: 12n,
				},
			}
			await new Promise<void>((resolve) => {
				signal.addEventListener('abort', () => resolve(), { once: true })
			})
		})
		const abortController = new AbortController()
		const $network = {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		} satisfies EntitySelector<typeof schema, EntityType.Network>
		const jsonRpcTransport = {
			diagnosticLabel: 'mainnet HTTP',
			getRecentBlockWires,
			iterateBlockStreamEvents,
		}
		vi.doMock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
			voltaireJsonRpcTransportsForBinding: () => [{
				endpointKind: SourceEndpointKind.HttpUrl,
				transport: jsonRpcTransport,
			}],
		}))
		const blockStream = voltaireJsonRpc.resolvers.find((resolver) => (
			'resolveLive' in resolver
		))?.resolveLive.blockStream
		if (blockStream == null)
			throw new Error('Voltaire_JsonRpc: missing blockStream live resolver')

		blockStream.start({
			parentEntitySelector: $network,
			queryClient: new QueryClient(),
			signal: abortController.signal,
			trigger: {
				filters: [],
				sorts: [],
				pagination: {
					limit: 2,
				},
				selectorKeys: [],
				parentSelectorKeys: [],
				publicEnv: {},
			},
			fields: {
				'$$timestamps': {
					replaceRows: replaceTimestampRows,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$blocks': {
					replaceRows: replaceBlockRows,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$transactions': {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$contracts': {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$blobs': {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$beaconEpochs': {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$beaconSlots': {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				invalidate: vi.fn(),
			},
		})

		try {
			await vi.waitFor(() => {
				expect(replaceTimestampRows).toHaveBeenCalledOnce()
				expect(replaceBlockRows).toHaveBeenCalledOnce()
				expect(iterateBlockStreamEvents).toHaveBeenCalledOnce()
			})
			expect(getRecentBlockWires).toHaveBeenCalledWith(expect.objectContaining({
				recentBlockDepth: 16,
			}))
			expect(getRecentBlockWires).toHaveBeenCalledOnce()
			expect(replaceTimestampRows).toHaveBeenCalledWith([{
				source: Source.Voltaire_JsonRpc,
				value: [{
					[EntityMetaKey.Selector]: {
						$network,
						timestampMs: expect.any(Number),
						source: Source.Voltaire_JsonRpc,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: 12n,
					},
				}],
			}])
			expect(replaceBlockRows).toHaveBeenCalledWith([{
				source: Source.Voltaire_JsonRpc,
				value: [{
					[EntityMetaKey.Selector]: {
						$network,
						blockNumber: 12n,
					},
					[EntityMetaKey.Fields]: expect.objectContaining({
						[entityFieldAddressKey(EntityType.EvmBlock, [], 'blockNumber')]: 12n,
						[entityFieldAddressKey(EntityType.EvmBlock, [], 'hash')]: `0x${'12'.repeat(32)}`,
					}),
				}],
			}])
			const schemaIndex = indexSchema(schema)
			const fieldDefinition = schemaIndex.entityFieldDefinitionByEntityTypePathAndName[EntityType.Network][
				entityFieldAddressKey(EntityType.Network, ['Evm'], '$$blocks')
			]
			if (fieldDefinition == null)
				throw new Error('Network.Evm.$$blocks field definition missing')

			expect(() => materializeResolverOutput({
				kind: ResolverOutputMaterialization.Field,
				schema,
				schemaIndex,
				entityDefinition: schemaIndex.entityDefinitionByType[EntityType.Network],
				parentSelector: $network,
				parentSelectorKey: entitySelectorKey(
					schema,
					schemaIndex.entityDefinitionByType[EntityType.Network],
					$network
				),
				source: Source.Voltaire_JsonRpc,
				fieldDefinition,
				value: replaceBlockRows.mock.calls[0][0][0].value,
			})).not.toThrow()
		} finally {
			abortController.abort()
		}
	})

	it('keeps root and field live resolver indexes distinct', () => {
		const rootLiveFields = new Set(
			Object.values(resolverRootLivePartsByEntityType)
				.flat()
					.flatMap((part) => (
						Object.keys(part.publisher.publishes).map((fieldName) => ({
							entityType: part.entityType,
							fieldName,
						}))
					))
		)
		expect(rootLiveFields.size).toBeGreaterThan(0)
		expect(Object.values(resolverRootLivePartsByEntityType).flat().every((resolver) => (
			'partIndex' in resolver
		))).toBe(false)
		expect(Object.values(resolverLivePartsByEntityTypeAndFieldName).flat().every((resolverPart) => (
			'partIndex' in resolverPart
		))).toBe(true)
		expect(fieldNamesWithLiveResolverByEntityType[EntityType.Network]).toContain('$$timestamps')
	})

	it('indexes value and count resolver parts without resolver ids', () => {
		expect(
			resolverParts.filter((part) => (
				part.entityType === EntityType.EvmNetwork_Timestamp
				&& part.fieldName === 'blockHeight'
				&& part.select != null
			)).length
		).toBeGreaterThan(0)
		expect(
			resolverParts.filter((part) => (
				part.entityType === EntityType.Network
				&& part.facetPath.join('.') === 'Evm'
				&& part.fieldName === '$$blocks'
				&& part.resolveCount != null
			)).length
		).toBeGreaterThan(0)
		for (const [source, facetPath, fieldName] of [
			[Source.CosmosSdk_Rest, 'Cosmos', '$$accounts'],
			[Source.CosmosSdk_Rest, 'Cosmos', '$$validators'],
			[Source.CosmosSdk_Rest, 'Cosmos', '$$governanceProposals'],
			[Source.Blockchair_Rest, 'Utxo', '$$blocks'],
			[Source.Blockchair_Rest, 'Utxo', '$$transactions'],
			[Source.MempoolSpace_Rest, 'Utxo', '$$blocks'],
			[Source.MempoolSpace_Rest, 'Utxo', '$$transactions'],
			[Source.SubstrateSidecar_Rest, 'Polkadot', '$$validators'],
			[Source.Solana_JsonRpc, 'Solana', '$$validators'],
		] as const)
			expect(
				resolverParts.filter((part) => (
					part.source === source
					&& part.entityType === EntityType.Network
					&& part.facetPath.join('.') === facetPath
					&& part.fieldName === fieldName
					&& part.resolveCount != null
				)).length
			).toBeGreaterThan(0)
		for (const [source, fieldName] of [
			[Source.Blockscout_Rest, '$$logs'],
			[Source.Voltaire_JsonRpc, '$$logs'],
			[Source.Voltaire_JsonRpc, '$$traces'],
		] as const)
			expect(
				resolverParts.filter((part) => (
					part.source === source
					&& part.entityType === EntityType.EvmTransaction
					&& part.facetPath.length === 0
					&& part.fieldName === fieldName
					&& part.resolveCount != null
				)).length
			).toBeGreaterThan(0)
		expect(
			Object.values(resolverValuePartsByEntityTypeAndFieldName)
				.flat()
				.some((resolverPart) => (
					'id' in resolverPart
					|| 'id' in resolverPart.resolver
				))
		).toBe(false)
	})

	it('preserves duplicate-safe field part indexes for multi-selector resolve keys and parentSelectors parts', () => {
		const first = defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => ({}),
				},
			},
		})({
				$$networks: {
					parentSelectors: ['Scope'],
					select: () => ([]),
				},
			})
		const second = defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => ({}),
				},
			},
		})({
				$$networks: {
					parentSelectors: ['Scope'],
					select: () => ([]),
				},
			})
		const parts = [first, second].flatMap((resolver, definitionIndex) => (
			Object.entries(resolver.projections).map(([fieldName, fieldSelector], partIndex) => ({
				...(typeof fieldSelector === 'function' ? { select: fieldSelector } : fieldSelector),
				definitionIndex,
				partIndex,
				source: Source.Constants_Internal,
				entityType: resolver.entityType,
				fieldName,
				resolveSelectorNames: Object.keys(resolver.resolve),
			}))
		))

		expect(parts).toEqual([
			expect.objectContaining({
				definitionIndex: 0,
				partIndex: 0,
				resolveSelectorNames: ['Scope'],
				parentSelectors: ['Scope'],
			}),
			expect.objectContaining({
				definitionIndex: 1,
				partIndex: 0,
				resolveSelectorNames: ['Scope'],
				parentSelectors: ['Scope'],
			}),
		])
		expect(new Set(parts.map((part) => (
			`${part.source}:${part.entityType}:${part.fieldName}`
		))).size).toBe(1)
		expect(new Set(parts.map((part) => (
			`${part.definitionIndex}:${part.partIndex}`
		))).size).toBe(parts.length)
	})

	it('limits resolver selector matching to schema selector names', () => {
		const entitySelectorNamesByEntityType = Object.fromEntries(
			schema.map((entityDefinition) => [
				entityDefinition.entityType,
				new Set(entityDefinition.selectors.map((selector) => selector.name)),
			])
		)

		expect(resolverDefinitions.every((resolver) => (
			Object.keys(resolver.resolve).every((selectorName) => (
				entitySelectorNamesByEntityType[resolver.entityType]?.has(selectorName)
			))
		))).toBe(true)
		expect(Object.values(resolverValuePartsByEntityTypeAndFieldName).flat().every((resolverPart) => (
			(resolverPart.parentSelectors ?? []).every((selectorName) => (
				entitySelectorNamesByEntityType[resolverPart.entityType]?.has(selectorName)
			))
		))).toBe(true)
	})

	it('keeps generated source, schema, and resolver contracts aligned', () => {
		const generatedEntityTypes = schema.map((entity) => entity.entityType)
		const generatedSourceProviders = sourceProviders.map((sourceProvider) => sourceProvider.provider)
		const generatedSources = sourceProviders.flatMap((sourceProvider) => (
			Object.keys(sourceProvider.sources)
		))

		expect(generatedEntityTypes.length).toBe(new Set(generatedEntityTypes).size)
		expect(Object.values(EntityType).filter((entityType) => !generatedEntityTypes.includes(entityType))).toEqual([])
		expect(generatedEntityTypes.filter((entityType) => !(entityType in EntityType))).toEqual([])
		expect(generatedSourceProviders.length).toBe(new Set(generatedSourceProviders).size)
		expect(generatedSourceProviders.filter((sourceProvider) => !(sourceProvider in SourceProvider))).toEqual([])
		expect(generatedSources.length).toBe(new Set(generatedSources).size)
		expect(generatedSources.filter((source) => !(source in Source))).toEqual([])
		expect(resolvers.filter((resolverModule) => !generatedSources.includes(resolverModule.source))).toEqual([])
	})

	it('joins compiled public and default source claims to loaded resolver materializers', () => {
		const compiledNetworkClaims = compiledSourceClaims.filter((claim) => (
			claim.source === Source.Constants_Internal
			&& claim.entityType === EntityType.Network
			&& (
				claim.publicRoute === '/network/[network]'
				|| (
					claim.facetPath.join('.') === 'Evm'
					&& claim.fieldName === 'consensusProtocol'
				)
			)
		))
		expect(compiledNetworkClaims).toHaveLength(3)
		expect(resolverSourceClaimGaps(compiledNetworkClaims)).toEqual([])
		const auditedPublicSourceClaims = compiledSourceClaims.filter((claim) => (
			claim.publicRoute != null
			&& [
				'/network/[network]/account/[accountAddress]/subaccount/[subaccountNumber]/market/[ticker]',
				'/network/[network]/eas/',
				'/network/[network]/eigenlayer',
				'/~/pyth/feed/',
			].some((publicRoutePrefix) => claim.publicRoute.startsWith(publicRoutePrefix))
		))
		expect(resolverSourceClaimGaps(auditedPublicSourceClaims)).toEqual([])
		expect(auditedPublicSourceClaims.filter((claim) => (
			claim.entityType === EntityType.DydxChainPerpetualPosition
			|| claim.entityType === EntityType.DydxChainPerpetualPosition_Timestamp
		)).map((claim) => ({ ...claim }))).toEqual([{
			source: Source.DydxIndexer,
			entityType: EntityType.DydxChainPerpetualPosition,
			selectorName: 'SubaccountMarket',
			facetPath: [],
			publicRoute: '/network/[network]/account/[accountAddress]/subaccount/[subaccountNumber]/market/[ticker]',
		}])
		expect(compiledSourceClaims.filter((claim) => [
			`${EntityType.DydxChainPerpetualPosition_Timestamp}:PositionTimestampMsSource`,
			`${EntityType.EigenLayerSlashingEvent}:NetworkTransactionHashLogIndex`,
			`${EntityType.EigenLayerStrategy_Timestamp}:StrategyTimestampMsSource`,
		].includes(`${claim.entityType}:${claim.selectorName}`))).toEqual([])
		expect(compiledSourceClaims.some((claim) => (
			claim.entityType === EntityType.LiquidityPool_Block
			&& claim.publicRoute != null
		))).toBe(false)
		expect(resolverSourceClaimGaps([{
			source: Source.Constants_Internal,
			entityType: EntityType.Network,
			selectorName: 'Caip2',
			facetPath: [],
			fieldName: 'missingCompilerFixtureField',
			publicRoute: '/compiler-source-claim-fixture',
		}])).toEqual([
			'/compiler-source-claim-fixture:Constants_Internal:Network:Caip2:missingCompilerFixtureField',
		])
	})

	it('registers Snapshot vote detail and proposal vote-list source claims', () => {
		const snapshotVoteClaims = compiledSourceClaims.filter((claim) => (
			claim.source === Source.SnapshotHub_Graphql
			&& (
				claim.entityType === EntityType.SnapshotVote
				|| (
					claim.entityType === EntityType.SnapshotProposal
					&& claim.fieldName === '$$votes'
				)
			)
		))
		expect(snapshotVoteClaims).toHaveLength(16)
		expect(snapshotVoteClaims).toEqual(expect.arrayContaining([
			expect.objectContaining({
				entityType: EntityType.SnapshotVote,
				selectorName: 'VoteId',
				publicRoute: '/~/snapshot/vote/[voteId]',
			}),
			expect.objectContaining({
				entityType: EntityType.SnapshotProposal,
				fieldName: '$$votes',
				publicRoute: '/~/snapshot/proposal/[proposalId]/votes',
			}),
		]))
		expect(resolverSourceClaimGaps(snapshotVoteClaims)).toEqual([])
		expect(allSourceResolverDefinitions.some((resolver) => (
			resolver.source === Source.SnapshotHub_Graphql
			&& resolver.entityType === EntityType.SnapshotVote
			&& resolver.resolve['VoteId'] != null
		))).toBe(true)
		expect(allSourceResolverParts.some((resolverPart) => (
			resolverPart.source === Source.SnapshotHub_Graphql
			&& resolverPart.entityType === EntityType.SnapshotProposal
			&& resolverPart.fieldName === '$$votes'
			&& resolverPart.select != null
		))).toBe(true)
	})

	it('accounts for endpoint observation source claims through current Network snapshot materializers', () => {
		expect(compiledSourceClaims.filter((claim) => (
			claim.entityType === EntityType.NetworkEndpointObservation_Timestamp
		)).map((claim) => [
			claim.source,
			claim.facetPath.join('.'),
			claim.fieldName,
		])).toEqual([
			[Source.Beacon_Rest, 'Beacon', 'attestationSubnets'],
			[Source.Beacon_Rest, 'Beacon', 'connectedPeerCount'],
			[Source.Beacon_Rest, 'Beacon', 'connectingPeerCount'],
			[Source.Beacon_Rest, 'Beacon', 'custodyGroupCount'],
			[Source.Beacon_Rest, 'Beacon', 'disconnectedPeerCount'],
			[Source.Beacon_Rest, 'Beacon', 'disconnectingPeerCount'],
			[Source.Beacon_Rest, 'Beacon', 'discoveryAddresses'],
			[Source.Beacon_Rest, 'Beacon', 'enr'],
			[Source.Beacon_Rest, 'Beacon', 'executionLayerOffline'],
			[Source.Beacon_Rest, 'Beacon', 'headSlot'],
			[Source.Beacon_Rest, 'Beacon', 'isOptimistic'],
			[Source.Beacon_Rest, 'Beacon', 'isSyncing'],
			[Source.Beacon_Rest, 'Beacon', 'metadataSequenceNumber'],
			[Source.Beacon_Rest, 'Beacon', 'p2pAddresses'],
			[Source.Beacon_Rest, 'Beacon', 'peerId'],
			[Source.Beacon_Rest, 'Beacon', 'statusCode'],
			[Source.Beacon_Rest, 'Beacon', 'syncCommitteeSubnets'],
			[Source.Beacon_Rest, 'Beacon', 'syncDistance'],
			[Source.Beacon_Rest, 'Beacon', 'version'],
			[Source.Voltaire_JsonRpc, 'Execution', 'peerCount'],
		])
		expect(allSourceResolverDefinitions.filter((resolver) => (
			resolver.entityType === EntityType.Network
			&& (
				resolver.source === Source.Beacon_Rest
				|| resolver.source === Source.Voltaire_JsonRpc
			)
			&& resolverFieldNames(resolver).includes('$$endpointObservations')
		)).map((resolver) => resolver.source)).toEqual([
			Source.Beacon_Rest,
			Source.Voltaire_JsonRpc,
		])
		expect(allSourceResolverDefinitions.filter((resolver) => (
			resolver.entityType === EntityType.NetworkEndpointObservation_Timestamp
			&& (
				resolver.source === Source.Beacon_Rest
				|| resolver.source === Source.Voltaire_JsonRpc
			)
		))).toEqual([])
	})

	it('accounts for unresolved child-field claims through same-source parent materializers', () => {
		const parentOwnedClaims = compiledResolverSourceClaimGaps.filter((claim) => (
			claim.publicRoute == null
			&& claim.source !== Source.Constants_Internal
			&& claim.source !== Source.Local_Internal
			&& sourceClaimParentMaterializers(claim).length > 0
		))

		expect(parentOwnedClaims).toHaveLength(70)
		expect(Object.entries(Object.groupBy(
			parentOwnedClaims,
			(claim) => claim.entityType
		)).map(([entityType, claims]) => [
			entityType,
			(claims ?? []).length,
		]).toSorted(([leftEntityType], [rightEntityType]) => (
			String(leftEntityType).localeCompare(String(rightEntityType), 'en')
		))).toEqual([
			[EntityType._GlobalIpfsAccess_Timestamp, 3],
			[EntityType._GlobalSwarmAccess_Timestamp, 5],
			[EntityType.AtprotoPost_Timestamp, 10],
			[EntityType.BridgeTransfer_Timestamp, 1],
			[EntityType.CardanoTransaction, 1],
			[EntityType.EvmNetworkActorCoinBalance_Timestamp, 1],
			[EntityType.HyperliquidPerpMarket_Timestamp, 2],
			[EntityType.LiquidityPool_Timestamp, 16],
			[EntityType.NetworkEndpointObservation_Timestamp, 20],
			[EntityType.UtxoAddress_Timestamp, 1],
			[EntityType.XrplLedger, 1],
			[EntityType.XrplLedgerEntry, 5],
			[EntityType.XrplTransaction, 4],
		])
		for (const claim of parentOwnedClaims) {
			expect(claim.fieldName).toBeDefined()
			expect(sourceClaimParentMaterializers(claim).every((resolverPart) => {
				const fieldDefinition = schemaIndex.entityFieldDefinitionByEntityTypePathAndName[resolverPart.entityType][
					entityFieldAddressKey(
						resolverPart.entityType,
						resolverPart.facetPath,
						resolverPart.fieldName
					)
				]
				return (
					resolverPart.source === claim.source
					&& (
						fieldDefinition?.type === EntityFieldType.EntityReference
						|| fieldDefinition?.type === EntityFieldType.EntitiesReference
					)
					&& fieldDefinition.entityType === claim.entityType
				)
			})).toBe(true)
		}
	})

	it('classifies unresolved checked-in and local claims under in-process catalog owners', () => {
		const catalogOwnedClaims = compiledResolverSourceClaimGaps.filter((claim) => (
			claim.source === Source.Constants_Internal
			|| claim.source === Source.Local_Internal
		))

		expect(catalogOwnedClaims).toHaveLength(99)
		expect(Object.entries(Object.groupBy(
			catalogOwnedClaims,
			(claim) => claim.source
		)).map(([source, claims]) => [
			source,
			(claims ?? []).length,
		])).toEqual([
			[Source.Constants_Internal, 15],
			[Source.Local_Internal, 84],
		])
		for (const source of [
			Source.Constants_Internal,
			Source.Local_Internal,
		]) {
			expect(catalogOwnedClaims.some((claim) => claim.source === source)).toBe(true)
			expect(allSourceResolverDefinitions.some((resolver) => resolver.source === source)).toBe(true)
			expect(sourceBindings.filter((binding) => binding.source === source)).toEqual([
				expect.objectContaining({
					source,
					target: {
						kind: SourceTargetKind.Global,
						key: source === Source.Constants_Internal ? 'checked-in-catalog' : 'internal-catalog',
					},
					endpoints: [expect.objectContaining({
						endpointKind: SourceEndpointKind.InProcess,
					})],
					wireProtocol: WireProtocol.InProcess,
					apiFamily: ApiFamily.CatalogRows,
					delivery: SourceDelivery.BrowserDirect,
					credentials: [],
				}),
			])
		}
	})

	it('keeps generated schema entities accountable without treating view source forwarding as ownership', () => {
		const accountabilityReport = resolverAccountabilityReport({
			entityTypes: schema.map((entityDefinition) => entityDefinition.entityType),
			entityTypesWithResolver: new Set(allSourceResolverDefinitions.map((resolver) => resolver.entityType)),
			entityTypesWithMaterializer: new Set([
				EntityType.XPost_Timestamp,
			]),
			sourceBackedEntityTypes: new Set(schema.flatMap((entityDefinition) => (
				Object.values(fieldDefinitionByEntityTypeAndFieldName[entityDefinition.entityType]).some((fieldDefinition) => (
					(fieldDefinition.defaultSources?.length ?? 0) > 0
				)) ?
					[entityDefinition.entityType]
				:
					[]
			))),
		})

		const newlyCoveredLocalEntityTypes = [
			EntityType.BlockheadWorkspace,
			EntityType.BlockheadPanel,
			EntityType.BlockheadLocalMediaIngest,
			EntityType.BlockheadLocalMediaIngest_Timestamp,
			EntityType.BlockheadWalletRequest,
			EntityType.BlockheadEvmWalletRequest,
			EntityType.BlockheadWalletRequestCall,
			EntityType.BlockheadWalletRequest_Timestamp,
		]
		expect(newlyCoveredLocalEntityTypes.every((entityType) => !accountabilityReport.unresolvedEntityTypes.includes(entityType))).toBe(true)
		expect(accountabilityReport.unresolvedEntityTypes).not.toContain(EntityType.BlockheadEvmWalletRequest)
		expect(accountabilityReport.unresolvedSourceBackedEntityTypes).not.toContain(EntityType.BlockheadEvmWalletRequest)
		expect(accountabilityReport.unresolvedNoDeclaredSourceEntityTypes).not.toContain(EntityType.BlockheadEvmWalletRequest)
		expect(accountabilityReport.unresolvedSourceBackedEntityTypes).not.toContain(EntityType.BlockheadWalletRequestCall)
		expect(accountabilityReport.unresolvedNoDeclaredSourceEntityTypes).not.toContain(EntityType.BlockheadWalletRequestCall)
		expect(accountabilityReport.unresolvedEntityTypes).not.toContain(EntityType.XPost_Timestamp)
		expect(accountabilityReport.total).toBe(accountabilityReport.sourceBacked + accountabilityReport.noDeclaredSource)
		expect(accountabilityReport.unresolvedEntityTypes).toEqual(expect.arrayContaining([
			...accountabilityReport.unresolvedSourceBackedEntityTypes,
			...accountabilityReport.unresolvedNoDeclaredSourceEntityTypes,
		]))
	})

	it('keeps Voltaire EVM receipt fields declared where the snapshot already materializes them', () => {
		expect(Object.keys(allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.Voltaire_JsonRpc
			&& resolver.entityType === EntityType.EvmBlock
		))?.resolve ?? {})).toEqual(expect.arrayContaining([
			'EvmNetworkBlockNumber',
			'EvmNetworkBlockHash',
		]))
		expect(resolverFieldNames(allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.Voltaire_JsonRpc
			&& resolver.entityType === EntityType.EvmTransaction
		)))).toEqual(expect.arrayContaining([
			'$block',
			'$from',
			'$to',
			'$contract',
			'indexInBlock',
			'value',
			'nonce',
			'input',
			'r',
			's',
			'v',
			'gas',
			'kind',
			'envelopeType',
			'executionStatus',
			'gasPrice',
			'gasUsed',
			'cumulativeGasUsed',
			'effectiveGasPrice',
			'maxFeePerGas',
			'maxPriorityFeePerGas',
			'blobGasUsed',
			'maxFeePerBlobGas',
			'$$logs',
			'$$traces',
		]))
		expect(resolverFieldNames(allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.Voltaire_JsonRpc
			&& resolver.entityType === EntityType.EvmTransaction
		)))).not.toContain('$$internalTransfers')
		expect(resolverFieldNames(allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.Voltaire_JsonRpc
			&& resolver.entityType === EntityType.EvmBlob
		)))).toEqual(expect.arrayContaining([
			'versionedHash',
		]))
		expect(resolverFieldNames(allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.Voltaire_JsonRpc
			&& resolver.entityType === EntityType.EvmLog
		)))).toEqual(expect.arrayContaining([
			'$$topics',
			'indexInTransaction',
			'$transaction',
			'$block',
			'data',
			'removed',
			'$emitter',
		]))
	})

	it('materializes Voltaire EVM block-hash, transaction log-list, direct log, and blob fields through real resolver facets', async () => {
		const resolverContext = {
			filters: [],
			sorts: [],
			pagination: {
				limit: 1,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		const $network = {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}
		const txHash = '0x1111111111111111111111111111111111111111111111111111111111111111'
		const blockHash = '0x2222222222222222222222222222222222222222222222222222222222222222'
		const parentHash = '0x3333333333333333333333333333333333333333333333333333333333333333'
		const from = '0x4444444444444444444444444444444444444444'
		const to = '0x5555555555555555555555555555555555555555'
		const emitter = '0x6666666666666666666666666666666666666666'
		const topic = '0x7777777777777777777777777777777777777777777777777777777777777777'
		const versionedHash = `0x01${'88'.repeat(31)}`
		const getBlockByHash = vi.fn(async () => ({
			number: '0x64',
			hash: blockHash,
			parentHash,
			timestamp: '0x65',
			miner: `0x${'99'.repeat(20)}`,
			gasUsed: '0x5208',
			gasLimit: '0x100000',
			baseFeePerGas: '0x3b9aca00',
			blobGasUsed: '0x2',
			excessBlobGas: '0x3',
			transactions: [txHash],
		}))
		const getTransactionByHash = vi.fn(async () => ({
			hash: txHash,
			blockNumber: '0x64',
			blockHash,
			transactionIndex: '0x2',
			from,
			to,
			value: '0x5',
			nonce: '0x7',
			input: '0x1234',
			gas: '0x5208',
			gasPrice: '0x3b9aca00',
			maxFeePerGas: '0x77359400',
			maxPriorityFeePerGas: '0x59682f00',
			r: `0x${'aa'.repeat(32)}`,
			s: `0x${'bb'.repeat(32)}`,
			v: '0x1b',
			type: '0x3',
			maxFeePerBlobGas: '0x10',
			blobVersionedHashes: [versionedHash],
		}))
		const getTransactionReceipt = vi.fn(async () => ({
			status: '0x1',
			gasUsed: '0x5208',
			cumulativeGasUsed: '0xa410',
			effectiveGasPrice: '0x3b9aca00',
			blobGasUsed: '0x2',
			logs: [{
				address: emitter,
				topics: [topic],
				data: '0xdead',
				blockNumber: '0x64',
				blockHash,
				transactionHash: txHash,
				transactionIndex: '0x2',
				logIndex: '0x3',
				removed: false,
			}],
		}))
		const jsonRpcTransport = {
			debugTraceTransaction: vi.fn(async () => null),
			diagnosticLabel: 'mainnet HTTP',
			getBlockByHash,
			getTransactionByHash,
			getTransactionReceipt,
		}
		vi.doMock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
			voltaireJsonRpcTransportsForBinding: () => [{
				endpointKind: SourceEndpointKind.HttpUrl,
				transport: jsonRpcTransport,
			}],
		}))

		const blockResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Voltaire_JsonRpc
			&& candidate.entityType === EntityType.EvmBlock
			&& 'hash' in candidate.projections
		))
		const resolveBlockByHash = blockResolver?.resolve['EvmNetworkBlockHash']
		if (blockResolver == null || resolveBlockByHash == null)
			throw new Error('Voltaire_JsonRpc: missing EvmBlock block-hash resolver')
		const block = await resolveBlockByHash({
			$network,
			hash: blockHash,
		}, resolverContext)
		expect(resolverFieldSelector(blockResolver, 'hash')(block, {
			$network,
			hash: blockHash,
		}, resolverContext)).toBe(blockHash)
		expect(resolverFieldSelector(blockResolver, 'blockNumber')(block, {
			$network,
			hash: blockHash,
		}, resolverContext)).toBe(100n)
		expect(resolverFieldSelector(blockResolver, 'blobGasUsed')(block, {
			$network,
			hash: blockHash,
		}, resolverContext)).toBe(2n)
		expect(resolverFieldSelector(blockResolver, '$$transactions')(block, {
			$network,
			hash: blockHash,
		}, resolverContext)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network,
				txHash,
			},
		}])

		const transactionResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Voltaire_JsonRpc
			&& candidate.entityType === EntityType.EvmTransaction
			&& 'r' in candidate.projections
			&& '$$logs' in candidate.projections
		))
		const resolveTransaction = transactionResolver?.resolve['EvmNetworkTxHash']
		if (transactionResolver == null || resolveTransaction == null)
			throw new Error('Voltaire_JsonRpc: missing EvmTransaction snapshot resolver')
		const transaction = await resolveTransaction({
			$network,
			txHash,
		}, resolverContext)
		expect(resolverFieldSelector(transactionResolver, 'r')(transaction, {
			$network,
			txHash,
		}, resolverContext)).toBe(`0x${'aa'.repeat(32)}`)
		expect(resolverFieldSelector(transactionResolver, 's')(transaction, {
			$network,
			txHash,
		}, resolverContext)).toBe(`0x${'bb'.repeat(32)}`)
		expect(resolverFieldSelector(transactionResolver, 'v')(transaction, {
			$network,
			txHash,
		}, resolverContext)).toBe('0x1b')
		expect(resolverFieldSelector(transactionResolver, 'blobGasUsed')(transaction, {
			$network,
			txHash,
		}, resolverContext)).toBe(2n)
		expect(resolverFieldSelector(transactionResolver, 'maxFeePerBlobGas')(transaction, {
			$network,
			txHash,
		}, resolverContext)).toBe(16n)
		expect(resolverFieldSelector(transactionResolver, '$$logs')(transaction, {
			$network,
			txHash,
		}, resolverContext)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network,
					txHash,
				},
				indexInTransaction: 3,
			},
		}])

		const transactionBlobsResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Voltaire_JsonRpc
			&& candidate.entityType === EntityType.EvmTransaction
			&& resolverFieldNames(candidate).includes('$$blobs')
		))
		const resolveTransactionBlobs = transactionBlobsResolver?.resolve['EvmNetworkTxHash']
		if (transactionBlobsResolver == null || resolveTransactionBlobs == null)
			throw new Error('Voltaire_JsonRpc: missing EvmTransaction.Blob.$$blobs resolver')
		expect(resolverFieldSelector(transactionBlobsResolver, '$$blobs')(
			await resolveTransactionBlobs({
				$network,
				txHash,
			}, resolverContext),
			{
				$network,
				txHash,
			},
			resolverContext
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network,
					txHash,
				},
				indexInTransaction: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmBlob, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network,
						blockNumber: 100n,
					},
				},
				[entityFieldAddressKey(EntityType.EvmBlob, [], '$transaction')]: {
					[EntityMetaKey.Selector]: {
						$network,
						txHash,
					},
				},
				[entityFieldAddressKey(EntityType.EvmBlob, [], 'versionedHash')]: versionedHash,
			},
		}])

		const logResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Voltaire_JsonRpc
			&& candidate.entityType === EntityType.EvmLog
		))
		const resolveLog = logResolver?.resolve['TransactionIndexInTransaction']
		if (logResolver == null || resolveLog == null)
			throw new Error('Voltaire_JsonRpc: missing EvmLog resolver')
		const log = await resolveLog({
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 3,
		}, resolverContext)
		expect(resolverFieldSelector(logResolver, '$$topics')(log, {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 3,
		}, resolverContext)).toEqual([{
			[EntityMetaKey.Selector]: {
				hex: topic,
			},
		}])
		expect(resolverFieldSelector(logResolver, '$transaction')(log, {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 3,
		}, resolverContext)).toEqual({
			[EntityMetaKey.Selector]: {
				$network,
				txHash,
			},
		})
		expect(resolverFieldSelector(logResolver, '$block')(log, {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 3,
		}, resolverContext)).toEqual({
			[EntityMetaKey.Selector]: {
				$network,
				hash: blockHash,
			},
		})
		expect(resolverFieldSelector(logResolver, 'removed')(log, {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 3,
		}, resolverContext)).toBe(false)
		expect(resolverFieldSelector(logResolver, '$emitter')(log, {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 3,
		}, resolverContext)).toEqual({
			[EntityMetaKey.Selector]: {
				$network,
				address: emitter,
			},
		})

		const blobResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Voltaire_JsonRpc
			&& candidate.entityType === EntityType.EvmBlob
			&& 'versionedHash' in candidate.projections
		))
		expect(allSourceResolverDefinitions.filter((candidate) => (
			candidate.source === Source.Voltaire_JsonRpc
			&& candidate.entityType === EntityType.EvmBlob
			&& candidate.resolve['TransactionIndexInTransaction'] != null
		))).toHaveLength(1)
		const resolveBlob = blobResolver?.resolve['TransactionIndexInTransaction']
		if (blobResolver == null || resolveBlob == null)
			throw new Error('Voltaire_JsonRpc: missing EvmBlob resolver')
		const blob = await resolveBlob({
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 0,
		}, resolverContext)
		expect(resolverFieldSelector(blobResolver, 'versionedHash')(blob, {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 0,
		}, resolverContext)).toBe(versionedHash)
		expect(resolverFieldSelector(blobResolver, '$transaction')(blob, {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 0,
		}, resolverContext)).toEqual({
			[EntityMetaKey.Selector]: {
				$network,
				txHash,
			},
		})

		expect(resolverFieldSelector(blobResolver, '$block')(blob, {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 0,
		}, resolverContext)).toEqual({
			[EntityMetaKey.Selector]: {
				$network,
				blockNumber: 100n,
			},
		})
	})

	it('keeps Coin_Timestamp direct resolvers tied to provider clocks', async () => {
		const resolverContext = {
			filters: [],
			sorts: [],
			pagination: {
				limit: 1,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		const coingeckoTimestampMs = Date.parse('2024-01-02T03:04:05.000Z')
		const blockscoutTimestampMs = Date.parse('2024-02-03T04:05:06.000Z')

		vi.doMock('$/sources/Coingecko/Rest/queries.ts', () => ({
			getCoin: vi.fn(async () => ({
				id: 'ethereum',
				symbol: 'eth',
				name: 'Ethereum',
				image: {
					thumb: 'https://example.com/ethereum.png',
					small: 'https://example.com/ethereum.png',
					large: 'https://example.com/ethereum.png',
				},
				market_data: {
					last_updated: '2024-01-02T03:04:05.000Z',
					market_cap_rank: 2,
					market_cap: {
						usd: 123,
					},
				},
			})),
		}))
		vi.doMock('$/sources/Blockscout/Rest/queries.ts', () => ({
			getStats: vi.fn(async () => ({
				gas_price_updated_at: '2024-02-03T04:05:06.000Z',
				market_cap: '456',
				coin_price_change_percentage: 1.5,
			})),
		}))

		const coingeckoTimestampResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Coingecko_Rest
			&& candidate.entityType === EntityType.Coin_Timestamp
			&& 'marketCapRank' in candidate.projections
		))
		const resolveCoingeckoTimestamp = coingeckoTimestampResolver?.resolve['CoinTimestampMsSource']
		if (coingeckoTimestampResolver == null || resolveCoingeckoTimestamp == null)
			throw new Error('Coingecko_Rest: missing Coin_Timestamp resolver')
		const coingeckoTimestamp = await resolveCoingeckoTimestamp({
			$coin: { coinId: CoinId.ETH },
			timestampMs: coingeckoTimestampMs,
			source: Source.Coingecko_Rest,
		}, resolverContext)
		expect(resolverFieldSelector(coingeckoTimestampResolver, 'marketCapRank')(coingeckoTimestamp, {
			$coin: { coinId: CoinId.ETH },
			timestampMs: coingeckoTimestampMs,
			source: Source.Coingecko_Rest,
		}, resolverContext)).toBe(2)
		await expect(resolveCoingeckoTimestamp({
			$coin: { coinId: CoinId.ETH },
			timestampMs: coingeckoTimestampMs + 1,
			source: Source.Coingecko_Rest,
		}, resolverContext)).rejects.toThrow('Coin_Timestamp id does not match market-data clock')

		const coingeckoCoinResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Coingecko_Rest
			&& candidate.entityType === EntityType.Coin
			&& '$$timestamps' in candidate.projections
		))
		const resolveCoingeckoCoin = coingeckoCoinResolver?.resolve['CoinId']
		if (coingeckoCoinResolver == null || resolveCoingeckoCoin == null)
			throw new Error('Coingecko_Rest: missing Coin.$$timestamps resolver')
		expect(resolverFieldSelector(coingeckoCoinResolver, '$$timestamps')(
			await resolveCoingeckoCoin({ coinId: CoinId.ETH }, resolverContext),
			{ coinId: CoinId.ETH },
			resolverContext
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				$coin: {
					coinId: CoinId.ETH,
				},
				timestampMs: coingeckoTimestampMs,
				source: Source.Coingecko_Rest,
			},
		}])

		const blockscoutTimestampResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Blockscout_Rest
			&& candidate.entityType === EntityType.Coin_Timestamp
			&& 'marketCap' in candidate.projections
		))
		const resolveBlockscoutTimestamp = blockscoutTimestampResolver?.resolve['CoinTimestampMsSource']
		if (blockscoutTimestampResolver == null || resolveBlockscoutTimestamp == null)
			throw new Error('Blockscout_Rest: missing Coin_Timestamp resolver')
		const blockscoutTimestamp = await resolveBlockscoutTimestamp({
			$coin: { coinId: CoinId.ETH },
			timestampMs: blockscoutTimestampMs,
			source: Source.Blockscout_Rest,
		}, resolverContext)
		expect(resolverFieldSelector(blockscoutTimestampResolver, 'marketCap')(blockscoutTimestamp, {
			$coin: { coinId: CoinId.ETH },
			timestampMs: blockscoutTimestampMs,
			source: Source.Blockscout_Rest,
		}, resolverContext)).toBe(456n)
		await expect(resolveBlockscoutTimestamp({
			$coin: { coinId: CoinId.ETH },
			timestampMs: blockscoutTimestampMs + 1,
			source: Source.Blockscout_Rest,
		}, resolverContext)).rejects.toThrow('Coin_Timestamp id does not match stats clock')

		const blockscoutCoinResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Blockscout_Rest
			&& candidate.entityType === EntityType.Coin
			&& '$$timestamps' in candidate.projections
		))
		const resolveBlockscoutCoin = blockscoutCoinResolver?.resolve['CoinId']
		if (blockscoutCoinResolver == null || resolveBlockscoutCoin == null)
			throw new Error('Blockscout_Rest: missing Coin.$$timestamps resolver')
		expect(resolverFieldSelector(blockscoutCoinResolver, '$$timestamps')(
			await resolveBlockscoutCoin({ coinId: CoinId.ETH }, resolverContext),
			{ coinId: CoinId.ETH },
			resolverContext
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				$coin: {
					coinId: CoinId.ETH,
				},
				timestampMs: blockscoutTimestampMs,
				source: Source.Blockscout_Rest,
			},
		}])
	})

	it('keeps NIP-11 relay observations source-scoped and preserves failure evidence', async () => {
		const resolverContext = {
			filters: [],
			sorts: [],
			pagination: {
				limit: 1,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		const relayUrl = 'wss://relay.damus.io'
		const timestampMs = 1_720_000_000_000
		const fetchRelayInformation = vi.fn(async () => ({
			name: 'Example relay',
			supported_nips: [1, 11],
			limitation: {
				max_limit: 500,
				payment_required: true,
			},
			fees: {
				admission: [{
					amount: 1_000,
					unit: 'msats',
				}],
			},
		}))
		vi.doMock('$/sources/NostrRelay/Http/queries.ts', () => ({ fetchRelayInformation }))

		const nip11RelayResolver = allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.NostrRelay_Nip11_Http
			&& resolver.entityType === EntityType.NostrRelay
		))
		const nip11ObservationResolver = allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.NostrRelay_Nip11_Http
			&& resolver.entityType === EntityType.NostrRelay_Timestamp
		))
		const resolveNip11Relay = nip11RelayResolver?.resolve['RelayUrl']
		const resolveNip11Observation = nip11ObservationResolver?.resolve['RelayTimestampMsSource']
		if (
			resolveNip11Relay == null
			|| resolveNip11Observation == null
		)
			throw new Error('missing NIP-11 relay observation resolver')

		expect(nip11ObservationResolver.appliesTo(
			'RelayTimestampMsSource',
			{
				$relay: { relayUrl },
				timestampMs,
				source: Source.NostrRelay_WebSocket,
			}
		)).toBe(false)

		expect(resolverFieldSelector(nip11RelayResolver, '$$timestamps')(
			await resolveNip11Relay({ relayUrl }, resolverContext),
			{ relayUrl },
			resolverContext
		)[0][EntityMetaKey.Selector]).toMatchObject({
			$relay: { relayUrl },
			source: Source.NostrRelay_Nip11_Http,
		})
		const nip11Observation = await resolveNip11Observation({
			$relay: { relayUrl },
			timestampMs,
			source: Source.NostrRelay_Nip11_Http,
		}, resolverContext)
		expect(nip11Observation).toMatchObject({
			timestampMs,
			source: Source.NostrRelay_Nip11_Http,
			name: 'Example relay',
			supportedNips: [1, 11],
			limitation: {
				maxLimit: 500,
				paymentRequired: true,
			},
			fees: {
				admission: [{
					amount: 1_000,
					unit: 'msats',
				}],
			},
			isPaid: true,
			reachable: true,
		})
		expect(fetchRelayInformation).toHaveBeenCalledWith({
			relayUrl,
		})
		await expect(resolveNip11Observation({
			$relay: { relayUrl },
			timestampMs,
			source: Source.NostrRelay_WebSocket,
		}, resolverContext)).rejects.toThrow('unsupported source')
		fetchRelayInformation.mockRejectedValueOnce(new Error('relay unavailable'))
		await expect(resolveNip11Observation({
			$relay: { relayUrl },
			timestampMs: timestampMs + 1,
			source: Source.NostrRelay_Nip11_Http,
		}, resolverContext)).resolves.toMatchObject({
			reachable: false,
			error: 'relay unavailable',
		})
	})

	it('converges RSS item identity and keeps fetch state source-scoped', async () => {
		const resolverContext = {
			filters: [],
			sorts: [],
			pagination: {
				limit: 10,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		const feedUrl = 'https://hnrss.org/frontpage'
		const guidItem = {
			guid: 'publisher-guid',
			link: 'https://example.com/posts/1',
			title: 'GUID item',
		}
		const linkItem = {
			link: 'https://example.com/posts/2',
			title: 'Link item',
		}
		const getNativeFeed = vi.fn(async () => ({
			items: [
				guidItem,
				linkItem,
			],
		}))
		const getRss2JsonFeed = vi.fn(async () => ({
			status: 'ok',
			feed: {
				url: 'https://api.example/feed.xml',
				link: 'https://publisher.example/',
			},
			items: [
				guidItem,
				linkItem,
			],
		}))
		const rssBinding = sourceBindings.find(({ source }) => source === Source.Rss_Rest)
		if (rssBinding == null)
			throw new Error('RSS source binding missing')
		vi.doMock('$/sources/Rss/Rest/queries.ts', () => ({
			getFeed: getNativeFeed,
			rssBindingByOrigin: new Map([
				[new URL(feedUrl).origin, rssBinding],
			]),
		}))
		vi.doMock('$/sources/Rss2Json/Rest/queries.ts', () => ({
			getFeed: getRss2JsonFeed,
		}))

		for (const source of [Source.Rss_Rest, Source.Rss2Json_Rest]) {
			const itemResolver = allSourceResolverDefinitions.find((resolver) => (
				resolver.source === source
					&& resolver.entityType === EntityType.RssItem
			))
			const feedResolvers = allSourceResolverDefinitions.filter((resolver) => (
				resolver.source === source
					&& resolver.entityType === EntityType.RssFeed
			))
			expect(feedResolvers).toHaveLength(1)
			const [feedItemsResolver] = feedResolvers
			expect(feedItemsResolver.projections).toHaveProperty('title')
			expect(feedItemsResolver.projections).toHaveProperty('$$items')
			if (source === Source.Rss_Rest) {
				expect(feedItemsResolver.projections).toHaveProperty('language')
				expect(feedItemsResolver.projections).toHaveProperty('lastBuildDate')
				expect(itemResolver?.projections).toHaveProperty('updatedAt')
				expect(itemResolver?.projections).toHaveProperty('commentsUrl')
			} else {
				expect(feedItemsResolver.projections).not.toHaveProperty('language')
				expect(feedItemsResolver.projections).not.toHaveProperty('lastBuildDate')
				expect(itemResolver?.projections).not.toHaveProperty('updatedAt')
				expect(itemResolver?.projections).not.toHaveProperty('commentsUrl')
			}
			const feedObservationResolver = allSourceResolverDefinitions.find((resolver) => (
				resolver.source === source
				&& resolver.entityType === EntityType.RssFeed_Timestamp
			))
			const itemObservationResolver = allSourceResolverDefinitions.find((resolver) => (
				resolver.source === source
				&& resolver.entityType === EntityType.RssItem_Timestamp
			))
			const resolveItem = itemResolver?.resolve['FeedIdentity']
			const resolveFeedItems = feedItemsResolver.resolve['FeedUrl']
			const resolveFeedObservation = feedObservationResolver?.resolve[
				'FeedTimestampMsSource'
			]
			const resolveItemObservation = itemObservationResolver?.resolve[
				'ItemTimestampMsSource'
			]
			if (
				resolveItem == null
				|| resolveFeedItems == null
				|| resolveFeedObservation == null
				|| resolveItemObservation == null
			)
				throw new Error(`missing ${source} RSS resolver`)

			const feedSnapshot = await resolveFeedItems({ feedUrl }, resolverContext)
			const feedItems = resolverFieldSelector(feedItemsResolver, '$$items')(
				feedSnapshot,
				{ feedUrl },
				resolverContext
			)
			if (source === Source.Rss2Json_Rest)
				expect(feedSnapshot).toMatchObject({
					siteUrl: 'https://publisher.example/',
				})
			expect(feedItems.map((item) => item[EntityMetaKey.Selector])).toEqual([
				{
					$feed: { feedUrl },
					itemIdentityKind: 'Guid',
					itemIdentity: 'publisher-guid',
				},
				{
					$feed: { feedUrl },
					itemIdentityKind: 'Link',
					itemIdentity: 'https://example.com/posts/2',
				},
			])
			await expect(resolveItem({
				$feed: { feedUrl },
				itemIdentityKind: 'Guid',
				itemIdentity: 'publisher-guid',
			}, resolverContext)).resolves.toMatchObject({
				itemIdentityKind: 'Guid',
				itemIdentity: 'publisher-guid',
			})

			const timestampMs = 1_720_000_000_000
			await expect(resolveFeedObservation({
				$feed: { feedUrl },
				timestampMs,
				source,
			}, resolverContext)).resolves.toMatchObject({
				reachable: true,
				observedItemCount: 2,
			})
			await expect(resolveItemObservation({
				$item: {
					$feed: { feedUrl },
					itemIdentityKind: 'Link',
					itemIdentity: 'https://example.com/posts/2',
				},
				timestampMs,
				source,
			}, resolverContext)).resolves.toMatchObject({
				observed: true,
				reachable: true,
			})
			await expect(resolveFeedObservation({
				$feed: { feedUrl },
				timestampMs,
				source: source === Source.Rss_Rest ? Source.Rss2Json_Rest : Source.Rss_Rest,
			}, resolverContext)).rejects.toThrow('unsupported source')
		}
		expect(getNativeFeed.mock.calls.every((call) => call[0] === rssBinding && call[1] === feedUrl)).toBe(true)
		expect(getRss2JsonFeed.mock.calls.every((call) => call.length === 1 && call[0] === feedUrl)).toBe(true)

		getNativeFeed.mockRejectedValueOnce(new Error('native feed unavailable'))
		const nativeFeedObservationResolver = allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.Rss_Rest
			&& resolver.entityType === EntityType.RssFeed_Timestamp
		))
		await expect(nativeFeedObservationResolver?.resolve[
			'FeedTimestampMsSource'
		]({
			$feed: { feedUrl },
			timestampMs: 1_720_000_000_001,
			source: Source.Rss_Rest,
		}, resolverContext)).resolves.toMatchObject({
			reachable: false,
			observedItemCount: 0,
			error: 'native feed unavailable',
		})
	})

	it('keeps UTXO parent list resolvers returning child selectors only', async () => {
		const resolverContext = {
			filters: [],
			sorts: [],
			pagination: {
				limit: 1,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		const bitcoinNetworkSelector = {
			caip2: networkBySlug.bitcoin.caip2,
		}
		const bitcoinNetworkSlugSelector = {
			slug: 'bitcoin',
		}
		const litecoinNetworkSelector = {
			caip2: networkBySlug.litecoin.caip2,
		}
		const dogecoinNetworkSelector = {
			caip2: networkBySlug.dogecoin.caip2,
		}
		const zcashNetworkSelector = {
			caip2: networkBySlug.zcash.caip2,
		}

		vi.doMock('$/sources/Blockchair/Rest/queries.ts', () => ({
			getBlocks: vi.fn(async () => ({
				data: [{
					id: 840_000,
					hash: '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5',
					time: '2024-04-19 00:00:00',
				}],
			})),
			getTransactions: vi.fn(async () => ({
				data: [{
					hash: 'blockchair-network-transaction',
					block_id: 840_000,
					time: '2024-04-19 00:00:00',
				}],
			})),
			getBitcoinLikeBlockDashboard: vi.fn(async () => ({
				data: {
					'0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5': {
						block: {
							hash: '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5',
						},
						transactions: [{
							hash: 'blockchair-block-transaction',
						}],
					},
				},
			})),
			getBitcoinLikeTransactionDashboard: vi.fn(async () => ({
				data: {
					'blockchair-parent-transaction': {
						transaction: {
							block_id: 840_000,
						},
						inputs: [{}],
						outputs: [{}],
					},
				},
			})),
		}))
		vi.doMock('$/sources/BitcoinCore/JsonRpc/queries.ts', () => ({
			getBlock: vi.fn(async () => ({
				hash: 'bitcoin-core-block',
				height: 840_000,
				time: 1_713_484_800,
				merkleroot: 'bitcoin-core-merkle',
				nonce: 1,
				difficulty: 1,
				nTx: 1,
				tx: [{
					txid: 'bitcoin-core-block-transaction',
					version: 2,
					locktime: 0,
					size: 100,
					vsize: 100,
					weight: 400,
					vin: [],
				}],
			})),
		}))
		vi.doMock('$/sources/LitecoinCore/JsonRpc/queries.ts', () => ({
			getBlock: vi.fn(async () => ({
				hash: 'litecoin-core-block',
				height: 2_700_000,
				time: 1_713_484_800,
				merkleroot: 'litecoin-core-merkle',
				nonce: 1,
				difficulty: 1,
				nTx: 1,
				tx: [{
					txid: 'litecoin-core-block-transaction',
					version: 2,
					locktime: 0,
					size: 100,
					vsize: 100,
					weight: 400,
					vin: [],
				}],
			})),
		}))
		vi.doMock('$/sources/DogecoinCore/JsonRpc/queries.ts', () => ({
			getBlock: vi.fn(async () => ({
				hash: 'dogecoin-core-block',
				height: 5_200_000,
				time: 1_713_484_800,
				merkleroot: 'dogecoin-core-merkle',
				nonce: 1,
				difficulty: 1,
				nTx: 1,
				tx: [{
					txid: 'dogecoin-core-block-transaction',
					version: 2,
					locktime: 0,
					size: 100,
					vsize: 100,
					weight: 400,
					vin: [],
				}],
			})),
		}))
		vi.doMock('$/sources/Zebra/JsonRpc/queries.ts', () => ({
			getBlock: vi.fn(async () => ({
				hash: 'zebra-block',
				height: 2_500_000,
				time: 1_713_484_800,
				merkleroot: 'zebra-merkle',
				nonce: 1,
				difficulty: 1,
				nTx: 1,
				tx: [{
					txid: 'zebra-block-transaction',
					version: 2,
					locktime: 0,
					size: 100,
					vsize: 100,
					weight: 400,
					vin: [],
				}],
			})),
			getRawTransaction: vi.fn(async () => ({
				version: 2,
				locktime: 0,
				size: 100,
				vsize: 100,
				weight: 400,
				vin: [{
					txid: 'zebra-spent-transaction',
					vout: 1,
					scriptSig: {
						asm: 'zebra input script',
					},
					sequence: 1,
				}],
				vout: [{
					value: 1,
					scriptPubKey: {
						asm: 'zebra output script',
						hex: '51',
						type: 'pubkey',
						address: 't1ZebraAddress',
					},
				}],
			})),
		}))
		vi.doMock('$/sources/MempoolSpace/Rest/queries.ts', () => ({
			getBlocks: vi.fn(async () => [{
				id: '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5',
				height: 840_000,
			}]),
			getMempoolTxids: vi.fn(async () => ['mempoolspace-network-transaction']),
			getMempoolStats: vi.fn(async () => ({
				count: 1,
				vsize: 100,
			})),
			getRecommendedFees: vi.fn(async () => ({
				hourFee: 1,
			})),
			getBlockHashByHeight: vi.fn(async () => '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5'),
			getBlockTransactionIds: vi.fn(async () => ['mempoolspace-block-transaction']),
			getTransaction: vi.fn(async () => ({
				txid: 'mempoolspace-parent-transaction',
				version: 2,
				locktime: 0,
				size: 100,
				weight: 400,
				status: {
					confirmed: false,
				},
				vin: [{
					is_coinbase: false,
					sequence: 1,
				}],
				vout: [{
					scriptpubkey: '51',
					scriptpubkey_type: 'pubkey',
					value: 1,
				}],
			})),
		}))
		vi.doMock('$/sources/ThreeXpl/Rest/queries.ts', () => ({
			fetchBlock: vi.fn(async () => ({
				data: {
					events: {
						transactions: [{
							transaction: 'threexpl-block-transaction',
						}],
					},
				},
			})),
		}))

		for (const {
			source,
			entityType,
			selectorName,
			entitySelector,
			fieldName,
			expectedSelectors,
		} of [
			{
				source: Source.Blockchair_Rest,
				entityType: EntityType.Network,
				selectorName: 'Slug',
				entitySelector: bitcoinNetworkSlugSelector,
				fieldName: '$$blocks',
				expectedSelectors: [{
					$network: bitcoinNetworkSlugSelector,
					height: 840_000n,
					hash: '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5',
				}],
			},
			{
				source: Source.Blockchair_Rest,
				entityType: EntityType.Network,
				selectorName: 'Slug',
				entitySelector: bitcoinNetworkSlugSelector,
				fieldName: '$$transactions',
				expectedSelectors: [{
					$network: bitcoinNetworkSlugSelector,
					txId: 'blockchair-network-transaction',
				}],
			},
			{
				source: Source.Blockchair_Rest,
				entityType: EntityType.UtxoBlock,
				selectorName: 'NetworkHeightHash',
				entitySelector: {
					$network: bitcoinNetworkSelector,
					height: 840_000n,
					hash: '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5',
				},
				fieldName: '$$transactions',
				expectedSelectors: [{
					$network: bitcoinNetworkSelector,
					txId: 'blockchair-block-transaction',
				}],
			},
			{
				source: Source.Blockchair_Rest,
				entityType: EntityType.UtxoTransaction,
				selectorName: 'NetworkTxId',
				entitySelector: {
					$network: bitcoinNetworkSelector,
					txId: 'blockchair-parent-transaction',
				},
				fieldName: '$$inputs',
				expectedSelectors: [{
					$transaction: {
						$network: bitcoinNetworkSelector,
						txId: 'blockchair-parent-transaction',
					},
					indexInTransaction: 0,
				}],
			},
			{
				source: Source.Blockchair_Rest,
				entityType: EntityType.UtxoTransaction,
				selectorName: 'NetworkTxId',
				entitySelector: {
					$network: bitcoinNetworkSelector,
					txId: 'blockchair-parent-transaction',
				},
				fieldName: '$$outputs',
				expectedSelectors: [{
					$transaction: {
						$network: bitcoinNetworkSelector,
						txId: 'blockchair-parent-transaction',
					},
					indexInTransaction: 0,
				}],
			},
			{
				source: Source.MempoolSpace_Rest,
				entityType: EntityType.Network,
				selectorName: 'Slug',
				entitySelector: bitcoinNetworkSlugSelector,
				fieldName: '$$blocks',
				expectedSelectors: [{
					$network: bitcoinNetworkSlugSelector,
					height: 840_000n,
					hash: '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5',
				}],
			},
			{
				source: Source.MempoolSpace_Rest,
				entityType: EntityType.Network,
				selectorName: 'Slug',
				entitySelector: bitcoinNetworkSlugSelector,
				fieldName: '$$transactions',
				expectedSelectors: [{
					$network: bitcoinNetworkSlugSelector,
					txId: 'mempoolspace-network-transaction',
				}],
			},
			{
				source: Source.MempoolSpace_Rest,
				entityType: EntityType.UtxoBlock,
				selectorName: 'NetworkHeightHash',
				entitySelector: {
					$network: bitcoinNetworkSelector,
					height: 840_000n,
					hash: '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5',
				},
				fieldName: '$$transactions',
				expectedSelectors: [{
					$network: bitcoinNetworkSelector,
					txId: 'mempoolspace-block-transaction',
				}],
			},
			{
				source: Source.MempoolSpace_Rest,
				entityType: EntityType.UtxoTransaction,
				selectorName: 'NetworkTxId',
				entitySelector: {
					$network: bitcoinNetworkSelector,
					txId: 'mempoolspace-parent-transaction',
				},
				fieldName: '$$inputs',
				expectedSelectors: [{
					$transaction: {
						$network: bitcoinNetworkSelector,
						txId: 'mempoolspace-parent-transaction',
					},
					indexInTransaction: 0,
				}],
			},
			{
				source: Source.MempoolSpace_Rest,
				entityType: EntityType.UtxoTransaction,
				selectorName: 'NetworkTxId',
				entitySelector: {
					$network: bitcoinNetworkSelector,
					txId: 'mempoolspace-parent-transaction',
				},
				fieldName: '$$outputs',
				expectedSelectors: [{
					$transaction: {
						$network: bitcoinNetworkSelector,
						txId: 'mempoolspace-parent-transaction',
					},
					indexInTransaction: 0,
				}],
			},
			{
				source: Source.BitcoinCore_JsonRpc,
				entityType: EntityType.UtxoBlock,
				selectorName: 'NetworkHeightHash',
				entitySelector: {
					$network: bitcoinNetworkSelector,
					height: 840_000n,
					hash: 'bitcoin-core-block',
				},
				fieldName: '$$transactions',
				expectedSelectors: [{
					$network: bitcoinNetworkSelector,
					txId: 'bitcoin-core-block-transaction',
				}],
			},
			{
				source: Source.LitecoinCore_JsonRpc,
				entityType: EntityType.UtxoBlock,
				selectorName: 'NetworkHeightHash',
				entitySelector: {
					$network: litecoinNetworkSelector,
					height: 2_700_000n,
					hash: 'litecoin-core-block',
				},
				fieldName: '$$transactions',
				expectedSelectors: [{
					$network: litecoinNetworkSelector,
					txId: 'litecoin-core-block-transaction',
				}],
			},
			{
				source: Source.DogecoinCore_JsonRpc,
				entityType: EntityType.UtxoBlock,
				selectorName: 'NetworkHeightHash',
				entitySelector: {
					$network: dogecoinNetworkSelector,
					height: 5_200_000n,
					hash: 'dogecoin-core-block',
				},
				fieldName: '$$transactions',
				expectedSelectors: [{
					$network: dogecoinNetworkSelector,
					txId: 'dogecoin-core-block-transaction',
				}],
			},
			{
				source: Source.Zebra_JsonRpc,
				entityType: EntityType.UtxoBlock,
				selectorName: 'NetworkHeightHash',
				entitySelector: {
					$network: zcashNetworkSelector,
					height: 2_500_000n,
					hash: 'zebra-block',
				},
				fieldName: '$$transactions',
				expectedSelectors: [{
					$network: zcashNetworkSelector,
					txId: 'zebra-block-transaction',
				}],
			},
			{
				source: Source.Zebra_JsonRpc,
				entityType: EntityType.UtxoTransaction,
				selectorName: 'NetworkTxId',
				entitySelector: {
					$network: zcashNetworkSelector,
					txId: 'zebra-parent-transaction',
				},
				fieldName: '$$inputs',
				expectedSelectors: [{
					$transaction: {
						$network: zcashNetworkSelector,
						txId: 'zebra-parent-transaction',
					},
					indexInTransaction: 0,
				}],
			},
			{
				source: Source.Zebra_JsonRpc,
				entityType: EntityType.UtxoTransaction,
				selectorName: 'NetworkTxId',
				entitySelector: {
					$network: zcashNetworkSelector,
					txId: 'zebra-parent-transaction',
				},
				fieldName: '$$outputs',
				expectedSelectors: [{
					$transaction: {
						$network: zcashNetworkSelector,
						txId: 'zebra-parent-transaction',
					},
					indexInTransaction: 0,
				}],
			},
			{
				source: Source.ThreeXpl_Rest,
				entityType: EntityType.UtxoBlock,
				selectorName: 'NetworkHeightHash',
				entitySelector: {
					$network: bitcoinNetworkSelector,
					height: 840_000n,
					hash: 'threexpl-block',
				},
				fieldName: '$$transactions',
				expectedSelectors: [{
					$network: bitcoinNetworkSelector,
					txId: 'threexpl-block-transaction',
				}],
			},
		] as const) {
			const resolverPart = allSourceResolverParts.find((candidate) => (
				candidate.source === source
				&& candidate.entityType === entityType
				&& candidate.fieldName === fieldName
				&& candidate.select != null
			))
			const resolver = resolverPart?.resolver
			const resolve = resolver?.resolve[selectorName]
			const fieldSelector = resolverPart?.select
			if (resolver == null || resolve == null || typeof fieldSelector !== 'function')
				throw new Error(`${source}:${entityType}.${fieldName}: missing resolver facet`)

			const rows = fieldSelector(
				await resolve(entitySelector, resolverContext),
				entitySelector,
				resolverContext
			)

			expect(rows).toEqual(expectedSelectors.map((expectedSelector) => ({
				[EntityMetaKey.Selector]: expectedSelector,
			})))
			for (const row of rows)
				expect(Object.keys(row)).toEqual([EntityMetaKey.Selector])
		}

		const blockchairTransactionResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Blockchair_Rest
			&& candidate.entityType === EntityType.UtxoTransaction
			&& resolverFieldNames(candidate).includes('$block')
		))
		const blockchairTransactionResolve = blockchairTransactionResolver?.resolve['NetworkTxId']
		const blockchairBlockField = resolverFieldSelector(blockchairTransactionResolver, '$block')
		if (blockchairTransactionResolver == null || blockchairTransactionResolve == null || typeof blockchairBlockField !== 'function')
			throw new Error('Blockchair_Rest: missing UtxoTransaction.$block facet')

		expect(blockchairBlockField(
			await blockchairTransactionResolve({
				$network: bitcoinNetworkSelector,
				txId: 'blockchair-parent-transaction',
			}, resolverContext),
			{
				$network: bitcoinNetworkSelector,
				txId: 'blockchair-parent-transaction',
			},
			resolverContext
		)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetworkSelector,
				height: 840_000n,
			},
		})
	})

	it('keeps ActivityPub local account ids distinct from acct selectors', async () => {
		const account = {
			id: '13179',
			acct: 'Gargron',
			uri: 'https://mastodon.social/users/Gargron',
		}
		const status = {
			id: '116539053870420123',
			uri: 'https://mastodon.social/users/Gargron/statuses/116539053870420123',
		}
		const resolverContext = {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}

		for (const {
			source,
			modulePath,
			getAccountByLocalAccountId,
			getAccountByAcct,
			getAccountByActivityStreamsUri,
			getStatusByActivityStreamsUri,
		} of [
			{
				source: Source.Mastodon_Rest,
				modulePath: '$/sources/Mastodon/Rest/queries.ts',
				getAccountByLocalAccountId: vi.fn(async () => account),
				getAccountByAcct: vi.fn(async () => account),
				getAccountByActivityStreamsUri: vi.fn(async () => account),
				getStatusByActivityStreamsUri: vi.fn(async () => status),
			},
		].filter(({ source }) => (
			allSourceResolverDefinitions.some((resolver) => (
				resolver.source === source
				&& resolver.entityType === EntityType.ActivityPubActor
			))
		))) {
			vi.doMock(modulePath, () => ({
				assertInstanceMatches: vi.fn(),
				getAccountByLocalAccountId,
				getAccountByAcct,
				getAccountByActivityStreamsUri,
				getStatusByActivityStreamsUri,
			}))

			const actorResolver = allSourceResolverDefinitions.find((resolver) => (
				resolver.source === source
				&& resolver.entityType === EntityType.ActivityPubActor
			))
			if (actorResolver == null)
				throw new Error(`${source}: missing ActivityPub actor resolver`)

			const localAccountIdResolver = actorResolver.resolve['LocalAccountId']
			const acctResolver = actorResolver.resolve['Acct']
			const actorActivityStreamsUriResolver = actorResolver.resolve['ActivityStreamsUri']
			if (localAccountIdResolver == null || acctResolver == null || actorActivityStreamsUriResolver == null)
				throw new Error(`${source}: missing ActivityPub actor selector resolver`)

			await expect(localAccountIdResolver({
				instanceOrigin: 'https://mastodon.social',
				localAccountId: '13179',
			}, resolverContext)).resolves.toMatchObject({
				localAccountId: '13179',
				acct: 'Gargron',
			})
			await expect(acctResolver({
				instanceOrigin: 'https://mastodon.social',
				acct: 'Gargron',
			}, resolverContext)).resolves.toMatchObject({
				localAccountId: '13179',
				acct: 'Gargron',
			})
			await expect(actorActivityStreamsUriResolver({
				activityStreamsUri: 'https://mastodon.social/users/Gargron',
			}, resolverContext)).resolves.toMatchObject({
				instanceOrigin: 'https://mastodon.social',
				localAccountId: '13179',
				acct: 'Gargron',
				activityStreamsUri: 'https://mastodon.social/users/Gargron',
			})
			const noteResolver = allSourceResolverDefinitions.find((resolver) => (
				resolver.source === source
				&& resolver.entityType === EntityType.ActivityPubNote
			))
			if (noteResolver == null)
				throw new Error(`${source}: missing ActivityPub note resolver`)
			const noteActivityStreamsUriResolver = noteResolver.resolve['ActivityStreamsUri']
			if (noteActivityStreamsUriResolver == null)
				throw new Error(`${source}: missing ActivityPub note URI selector resolver`)

			await expect(noteActivityStreamsUriResolver({
				activityStreamsUri: 'https://mastodon.social/users/Gargron/statuses/116539053870420123',
			}, resolverContext)).resolves.toMatchObject({
				instanceOrigin: 'https://mastodon.social',
				localStatusId: '116539053870420123',
				activityStreamsUri: 'https://mastodon.social/users/Gargron/statuses/116539053870420123',
			})
			expect(getAccountByLocalAccountId).toHaveBeenCalledTimes(1)
			expect(getAccountByLocalAccountId).toHaveBeenCalledWith(
				expect.objectContaining({ source: Source.Mastodon_Rest }),
				'https://mastodon.social',
				'13179'
			)
			expect(getAccountByAcct).toHaveBeenCalledTimes(1)
			expect(getAccountByAcct).toHaveBeenCalledWith(
				expect.objectContaining({ source: Source.Mastodon_Rest }),
				'https://mastodon.social',
				'Gargron'
			)
			expect(getAccountByActivityStreamsUri).toHaveBeenCalledTimes(1)
			expect(getAccountByActivityStreamsUri).toHaveBeenCalledWith(
				expect.objectContaining({ source: Source.Mastodon_Rest }),
				'https://mastodon.social/users/Gargron'
			)
			expect(getStatusByActivityStreamsUri).toHaveBeenCalledTimes(1)
			expect(getStatusByActivityStreamsUri).toHaveBeenCalledWith(
				expect.objectContaining({ source: Source.Mastodon_Rest }),
				'https://mastodon.social/users/Gargron/statuses/116539053870420123'
			)
		}
	})

	it('only indexes count facets for multiple-cardinality fields', () => {
		expect(Object.values(resolverCountPartsByEntityTypeAndFieldName).flat().length).toBeGreaterThan(0)
		expect(Object.values(resolverCountPartsByEntityTypeAndFieldName).flat().every((resolverPart) => (
			fieldDefinitionByEntityTypeAndFieldName[resolverPart.entityType][resolverPart.fieldName]?.cardinality === EntityFieldCardinality.Many
			|| fieldDefinitionByEntityTypeAndFieldName[resolverPart.entityType][resolverPart.fieldName]?.cardinality === EntityFieldCardinality.ZeroOrMany
		))).toBe(true)
	})

	it('keeps Farcaster account connection materialization local-only', () => {
		expect(allSourceResolverDefinitions
			.filter(({ entityType }) => entityType === EntityType.BlockheadFarcasterAccountConnection)
			.map(({ source }) => source)).toEqual([Source.Local_Internal])
	})

	it('keeps public Farcaster evidence separate from local connection authority', () => {
		const publicSources = [
			Source.Neynar_Rest,
			Source.Snapchain_Rest,
		]
		expect(allSourceResolverDefinitions.some((resolver) => (
			publicSources.includes(resolver.source)
			&& resolver.entityType === EntityType.BlockheadFarcasterAccountConnection
		))).toBe(false)
		expect(allSourceResolverDefinitions.some((resolver) => (
			publicSources.includes(resolver.source)
			&& resolver.entityType === EntityType.FarcasterUser
		))).toBe(true)
	})

})
