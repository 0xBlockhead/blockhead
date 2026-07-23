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
import { StarknetAccount_TimestampSelector } from '$/schema/StarknetAccount_Timestamp.ts'
import { StarknetContractSelector } from '$/schema/StarknetContract.ts'
import { Source } from '$/sources/Source.ts'
import type { StarknetEvent } from '$/sources/Starknet/JsonRpc/types.ts'

const getBlockHashAndNumber = vi.fn()
const getClassHashAt = vi.fn()
const getEvents = vi.fn()
const getNonce = vi.fn()

vi.mock('$/sources/Starknet/JsonRpc/queries.ts', () => ({
	getBlockHashAndNumber,
	getClassHashAt,
	getEvents,
	getNonce,
}))

const { default: starknetJsonRpc } = await import('$/resolvers/Starknet-JsonRpc.ts')

const contract = {
	$network: {
		$network: {
			caip2: networkBySlug.starknet.caip2,
		},
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
} satisfies StarknetEvent

describe('Starknet JSON-RPC account resolver', () => {
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
	})

	it('materializes the latest accepted contract state and exact historical state', async () => {
		const relationshipResolver = starknetJsonRpc.resolvers[0]
		const snapshot = await relationshipResolver.resolve[
			StarknetContractSelector.NetworkAddress
		].resolve(contract, context)
		const rows = relationshipResolver.projections.$$accountStates(snapshot, contract, context)

		expect(rows).toEqual([{
			[EntityMetaKey.Selector]: {
				$contract: contract,
				blockNumber: 900_000n,
				source: Source.Starknet_JsonRpc,
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
			source: Source.Starknet_JsonRpc,
			fieldDefinition,
			value: rows,
		})).toHaveLength(1)

		const stateResolver = starknetJsonRpc.resolvers[1]
		const state = await stateResolver.resolve[
			StarknetAccount_TimestampSelector.ContractBlockNumberSource
		].resolve({
			$contract: contract,
			blockNumber: 899_999n,
			source: Source.Starknet_JsonRpc,
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
			expect.anything(),
			{ block_number: 899_999 },
			contract.address
		)
	})

	it('materializes emitted events with canonical transaction and contract identities', async () => {
		const relationshipResolver = starknetJsonRpc.resolvers[2]
		const chunk = await relationshipResolver.resolve[
			StarknetContractSelector.NetworkAddress
		].resolve(contract, context)
		const rows = relationshipResolver.projections.$$events.select(chunk, contract, context)

		expect(getEvents).toHaveBeenCalledWith(
			expect.anything(),
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
			source: Source.Starknet_JsonRpc,
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
			StarknetContractSelector.NetworkAddress
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
		await expect(starknetJsonRpc.resolvers[0].resolve[
			StarknetContractSelector.NetworkAddress
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
		const chunk = await starknetJsonRpc.resolvers[2].resolve[
			StarknetContractSelector.NetworkAddress
		].resolve(contract, context)
		expect(() => starknetJsonRpc.resolvers[2].projections.$$events.select(
			chunk,
			contract,
			context
		)).toThrow('event response does not match the contract')
	})
})
