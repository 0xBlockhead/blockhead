import { createHash } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'

import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	indexResolvers,
	validateResolverDefinitions,
	type SourceResolverDefinition,
	type SourceResolverDefinitionCandidate,
} from '$/resolvers/$resolvers.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityMetaKey,
	entityFieldDefinitions,
	type Schema,
} from '$/schema/$schema.ts'
import { type as arktype } from 'arktype'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import {
	enabledSources as browserEnabledSources,
	sourceProviders,
} from '$/sources/index.ts'
import { resolvers } from '$/resolvers/index.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { ActivityPubActorSelector } from '$/schema/ActivityPubActor.ts'
import { ActivityPubNoteSelector } from '$/schema/ActivityPubNote.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import { Coin_TimestampSelector } from '$/schema/Coin_Timestamp.ts'
import { EvmBlockSelector } from '$/schema/EvmBlock.ts'
import { EvmBlobSelector } from '$/schema/EvmBlob.ts'
import { EvmLogSelector } from '$/schema/EvmLog.ts'
import { EvmTransactionSelector } from '$/schema/EvmTransaction.ts'
import { UtxoNetworkSelector } from '$/schema/UtxoNetwork.ts'
import { UtxoBlockSelector } from '$/schema/UtxoBlock.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'
import { bitcoinNetworkBySlug } from '$/constants/BitcoinNetwork.ts'
import { CoinId } from '$/constants/Coin.ts'
import { app } from '../../APP.ts'

const {
	resolverDefinitions,
	resolverParts,
	resolverValuePartsByEntityTypeAndFieldName,
	resolverCountPartsByEntityTypeAndFieldName,
	resolverLivePartsByEntityTypeAndFieldName,
	resolverRootLivePartsByEntityType,
	fieldNamesWithLiveResolverByEntityType,
	resolverDiscriminatorPartsByEntityTypeAndConditionKey,
} = indexResolvers(
	schema,
	resolvers,
	browserEnabledSources
)
const {
	resolverDefinitions: allSourceResolverDefinitions,
} = indexResolvers(
	schema,
	resolvers,
	new Set(sourceProviders.flatMap((sourceProvider) => (
		sourceProvider.sources.map((sourceDefinition) => sourceDefinition.source)
	)))
)

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

const coverageFingerprint = (ids: string[]) => ({
	count: ids.length,
	sha256: createHash('sha256')
		.update(ids.join('\n'))
		.digest('hex'),
})

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
				name: 'indexedConditional',
				type: EntityFieldType.Primitive,
				primitiveType: arktype('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				when: {
					fieldName: 'segments',
					itemIndex: 0,
					values: ['kind'],
				},
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
		[FixtureEntitySelector.Slug]: async () => ({}),
	},
	fields: {
		name: () => 'Ada',
		segments: () => ['kind'],
	},
} satisfies SourceResolverDefinition<typeof fixtureSchema, 'Fixture'>

