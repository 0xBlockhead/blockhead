import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	materializeResolverOutput,
	ResolverOutputMaterialization,
} from '$/collections/assertLoadedCollectionRows.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	entitySelectorKey,
	indexSchema,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { Event } from '$/sources/_shared/interfaces/StarknetJsonRpc/types.ts'

const getBlockHashAndNumber = vi.fn()
const getBlockTransactionCount = vi.fn()
const getBlockWithTxHashes = vi.fn()
const getChainId = vi.fn()
const getClass = vi.fn()
const getClassHashAt = vi.fn()
const getEvents = vi.fn()
const getNonce = vi.fn()
const getSpecVersion = vi.fn()
const getStorageAt = vi.fn()
const getSyncing = vi.fn()
const getTransactionByBlockIdAndIndex = vi.fn()
const getTransactionByHash = vi.fn()
const getTransactionReceipt = vi.fn()

vi.mock('$/sources/Pathfinder/JsonRpc/queries.ts', () => ({
	default: {
		getBlockHashAndNumber,
		getBlockTransactionCount,
		getBlockWithTxHashes,
		getChainId,
		getClass,
		getClassHashAt,
		getEvents,
		getNonce,
		getSpecVersion,
		getStorageAt,
		getSyncing,
		getTransactionByBlockIdAndIndex,
		getTransactionByHash,
		getTransactionReceipt,
	},
}))

const { default: pathfinder } = await import('$/resolvers/Pathfinder.ts')

const networkResolver = pathfinder.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetNetwork
	&& 'chainId' in resolver.projections
))
const networkBlocksResolver = pathfinder.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetNetwork
	&& '$$blocks' in resolver.projections
))
const networkTransactionsResolver = pathfinder.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetNetwork
	&& '$$transactions' in resolver.projections
))
const blockResolver = pathfinder.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetBlock
))
const transactionResolver = pathfinder.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetTransaction
))
const classResolver = pathfinder.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetClass
))
const contractAccountResolver = pathfinder.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetContract
	&& '$$accountStates' in resolver.projections
))
const accountTimestampResolver = pathfinder.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetAccount_Timestamp
))
const storageResolver = pathfinder.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetStorageEntry
))
const storageTimestampResolver = pathfinder.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetStorageEntry_Timestamp
))
const contractEventsResolver = pathfinder.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetContract
	&& '$$events' in resolver.projections
))

if (
	networkResolver == null
	|| networkBlocksResolver == null
	|| networkTransactionsResolver == null
	|| blockResolver == null
	|| transactionResolver == null
	|| classResolver == null
	|| contractAccountResolver == null
	|| accountTimestampResolver == null
	|| storageResolver == null
	|| storageTimestampResolver == null
	|| contractEventsResolver == null
)
	throw new Error('Pathfinder spec missing deepened resolvers')

const network = {
	$network: {
		caip2: networkBySlug.starknet.caip2,
	},
}

const contract = {
	$network: {
		$network: network.$network,
	},
	address: '0xabc',
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
}

const event = {
	from_address: contract.address,
	keys: ['0x1'],
	data: ['0x2'],
	block_hash: '0x3',
	block_number: 900_000,
	transaction_hash: '0x4',
	transaction_index: 5,
	event_index: 1,
} satisfies Event

const receiptEvent = {
	from_address: contract.address,
	keys: ['0x1'],
	data: ['0x2'],
}

const blockWire = {
	status: 'ACCEPTED_ON_L2',
	block_hash: '0xb10c',
	parent_hash: '0xb109',
	block_number: 900_000,
	new_root: '0x99',
	timestamp: 1_700_000_000,
	sequencer_address: '0x5e9',
	l1_gas_price: {
		price_in_wei: '0x11',
		price_in_fri: '0x12',
	},
	l1_data_gas_price: {
		price_in_wei: '0x21',
		price_in_fri: '0x22',
	},
	transactions: ['0x4'],
}

