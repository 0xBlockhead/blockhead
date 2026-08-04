import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getAddressSummary,
	getAddressTransactions,
	getContractEvents,
} = vi.hoisted(() => ({
	getAddressSummary: vi.fn(),
	getAddressTransactions: vi.fn(),
	getContractEvents: vi.fn(),
}))

vi.mock('$/sources/Starkscan/Rest/queries.ts', () => ({
	getAddressSummary,
	getAddressTransactions,
	getContractEvents,
}))

const { default: starkscanResolvers } = await import('$/resolvers/Starkscan.ts')
const accountStatesResolver = starkscanResolvers.resolvers.find((resolver) => (
	'$$accountStates' in resolver.projections
))
const eventsResolver = starkscanResolvers.resolvers.find((resolver) => (
	'$$events' in resolver.projections
))
const transactionsResolver = starkscanResolvers.resolvers.find((resolver) => (
	'$$transactions' in resolver.projections
))

if (accountStatesResolver == null)
	throw new Error('Starkscan spec missing contract account states resolver')
if (eventsResolver == null)
	throw new Error('Starkscan spec missing contract events resolver')
if (transactionsResolver == null)
	throw new Error('Starkscan spec missing contract transactions resolver')


const contract = {
	$network: {
		$network: {
			caip2: networkBySlug.starknet.caip2,
		},
	},
	address: '0x0001',
}
const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
	providerContinuationToken: 'opaque:current+cursor',
}
const transactions = [
	{
		blockNumber: 100,
		timestampIso: '2026-07-15T12:00:00Z',
		txIndex: 2,
		txHash: '0x00abc',
		kinds: ['invoke'],
		counterparty: '0x2',
		txType: 'INVOKE',
		executionStatus: 'SUCCEEDED',
		finalityStatus: 'ACCEPTED_ON_L2',
		fromAddress: '0x01',
		toAddress: '0x2',
		primaryMethod: 'transfer',
		callCount: 1,
		methodsDiffer: false,
		transferCount: 1,
		topTransferTokenAddress: '0x3',
		topTransferAmount: '4',
		topTransferStandard: 'ERC20',
	},
	{
		blockNumber: 99,
		timestampIso: null,
		txIndex: 5,
		txHash: '0xdef',
		kinds: ['declare'],
		counterparty: null,
		txType: null,
		executionStatus: null,
		finalityStatus: null,
		fromAddress: '0x2',
		toAddress: '0x01',
		primaryMethod: null,
		callCount: null,
		methodsDiffer: null,
		transferCount: null,
		topTransferTokenAddress: null,
		topTransferAmount: null,
		topTransferStandard: null,
	},
]
const events = [
	{
		blockNumber: 100,
		timestampIso: '2026-07-15T12:00:00Z',
		txHash: '0x00abc',
		txIndex: 2,
		logIndex: 1,
		address: '0x01',
		keys: ['0x11'],
		topic0: '0x11',
		topic1: null,
		topic2: null,
		topic3: null,
		data: ['0x22'],
		decodingStatus: 'unknown',
	},
]

