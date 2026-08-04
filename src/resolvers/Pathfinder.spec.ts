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
const getBlockWithTxHashes = vi.fn()
const getChainId = vi.fn()
const getClassHashAt = vi.fn()
const getEvents = vi.fn()
const getNonce = vi.fn()
const getSpecVersion = vi.fn()
const getStorageAt = vi.fn()
const getSyncing = vi.fn()
const getTransactionByHash = vi.fn()
const getTransactionReceipt = vi.fn()

vi.mock('$/sources/Pathfinder/JsonRpc/queries.ts', () => ({
	default: {
		getBlockHashAndNumber,
		getBlockWithTxHashes,
		getChainId,
		getClassHashAt,
		getEvents,
		getNonce,
		getSpecVersion,
		getStorageAt,
		getSyncing,
		getTransactionByHash,
		getTransactionReceipt,
	},
}))

const { default: pathfinder } = await import('$/resolvers/Pathfinder.ts')

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
		getStorageAt.mockResolvedValue('0x55')
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
			events: [event],
			block_hash: '0xb10c',
			block_number: 900_000,
		})
	})

	it('materializes network head observations from chain + sync RPCs', async () => {
		const networkResolver = pathfinder.resolvers[0]
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

	it('materializes blocks and transactions with schema-shaped fields', async () => {
		const blockResolver = pathfinder.resolvers[1]
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

		const transactionResolver = pathfinder.resolvers[2]
		const transaction = await transactionResolver.resolve.NetworkTransactionHash.resolve({
			$network: contract.$network,
			transactionHash: '0x4',
		}, context)

		expect(transaction).toMatchObject({
			transactionKind: 'INVOKE',
			senderAddress: '0xabc',
			nonce: '0x7',
			maxFee: undefined,
		})
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

	it('materializes the latest accepted contract state and exact historical state', async () => {
		const relationshipResolver = pathfinder.resolvers[3]
		const snapshot = await relationshipResolver.resolve[
			'NetworkAddress'
		].resolve(contract, context)
		const rows = relationshipResolver.projections.$$accountStates(snapshot, contract, context)

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

		const stateResolver = pathfinder.resolvers[4]
		const state = await stateResolver.resolve[
			'ContractBlockNumberSource'
		].resolve({
			$contract: contract,
			blockNumber: 899_999n,
			source: Source.Pathfinder,
		}, context)
		expect(stateResolver.projections).toMatchObject({
			nonce: expect.any(Function),
			classHash: expect.any(Function),
			found: expect.any(Function),
		})
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
		const storageResolver = pathfinder.resolvers[5]
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

		const observationResolver = pathfinder.resolvers[6]
		const observation = await observationResolver.resolve.EntryBlockNumberSource.resolve({
			$entry: entry,
			blockNumber: 899_999n,
			source: Source.Pathfinder,
		}, context)
		expect(observation).toEqual({
			value: '0x55',
			blockHash: '0xb10c',
		})
		expect(getStorageAt).toHaveBeenLastCalledWith(
			contract.address,
			'0x1',
			{ block_number: 899_999 }
		)
	})

	it('materializes emitted events with canonical transaction and contract identities', async () => {
		const relationshipResolver = pathfinder.resolvers[7]
		const chunk = await relationshipResolver.resolve[
			'NetworkAddress'
		].resolve(contract, context)
		const rows = relationshipResolver.projections.$$events.select(chunk, contract, context)

		expect(getEvents).toHaveBeenCalledWith(
			{
				address: contract.address,
				chunk_size: 2,
			}
		)
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
		expect(relationshipResolver.projections.$$events.continuation(
			chunk,
			contract,
			context
		)).toEqual({
			operation: 'contract-events',
			target: contract.address,
			terminal: false,
			token: 'next-page',
		})

		getEvents.mockResolvedValueOnce({
			events: [],
		})
		const emptyChunk = await relationshipResolver.resolve[
			'NetworkAddress'
		].resolve(contract, context)
		expect(relationshipResolver.projections.$$events.select(
			emptyChunk,
			contract,
			context
		)).toEqual([])
		expect(relationshipResolver.projections.$$events.continuation(
			emptyChunk,
			contract,
			context
		)).toMatchObject({
			terminal: true,
		})
	})

	it('rejects cross-network subjects and provider rows that escape the address filter', async () => {
		await expect(pathfinder.resolvers[3].resolve[
			'NetworkAddress'
		].resolve({
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
		const chunk = await pathfinder.resolvers[7].resolve[
			'NetworkAddress'
		].resolve(contract, context)
		expect(() => pathfinder.resolvers[7].projections.$$events.select(
			chunk,
			contract,
			context
		)).toThrow('event response does not match the contract')
	})
})
