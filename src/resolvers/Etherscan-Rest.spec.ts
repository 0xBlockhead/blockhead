import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getTokenTransfersByAddress = vi.hoisted(() => vi.fn())
const getTokenTransfersByTransaction = vi.hoisted(() => vi.fn())
const getTransactionByHash = vi.hoisted(() => vi.fn())
const getTransactionReceipt = vi.hoisted(() => vi.fn())
const getBlockNumber = vi.hoisted(() => vi.fn())
const getBlockByNumber = vi.hoisted(() => vi.fn())
const getCode = vi.hoisted(() => vi.fn())
const getTransactionsByAddress = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Etherscan/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Etherscan/Rest/queries.ts')>(),
	getTokenTransfersByAddress,
	getTokenTransfersByTransaction,
	getTransactionByHash,
	getTransactionReceipt,
	getBlockNumber,
	getBlockByNumber,
	getCode,
	getTransactionsByAddress,
}))

const { default: etherscanRest } = await import('$/resolvers/Etherscan-Rest.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 1,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const address = '0x1111111111111111111111111111111111111111'
const txHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

describe('Etherscan Network selectors', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('derives the chain from the catalog slug and preserves that selector in references', async () => {
		getTokenTransfersByAddress.mockResolvedValue([{
			standard: 'erc20',
			row: {
				hash: txHash,
				logIndex: '7',
			},
		}])
		const resolver = etherscanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmNetworkAccount
			&& '$$tokenTransfers' in candidate.projections
			&& 'EvmNetworkEvmAccount' in candidate.resolve
		))
		if (
			resolver == null
			|| !('EvmNetworkEvmAccount' in resolver.resolve)
		)
			throw new Error('Etherscan_Rest: missing EvmNetworkAccount token-transfer resolver')

		const $network = {
			slug: 'ethereum',
		} as const
		const references = await resolver.resolve.EvmNetworkEvmAccount.resolve({
			$actor: {
				address,
			},
			$network,
		}, context)

		expect(getTokenTransfersByAddress).toHaveBeenCalledWith(expect.objectContaining({
			chainId: 1,
			address,
		}))
		expect(references).toEqual([{
			[EntityMetaKey.Selector]: {
				$log: {
					$transaction: {
						$network,
						txHash,
					},
					indexInTransaction: 7,
				},
				indexInLog: 0,
			},
		}])
	})

	it('rejects an NFT projection when its required token id is absent', async () => {
		getTokenTransfersByTransaction.mockResolvedValue([{
			standard: 'erc721',
			row: {
				hash: txHash,
				logIndex: '7',
			},
		}])
		const resolver = etherscanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTokenTransfer
			&& 'LogIndexInLog' in candidate.resolve
			&& 'Nft' in candidate.projections
		))
		const resolve = (
			resolver != null
			&& 'LogIndexInLog' in resolver.resolve ?
				resolver.resolve.LogIndexInLog.resolve
			:
				undefined
		)
		const projectTokenId = (
			resolver != null
			&& 'Nft' in resolver.projections ?
				resolver.projections.Nft.tokenId
			:
				undefined
		)
		if (
			resolver == null
			|| resolve == null
			|| projectTokenId == null
		)
			throw new Error('Etherscan_Rest: missing EvmTokenTransfer resolver')

		const entitySelector = {
			$log: {
				$transaction: {
					$network: {
						slug: 'ethereum',
					},
					txHash,
				},
				indexInTransaction: 7,
			},
			indexInLog: 0,
		} as const
		const entity = await resolve(
			entitySelector,
			context
		)

		expect(() => projectTokenId(entity)).toThrow('NFT transfer missing token id')
	})

	it('maps proxy transaction + receipt into EvmTransaction snapshot fields', async () => {
		getTransactionByHash.mockResolvedValue({
			hash: txHash,
			from: address,
			to: '0x2222222222222222222222222222222222222222',
			blockNumber: '0x10',
			transactionIndex: '0x1',
			value: '0x0',
			nonce: '0x3',
			input: '0xabcdef',
			gas: '0x5208',
			gasPrice: '0x1',
			type: '0x2',
			maxFeePerGas: '0x2',
			maxPriorityFeePerGas: '0x1',
			r: `0x${'11'.repeat(32)}`,
			s: `0x${'22'.repeat(32)}`,
			v: '0x1',
		})
		getTransactionReceipt.mockResolvedValue({
			status: '0x1',
			gasUsed: '0x5208',
			cumulativeGasUsed: '0x5208',
			effectiveGasPrice: '0x1',
			logs: [{
				address: '0x3333333333333333333333333333333333333333',
				topics: [`0x${'dd'.repeat(32)}`],
				data: '0x',
				logIndex: '0x0',
				transactionHash: txHash,
				blockHash: `0x${'bb'.repeat(32)}`,
				blockNumber: '0x10',
			}],
		})
		const resolver = etherscanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTransaction
			&& 'EvmNetworkTxHash' in candidate.resolve
			&& '$from' in candidate.projections
			&& '$$logs' in candidate.projections
		))
		if (
			resolver == null
			|| !('EvmNetworkTxHash' in resolver.resolve)
		)
			throw new Error('Etherscan_Rest: missing EvmTransaction snapshot resolver')

		const $network = {
			slug: 'ethereum',
		} as const
		const entity = await resolver.resolve.EvmNetworkTxHash.resolve({
			$network,
			txHash,
		}, context)

		expect(entity.$from?.[EntityMetaKey.Selector].address).toBe(address)
		expect(entity.$$logs).toHaveLength(1)
		expect(resolver.projections.$$logs.resolveCount(entity)).toBe(1)
	})

	it('throws when EvmLog token-transfer facet cannot load transfers', async () => {
		getTokenTransfersByTransaction.mockResolvedValue(null)
		const resolver = etherscanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmLog
			&& 'TransactionIndexInTransaction' in candidate.resolve
			&& 'Event' in candidate.projections
			&& 'TokenTransfer' in candidate.projections.Event
		))
		if (
			resolver == null
			|| !('TransactionIndexInTransaction' in resolver.resolve)
		)
			throw new Error('Etherscan_Rest: missing EvmLog token-transfer facet')

		await expect(resolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: {
				$network: {
					slug: 'ethereum',
				},
				txHash,
			},
			indexInTransaction: 0,
		}, context)).rejects.toThrow('token transfers by transaction returned no result')
	})

	it('lists recent Network.$$blocks from eth_blockNumber', async () => {
		getBlockNumber.mockResolvedValue('0xa')
		const resolver = etherscanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Caip2' in candidate.resolve
			&& 'Evm' in candidate.projections
			&& '$$blocks' in candidate.projections.Evm
			&& typeof candidate.projections.Evm.$$blocks === 'function'
		))
		if (
			resolver == null
			|| !('Caip2' in resolver.resolve)
		)
			throw new Error('Etherscan_Rest: missing Network.$$blocks resolver')

		const rows = await resolver.resolve.Caip2.resolve({
			slug: 'ethereum',
		}, {
			...context,
			pagination: {
				limit: 3,
			},
		})

		expect(rows).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					blockNumber: 10n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					blockNumber: 9n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					blockNumber: 8n,
				},
			},
		])
	})

	it('projects tip EvmNetworkAccount observations from eth_getCode + tip block', async () => {
		getBlockNumber.mockResolvedValue('0x159a91')
		getBlockByNumber.mockResolvedValue({
			number: '0x159a91',
			timestamp: '0x65a4b665',
		})
		getCode.mockResolvedValue('0x60806040')

		const accountResolver = etherscanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmNetworkAccount
			&& '$$timestamps' in candidate.projections
		))
		const timestampResolver = etherscanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmNetworkAccount_Timestamp
			&& 'isContract' in candidate.projections
		))
		if (
			accountResolver == null
			|| !('EvmNetworkEvmAccount' in accountResolver.resolve)
			|| timestampResolver == null
			|| !('AccountTimestampMsSource' in timestampResolver.resolve)
		)
			throw new Error('Etherscan_Rest: missing EvmNetworkAccount timestamp resolvers')

		const $network = {
			slug: 'ethereum',
		} as const
		const account = await accountResolver.resolve.EvmNetworkEvmAccount.resolve({
			$actor: {
				address,
			},
			$network,
		}, context)
		expect(accountResolver.projections.$$timestamps(account)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: {
					$network,
					$actor: {
						address,
					},
				},
				timestampMs: 0x65a4b665 * 1_000,
				source: Source.Etherscan_Rest,
			},
		}])

		const observation = await timestampResolver.resolve.AccountTimestampMsSource.resolve({
			$account: {
				$network,
				$actor: {
					address,
				},
			},
			timestampMs: 0x65a4b665 * 1_000,
			source: Source.Etherscan_Rest,
		}, context)
		expect(timestampResolver.projections.blockNumber(observation)).toBe(0x159a91n)
		expect(timestampResolver.projections.isContract(observation)).toBe(true)
	})

	it('projects enrolled blob gas fields on EvmBlock', async () => {
		getBlockByNumber.mockResolvedValue({
			hash: `0x${'bb'.repeat(32)}`,
			parentHash: `0x${'aa'.repeat(32)}`,
			miner: address,
			timestamp: '0x10',
			gasUsed: '0x5208',
			gasLimit: '0x1c9c380',
			baseFeePerGas: '0x1',
			blobGasUsed: '0x20000',
			excessBlobGas: '0x0',
			transactions: [txHash],
		})
		const resolver = etherscanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmBlock
			&& 'blobGasUsed' in candidate.projections
			&& 'excessBlobGas' in candidate.projections
		))
		if (
			resolver == null
			|| !('EvmNetworkBlockNumber' in resolver.resolve)
		)
			throw new Error('Etherscan_Rest: missing EvmBlock blob gas projections')

		const entity = await resolver.resolve.EvmNetworkBlockNumber.resolve({
			$network: {
				slug: 'ethereum',
			},
			blockNumber: 16n,
		}, context)
		expect(resolver.projections.blobGasUsed(entity)).toBe(0x20000n)
		expect(resolver.projections.excessBlobGas(entity)).toBe(0n)
	})

	it('projects enrolled Blob.$$blobs from proxy blobVersionedHashes', async () => {
		const versionedHash = `0x01${'ab'.repeat(31)}`
		getTransactionByHash.mockResolvedValue({
			hash: txHash,
			from: address,
			to: '0x2222222222222222222222222222222222222222',
			blockNumber: '0x10',
			transactionIndex: '0x1',
			value: '0x0',
			nonce: '0x3',
			input: '0x',
			gas: '0x5208',
			gasPrice: '0x1',
			type: '0x3',
			maxFeePerGas: '0x2',
			maxPriorityFeePerGas: '0x1',
			maxFeePerBlobGas: '0x5',
			blobVersionedHashes: [versionedHash, `0x00${'cd'.repeat(31)}`],
			r: `0x${'11'.repeat(32)}`,
			s: `0x${'22'.repeat(32)}`,
			v: '0x1',
		})
		getTransactionReceipt.mockResolvedValue({
			status: '0x1',
			gasUsed: '0x5208',
			cumulativeGasUsed: '0x5208',
			effectiveGasPrice: '0x1',
			blobGasUsed: '0x20000',
			logs: [],
		})
		const resolver = etherscanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTransaction
			&& 'Blob' in candidate.projections
			&& '$$blobs' in candidate.projections.Blob
		))
		if (
			resolver == null
			|| !('EvmNetworkTxHash' in resolver.resolve)
		)
			throw new Error('Etherscan_Rest: missing EvmTransaction Blob.$$blobs projection')

		const $network = {
			slug: 'ethereum',
		} as const
		const entity = await resolver.resolve.EvmNetworkTxHash.resolve({
			$network,
			txHash,
		}, context)
		const blobs = resolver.projections.Blob.$$blobs.select(entity)
		expect(blobs).toHaveLength(1)
		expect(blobs[0]?.[EntityMetaKey.Selector]).toEqual({
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction: 0,
		})
		expect(blobs[0]?.versionedHash).toBe(versionedHash)
		expect(resolver.projections.Blob.$$blobs.resolveCount(entity)).toBe(1)
		expect(resolver.projections.Blob.blobGasUsed(entity)).toBe(0x20000n)
		expect(resolver.projections.Blob.maxFeePerBlobGas(entity)).toBe(5n)
	})
})