describe('Starkscan contract resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('declares Starknet mainnet applicability and exact source authority', () => {
		expect(transactionsResolver.resolve[
			'NetworkAddress'
		].appliesTo).toEqual([
			{
				$network: {
					$network: {
						caip2: networkBySlug.starknet.caip2,
					},
				},
			},
			{
				$network: {
					$network: {
						slug: networkBySlug.starknet.slug,
					},
				},
			},
		])
		expect(starkscanResolvers.source).toBe(Source.Starkscan)
	})

	it('projects account states from certified class or not-deployed summaries', async () => {
		getAddressSummary.mockResolvedValueOnce({
			address: '0x1',
			totalActivityCount: 3,
			latestActivityBlock: 100,
			classHash: '0x0abc',
			contractExistence: null,
		})
		const foundSummary = await accountStatesResolver.resolve[
			'NetworkAddress'
		].resolve(contract, resolverContext)
		const accountStates = accountStatesResolver.projections.$$accountStates
		if (typeof accountStates !== 'function')
			throw new Error('Starkscan spec missing account state projection')
		expect(accountStates(foundSummary, contract, resolverContext)).toEqual([{
			[EntityMetaKey.Selector]: {
				$contract: contract,
				blockNumber: 100n,
				source: Source.Starkscan,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'classHash')]: '0xabc',
				[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'found')]: true,
			},
		}])

		getAddressSummary.mockResolvedValueOnce({
			address: '0x1',
			totalActivityCount: 0,
			latestActivityBlock: null,
			classHash: null,
			contractExistence: {
				status: 'not_deployed',
				reasonCode: 'contract_not_found',
				evidenceSource: 'finalized_class_hash_at',
				observedBlockNumber: 42,
				observedBlockHash: '0xdead',
				expiresAtIso: '2026-07-15T12:00:00Z',
			},
		})
		const missingSummary = await accountStatesResolver.resolve[
			'NetworkAddress'
		].resolve(contract, resolverContext)
		expect(accountStates(missingSummary, contract, resolverContext)).toEqual([{
			[EntityMetaKey.Selector]: {
				$contract: contract,
				blockNumber: 42n,
				source: Source.Starkscan,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'found')]: false,
			},
		}])
		expect(getAddressSummary).toHaveBeenCalledWith('0x1')
	})

	it('projects contract events with opaque continuation', async () => {
		getContractEvents.mockResolvedValueOnce({
			items: events,
			nextCursor: '99:0:0',
			eventDecodingDegraded: false,
		})
		const page = await eventsResolver.resolve[
			'NetworkAddress'
		].resolve(contract, {
			...resolverContext,
			providerContinuationToken: '100:2:1',
		})
		const projection = eventsResolver.projections.$$events
		if (typeof projection === 'function')
			throw new Error('Starkscan spec missing event pagination')
		expect(getContractEvents).toHaveBeenCalledWith(
			{
				address: '0x1',
				limit: 2,
				cursor: '100:2:1',
			}
		)
		expect(projection.select(page, contract, resolverContext)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: contract.$network,
					transactionHash: '0xabc',
				},
				eventIndex: 1,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetEvent, [], '$fromContract')]: {
					[EntityMetaKey.Selector]: contract,
				},
				[entityFieldAddressKey(EntityType.StarknetEvent, [], 'keys')]: ['0x11'],
				[entityFieldAddressKey(EntityType.StarknetEvent, [], 'data')]: ['0x22'],
			},
		}])
		expect(projection.continuation(page, contract, resolverContext)).toEqual({
			operation: 'contract-events',
			target: contract.address,
			terminal: false,
			token: '99:0:0',
		})
	})

	it('preserves provider order, canonical identity, provenance, and opaque continuation', async () => {
		getAddressTransactions.mockResolvedValueOnce({
			items: transactions,
			nextCursor: 'opaque:next+cursor',
		})

		const page = await transactionsResolver.resolve[
			'NetworkAddress'
		].resolve(contract, resolverContext)
		const projection = transactionsResolver.projections.$$transactions
		if (typeof projection === 'function')
			throw new Error('Starkscan spec missing transaction pagination')
		const projected = projection.select(page, contract, resolverContext)

		expect(getAddressTransactions).toHaveBeenCalledWith(
			{
				address: '0x1',
				limit: 2,
				cursor: 'opaque:current+cursor',
			}
		)
		expect(projected.map((transaction) => transaction[EntityMetaKey.Selector])).toEqual([
			{
				$network: contract.$network,
				transactionHash: '0xabc',
			},
			{
				$network: contract.$network,
				transactionHash: '0xdef',
			},
		])
		expect(projected[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.StarknetTransaction, [], 'transactionKind')]: 'INVOKE',
			[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$block')]: {
				[EntityMetaKey.Selector]: {
					$network: contract.$network,
					blockNumber: 100n,
				},
			},
			[entityFieldAddressKey(EntityType.StarknetTransaction, [], 'senderAddress')]: '0x1',
			[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$senderContract')]: {
				[EntityMetaKey.Selector]: contract,
			},
			[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: contract.$network,
						transactionHash: '0xabc',
					},
					timestampMs: 1_784_116_800_000,
					source: Source.Starkscan,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'blockNumber')]: 100n,
					[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'finalityStatus')]: 'ACCEPTED_ON_L2',
					[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'executionStatus')]: 'SUCCEEDED',
				},
			}],
		})
		expect(projection.continuation(page, contract, resolverContext)).toEqual({
			operation: 'contract-transactions',
			target: contract.address,
			terminal: false,
			token: 'opaque:next+cursor',
		})
	})

	it('terminates empty pages and fails before transport for foreign networks', async () => {
		getAddressTransactions.mockResolvedValueOnce({
			items: [],
			nextCursor: null,
		})
		const page = await transactionsResolver.resolve[
			'NetworkAddress'
		].resolve(contract, {
			...resolverContext,
			pagination: {
				limit: 0,
			},
			providerContinuationToken: undefined,
		})
		const projection = transactionsResolver.projections.$$transactions
		if (typeof projection === 'function')
			throw new Error('Starkscan spec missing transaction continuation')
		expect(projection.continuation(page, contract, resolverContext)).toEqual({
			operation: 'contract-transactions',
			target: contract.address,
			terminal: true,
		})

		await expect(transactionsResolver.resolve[
			'NetworkAddress'
		].resolve({
			...contract,
			$network: {
				$network: {
					slug: 'not-starknet',
				},
			},
		}, resolverContext)).rejects.toThrow('unsupported network')
		expect(getAddressTransactions).toHaveBeenCalledTimes(1)
	})
})