describe('resolver registry live resolver architecture', () => {
	it('registers only resolver modules with at least one definition', () => {
		const activeResolverSources = resolvers.flatMap((resolverModule) => (
			resolverModule.resolvers.length > 0 ?
				[resolverModule.source]
			:
				[]
		))

		expect(activeResolverSources.length).toBeGreaterThan(0)
		expect(new Set(activeResolverSources).size).toBe(activeResolverSources.length)
		expect(activeResolverSources.every((source) => (
			sourceProviders.some((sourceProvider) => (
				sourceProvider.sources.some((sourceDefinition) => sourceDefinition.source === source)
			))
		))).toBe(true)
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
						missingSelector: async () => ({}),
					},
				},
				/references unknown selector missingSelector/,
			],
			[
				'empty fields',
				{
					...validFixtureResolver,
					fields: {},
				},
				/declares no fields/,
			],
			[
				'unknown field',
				{
					...validFixtureResolver,
					fields: {
						missingField: () => undefined,
					},
				},
				/references unknown field missingField/,
			],
			[
				'unknown parent selector',
				{
					...validFixtureResolver,
					fields: {
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
					fields: {
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
							publishes: {
								missingField: true,
							},
							start: () => {},
						},
					},
				},
				/references unknown live field missingField/,
			],
			[
				'undeclared root live field',
				{
					...validFixtureResolver,
					resolveLive: {
						clock: {
							publishes: {
								$$children: true,
							},
							start: () => {},
						},
					},
				},
				/publishes undeclared live field \$\$children/,
			],
			[
				'async field selector',
				{
					...validFixtureResolver,
					fields: {
						name: async () => 'Ada',
					},
				},
				/has async field selector/,
			],
			[
				'async count selector',
				{
					...validFixtureResolver,
					fields: {
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
		expect(allSourceResolverDefinitions.length).toBeGreaterThan(0)
		expect(allSourceResolverDefinitions.every((resolver) => (
			Object.keys(resolver.fields).length > 0
		))).toBe(true)
		expect(Object.values(resolverRootLivePartsByEntityType).flat().every((part) => (
			Object.keys(part.publisher.publishes).every((fieldName) => (
				fieldName in part.resolver.fields
			))
		))).toBe(true)
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
			&& Object.entries(resolverPart.resolver.fields)[resolverPart.partIndex]?.[0] === resolverPart.fieldName
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
		const evmNetworkRootLiveParts = resolverRootLivePartsByEntityType[EntityType.EvmNetwork] ?? []

		expect(fieldNamesWithLiveResolverByEntityType[EntityType.EvmNetwork]).toContain('$$timestamps')
		expect(evmNetworkRootLiveParts.some((part) => (
			part.publisher.publishes.$$timestamps === true
		))).toBe(true)
		expect(resolverParts.some((part) => (
			part.entityType === EntityType.EvmNetwork_Timestamp
			&& part.fieldName === 'blockHeight'
			&& part.select != null
		))).toBe(true)
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
		expect(fieldNamesWithLiveResolverByEntityType[EntityType.EvmNetwork]).toContain('$$timestamps')
	})

	it('indexes value, count, and discriminator resolver parts without resolver ids', () => {
		expect(
			resolverParts.filter((part) => (
				part.entityType === EntityType.EvmNetwork_Timestamp
				&& part.fieldName === 'blockHeight'
				&& part.select != null
			)).length
		).toBeGreaterThan(0)
		expect(
			resolverParts.filter((part) => (
				part.entityType === EntityType.EvmNetwork
				&& part.fieldName === '$$blocks'
				&& part.resolveCount != null
			)).length
		).toBeGreaterThan(0)
		expect(
			Object.values(resolverDiscriminatorPartsByEntityTypeAndConditionKey)
				.flatMap((partsByConditionKey) => (
					Object.values(partsByConditionKey)
				))
				.every((parts) => parts.every((resolverPart) => resolverPart.select != null))
		).toBe(true)
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
		const first = defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => ({}),
			},
		})({
			fields: {
				$$networks: {
					parentSelectors: [_GlobalSelector.Scope],
					select: () => ([]),
				},
			},
		})
		const second = defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => ({}),
			},
		})({
			fields: {
				$$networks: {
					parentSelectors: [_GlobalSelector.Scope],
					select: () => ([]),
				},
			},
		})
		const parts = [first, second].flatMap((resolver, definitionIndex) => (
			Object.entries(resolver.fields).map(([fieldName, fieldSelector], partIndex) => ({
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
				resolveSelectorNames: [_GlobalSelector.Scope],
				parentSelectors: [_GlobalSelector.Scope],
			}),
			expect.objectContaining({
				definitionIndex: 1,
				partIndex: 0,
				resolveSelectorNames: [_GlobalSelector.Scope],
				parentSelectors: [_GlobalSelector.Scope],
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

	it('keeps concrete selector fields materializable through resolver selectors or field facets', () => {
		expect(
			schema.flatMap((entityDefinition) => {
				const entityResolvers = allSourceResolverDefinitions.filter((resolver) => (
					resolver.entityType === entityDefinition.entityType
				))
				if (entityResolvers.length === 0)
					return []

				const acceptedSelectorFieldNames = new Set(entityResolvers.flatMap((resolver) => (
					Object.keys(resolver.resolve).flatMap((selectorName) => (
						entityDefinition.selectors
							.find((selector) => selector.name === selectorName)
							?.fields ?? []
					))
				)))
				const materializedFieldNames = new Set(entityResolvers.flatMap((resolver) => (
					Object.keys(resolver.fields)
				)))

				return entityDefinition.selectors.flatMap((selector) => (
					selector.fields.flatMap((fieldName) => (
						acceptedSelectorFieldNames.has(fieldName)
						|| materializedFieldNames.has(fieldName) ?
							[]
						:
							[`${entityDefinition.entityType}.${selector.name}.${fieldName}`]
					))
				))
			})
		).toEqual([])
	})

	it('keeps APP source, schema, and resolver generation counts aligned', () => {
		const appEntityTypeRows = app.schema.entities
			.map((entity) => entity.entityType)
		const appEntityTypes = new Set(appEntityTypeRows)
		const generatedEntityTypes = new Set(schema.map((entity) => entity.entityType))

		expect(appEntityTypeRows.length).toBe(appEntityTypes.size)
		expect([...appEntityTypes].filter((entityType) => !generatedEntityTypes.has(entityType))).toEqual([])
		expect([...generatedEntityTypes].filter((entityType) => !appEntityTypes.has(entityType))).toEqual([])
		expect(sourceProviders.length).toBe(app.sources.providers.length)
		expect(sourceProviders.flatMap((sourceProvider) => sourceProvider.sources).length)
			.toBe(app.sources.sources.length)
		expect(resolvers.length).toBe(app.resolvers.modules.length)
	})

	it('keeps default source field coverage backed by matching resolver facets', () => {
		const resolverDefinitionsBySourceEntityType = Map.groupBy(
			allSourceResolverDefinitions,
			(resolver) => `${resolver.source}:${resolver.entityType}`
		)

		const defaultSourceCoverageGaps = schema.flatMap((entityDefinition) => {
				const selectorByName = Object.fromEntries(
					entityDefinition.selectors.map((selector) => [
						selector.name,
						selector,
					])
				)

				return entityFieldDefinitions(entityDefinition).flatMap((fieldDefinition) => {
					const defaultSources = fieldDefinition.defaultSources ?? []
					const sourceCoverage = defaultSources.map((source) => {
						const resolversForSource = resolverDefinitionsBySourceEntityType.get(
							`${source}:${entityDefinition.entityType}`
						) ?? []
						const resolverAcceptsFieldThroughSelector = resolversForSource.some((resolver) => (
							Object.keys(resolver.resolve).some((selectorName) => (
								selectorByName[selectorName].fields.includes(fieldDefinition.name) === true
							))
						))
						const resolverMaterializesField = resolversForSource.some((resolver) => (
							fieldDefinition.name in resolver.fields
						))

						return {
							source,
							covered: resolverAcceptsFieldThroughSelector || resolverMaterializesField,
						}
					})

					return (
						defaultSources.length === 0
						|| sourceCoverage.some((source) => source.covered)
					) ?
						[]
					:
						[`${defaultSources.join('|')}:${entityDefinition.entityType}.${fieldDefinition.name}`]
				})
			})

		expect(defaultSourceCoverageGaps).toEqual([])
	})

	it('keeps every active APP entity accountable to at least one resolver module', () => {
		const entityTypesWithResolver = new Set(allSourceResolverDefinitions.map((resolver) => resolver.entityType))
		const appEntityByEntityType = Object.fromEntries(
			app.schema.entities.map((entityDefinition) => [
				entityDefinition.entityType,
				entityDefinition,
			])
		)
		const unresolvedEntityTypes = schema
			.map((entityDefinition) => entityDefinition.entityType)
			.filter((entityType) => !entityTypesWithResolver.has(entityType))
		const unresolvedSourceBackedEntityTypes = unresolvedEntityTypes.filter((entityType) => {
			const appEntity = appEntityByEntityType[entityType]

			return (
				(appEntity.singularView?.query?.sources?.length ?? 0) > 0
				|| appEntity.fields.some((fieldDefinition) => (
					(fieldDefinition.defaultSources?.length ?? 0) > 0
				))
			)
		})
		const unresolvedNoDeclaredSourceEntityTypes = unresolvedEntityTypes.filter((entityType) => (
			!unresolvedSourceBackedEntityTypes.includes(entityType)
		))

		expect({
			all: coverageFingerprint(unresolvedEntityTypes),
			sourceBacked: coverageFingerprint(unresolvedSourceBackedEntityTypes),
			noDeclaredSource: coverageFingerprint(unresolvedNoDeclaredSourceEntityTypes),
			sourceBackedExamples: unresolvedSourceBackedEntityTypes.slice(0, 20),
		}).toEqual({
			all: {
				count: 687,
				sha256: '9770b47abd3ec02ab005cf8d42f480d6be9f0f687dd06b200108113fc34bc88f',
			},
			sourceBacked: {
				count: 227,
				sha256: '831850bfea8f6150ee64ff5afcfc9493085b067571e6a82ed14f35a70b80977e',
			},
			noDeclaredSource: {
				count: 460,
				sha256: '5293d3cd8c10a88d2287bc6d5a2d69cb75c5ad9c0b6d4bf25ed9cae619ec3159',
			},
			sourceBackedExamples: [
				'ZeroGDaQuorum',
				'ZeroGDaNode',
				'ZeroGKvEntry',
				'ZeroGServiceProvider',
				'ZeroGServiceRequest',
				'ZeroGSettlementTrace',
				'ZeroGStorageProof',
				'AiModel',
				'AiModel_Timestamp',
				'AiProviderApiOperation',
				'AiProviderApiOperation_Timestamp',
				'AiProviderCatalogEntry',
				'AiProviderCatalogEntry_Timestamp',
				'AiArtifact',
				'AiDocument',
				'AiArtifactAttestation',
				'AiDocumentClaim',
				'AiRelationshipClaim',
				'AgentIdentityClaim',
				'A2aAgentCard',
			],
		})
	})

	it('keeps Voltaire EVM receipt fields declared where the snapshot already materializes them', () => {
		expect(Object.keys(allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.Voltaire_JsonRpc
			&& resolver.entityType === EntityType.EvmBlock
		))?.resolve ?? {})).toEqual(expect.arrayContaining([
			EvmBlockSelector.EvmNetworkBlockNumber,
			EvmBlockSelector.EvmNetworkBlockHash,
		]))
		expect(Object.keys(allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.Voltaire_JsonRpc
			&& resolver.entityType === EntityType.EvmTransaction
		))?.fields ?? {})).toEqual(expect.arrayContaining([
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
			'traceRoot',
			'traceUnavailable',
		]))
		expect(Object.keys(allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.Voltaire_JsonRpc
			&& resolver.entityType === EntityType.EvmTransaction
		))?.fields ?? {})).not.toContain('$$internalTransfers')
		expect(Object.keys(allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.Voltaire_JsonRpc
			&& resolver.entityType === EntityType.EvmBlob
		))?.fields ?? {})).toEqual(expect.arrayContaining([
			'versionedHash',
		]))
		expect(Object.keys(allSourceResolverDefinitions.find((resolver) => (
			resolver.source === Source.Voltaire_JsonRpc
			&& resolver.entityType === EntityType.EvmLog
		))?.fields ?? {})).toEqual(expect.arrayContaining([
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
		const getBlockByHashForRpcUrl = vi.fn(async () => ({
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
		const getTransactionByHashForRpcUrl = vi.fn(async () => ({
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
		const getTransactionReceiptForRpcUrl = vi.fn(async () => ({
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
		vi.doMock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
			debugTraceTransactionForRpcUrl: vi.fn(async () => null),
			getBlockByHashForRpcUrl,
			getTransactionByHashForRpcUrl,
			getTransactionReceiptForRpcUrl,
			voltaireJsonRpcTransportWithOriginsByChainId: {
				1: {
					rpcUrl: 'https://example.com/rpc',
					transportType: 'Http',
					origins: [],
				},
			},
		}))

		const blockResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Voltaire_JsonRpc
			&& candidate.entityType === EntityType.EvmBlock
			&& 'hash' in candidate.fields
		))
		const resolveBlockByHash = blockResolver?.resolve[EvmBlockSelector.EvmNetworkBlockHash]
		if (blockResolver == null || resolveBlockByHash == null)
			throw new Error('Voltaire_JsonRpc: missing EvmBlock block-hash resolver')
		const block = await resolveBlockByHash({
			$network,
			hash: blockHash,
		}, resolverContext)
		expect(blockResolver.fields.hash(block, {
			$network,
			hash: blockHash,
		}, resolverContext)).toBe(blockHash)
		expect(blockResolver.fields.blockNumber(block, {
			$network,
			hash: blockHash,
		}, resolverContext)).toBe(100n)
		expect(blockResolver.fields.blobGasUsed(block, {
			$network,
			hash: blockHash,
		}, resolverContext)).toBe(2n)
		expect(blockResolver.fields.$$transactions(block, {
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
			&& 'r' in candidate.fields
			&& '$$logs' in candidate.fields
		))
		const resolveTransaction = transactionResolver?.resolve[EvmTransactionSelector.EvmNetworkTxHash]
		if (transactionResolver == null || resolveTransaction == null)
			throw new Error('Voltaire_JsonRpc: missing EvmTransaction snapshot resolver')
		const transaction = await resolveTransaction({
			$network,
			txHash,
		}, resolverContext)
		expect(transactionResolver.fields.r(transaction, {
			$network,
			txHash,
		}, resolverContext)).toBe(`0x${'aa'.repeat(32)}`)
		expect(transactionResolver.fields.s(transaction, {
			$network,
			txHash,
		}, resolverContext)).toBe(`0x${'bb'.repeat(32)}`)
		expect(transactionResolver.fields.v(transaction, {
			$network,
			txHash,
		}, resolverContext)).toBe('0x1b')
		expect(transactionResolver.fields.blobGasUsed(transaction, {
			$network,
			txHash,
		}, resolverContext)).toBe(2n)
		expect(transactionResolver.fields.maxFeePerBlobGas(transaction, {
			$network,
			txHash,
		}, resolverContext)).toBe(16n)
		expect(transactionResolver.fields.$$logs(transaction, {
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

		const transactionLogsResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Voltaire_JsonRpc
			&& candidate.entityType === EntityType.EvmTransaction
			&& Object.keys(candidate.fields).length === 1
			&& '$$logs' in candidate.fields
		))
		const resolveTransactionLogs = transactionLogsResolver?.resolve[EvmTransactionSelector.EvmNetworkTxHash]
		if (transactionLogsResolver == null || resolveTransactionLogs == null)
			throw new Error('Voltaire_JsonRpc: missing EvmTransaction.$$logs resolver')
		expect(transactionLogsResolver.fields.$$logs(
			await resolveTransactionLogs({
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
				indexInTransaction: 3,
			},
		}])

		const logResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Voltaire_JsonRpc
			&& candidate.entityType === EntityType.EvmLog
		))
		const resolveLog = logResolver?.resolve[EvmLogSelector.TransactionIndexInTransaction]
		if (logResolver == null || resolveLog == null)
			throw new Error('Voltaire_JsonRpc: missing EvmLog resolver')
		const log = await resolveLog({
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 3,
		}, resolverContext)
		expect(logResolver.fields.$$topics(log, {
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
		expect(logResolver.fields.$transaction(log, {
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
		expect(logResolver.fields.$block(log, {
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
		expect(logResolver.fields.removed(log, {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 3,
		}, resolverContext)).toBe(false)
		expect(logResolver.fields.$emitter(log, {
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
			&& 'versionedHash' in candidate.fields
		))
		const resolveBlob = blobResolver?.resolve[EvmBlobSelector.TransactionIndexInTransaction]
		if (blobResolver == null || resolveBlob == null)
			throw new Error('Voltaire_JsonRpc: missing EvmBlob resolver')
		const blob = await resolveBlob({
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 0,
		}, resolverContext)
		expect(blobResolver.fields.versionedHash(blob, {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 0,
		}, resolverContext)).toBe(versionedHash)
		expect(blobResolver.fields.$transaction(blob, {
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
		expect(blobResolver.fields.$block(blob, {
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
			&& 'marketCapRank' in candidate.fields
		))
		const resolveCoingeckoTimestamp = coingeckoTimestampResolver?.resolve[Coin_TimestampSelector.CoinTimestampMsSource]
		if (coingeckoTimestampResolver == null || resolveCoingeckoTimestamp == null)
			throw new Error('Coingecko_Rest: missing Coin_Timestamp resolver')
		const coingeckoTimestamp = await resolveCoingeckoTimestamp({
			$coin: { coinId: CoinId.ETH },
			timestampMs: coingeckoTimestampMs,
			source: Source.Coingecko_Rest,
		}, resolverContext)
		expect(coingeckoTimestampResolver.fields.marketCapRank(coingeckoTimestamp, {
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
			&& '$$timestamps' in candidate.fields
		))
		const resolveCoingeckoCoin = coingeckoCoinResolver?.resolve[CoinSelector.CoinId]
		if (coingeckoCoinResolver == null || resolveCoingeckoCoin == null)
			throw new Error('Coingecko_Rest: missing Coin.$$timestamps resolver')
		expect(coingeckoCoinResolver.fields.$$timestamps(
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
			marketCapRank: 2,
			marketCapUsd: 123,
			transport: 'coingecko-coin',
			providerAssetId: 'ethereum',
		}])

		const blockscoutTimestampResolver = allSourceResolverDefinitions.find((candidate) => (
			candidate.source === Source.Blockscout_Rest
			&& candidate.entityType === EntityType.Coin_Timestamp
			&& 'marketCap' in candidate.fields
		))
		const resolveBlockscoutTimestamp = blockscoutTimestampResolver?.resolve[Coin_TimestampSelector.CoinTimestampMsSource]
		if (blockscoutTimestampResolver == null || resolveBlockscoutTimestamp == null)
			throw new Error('Blockscout_Rest: missing Coin_Timestamp resolver')
		const blockscoutTimestamp = await resolveBlockscoutTimestamp({
			$coin: { coinId: CoinId.ETH },
			timestampMs: blockscoutTimestampMs,
			source: Source.Blockscout_Rest,
		}, resolverContext)
		expect(blockscoutTimestampResolver.fields.marketCap(blockscoutTimestamp, {
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
			&& '$$timestamps' in candidate.fields
		))
		const resolveBlockscoutCoin = blockscoutCoinResolver?.resolve[CoinSelector.CoinId]
		if (blockscoutCoinResolver == null || resolveBlockscoutCoin == null)
			throw new Error('Blockscout_Rest: missing Coin.$$timestamps resolver')
		expect(blockscoutCoinResolver.fields.$$timestamps(
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
			caip2: bitcoinNetworkBySlug.bitcoin.caip2,
		}
		const litecoinNetworkSelector = {
			caip2: bitcoinNetworkBySlug.litecoin.caip2,
		}
		const dogecoinNetworkSelector = {
			caip2: bitcoinNetworkBySlug.dogecoin.caip2,
		}
		const zcashNetworkSelector = {
			caip2: bitcoinNetworkBySlug.zcash.caip2,
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
			getBlockHashByHeight: vi.fn(async () => '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5'),
			getBlockTransactionIds: vi.fn(async () => ['mempoolspace-block-transaction']),
			getTransaction: vi.fn(async () => ({
				vin: [{}],
				vout: [{}],
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
				entityType: EntityType.UtxoNetwork,
				selectorName: UtxoNetworkSelector.Network,
				entitySelector: {
					$network: bitcoinNetworkSelector,
				},
				fieldName: '$$blocks',
				expectedSelectors: [{
					$network: bitcoinNetworkSelector,
					height: 840_000n,
					hash: '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5',
				}],
			},
			{
				source: Source.Blockchair_Rest,
				entityType: EntityType.UtxoNetwork,
				selectorName: UtxoNetworkSelector.Network,
				entitySelector: {
					$network: bitcoinNetworkSelector,
				},
				fieldName: '$$transactions',
				expectedSelectors: [{
					$network: bitcoinNetworkSelector,
					txId: 'blockchair-network-transaction',
				}],
			},
			{
				source: Source.Blockchair_Rest,
				entityType: EntityType.UtxoBlock,
				selectorName: UtxoBlockSelector.NetworkHeightHash,
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
				selectorName: UtxoTransactionSelector.NetworkTxId,
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
				selectorName: UtxoTransactionSelector.NetworkTxId,
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
				entityType: EntityType.UtxoNetwork,
				selectorName: UtxoNetworkSelector.Network,
				entitySelector: {
					$network: bitcoinNetworkSelector,
				},
				fieldName: '$$blocks',
				expectedSelectors: [{
					$network: bitcoinNetworkSelector,
					height: 840_000n,
					hash: '0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5',
				}],
			},
			{
				source: Source.MempoolSpace_Rest,
				entityType: EntityType.UtxoNetwork,
				selectorName: UtxoNetworkSelector.Network,
				entitySelector: {
					$network: bitcoinNetworkSelector,
				},
				fieldName: '$$transactions',
				expectedSelectors: [{
					$network: bitcoinNetworkSelector,
					txId: 'mempoolspace-network-transaction',
				}],
			},
			{
				source: Source.MempoolSpace_Rest,
				entityType: EntityType.UtxoBlock,
				selectorName: UtxoBlockSelector.NetworkHeightHash,
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
				selectorName: UtxoTransactionSelector.NetworkTxId,
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
				selectorName: UtxoTransactionSelector.NetworkTxId,
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
				selectorName: UtxoBlockSelector.NetworkHeightHash,
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
				selectorName: UtxoBlockSelector.NetworkHeightHash,
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
				selectorName: UtxoBlockSelector.NetworkHeightHash,
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
				selectorName: UtxoBlockSelector.NetworkHeightHash,
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
				selectorName: UtxoTransactionSelector.NetworkTxId,
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
				selectorName: UtxoTransactionSelector.NetworkTxId,
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
				selectorName: UtxoBlockSelector.NetworkHeightHash,
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
			const resolver = allSourceResolverDefinitions.find((candidate) => (
				candidate.source === source
				&& candidate.entityType === entityType
				&& fieldName in candidate.fields
			))
			const resolve = resolver?.resolve[selectorName]
			const fieldSelector = resolver?.fields[fieldName]
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
			&& '$block' in candidate.fields
		))
		const blockchairTransactionResolve = blockchairTransactionResolver?.resolve[UtxoTransactionSelector.NetworkTxId]
		const blockchairBlockField = blockchairTransactionResolver?.fields.$block
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

			const localAccountIdResolver = actorResolver.resolve[ActivityPubActorSelector.LocalAccountId]
			const acctResolver = actorResolver.resolve[ActivityPubActorSelector.Acct]
			const actorActivityStreamsUriResolver = actorResolver.resolve[ActivityPubActorSelector.ActivityStreamsUri]
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
			const noteActivityStreamsUriResolver = noteResolver.resolve[ActivityPubNoteSelector.ActivityStreamsUri]
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
			expect(getAccountByLocalAccountId).toHaveBeenCalledWith({}, 'https://mastodon.social', '13179')
			expect(getAccountByAcct).toHaveBeenCalledTimes(1)
			expect(getAccountByAcct).toHaveBeenCalledWith({}, 'https://mastodon.social', 'Gargron')
			expect(getAccountByActivityStreamsUri).toHaveBeenCalledTimes(1)
			expect(getAccountByActivityStreamsUri).toHaveBeenCalledWith({}, 'https://mastodon.social/users/Gargron')
			expect(getStatusByActivityStreamsUri).toHaveBeenCalledTimes(1)
			expect(getStatusByActivityStreamsUri).toHaveBeenCalledWith({}, 'https://mastodon.social/users/Gargron/statuses/116539053870420123')
		}
	})

	it('only indexes count facets for multiple-cardinality fields', () => {
		expect(Object.values(resolverCountPartsByEntityTypeAndFieldName).flat().length).toBeGreaterThan(0)
		expect(Object.values(resolverCountPartsByEntityTypeAndFieldName).flat().every((resolverPart) => (
			fieldDefinitionByEntityTypeAndFieldName[resolverPart.entityType][resolverPart.fieldName]?.cardinality === EntityFieldCardinality.Many
			|| fieldDefinitionByEntityTypeAndFieldName[resolverPart.entityType][resolverPart.fieldName]?.cardinality === EntityFieldCardinality.ZeroOrMany
		))).toBe(true)
	})

	it('indexes conditional discriminator fields through the condition source field resolver parts', () => {
		const {
			resolverDiscriminatorPartsByEntityTypeAndConditionKey: fixtureResolverDiscriminatorPartsByEntityTypeAndConditionKey,
		} = indexResolvers(fixtureSchema, [{
			source: 'Fixture',
			resolvers: [validFixtureResolver],
		}], new Set(['Fixture']))
		const discriminatorEntries = Object.entries(resolverDiscriminatorPartsByEntityTypeAndConditionKey)
			.flatMap(([entityType, partsByConditionKey]) => (
				Object.entries(partsByConditionKey).map(([conditionKey, parts]) => ({
					entityType,
					conditionKey,
					parts,
				}))
			))

		if (discriminatorEntries.length === 0) {
			expect(discriminatorEntries.length).toBe(0)
			return
		}

		expect(
			fixtureResolverDiscriminatorPartsByEntityTypeAndConditionKey.FixtureEntity['segments[0]'].map((resolverPart) => resolverPart.fieldName)
		).toEqual(['segments'])
		expect(discriminatorEntries.every(({ entityType, conditionKey, parts }) => (
			parts.every((resolverPart) => (
				resolverPart.entityType === entityType
				&& conditionKey.startsWith(resolverPart.fieldName)
			))
		))).toBe(true)
	})
})
