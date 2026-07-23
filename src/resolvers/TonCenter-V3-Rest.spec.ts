import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const sourceQueries = vi.hoisted(() => ({
	getTonCenterV3Blocks: vi.fn(),
	getTonCenterV3Transactions: vi.fn(),
	getTonCenterV3Messages: vi.fn(),
	getTonCenterV3CompletedTraces: vi.fn(),
	getTonCenterV3JettonMasters: vi.fn(),
	getTonCenterV3NftCollections: vi.fn(),
	getTonCenterV3NftItems: vi.fn(),
}))

vi.mock('$/sources/TonCenter/V3/Rest/queries.ts', () => sourceQueries)

const { createTonCenterV3Resolvers } = await import('$/resolvers/TonCenter-V3-Rest.ts')

const binding = {
	provider: SourceProvider.TonCenter,
	source: Source.TonCenter_V3_Rest,
	target: {
		kind: SourceTargetKind.Caip2Network,
		key: 'ton:-239',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://toncenter.com/api/v3/',
		origin: 'https://toncenter.com',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [SourceOperationGroup.GenericRead],
	delivery: SourceDelivery.HttpProxy,
	credentials: [{
		scope: SourceCredentialScope.None,
	}],
	proxyId: 'TonCenter_V3_Rest-mainnet',
} as const satisfies SourceBinding

const tonCenter = createTonCenterV3Resolvers(binding)
const network = {
	caip2: networkBySlug.ton.caip2,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
	providerContinuationToken: '4',
}

const [
	blocksResolver,
	transactionsResolver,
	messagesResolver,
	tracesResolver,
	jettonsResolver,
	collectionsResolver,
	itemsResolver,
] = tonCenter.resolvers

describe('TonCenter v3 network resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.setSystemTime(1_750_000_000_000)
	})

	it('declares only canonical TON mainnet applicability and preserves bounded offsets', async () => {
		sourceQueries.getTonCenterV3Blocks.mockResolvedValueOnce({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [],
		})
		const resolver = blocksResolver

		await resolver.resolve[NetworkSelector.Caip2].resolve(network, context)

		expect(resolver.resolve[NetworkSelector.Caip2].appliesTo).toEqual([{
			caip2: networkBySlug.ton.caip2,
		}])
		expect(resolver.resolve[NetworkSelector.Slug].appliesTo).toEqual([{
			slug: networkBySlug.ton.slug,
		}])
		expect(sourceQueries.getTonCenterV3Blocks).toHaveBeenCalledWith(binding, {
			limit: 2,
			offset: 4,
			order: 'desc',
		})
		await expect(
			resolver.resolve[NetworkSelector.Caip2].resolve(
				{ caip2: { namespace: 'ton', reference: 'testnet' } },
				context
			)
		).rejects.toThrow('unsupported network')
		await expect(
			resolver.resolve[NetworkSelector.Caip2].resolve(
				network,
				{
					...context,
					providerContinuationToken: '4.5',
				}
			)
		).rejects.toThrow('invalid offset continuation')

		vi.clearAllMocks()
		const emptyPage = await resolver.resolve[NetworkSelector.Caip2].resolve(
			network,
			{
				...context,
				pagination: {
					limit: 0,
				},
			}
		)
		expect(emptyPage).toEqual({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [],
		})
		expect(sourceQueries.getTonCenterV3Blocks).not.toHaveBeenCalled()
		const blocksProjection = resolver.projections.Ton.$$blocks
		if (typeof blocksProjection === 'function')
			throw new Error('TonCenter-V3-Rest spec missing block pagination')
		expect(blocksProjection.continuation(emptyPage)).toEqual({
			operation: 'blocks',
			target: 'ton:-239',
			terminal: true,
		})
	})

	it('projects blocks, transactions, and messages to canonical identities and fields', async () => {
		sourceQueries.getTonCenterV3Blocks.mockResolvedValueOnce({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [{
				workchain: -1,
				shard: '8000000000000000',
				seqno: 42,
				rootHash: 'a'.repeat(64),
				fileHash: 'b'.repeat(64),
				genUtimeSeconds: 1_700_000_000,
				startLt: 100n,
				endLt: 200n,
				transactionCount: 1,
			}],
			nextOffset: 6,
		})
		const blocksPage = await blocksResolver.resolve[NetworkSelector.Caip2].resolve(network, context)
		const blocksProjection = blocksResolver.projections.Ton.$$blocks
		if (typeof blocksProjection === 'function')
			throw new Error('TonCenter-V3-Rest spec missing block pagination')
		expect(blocksProjection.select(blocksPage, network)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				workchain: -1,
				shardPrefix: '8000000000000000',
				seqno: 42n,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.TonBlock, [], 'rootHash')]: 'a'.repeat(64),
				[entityFieldAddressKey(EntityType.TonBlock, [], 'genUtimeMs')]: 1_700_000_000_000,
			}),
		}])
		expect(blocksProjection.continuation(blocksPage)).toEqual({
			operation: 'blocks',
			target: 'ton:-239',
			terminal: false,
			token: '6',
		})

		const message = {
			hash: 'c'.repeat(64),
			source: `0:${'1'.repeat(64)}`,
			destination: `0:${'2'.repeat(64)}`,
			createdAtSeconds: 1,
			createdLt: 9n,
			valueNano: 10n,
			forwardFeeNano: 1n,
			importFeeNano: 0n,
		}
		sourceQueries.getTonCenterV3Transactions.mockResolvedValueOnce({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [{
				account: `0:${'3'.repeat(64)}`,
				logicalTime: 12n,
				hash: 'd'.repeat(64),
				block: {
					workchain: -1,
					shard: '8000000000000000',
					seqno: 42,
				},
				timestampSeconds: 1_700_000_100,
				totalFeesNano: 5n,
				previousTransactionHash: 'e'.repeat(64),
				previousTransactionLogicalTime: 11n,
				originalStatus: 'active',
				endStatus: 'active',
				transactionKind: 'ord',
				aborted: false,
				destroyed: false,
				inboundMessage: message,
				outboundMessages: [message],
				traceId: 'f'.repeat(64),
			}],
		})
		const transactionsPage = await transactionsResolver.resolve[NetworkSelector.Caip2].resolve(network, context)
		const transactionsProjection = transactionsResolver.projections.Ton.$$transactions
		if (typeof transactionsProjection === 'function')
			throw new Error('TonCenter-V3-Rest spec missing transaction pagination')
		const [transaction] = transactionsProjection.select(transactionsPage, network)
		expect(transaction[EntityMetaKey.Selector]).toEqual({
			$account: {
				$network: network,
				address: `0:${'3'.repeat(64)}`,
			},
			lt: 12n,
			hash: 'd'.repeat(64),
		})
		expect(transaction[EntityMetaKey.Fields]).toEqual(expect.objectContaining({
			[entityFieldAddressKey(EntityType.TonTransaction, [], 'totalFeesNano')]: 5n,
			[entityFieldAddressKey(EntityType.TonTransaction, [], 'outMessageCount')]: 1,
		}))

		sourceQueries.getTonCenterV3Messages.mockResolvedValueOnce({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [message],
		})
		const messagesPage = await messagesResolver.resolve[NetworkSelector.Caip2].resolve(network, context)
		const messagesProjection = messagesResolver.projections.Ton.$$messages
		if (typeof messagesProjection === 'function')
			throw new Error('TonCenter-V3-Rest spec missing message pagination')
		expect(messagesProjection.select(messagesPage, network)[0]).toEqual(expect.objectContaining({
			[EntityMetaKey.Selector]: {
				$network: network,
				messageHash: 'c'.repeat(64),
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.TonMessage, [], 'messageKind')]: 'internal',
			}),
		}))
	})

	it('projects completed trace and asset observations with exact provenance and resolution time', async () => {
		const rootMessage = {
			hash: '1'.repeat(64),
			destination: `0:${'2'.repeat(64)}`,
			createdAtSeconds: 1,
			createdLt: 2n,
			valueNano: 3n,
			forwardFeeNano: 0n,
			importFeeNano: 0n,
		}
		sourceQueries.getTonCenterV3CompletedTraces.mockResolvedValueOnce({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [{
				traceId: '1'.repeat(64),
				startLt: 1n,
				endLt: 2n,
				startUtimeSeconds: 1_700_000_000,
				endUtimeSeconds: 1_700_000_001,
				masterchainStartSeqno: 1n,
				masterchainEndSeqno: 2n,
				rootMessage,
				transactionHashes: ['2'.repeat(64)],
				messageCount: 2,
				transactionCount: 1,
			}],
		})
		const tracesPage = await tracesResolver.resolve[NetworkSelector.Caip2].resolve(network, context)
		const tracesProjection = tracesResolver.projections.Ton.$$traces
		if (typeof tracesProjection === 'function')
			throw new Error('TonCenter-V3-Rest spec missing trace pagination')
		const [trace] = tracesProjection.select(tracesPage, network)
		expect(trace[EntityMetaKey.Selector]).toEqual({
			$network: network,
			traceId: '1'.repeat(64),
			source: Source.TonCenter_V3_Rest,
		})
		expect(trace[EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.TonTrace, [], '$$timestamps')
		][0][EntityMetaKey.Selector]).toEqual({
			$trace: trace[EntityMetaKey.Selector],
			timestampMs: 1_750_000_000_000,
			source: Source.TonCenter_V3_Rest,
		})

		sourceQueries.getTonCenterV3JettonMasters.mockResolvedValueOnce({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [{
				address: `0:${'3'.repeat(64)}`,
				metadataUri: 'ipfs://jetton',
				totalSupplyUnits: 1_000_000n,
				mintable: true,
			}],
		})
		const jettonsPage = await jettonsResolver.resolve[NetworkSelector.Caip2].resolve(network, context)
		const jettonsProjection = jettonsResolver.projections.Ton.$$jettons
		if (typeof jettonsProjection === 'function')
			throw new Error('TonCenter-V3-Rest spec missing jetton pagination')
		const [jetton] = jettonsProjection.select(jettonsPage, network)
		const jettonObservation = jetton[EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.TonJetton, [], '$$timestamps')
		][0]
		expect(jettonObservation[EntityMetaKey.Selector]).toEqual({
			$jetton: jetton[EntityMetaKey.Selector],
			timestampMs: 1_750_000_000_000,
			source: Source.TonCenter_V3_Rest,
		})
		expect(jettonObservation[EntityMetaKey.Fields]).not.toHaveProperty(
			entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'totalSupplyNano')
		)

		sourceQueries.getTonCenterV3NftCollections.mockResolvedValueOnce({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [{
				address: `0:${'4'.repeat(64)}`,
				metadataUri: 'ipfs://collection',
				content: { uri: 'ipfs://collection' },
				nextItemIndex: 2n,
			}],
		})
		const collectionsPage = await collectionsResolver.resolve[NetworkSelector.Caip2].resolve(network, context)
		const collectionsProjection = collectionsResolver.projections.Ton.$$nftCollections
		if (typeof collectionsProjection === 'function')
			throw new Error('TonCenter-V3-Rest spec missing collection pagination')
		const [collection] = collectionsProjection.select(collectionsPage, network)
		expect(collection[EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.TonNftCollection, [], '$$timestamps')
		][0][EntityMetaKey.Selector]).toEqual({
			$collection: collection[EntityMetaKey.Selector],
			timestampMs: 1_750_000_000_000,
			source: Source.TonCenter_V3_Rest,
		})

		sourceQueries.getTonCenterV3NftItems.mockResolvedValueOnce({
			source: Source.TonCenter_V3_Rest,
			target: 'ton:-239',
			rows: [{
				address: `0:${'5'.repeat(64)}`,
				collectionAddress: `0:${'4'.repeat(64)}`,
				index: 1n,
				ownerAddress: `0:${'6'.repeat(64)}`,
				initialized: true,
				metadataUri: 'ipfs://item',
				onSale: true,
				saleContractAddress: `0:${'7'.repeat(64)}`,
			}],
		})
		const itemsPage = await itemsResolver.resolve[NetworkSelector.Caip2].resolve(network, context)
		const itemsProjection = itemsResolver.projections.Ton.$$nftItems
		if (typeof itemsProjection === 'function')
			throw new Error('TonCenter-V3-Rest spec missing item pagination')
		const [item] = itemsProjection.select(itemsPage, network)
		expect(item[EntityMetaKey.Fields]).toEqual(expect.objectContaining({
			[entityFieldAddressKey(EntityType.TonNftItem, [], 'itemIndex')]: 1n,
		}))
		expect(item[EntityMetaKey.Fields]).not.toHaveProperty('onSale')
		expect(item[EntityMetaKey.Fields]).not.toHaveProperty('saleContractAddress')
	})
})
