import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { StarknetContractSelector } from '$/schema/StarknetContract.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'

const { getAddressTransactions } = vi.hoisted(() => ({
	getAddressTransactions: vi.fn(),
}))

vi.mock('$/sources/Starkscan/Rest/queries.ts', () => ({
	getAddressTransactions,
}))

const { default: starkscanResolvers } = await import('$/resolvers/Starkscan-Rest.ts')
const transactionsResolver = starkscanResolvers.resolvers.find((resolver) => (
	'$$transactions' in resolver.projections
))

if (transactionsResolver == null)
	throw new Error('Starkscan-Rest spec missing contract transactions resolver')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => candidate.source === Source.Starkscan_Rest)

if (binding == null)
	throw new Error('Starkscan-Rest spec missing source binding')

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

describe('Starkscan contract transaction resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('declares Starknet mainnet applicability and exact source authority', () => {
		expect(transactionsResolver.resolve[
			StarknetContractSelector.NetworkAddress
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
		expect(starkscanResolvers.source).toBe(Source.Starkscan_Rest)
	})

	it('preserves provider order, canonical identity, provenance, and opaque continuation', async () => {
		getAddressTransactions.mockResolvedValueOnce({
			items: transactions,
			nextCursor: 'opaque:next+cursor',
		})

		const page = await transactionsResolver.resolve[
			StarknetContractSelector.NetworkAddress
		].resolve(contract, resolverContext)
		const projection = transactionsResolver.projections.$$transactions
		if (typeof projection === 'function')
			throw new Error('Starkscan-Rest spec missing transaction pagination')
		const projected = projection.select(page, contract, resolverContext)

		expect(getAddressTransactions).toHaveBeenCalledWith(
			binding,
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
					source: Source.Starkscan_Rest,
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
			StarknetContractSelector.NetworkAddress
		].resolve(contract, {
			...resolverContext,
			pagination: {
				limit: 0,
			},
			providerContinuationToken: undefined,
		})
		const projection = transactionsResolver.projections.$$transactions
		if (typeof projection === 'function')
			throw new Error('Starkscan-Rest spec missing transaction continuation')
		expect(projection.continuation(page, contract, resolverContext)).toEqual({
			operation: 'contract-transactions',
			target: contract.address,
			terminal: true,
		})

		await expect(transactionsResolver.resolve[
			StarknetContractSelector.NetworkAddress
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