describe('Pathfinder Starknet JSON-RPC account resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getBlockHashAndNumber.mockResolvedValue({
			block_hash: '0xabc',
			block_number: 900_000,
		})
		getNonce.mockResolvedValue('0x7')
		getClassHashAt.mockResolvedValue('0x123')
		getEvents.mockResolvedValue({
			events: [event],
			continuation_token: 'next-page',
		})
		getChainId.mockResolvedValue('0x534e5f4d41494e')
		getSyncing.mockResolvedValue(false)
		getSpecVersion.mockResolvedValue('0.10.2')
		getBlockWithTxHashes.mockResolvedValue(blockWire)
		getBlockTransactionCount.mockResolvedValue(2)
		getStorageAt.mockResolvedValue('0x55')
		getClass.mockResolvedValue({
			sierra_program: ['0x1'],
			contract_class_version: '0.1.0',
			entry_points_by_type: {
				CONSTRUCTOR: [],
				EXTERNAL: [],
				L1_HANDLER: [],
			},
		})
		getTransactionByBlockIdAndIndex.mockResolvedValue({
			transaction_hash: '0x4',
			type: 'INVOKE',
		})
		getTransactionByHash.mockResolvedValue({
			transaction_hash: '0x4',
			type: 'INVOKE',
			sender_address: '0xabc',
			nonce: '0x7',
			version: '0x3',
			calldata: ['0x1'],
			signature: ['0x2'],
			resource_bounds: {
				l1_gas: {
					max_amount: '0x1',
					max_price_per_unit: '0x2',
				},
			},
		})
		getTransactionReceipt.mockResolvedValue({
			transaction_hash: '0x4',
			actual_fee: {
				amount: '0x3',
				unit: 'FRI',
			},
			finality_status: 'ACCEPTED_ON_L2',
			execution_status: 'SUCCEEDED',
			messages_sent: [{
				from_address: '0xabc',
				to_address: '0xeth',
				payload: [],
			}],
			events: [receiptEvent],
			block_hash: '0xb10c',
			block_number: 900_000,
		})
	})

	it('materializes network head observations from chain + sync RPCs', async () => {
		const snapshot = await networkResolver.resolve.Network.resolve(network, context)

		expect(snapshot.chainId).toBe('0x534e5f4d41494e')
		expect(snapshot.$$timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: 1_700_000_000_000,
				source: Source.Pathfinder,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'latestBlockNumber')]: 900_000n,
				[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'latestBlockHash')]: '0xb10c',
				[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'syncing')]: false,
				[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'protocolVersion')]: '0.10.2',
			},
		}])
		expect(getBlockWithTxHashes).toHaveBeenCalledWith('latest')
	})

	it('pages network blocks and transactions from Pathfinder head', async () => {
		getBlockWithTxHashes
			.mockResolvedValueOnce({
				...blockWire,
				block_number: 900_000,
			})
			.mockResolvedValueOnce({
				...blockWire,
				block_number: 899_999,
				block_hash: '0xb109',
				parent_hash: '0xb108',
				transactions: ['0x5'],
			})

		const blocksPage = await networkBlocksResolver.resolve.Network.resolve(network, context)
		const blocksProjection = networkBlocksResolver.projections.$$blocks
		if (typeof blocksProjection === 'function' || blocksProjection.select == null)
			throw new Error('missing network blocks projection')
		const blockRows = blocksProjection.select(blocksPage, network, context)
		expect(blockRows).toHaveLength(2)
		expect(blockRows[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: 900_000n,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetBlock, [], 'blockHash')]: '0xb10c',
			},
		})
		expect(blocksProjection.continuation?.(blocksPage, network, context)).toEqual({
			operation: 'network-blocks',
			terminal: false,
			token: '899998',
		})

		const transactionsPage = await networkTransactionsResolver.resolve.Network.resolve(network, context)
		const transactionsProjection = networkTransactionsResolver.projections.$$transactions
		if (typeof transactionsProjection === 'function' || transactionsProjection.select == null)
			throw new Error('missing network transactions projection')
		expect(transactionsProjection.select(transactionsPage, network, context)).toHaveLength(2)
		expect(transactionsProjection.select(transactionsPage, network, context)[0]).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				transactionHash: '0x4',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetTransaction, [], 'transactionKind')]: 'INVOKE',
				[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						blockNumber: 900_000n,
					},
				},
			},
		})
		expect(getTransactionByBlockIdAndIndex).toHaveBeenCalledWith(
			{ block_number: 900_000 },
			0
		)
		expect(getTransactionByBlockIdAndIndex).toHaveBeenCalledWith(
			{ block_number: 900_000 },
			1
		)
	})

	it('materializes blocks and transactions with schema-shaped fields and receipt events', async () => {
		const blockByNumber = await blockResolver.resolve.NetworkBlockNumber.resolve({
			$network: contract.$network,
			blockNumber: 900_000n,
		}, context)

		expect(blockByNumber).toMatchObject({
			blockNumber: 900_000n,
			blockHash: '0xb10c',
			parentHash: '0xb109',
			status: 'ACCEPTED_ON_L2',
			l1GasPrice: '0x11',
		})
		expect(blockByNumber.$$transactions).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: contract.$network,
				transactionHash: '0x4',
			},
		}])

		const transactionIdentity = {
			$network: contract.$network,
			transactionHash: '0x4',
		}
		const transaction = await transactionResolver.resolve.NetworkTransactionHash.resolve(
			transactionIdentity,
			context
		)

		expect(transaction).toMatchObject({
			transactionKind: 'INVOKE',
			senderAddress: '0xabc',
			nonce: '0x7',
			maxFee: undefined,
		})
		expect(transaction.$$events).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: transactionIdentity,
				eventIndex: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetEvent, [], '$fromContract')]: {
					[EntityMetaKey.Selector]: contract,
				},
				[entityFieldAddressKey(EntityType.StarknetEvent, [], 'keys')]: ['0x1'],
				[entityFieldAddressKey(EntityType.StarknetEvent, [], 'data')]: ['0x2'],
			},
		}])
		expect(transaction.$$timestamps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: contract.$network,
					transactionHash: '0x4',
				},
				timestampMs: 1_700_000_000_000,
				source: Source.Pathfinder,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'blockNumber')]: 900_000n,
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'finalityStatus')]: 'ACCEPTED_ON_L2',
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'executionStatus')]: 'SUCCEEDED',
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'actualFee')]: 3n,
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'eventsCount')]: 1,
			},
		})
		expect(getTransactionByHash).toHaveBeenCalledWith('0x4')
		expect(getTransactionReceipt).toHaveBeenCalledWith('0x4')
	})

	it('materializes sierra class definitions from starknet_getClass', async () => {
		const klass = {
			$network: contract.$network,
			classHash: '0x123',
		}
		const snapshot = await classResolver.resolve.NetworkClassHash.resolve(klass, context)
		expect(classResolver.projections.classHash(snapshot)).toBe('0x123')
		expect(classResolver.projections.contractClassVersion(snapshot)).toBe('0.1.0')
		expect(getClass).toHaveBeenCalledWith('latest', '0x123')
	})

	it('materializes the latest accepted contract state and exact historical state', async () => {
		const snapshot = await contractAccountResolver.resolve.NetworkAddress.resolve(contract, context)
		const rows = contractAccountResolver.projections.$$accountStates(snapshot, contract, context)

		expect(rows).toEqual([{
			[EntityMetaKey.Selector]: {
				$contract: contract,
				blockNumber: 900_000n,
				source: Source.Pathfinder,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'nonce')]: '0x7',
				[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'classHash')]: '0x123',
				[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'found')]: true,
			},
		}])
		const schemaIndex = indexSchema(schema)
		const fieldDefinition = schemaIndex.entityFieldDefinitionByEntityTypePathAndName[
			EntityType.StarknetContract
		][entityFieldAddressKey(EntityType.StarknetContract, [], '$$accountStates')]
		if (fieldDefinition == null)
			throw new Error('Starknet contract account states field definition missing')

		expect(materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema,
			schemaIndex,
			entityDefinition: schemaIndex.entityDefinitionByType[EntityType.StarknetContract],
			parentSelector: contract,
			parentSelectorKey: entitySelectorKey(
				schema,
				schemaIndex.entityDefinitionByType[EntityType.StarknetContract],
				contract
			),
			source: Source.Pathfinder,
			fieldDefinition,
			value: rows,
		})).toHaveLength(1)

		const state = await accountTimestampResolver.resolve.ContractBlockNumberSource.resolve({
			$contract: contract,
			blockNumber: 899_999n,
			source: Source.Pathfinder,
		}, context)
		expect(state).toEqual({
			nonce: '0x7',
			classHash: '0x123',
			found: true,
		})
		expect(getNonce).toHaveBeenLastCalledWith(
			{ block_number: 899_999 },
			contract.address
		)
	})

	it('materializes storage observations at accepted block heights', async () => {
		const entry = {
			$contract: contract,
			storageKey: '0x1',
		}
		const snapshot = await storageResolver.resolve.ContractStorageKey.resolve(entry, context)

		expect(snapshot.$$timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$entry: entry,
				blockNumber: 900_000n,
				source: Source.Pathfinder,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetStorageEntry_Timestamp, [], 'value')]: '0x55',
				[entityFieldAddressKey(EntityType.StarknetStorageEntry_Timestamp, [], 'blockHash')]: '0xb10c',
			},
		}])

		const observation = await storageTimestampResolver.resolve.EntryBlockNumberSource.resolve({
			$entry: entry,
			blockNumber: 899_999n,
			source: Source.Pathfinder,
		}, context)
		expect(observation).toEqual({
			value: '0x55',
			blockHash: '0xb10c',
		})
	})

	it('materializes emitted events with canonical transaction and contract identities', async () => {
		const chunk = await contractEventsResolver.resolve.NetworkAddress.resolve(contract, context)
		const rows = contractEventsResolver.projections.$$events.select(chunk, contract, context)

		expect(getEvents).toHaveBeenCalledWith({
			address: contract.address,
			chunk_size: 2,
		})
		expect(rows[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: contract.$network,
					transactionHash: event.transaction_hash,
				},
				eventIndex: event.event_index,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetEvent, [], '$fromContract')]: {
					[EntityMetaKey.Selector]: contract,
				},
				[entityFieldAddressKey(EntityType.StarknetEvent, [], 'keys')]: event.keys,
				[entityFieldAddressKey(EntityType.StarknetEvent, [], 'data')]: event.data,
			},
		})
		const schemaIndex = indexSchema(schema)
		const fieldDefinition = schemaIndex.entityFieldDefinitionByEntityTypePathAndName[
			EntityType.StarknetContract
		][entityFieldAddressKey(EntityType.StarknetContract, [], '$$events')]
		if (fieldDefinition == null)
			throw new Error('Starknet contract events field definition missing')

		expect(materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema,
			schemaIndex,
			entityDefinition: schemaIndex.entityDefinitionByType[EntityType.StarknetContract],
			parentSelector: contract,
			parentSelectorKey: entitySelectorKey(
				schema,
				schemaIndex.entityDefinitionByType[EntityType.StarknetContract],
				contract
			),
			source: Source.Pathfinder,
			fieldDefinition,
			value: rows,
		})).toHaveLength(1)
	})

	it('rejects cross-network subjects and provider rows that escape the address filter', async () => {
		await expect(contractAccountResolver.resolve.NetworkAddress.resolve({
			...contract,
			$network: {
				$network: {
					slug: 'ethereum',
				},
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(getBlockHashAndNumber).not.toHaveBeenCalled()

		getEvents.mockResolvedValueOnce({
			events: [{
				...event,
				from_address: '0xdef',
			}],
		})
		const chunk = await contractEventsResolver.resolve.NetworkAddress.resolve(contract, context)
		expect(() => contractEventsResolver.projections.$$events.select(
			chunk,
			contract,
			context
		)).toThrow('event response does not match the contract')
	})
})
