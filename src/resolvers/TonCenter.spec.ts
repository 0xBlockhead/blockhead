import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

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

const { createTonCenterV3Resolvers } = await import('$/resolvers/TonCenter.ts')

const tonCenter = createTonCenterV3Resolvers()
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
			source: Source.TonCenter,
			target: 'ton:-239',
			rows: [],
		})
		const resolver = blocksResolver

		await resolver.resolve['Caip2'].resolve(network, context)

		expect(resolver.resolve['Caip2'].appliesTo).toEqual([{
			caip2: networkBySlug.ton.caip2,
		}])
		expect(resolver.resolve['Slug'].appliesTo).toEqual([{
			slug: networkBySlug.ton.slug,
		}])
		expect(sourceQueries.getTonCenterV3Blocks).toHaveBeenCalledWith({
			limit: 2,
			offset: 4,
			order: 'desc',
		})
		await expect(
			resolver.resolve['Caip2'].resolve(
				{ caip2: { namespace: 'ton', reference: 'testnet' } },
				context
			)
		).rejects.toThrow('unsupported network')
		await expect(
			resolver.resolve['Caip2'].resolve(
				network,
				{
					...context,
					providerContinuationToken: '4.5',
				}
			)
		).rejects.toThrow('invalid offset continuation')

		vi.clearAllMocks()
		const emptyPage = await resolver.resolve['Caip2'].resolve(
			network,
			{
				...context,
				pagination: {
					limit: 0,
				},
			}
		)
		expect(emptyPage).toEqual({
			rows: [],
		})
		expect(sourceQueries.getTonCenterV3Blocks).not.toHaveBeenCalled()
		const blocksProjection = resolver.projections.Ton.$$blocks
		if (typeof blocksProjection === 'function')
			throw new Error('TON Center v3 spec missing block pagination')
		expect(blocksProjection.continuation(emptyPage)).toEqual({
			operation: 'blocks',
			target: 'ton:-239',
			terminal: true,
		})
	})

	it('projects blocks, transactions, and messages to canonical identities and fields', async () => {
		sourceQueries.getTonCenterV3Blocks.mockResolvedValueOnce({
			source: Source.TonCenter,
			target: 'ton:-239',
			rows: [{
				workchain: -1,
				shard: 'ABCDEF0123456789',
				seqno: 42,
				root_hash: 'A'.repeat(64),
				file_hash: 'B'.repeat(64),
				gen_utime: '1700000000',
				start_lt: '100',
				end_lt: '200',
				tx_count: 1,
			}],
			nextOffset: 6,
		})
		const blocksPage = await blocksResolver.resolve['Caip2'].resolve(network, context)
		const blocksProjection = blocksResolver.projections.Ton.$$blocks
		if (typeof blocksProjection === 'function')
			throw new Error('TON Center v3 spec missing block pagination')
		expect(blocksProjection.select(blocksPage, network)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				workchain: -1,
				shardPrefix: 'abcdef0123456789',
				seqno: 42n,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.TonBlock, [], 'rootHash')]: 'a'.repeat(64),
				[entityFieldAddressKey(EntityType.TonBlock, [], 'fileHash')]: 'b'.repeat(64),
				[entityFieldAddressKey(EntityType.TonBlock, [], 'genUtimeMs')]: 1_700_000_000_000,
				[entityFieldAddressKey(EntityType.TonBlock, [], 'startLt')]: 100n,
				[entityFieldAddressKey(EntityType.TonBlock, [], 'endLt')]: 200n,
			}),
		}])
		expect(blocksProjection.continuation(blocksPage)).toEqual({
			operation: 'blocks',
			target: 'ton:-239',
			terminal: false,
			token: '6',
		})

		const message = {
			hash: 'C'.repeat(64),
			source: `0:${'A'.repeat(64)}`,
			destination: `0:${'B'.repeat(64)}`,
			created_at: '1',
			created_lt: '9',
			value: '10',
			fwd_fee: '1',
			import_fee: '0',
		}
		sourceQueries.getTonCenterV3Transactions.mockResolvedValueOnce({
			source: Source.TonCenter,
			target: 'ton:-239',
			rows: [{
				account: `0:${'A'.repeat(64)}`,
				hash: 'D'.repeat(64),
				lt: '12',
				block_ref: {
					workchain: -1,
					shard: 'ABCDEF0123456789',
					seqno: 42,
				},
				now: 1_700_000_100,
				total_fees: '5',
				prev_trans_hash: 'E'.repeat(64),
				prev_trans_lt: '11',
				orig_status: 'active',
				end_status: 'frozen',
				description: {
					type: 'ord',
					aborted: false,
					destroyed: false,
				},
				in_msg: message,
				out_msgs: [message],
				trace_id: 'F'.repeat(64),
			}],
		})
		const transactionsPage = await transactionsResolver.resolve['Caip2'].resolve(network, context)
		const transactionsProjection = transactionsResolver.projections.Ton.$$transactions
		if (typeof transactionsProjection === 'function')
			throw new Error('TON Center v3 spec missing transaction pagination')
		const [transaction] = transactionsProjection.select(transactionsPage, network)
		expect(transaction[EntityMetaKey.Selector]).toEqual({
			$account: {
				$network: network,
				address: `0:${'a'.repeat(64)}`,
			},
			lt: 12n,
			hash: 'd'.repeat(64),
		})
		expect(transaction[EntityMetaKey.Fields]).toEqual(expect.objectContaining({
			[entityFieldAddressKey(EntityType.TonTransaction, [], 'nowMs')]: 1_700_000_100_000,
			[entityFieldAddressKey(EntityType.TonTransaction, [], 'origStatus')]: 'active',
			[entityFieldAddressKey(EntityType.TonTransaction, [], 'endStatus')]: 'frozen',
			[entityFieldAddressKey(EntityType.TonTransaction, [], 'transactionKind')]: 'ord',
			[entityFieldAddressKey(EntityType.TonTransaction, [], 'totalFeesNano')]: 5n,
			[entityFieldAddressKey(EntityType.TonTransaction, [], 'outMessageCount')]: 1,
			[entityFieldAddressKey(EntityType.TonTransaction, [], 'previousTransactionHash')]: 'e'.repeat(64),
			[entityFieldAddressKey(EntityType.TonTransaction, [], 'previousTransactionLt')]: 11n,
			[entityFieldAddressKey(EntityType.TonTransaction, [], '$block')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					workchain: -1,
					shardPrefix: 'abcdef0123456789',
					seqno: 42n,
				},
			},
			[entityFieldAddressKey(EntityType.TonTransaction, [], '$trace')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					traceId: 'f'.repeat(64),
					source: Source.TonCenter,
				},
			},
		}))

		sourceQueries.getTonCenterV3Messages.mockResolvedValueOnce({
			source: Source.TonCenter,
			target: 'ton:-239',
			rows: [message],
		})
		const messagesPage = await messagesResolver.resolve['Caip2'].resolve(network, context)
		const messagesProjection = messagesResolver.projections.Ton.$$messages
		if (typeof messagesProjection === 'function')
			throw new Error('TON Center v3 spec missing message pagination')
		expect(messagesProjection.select(messagesPage, network)[0]).toEqual(expect.objectContaining({
			[EntityMetaKey.Selector]: {
				$network: network,
				messageHash: 'c'.repeat(64),
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.TonMessage, [], 'messageKind')]: 'internal',
				[entityFieldAddressKey(EntityType.TonMessage, [], 'sourceAddress')]: `0:${'a'.repeat(64)}`,
				[entityFieldAddressKey(EntityType.TonMessage, [], 'destinationAddress')]: `0:${'b'.repeat(64)}`,
				[entityFieldAddressKey(EntityType.TonMessage, [], 'valueNano')]: 10n,
				[entityFieldAddressKey(EntityType.TonMessage, [], 'createdLt')]: 9n,
			}),
		}))
	})

	it('projects completed traces at the provider completion clock and assets at resolution time', async () => {
		const rootMessage = {
			hash: '1'.repeat(64),
			destination: `0:${'2'.repeat(64)}`,
			created_at: '1',
			created_lt: '2',
			value: '3',
			fwd_fee: '0',
			import_fee: '0',
		}
		sourceQueries.getTonCenterV3CompletedTraces.mockResolvedValueOnce({
			source: Source.TonCenter,
			target: 'ton:-239',
			rows: [{
				trace_id: '1'.repeat(64).toUpperCase(),
				start_lt: '1',
				end_lt: '2',
				start_utime: 1_700_000_000,
				end_utime: 1_700_000_001,
				mc_seqno_start: '1',
				mc_seqno_end: '2',
				is_incomplete: false,
				trace: {
					in_msg_hash: '1'.repeat(64),
					in_msg: rootMessage,
					tx_hash: '2'.repeat(64),
				},
				transactions_order: ['2'.repeat(64)],
				trace_info: {
					messages: 2,
					pending_messages: 0,
					transactions: 1,
				},
			}],
		})
		const tracesPage = await tracesResolver.resolve['Caip2'].resolve(network, context)
		const tracesProjection = tracesResolver.projections.Ton.$$traces
		if (typeof tracesProjection === 'function')
			throw new Error('TON Center v3 spec missing trace pagination')
		const [trace] = tracesProjection.select(tracesPage, network)
		expect(trace[EntityMetaKey.Selector]).toEqual({
			$network: network,
			traceId: '1'.repeat(64),
			source: Source.TonCenter,
		})
		expect(trace[EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.TonTrace, [], '$$timestamps')
		][0][EntityMetaKey.Selector]).toEqual({
			$trace: trace[EntityMetaKey.Selector],
			timestampMs: 1_700_000_001_000,
			source: Source.TonCenter,
		})
		expect(trace[EntityMetaKey.Fields]).toEqual(expect.objectContaining({
			[entityFieldAddressKey(EntityType.TonTrace, [], 'startedAtMs')]: 1_700_000_000_000,
			[entityFieldAddressKey(EntityType.TonTrace, [], '$rootMessage')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					messageHash: '1'.repeat(64),
				},
				[EntityMetaKey.Fields]: expect.anything(),
			},
			[entityFieldAddressKey(EntityType.TonTrace, [], '$$messages')]: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					messageHash: '1'.repeat(64),
				},
				[EntityMetaKey.Fields]: expect.anything(),
			}],
		}))
		expect(trace[EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.TonTrace, [], '$$timestamps')
		][0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.TonTrace_Timestamp, [], 'status')]: 'completed',
			[entityFieldAddressKey(EntityType.TonTrace_Timestamp, [], 'transactionCount')]: 1,
			[entityFieldAddressKey(EntityType.TonTrace_Timestamp, [], 'messageCount')]: 2,
		})
		expect(trace[EntityMetaKey.Fields]).not.toHaveProperty(
			entityFieldAddressKey(EntityType.TonTrace, [], '$$transactions')
		)
		expect(trace[EntityMetaKey.Fields]).not.toHaveProperty(
			entityFieldAddressKey(EntityType.TonTrace, [], 'rootTransactionSelector')
		)

		sourceQueries.getTonCenterV3JettonMasters.mockResolvedValueOnce({
			source: Source.TonCenter,
			target: 'ton:-239',
			rows: [{
				address: `0:${'A'.repeat(64)}`,
				admin_address: `0:${'B'.repeat(64)}`,
				code_hash: 'C'.repeat(64),
				data_hash: 'D'.repeat(64),
				jetton_content: {
					uri: 'ipfs://jetton',
				},
				jetton_wallet_code_hash: 'E'.repeat(64),
				last_transaction_lt: '9007199254740999',
				total_supply: '1000000',
				mintable: true,
			}],
		})
		const jettonsPage = await jettonsResolver.resolve['Caip2'].resolve(network, context)
		const jettonsProjection = jettonsResolver.projections.Ton.$$jettons
		if (typeof jettonsProjection === 'function')
			throw new Error('TON Center v3 spec missing jetton pagination')
		const [jetton] = jettonsProjection.select(jettonsPage, network)
		const jettonObservation = jetton[EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.TonJetton, [], '$$timestamps')
		][0]
		expect(jettonObservation[EntityMetaKey.Selector]).toEqual({
			$jetton: jetton[EntityMetaKey.Selector],
			timestampMs: 1_750_000_000_000,
			source: Source.TonCenter,
		})
		expect(jetton[EntityMetaKey.Selector]).toEqual({
			$network: network,
			masterAddress: `0:${'a'.repeat(64)}`,
		})
		expect(jettonObservation[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'adminAddress')]: `0:${'b'.repeat(64)}`,
			[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'codeHash')]: 'c'.repeat(64),
			[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'dataHash')]: 'd'.repeat(64),
			[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'walletCodeHash')]: 'e'.repeat(64),
			[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'metadataUri')]: 'ipfs://jetton',
			[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'mintable')]: true,
			[entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'lastTransactionLt')]: 9_007_199_254_740_999n,
		})
		expect(jettonObservation[EntityMetaKey.Fields]).not.toHaveProperty(
			entityFieldAddressKey(EntityType.TonJetton_Timestamp, [], 'totalSupplyNano')
		)

		sourceQueries.getTonCenterV3NftCollections.mockResolvedValueOnce({
			source: Source.TonCenter,
			target: 'ton:-239',
			rows: [{
				address: `0:${'F'.repeat(64)}`,
				code_hash: 'B'.repeat(64),
				collection_content: {
					uri: 'ipfs://collection',
				},
				data_hash: 'C'.repeat(64),
				last_transaction_lt: '9007199254740999',
				next_item_index: '340282366920938463463374607431768211455',
				owner_address: `0:${'A'.repeat(64)}`,
			}],
		})
		const collectionsPage = await collectionsResolver.resolve['Caip2'].resolve(network, context)
		const collectionsProjection = collectionsResolver.projections.Ton.$$nftCollections
		if (typeof collectionsProjection === 'function')
			throw new Error('TON Center v3 spec missing collection pagination')
		const [collection] = collectionsProjection.select(collectionsPage, network)
		expect(collection[EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.TonNftCollection, [], '$$timestamps')
		][0][EntityMetaKey.Selector]).toEqual({
			$collection: collection[EntityMetaKey.Selector],
			timestampMs: 1_750_000_000_000,
			source: Source.TonCenter,
		})
		expect(collection[EntityMetaKey.Selector]).toEqual({
			$network: network,
			collectionAddress: `0:${'f'.repeat(64)}`,
		})
		expect(collection[EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.TonNftCollection, [], '$$timestamps')
		][0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'ownerAddress')]: `0:${'a'.repeat(64)}`,
			[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'nextItemIndex')]: 340_282_366_920_938_463_463_374_607_431_768_211_455n,
			[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'metadataUri')]: 'ipfs://collection',
			[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'content')]: {
				uri: 'ipfs://collection',
			},
			[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'codeHash')]: 'b'.repeat(64),
			[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'dataHash')]: 'c'.repeat(64),
			[entityFieldAddressKey(EntityType.TonNftCollection_Timestamp, [], 'lastTransactionLt')]: 9_007_199_254_740_999n,
		})

		sourceQueries.getTonCenterV3NftItems.mockResolvedValueOnce({
			source: Source.TonCenter,
			target: 'ton:-239',
			rows: [{
				address: `0:${'D'.repeat(64)}`,
				code_hash: 'E'.repeat(64),
				collection_address: `0:${'F'.repeat(64)}`,
				content: {
					uri: 'ipfs://item',
				},
				data_hash: 'A'.repeat(64),
				index: '1',
				init: true,
				last_transaction_lt: '9007199254740998',
				on_sale: true,
				owner_address: `0:${'B'.repeat(64)}`,
				sale_contract_address: `0:${'C'.repeat(64)}`,
			}],
		})
		const itemsPage = await itemsResolver.resolve['Caip2'].resolve(network, context)
		const itemsProjection = itemsResolver.projections.Ton.$$nftItems
		if (typeof itemsProjection === 'function')
			throw new Error('TON Center v3 spec missing item pagination')
		const [item] = itemsProjection.select(itemsPage, network)
		expect(item[EntityMetaKey.Fields]).toEqual(expect.objectContaining({
			[entityFieldAddressKey(EntityType.TonNftItem, [], 'itemIndex')]: 1n,
			[entityFieldAddressKey(EntityType.TonNftItem, [], '$collection')]: {
				[EntityMetaKey.Selector]: {
					$network: network,
					collectionAddress: `0:${'f'.repeat(64)}`,
				},
			},
		}))
		expect(item[EntityMetaKey.Selector]).toEqual({
			$network: network,
			itemAddress: `0:${'d'.repeat(64)}`,
		})
		expect(item[EntityMetaKey.Fields][
			entityFieldAddressKey(EntityType.TonNftItem, [], '$$timestamps')
		][0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'ownerAddress')]: `0:${'b'.repeat(64)}`,
			[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'initialized')]: true,
			[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'metadataUri')]: 'ipfs://item',
			[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'content')]: {
				uri: 'ipfs://item',
			},
			[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'codeHash')]: 'e'.repeat(64),
			[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'dataHash')]: 'a'.repeat(64),
			[entityFieldAddressKey(EntityType.TonNftItem_Timestamp, [], 'lastTransactionLt')]: 9_007_199_254_740_998n,
		})
		expect(item[EntityMetaKey.Fields]).not.toHaveProperty('onSale')
		expect(item[EntityMetaKey.Fields]).not.toHaveProperty('saleContractAddress')
	})
})
