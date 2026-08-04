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
} = vi.hoisted(() => ({
	getApiStatus: vi.fn(),
	getBlockByHash: vi.fn(),
	getClassByHash: vi.fn(),
	getContractByAddress: vi.fn(),
	getNetworkStats: vi.fn(),
	getTransactionByHash: vi.fn(),
}))

vi.mock('$/sources/Voyager/Rest/queries.ts', () => ({
	getApiStatus,
	getBlockByHash,
	getClassByHash,
	getContractByAddress,
	getNetworkStats,
	getTransactionByHash,
}))

const { default: voyagerRest } = await import('$/resolvers/Voyager-Rest.ts')

const transactionResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetTransaction
))
const blockResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetBlock
))
const contractResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetContract
))
const classResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetClass
))
const networkResolver = voyagerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.StarknetNetwork
))

if (transactionResolver == null)
	throw new Error('Voyager spec missing transaction resolver')
if (blockResolver == null)
	throw new Error('Voyager spec missing block resolver')
if (contractResolver == null)
	throw new Error('Voyager spec missing contract resolver')
if (classResolver == null)
	throw new Error('Voyager spec missing class resolver')
if (networkResolver == null)
	throw new Error('Voyager spec missing network resolver')

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
		expect(voyagerRest.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.StarknetTransaction,
			EntityType.StarknetBlock,
			EntityType.StarknetContract,
			EntityType.StarknetClass,
			EntityType.StarknetNetwork,
		])
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
			index: 1,
			l1VerificationHash: '0x2',
			classHash: null,
			contractAddress: null,
			timestamp: 1_700_000_000,
			actualFee: '346',
			contractAlias: null,
			classAlias: null,
			status: 'Accepted on L2',
			type: 'INVOKE',
			blockId: '0x75',
			actualFeeUnit: 'ETH',
			usdFormattedMaxFee: null,
			usdHistoricalFormattedMaxFee: null,
			executionResources: {},
			tip: null,
			receipt: {
				events: [{
					blockNumber: 100,
					nestedEventNames: [],
					timestamp: 1_700_000_000,
				}],
				tokensTransferred: [],
				feeTransferred: [],
				nftTransferred: [],
			},
			executionStatus: 'Succeeded',
			signature: ['0x01', null],
			contractAddressSalt: null,
			senderAddress: '0x01',
			maxFee: '0x10',
			nonce: '0x1',
			version: '0x1',
			selector: '0x15',
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

	it('hard-fails when transaction HTTP rejects', async () => {
		getTransactionByHash.mockRejectedValueOnce(new Error('Voyager https://api.voyager.online/beta/txns/0x1 → 404 Not Found'))

		await expect(
			transactionResolver.resolve.NetworkTransactionHash.resolve({
				$network: starknetNetwork,
				transactionHash: '0x1',
			}, context)
		).rejects.toThrow('404 Not Found')
	})

	it('projects block fields from Voyager block details', async () => {
		getBlockByHash.mockResolvedValueOnce({
			blockNumber: 483249,
			hash: '0x0194',
			timestamp: 1703664798,
			stateRoot: '0x017c',
			txnCount: 130,
			messageCount: 0,
			eventCount: 738,
			l1VerificationTxHash: '0xca9',
			status: 'Accepted on L1',
			prevBlockHash: '0x051b',
			nextBlockHash: '0x04e1',
			confirmations: 1,
			sequencerAddress: '0x01176',
			totalFee: '0x5a',
			timeToMine: 41,
			version: '0.12.3',
			ethGasPrice: '0x043',
			strkGasPrice: '0x0',
			l1AcceptTime: 19492,
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
	})

	it('projects contract account state from Voyager contract details', async () => {
		getContractByAddress.mockResolvedValueOnce({
			address: '0x01',
			blockNumber: 29410,
			isAccount: true,
			isErcToken: false,
			isProxy: false,
			type: 'Ready',
			creationTimestamp: 1680260250,
			verifiedTimestamp: null,
			classAlias: 'Ready',
			contractAlias: null,
			classHash: '0x0abc',
			version: '2.0.0',
			blockHash: '0x701',
			nonce: 100,
			implementationContract: null,
			tokenName: null,
			tokenSymbol: null,
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
			type: 5,
			isAccount: false,
			isProxy: false,
			isErcToken: true,
			creationTimestamp: 1757525492,
			contractsCount: null,
			declaredBy: '0x06a0',
			code: null,
			byteCode: null,
			license: null,
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
			contractsCount: '1',
			classesCount: '1',
			transactionsCount: '1',
			tpsAtBlockHash: '0x07fa',
			tps: '8',
			maxRecordedTps: '992',
			latestAvgFee: [],
			activeAccounts: '1',
			accountsGrowth: '1',
			totalTvl: {
				value: '1',
				unit: 'USD',
			},
		})
		getApiStatus.mockResolvedValueOnce({
			apis: {
				core: {
					status: 'lagging',
					lagSeconds: 80,
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
