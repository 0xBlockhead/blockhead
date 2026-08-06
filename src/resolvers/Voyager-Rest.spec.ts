import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getApiStatus,
	getBlockByHash,
	getClassByHash,
	getContractByAddress,
	getNetworkStats,
	getTransactionByHash,
	listBlocks,
	listEvents,
	listTransactions,
} = vi.hoisted(() => ({
	getApiStatus: vi.fn(),
	getBlockByHash: vi.fn(),
	getClassByHash: vi.fn(),
	getContractByAddress: vi.fn(),
	getNetworkStats: vi.fn(),
	getTransactionByHash: vi.fn(),
	listBlocks: vi.fn(),
	listEvents: vi.fn(),
	listTransactions: vi.fn(),
}))

vi.mock('$/sources/Voyager/Rest/queries.ts', () => ({
	getApiStatus,
	getBlockByHash,
	getClassByHash,
	getContractByAddress,
	getNetworkStats,
	getTransactionByHash,
	listBlocks,
	listEvents,
	listTransactions,
}))

const { default: voyagerRest } = await import('$/resolvers/Voyager-Rest.ts')

const transactionResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetTransaction
	&& 'transactionKind' in resolver.projections
))
const transactionEventsResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetTransaction
	&& '$$events' in resolver.projections
))
const blockResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetBlock
	&& 'blockHash' in resolver.projections
))
const blockTransactionsResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetBlock
	&& '$$transactions' in resolver.projections
))
const contractResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetContract
))
const classResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetClass
))
const networkResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetNetwork
	&& '$$timestamps' in resolver.projections
))
const networkBlocksResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetNetwork
	&& '$$blocks' in resolver.projections
))
const networkTransactionsResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetNetwork
	&& '$$transactions' in resolver.projections
))

if (
	transactionResolver == null
	|| transactionEventsResolver == null
	|| blockResolver == null
	|| blockTransactionsResolver == null
	|| contractResolver == null
	|| classResolver == null
	|| networkResolver == null
	|| networkBlocksResolver == null
	|| networkTransactionsResolver == null
)
	throw new Error('Voyager spec missing deepened resolvers')

