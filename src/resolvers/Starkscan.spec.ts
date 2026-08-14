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
	getBlock,
	getClass,
	getContractEvents,
	getExactTokenHoldings,
	getTransaction,
} = vi.hoisted(() => ({
	getAddressSummary: vi.fn(),
	getAddressTransactions: vi.fn(),
	getBlock: vi.fn(),
	getClass: vi.fn(),
	getContractEvents: vi.fn(),
	getExactTokenHoldings: vi.fn(),
	getTransaction: vi.fn(),
}))

vi.mock('$/sources/Starkscan/Rest/queries.ts', () => ({
	getAddressSummary,
	getAddressTransactions,
	getBlock,
	getClass,
	getContractEvents,
	getExactTokenHoldings,
	getTransaction,
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
	&& 'NetworkAddress' in resolver.resolve
))
const tokenHoldingsResolver = starkscanResolvers.resolvers.find((resolver) => (
	'$$tokenHoldings' in resolver.projections
))
const tokenHoldingResolver = starkscanResolvers.resolvers.find((resolver) => (
	'OwnerTokenContract' in resolver.resolve
))
const blockResolver = starkscanResolvers.resolvers.find((resolver) => (
	'NetworkBlockNumber' in resolver.resolve
))
const transactionResolver = starkscanResolvers.resolvers.find((resolver) => (
	'NetworkTransactionHash' in resolver.resolve
))
const classResolver = starkscanResolvers.resolvers.find((resolver) => (
	'NetworkClassHash' in resolver.resolve
	&& 'classHash' in resolver.projections
))
const classContractCountResolver = starkscanResolvers.resolvers.find((resolver) => (
	'NetworkClassHash' in resolver.resolve
	&& '$$contracts' in resolver.projections
	&& typeof resolver.projections.$$contracts === 'object'
	&& resolver.projections.$$contracts != null
	&& 'resolveCount' in resolver.projections.$$contracts
))

if (accountStatesResolver == null)
	throw new Error('Starkscan spec missing contract account states resolver')
if (eventsResolver == null)
	throw new Error('Starkscan spec missing contract events resolver')
if (transactionsResolver == null)
	throw new Error('Starkscan spec missing contract transactions resolver')
if (tokenHoldingsResolver == null)
	throw new Error('Starkscan spec missing contract token holdings resolver')
if (tokenHoldingResolver == null)
	throw new Error('Starkscan spec missing token holding resolver')
if (blockResolver == null)
	throw new Error('Starkscan spec missing block resolver')
if (transactionResolver == null)
	throw new Error('Starkscan spec missing transaction resolver')
if (classResolver == null)
	throw new Error('Starkscan spec missing class resolver')
if (classContractCountResolver == null)
	throw new Error('Starkscan spec missing class contract count resolver')


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
const tokenHoldings = {
	chainId: 'SN_MAIN',
	ownerAddress: '0x1',
	items: [{
		tokenAddress: '0x03',
		normalizedTokenAddress: '0x3',
		indexedBalanceRaw: '340282366920938463463374607431768211455',
		symbol: 'STRK',
		name: 'Starknet Token',
		decimals: 18,
	}],
	exact: true,
	truncated: false,
	completeness: {
		exact: true,
		truncated: false,
		complete: true,
		reasonCode: 'complete',
		reason: 'Complete indexed holdings',
		lagBlocks: 0,
		capped: false,
		cap: null,
	},
	fetchedAtMs: 1_784_116_800_000,
}

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
		expect(starkscanResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.StarknetTokenHolding_Timestamp
		))).toBe(false)
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

	it('projects exact owner holdings with one fetched-at observation per token', async () => {
		getExactTokenHoldings.mockResolvedValueOnce(tokenHoldings)
		const holdings = await tokenHoldingsResolver.resolve[
			'NetworkAddress'
		].resolve(contract, {
			...resolverContext,
			providerContinuationToken: undefined,
		})
		expect(getExactTokenHoldings).toHaveBeenCalledWith('0x1')
		expect(tokenHoldingsResolver.projections.$$tokenHoldings.select(
			holdings,
			contract,
			resolverContext
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				$owner: contract,
				$tokenContract: {
					$network: contract.$network,
					address: '0x3',
				},
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetTokenHolding, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$holding: {
							$owner: contract,
							$tokenContract: {
								$network: contract.$network,
								address: '0x3',
							},
						},
						timestampMs: 1_784_116_800_000,
						source: Source.Starkscan,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.StarknetTokenHolding_Timestamp, [], 'indexedBalanceRaw')]: 340282366920938463463374607431768211455n,
						[entityFieldAddressKey(EntityType.StarknetTokenHolding_Timestamp, [], 'symbol')]: 'STRK',
						[entityFieldAddressKey(EntityType.StarknetTokenHolding_Timestamp, [], 'name')]: 'Starknet Token',
						[entityFieldAddressKey(EntityType.StarknetTokenHolding_Timestamp, [], 'decimals')]: 18,
					},
				}],
			},
		}])
		expect(tokenHoldingsResolver.projections.$$tokenHoldings.resolveCount(holdings)).toBe(1)
		expect(tokenHoldingsResolver.projections.$$tokenHoldings.continuation(holdings)).toEqual({
			operation: 'contract-token-holdings',
			target: 'starkscan',
			terminal: true,
		})
	})

	it('resolves one stable holding and rejects missing or foreign identities', async () => {
		const holding = {
			$owner: contract,
			$tokenContract: {
				$network: contract.$network,
				address: '0x03',
			},
		}
		getExactTokenHoldings.mockResolvedValueOnce(tokenHoldings)
		const snapshot = await tokenHoldingResolver.resolve[
			'OwnerTokenContract'
		].resolve(holding, resolverContext)
		expect(tokenHoldingResolver.projections.$$timestamps(
			snapshot,
			holding,
			resolverContext
		)[0][EntityMetaKey.Selector]).toEqual({
			$holding: holding,
			timestampMs: 1_784_116_800_000,
			source: Source.Starkscan,
		})

		getExactTokenHoldings.mockResolvedValueOnce(tokenHoldings)
		await expect(tokenHoldingResolver.resolve[
			'OwnerTokenContract'
		].resolve({
			...holding,
			$tokenContract: {
				...holding.$tokenContract,
				address: '0x4',
			},
		}, resolverContext)).rejects.toThrow('token holding was not found')

		await expect(tokenHoldingResolver.resolve[
			'OwnerTokenContract'
		].resolve({
			...holding,
			$tokenContract: {
				$network: {
					$network: {
						slug: 'not-starknet',
					},
				},
				address: '0x3',
			},
		}, resolverContext)).rejects.toThrow('unsupported network')
		expect(getExactTokenHoldings).toHaveBeenCalledTimes(2)
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

describe('Starkscan block transaction and class resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('projects block snapshots with canonical transaction provenance', async () => {
		getBlock.mockResolvedValueOnce({
			chainId: 'SN_MAIN',
			blockNumber: 100,
			blockHash: '0x0abc',
			parentHash: '0xdef',
			timestampIso: '2026-07-15T12:00:00Z',
			txCount: 1,
			rawObjectKey: 'block:100',
			stateRoot: '0x11',
			sequencerAddress: '0x22',
			l1DataAvailabilityMode: null,
			starknetVersion: '0.13.2',
			l1GasPrice: {
				priceInWei: '1',
				priceInFri: null,
			},
			l2GasPrice: null,
			l1DataGasPrice: null,
			transactions: [{
				txHash: '0x00abc',
				txIndex: 0,
				txCursor: '100:0',
				fromAddress: '0x01',
				toAddress: '0x2',
				executionStatus: 'SUCCEEDED',
				finalityStatus: 'ACCEPTED_ON_L2',
			}],
		})
		const network = {
			$network: {
				caip2: networkBySlug.starknet.caip2,
			},
		}
		const snapshot = await blockResolver.resolve[
			'NetworkBlockNumber'
		].resolve({
			$network: network,
			blockNumber: 100n,
		}, resolverContext)
		expect(getBlock).toHaveBeenCalledWith('100')
		expect(blockResolver.projections.blockHash(snapshot, {
			$network: network,
			blockNumber: 100n,
		}, resolverContext)).toBe('0xabc')
		expect(blockResolver.projections.$$transactions.select(snapshot, {
			$network: network,
			blockNumber: 100n,
		}, resolverContext)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				transactionHash: '0xabc',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						blockNumber: 100n,
					},
				},
				[entityFieldAddressKey(EntityType.StarknetTransaction, [], 'senderAddress')]: '0x1',
				[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$senderContract')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: '0x1',
					},
				},
				[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: network,
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
			},
		}])
		expect(blockResolver.projections.$$transactions.resolveCount(snapshot)).toBe(1)
	})

	it('projects transaction detail with events and observation provenance', async () => {
		getTransaction.mockResolvedValueOnce({
			chainId: 'SN_MAIN',
			blockNumber: 100,
			timestampIso: '2026-07-15T12:00:00Z',
			txIndex: 2,
			txHash: '0x00abc',
			txCursor: '100:2',
			fromAddress: '0x01',
			toAddress: '0x2',
			executionStatus: 'SUCCEEDED',
			finalityStatus: 'ACCEPTED_ON_L2',
			txType: 'INVOKE',
			rawObjectKey: 'tx:0xabc',
			receipt: {
				executionStatus: 'SUCCEEDED',
				finalityStatus: 'ACCEPTED_ON_L2',
				gasUsed: '12',
				effectiveGasPrice: '3',
				revertReason: null,
			},
			logsTruncated: false,
			eventDecodingDegraded: false,
			logs: [{
				logIndex: 1,
				address: '0x01',
				keys: ['0x11'],
				topic0: '0x11',
				topic1: null,
				topic2: null,
				topic3: null,
				data: ['0x22'],
				decodingStatus: 'unknown',
			}],
			calldata: ['0x33'],
			tokenTransfers: [],
			messages: [],
			messagesCoverage: {
				status: 'exact',
				source: 'starknet_protocol_messages',
				reasonCode: 'no_matching_message_rows',
				message: 'No messages',
			},
			bridgeIntent: null,
		})
		const network = {
			$network: {
				caip2: networkBySlug.starknet.caip2,
			},
		}
		const snapshot = await transactionResolver.resolve[
			'NetworkTransactionHash'
		].resolve({
			$network: network,
			transactionHash: '0x00abc',
		}, resolverContext)
		expect(getTransaction).toHaveBeenCalledWith('0xabc')
		expect(transactionResolver.projections.transactionKind(snapshot, {
			$network: network,
			transactionHash: '0x00abc',
		}, resolverContext)).toBe('INVOKE')
		expect(transactionResolver.projections.$$events.select(snapshot, {
			$network: network,
			transactionHash: '0x00abc',
		}, resolverContext)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					transactionHash: '0xabc',
				},
				eventIndex: 1,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetEvent, [], '$fromContract')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: '0x1',
					},
				},
				[entityFieldAddressKey(EntityType.StarknetEvent, [], 'keys')]: ['0x11'],
				[entityFieldAddressKey(EntityType.StarknetEvent, [], 'data')]: ['0x22'],
			},
		}])
		expect(transactionResolver.projections.$$events.resolveCount(snapshot)).toBe(1)
		expect(transactionResolver.projections.$$timestamps.resolveCount(snapshot)).toBe(1)
	})

	it('projects class identity and paginated instances', async () => {
		getClass.mockResolvedValueOnce({
			class: {
				chainId: 'SN_MAIN',
				classHash: '0x0abc',
				classVersion: '0.1.0',
				compiledClassHash: '0x11',
				declarationTxHash: '0xdef',
				declaredAtBlock: 100,
			},
			instances: [{
				address: '0x01',
			}],
			nextInstanceCursor: '0x02',
		})
		const network = {
			$network: {
				caip2: networkBySlug.starknet.caip2,
			},
		}
		const klass = {
			$network: network,
			classHash: '0x0abc',
		}
		const snapshot = await classResolver.resolve[
			'NetworkClassHash'
		].resolve(klass, resolverContext)
		const projection = classResolver.projections.$$contracts
		if (typeof projection === 'function')
			throw new Error('Starkscan spec missing class instance pagination')
		expect(getClass).toHaveBeenCalledWith({
			classHash: '0xabc',
			limit: 2,
			cursor: 'opaque:current+cursor',
		})
		expect(classResolver.projections.classHash(snapshot, klass, resolverContext)).toBe('0xabc')
		expect(classResolver.projections.declaredAtBlockNumber(snapshot, klass, resolverContext)).toBe(100n)
		expect(projection.select(snapshot, klass, resolverContext)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				address: '0x1',
			},
		}])
		expect(projection.continuation(snapshot, klass, resolverContext)).toEqual({
			operation: 'class-instances',
			target: klass.classHash,
			terminal: false,
			token: '0x02',
		})
	})

	it('resolves indexed class association counts independently from instance pages', async () => {
		getClass.mockResolvedValueOnce({
			class: {
				chainId: 'SN_MAIN',
				classHash: '0x0abc',
				instanceCount: 12,
			},
			instances: [{
				address: '0x01',
			}],
			nextInstanceCursor: '0x02',
		})
		const klass = {
			$network: {
				$network: {
					caip2: networkBySlug.starknet.caip2,
				},
			},
			classHash: '0x0abc',
		}
		const count = await classContractCountResolver.resolve.NetworkClassHash.resolve(
			klass,
			resolverContext
		)

		expect(getClass).toHaveBeenCalledWith({
			classHash: '0xabc',
			limit: 1,
		})
		expect(classContractCountResolver.projections.$$contracts.resolveCount(count)).toBe(12)
	})
})