const starknetNetwork = {
	$network: {
		caip2: networkBySlug.starknet.caip2,
	},
}

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Voyager Rest resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('registers under Voyager for Starknet mainnet selectors', () => {
		expect(voyagerRest.source).toBe(Source.Voyager)
		expect(transactionResolver.resolve.NetworkTransactionHash.appliesTo).toEqual([
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
		expect(blockResolver.resolve.NetworkBlockNumber).toBeDefined()
	})

	it('rejects non-Starknet networks before HTTP', async () => {
		await expect(
			transactionResolver.resolve.NetworkTransactionHash.resolve({
				$network: {
					$network: {
						slug: 'not-starknet',
					},
				},
				transactionHash: '0x1',
			}, context)
		).rejects.toThrow('Voyager_Rest: unsupported network')
		expect(getTransactionByHash).not.toHaveBeenCalled()
	})

	it('projects schema-shaped transaction fields from Voyager details', async () => {
		getTransactionByHash.mockResolvedValueOnce({
			blockNumber: 100,
			hash: '0x00abc',
			timestamp: 1_700_000_000,
			actualFee: '346',
			status: 'Accepted on L2',
			type: 'INVOKE',
			receipt: {
				events: [{
					blockNumber: 100,
					nestedEventNames: [],
					timestamp: 1_700_000_000,
				}],
			},
			executionStatus: 'Succeeded',
			signature: ['0x01', null],
			senderAddress: '0x01',
			maxFee: '0x10',
			nonce: '0x1',
			version: '0x1',
			calldata: ['0x1'],
			revertError: null,
		})

		const snapshot = await transactionResolver.resolve.NetworkTransactionHash.resolve({
			$network: starknetNetwork,
			transactionHash: '0xabc',
		}, context)

		expect(getTransactionByHash).toHaveBeenCalledWith({
			txnHash: '0xabc',
		})
		expect(transactionResolver.projections.transactionKind(snapshot)).toBe('INVOKE')
		expect(transactionResolver.projections.$block(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: starknetNetwork,
				blockNumber: 100n,
			},
		})
		expect(transactionResolver.projections.senderAddress(snapshot)).toBe('0x1')
		expect(transactionResolver.projections.maxFee(snapshot)).toBe(16n)
		expect(transactionResolver.projections.signature(snapshot)).toEqual(['0x1'])
		expect(transactionResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: starknetNetwork,
					transactionHash: '0xabc',
				},
				timestampMs: 1_700_000_000_000,
				source: Source.Voyager,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'blockNumber')]: 100n,
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'finalityStatus')]: 'Accepted on L2',
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'executionStatus')]: 'Succeeded',
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'actualFee')]: 346n,
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'eventsCount')]: 1,
			},
		}])
	})

	it('projects transaction events from Voyager listEvents', async () => {
		listEvents.mockResolvedValueOnce({
			items: [{
				number: 3,
				fromAddress: '0x02',
				selector: '0x99',
				dataDecoded: [{
					name: 'from',
					value: '0x01',
				}],
			}],
			lastPage: 1,
		})

		const page = await transactionEventsResolver.resolve.NetworkTransactionHash.resolve({
			$network: starknetNetwork,
			transactionHash: '0xabc',
		}, context)
		const projection = transactionEventsResolver.projections.$$events
		if (typeof projection === 'function' || projection.select == null)
			throw new Error('missing events projection')

		expect(listEvents).toHaveBeenCalledWith({
			limit: 16,
			page: 1,
			txnHash: '0xabc',
		})
		expect(projection.select(page, {
			$network: starknetNetwork,
			transactionHash: '0xabc',
		}, context)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: starknetNetwork,
					transactionHash: '0xabc',
				},
				eventIndex: 3,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetEvent, [], 'keys')]: ['0x99'],
				[entityFieldAddressKey(EntityType.StarknetEvent, [], 'data')]: ['0x01'],
			},
		})
	})

	it('hard-fails when transaction HTTP rejects', async () => {
		getTransactionByHash.mockRejectedValueOnce(new Error('Voyager https://api.voyager.online/beta/txns/0x1 → 404 Not Found'))

		await expect(
			transactionResolver.resolve.NetworkTransactionHash.resolve({
				$network: starknetNetwork,
				transactionHash: '0x1',
			}, context)
		).rejects.toThrow('404 Not Found')
	})

	it('projects block fields from hash and number selectors', async () => {
		getBlockByHash.mockResolvedValueOnce({
			blockNumber: 483249,
			hash: '0x0194',
			timestamp: 1703664798,
			stateRoot: '0x017c',
			status: 'Accepted on L1',
			prevBlockHash: '0x051b',
			sequencerAddress: '0x01176',
			ethGasPrice: '0x043',
			strkGasPrice: '0x0',
		})

		const snapshot = await blockResolver.resolve.NetworkBlockHash.resolve({
			$network: starknetNetwork,
			blockHash: '0x194',
		}, context)

		expect(blockResolver.projections.blockNumber(snapshot)).toBe(483249n)
		expect(blockResolver.projections.blockHash(snapshot)).toBe('0x194')
		expect(blockResolver.projections.parentHash(snapshot)).toBe('0x51b')
		expect(blockResolver.projections.timestampMs(snapshot)).toBe(1_703_664_798_000)
		expect(blockResolver.projections.status(snapshot)).toBe('Accepted on L1')

		getBlockByHash.mockResolvedValueOnce({
			blockNumber: 10,
			hash: '0x0aa',
			timestamp: 1700000000,
			status: 'Accepted on L2',
		})
		const byNumber = await blockResolver.resolve.NetworkBlockNumber.resolve({
			$network: starknetNetwork,
			blockNumber: 10n,
		}, context)
		expect(getBlockByHash).toHaveBeenLastCalledWith({
			blockHash: '10',
		})
		expect(blockResolver.projections.blockHash(byNumber)).toBe('0xaa')
	})

	it('projects block and network transaction/block list facets', async () => {
		listTransactions.mockResolvedValueOnce({
			items: [{
				hash: '0x01',
				type: 'INVOKE',
				timestamp: 1,
				status: 'Accepted on L2',
				blockNumber: 10,
			}],
			lastPage: 2,
		})
		const blockTxPage = await blockTransactionsResolver.resolve.NetworkBlockNumber.resolve({
			$network: starknetNetwork,
			blockNumber: 10n,
		}, context)
		const blockTxProjection = blockTransactionsResolver.projections.$$transactions
		if (typeof blockTxProjection === 'function' || blockTxProjection.select == null)
			throw new Error('missing block tx projection')
		expect(blockTxProjection.select(blockTxPage, {
			$network: starknetNetwork,
			blockNumber: 10n,
		}, context)[0][EntityMetaKey.Selector]).toEqual({
			$network: starknetNetwork,
			transactionHash: '0x1',
		})

		listBlocks.mockResolvedValueOnce({
			items: [{
				blockNumber: 20,
				hash: '0x020',
				timestamp: 1700000000,
				status: 'Accepted on L2',
			}],
			lastPage: 1,
		})
		const blocksPage = await networkBlocksResolver.resolve.Network.resolve(starknetNetwork, context)
		const blocksProjection = networkBlocksResolver.projections.$$blocks
		if (typeof blocksProjection === 'function' || blocksProjection.select == null)
			throw new Error('missing network blocks projection')
		expect(blocksProjection.select(blocksPage, starknetNetwork, context)[0][EntityMetaKey.Selector]).toEqual({
			$network: starknetNetwork,
			blockNumber: 20n,
		})

		listTransactions.mockResolvedValueOnce({
			items: [{
				hash: '0x03',
				type: 'DECLARE',
				timestamp: 2,
				status: 'Accepted on L2',
				blockNumber: 21,
			}],
			lastPage: 1,
		})
		const networkTxPage = await networkTransactionsResolver.resolve.Network.resolve(starknetNetwork, context)
		const networkTxProjection = networkTransactionsResolver.projections.$$transactions
		if (typeof networkTxProjection === 'function' || networkTxProjection.select == null)
			throw new Error('missing network tx projection')
		expect(networkTxProjection.select(networkTxPage, starknetNetwork, context)[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.StarknetTransaction, [], 'transactionKind')]: 'DECLARE',
		})
	})

	it('projects contract account state from Voyager contract details', async () => {
		getContractByAddress.mockResolvedValueOnce({
			address: '0x01',
			blockNumber: 29410,
			classHash: '0x0abc',
			nonce: 100,
		})

		const contract = {
			$network: starknetNetwork,
			address: '0x1',
		}
		const snapshot = await contractResolver.resolve.NetworkAddress.resolve(contract, context)

		expect(contractResolver.projections.$$accountStates(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$contract: contract,
				blockNumber: 29410n,
				source: Source.Voyager,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'classHash')]: '0xabc',
				[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'nonce')]: '0x64',
				[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'found')]: true,
			},
		}])
	})

	it('projects class fields from Voyager class details', async () => {
		getClassByHash.mockResolvedValueOnce({
			hash: '0x0421',
			transactionHash: '0x045f',
			version: '2.11.4',
		})

		const snapshot = await classResolver.resolve.NetworkClassHash.resolve({
			$network: starknetNetwork,
			classHash: '0x421',
		}, context)

		expect(classResolver.projections.classHash(snapshot)).toBe('0x421')
		expect(classResolver.projections.contractClassVersion(snapshot)).toBe('2.11.4')
		expect(classResolver.projections.declaredByTransactionHash(snapshot)).toBe('0x45f')
	})

	it('projects network timestamps from stats and api status', async () => {
		getNetworkStats.mockResolvedValueOnce({
			blocksCount: '2390025',
			tpsAtBlockHash: '0x07fa',
		})
		getApiStatus.mockResolvedValueOnce({
			apis: {
				core: {
					status: 'lagging',
				},
			},
			timestamp: 1_767_097_236_000,
		})

		const snapshot = await networkResolver.resolve.Network.resolve(starknetNetwork, context)

		expect(networkResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: starknetNetwork,
				timestampMs: 1_767_097_236_000,
				source: Source.Voyager,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'latestBlockNumber')]: 2390024n,
				[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'latestBlockHash')]: '0x7fa',
				[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'syncing')]: true,
			},
		}])
	})
})
