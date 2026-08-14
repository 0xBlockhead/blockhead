import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getBlobDetail = vi.hoisted(() => vi.fn())
const getTransaction = vi.hoisted(() => vi.fn())
const getBlock = vi.hoisted(() => vi.fn())
const listBlobs = vi.hoisted(() => vi.fn())
const listBlocks = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Blobscan/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Blobscan/Rest/queries.ts')>(),
	getBlobDetail,
	getTransaction,
	getBlock,
	listBlobs,
	listBlocks,
}))

const { default: blobscanRest } = await import('$/resolvers/Blobscan-Rest.ts')

const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}
const txHash = '0x1e46f5ba946b88488bb1afb80503f799ef9dc491af49a6cc8d1c5177de7b7cf1'
const versionedHash = '0x01301f3d74a866273da32b8103d31648b3753b2f12ae53c6d46dfc674121cc05'
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
		offset: 0,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const blobDetailResolver = blobscanRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmBlob
	&& 'kzgCommitment' in resolver.projections
))
const transactionBlobsResolver = blobscanRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmTransaction
	&& 'Blob' in resolver.projections
	&& '$$blobs' in resolver.projections.Blob
))
const networkBlobsResolver = blobscanRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$blobs' in resolver.projections.Evm
))
const blockResolver = blobscanRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmBlock
	&& 'blobGasUsed' in resolver.projections
	&& '$$transactions' in resolver.projections
))
const networkBlocksResolver = blobscanRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$blocks' in resolver.projections.Evm
))

if (
	blobDetailResolver == null
	|| transactionBlobsResolver == null
	|| networkBlobsResolver == null
	|| blockResolver == null
	|| networkBlocksResolver == null
)
	throw new Error('Blobscan-Rest spec missing expected resolvers')

describe('Blobscan EVM blob resolvers', () => {
	beforeEach(() => {
		getBlobDetail.mockReset()
		getTransaction.mockReset()
		getBlock.mockReset()
		listBlobs.mockReset()
		listBlocks.mockReset()
	})

	it('resolves blob identity and detail from the transaction selector', async () => {
		getBlobDetail.mockResolvedValueOnce({
			versionedHash,
			blockNumber: 25680860,
			txHash,
			index: 0,
			commitment: '0xcommit',
			dataStorageReferences: [{
				storage: 'ipfs',
				url: 'https://blobscan.com/ipfs/bafy',
			}],
		})

		const detail = await blobDetailResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: {
				$network: network,
				txHash,
			},
			indexInTransaction: 0,
		}, context)
		expect(blobDetailResolver.projections.versionedHash(detail, context)).toBe(versionedHash)
		expect(blobDetailResolver.projections.$block(detail, context)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: 25680860n,
			},
		})
		expect(blobDetailResolver.projections.kzgCommitment(detail, context)).toBe('0xcommit')
		expect(blobDetailResolver.projections.blobDataStorageReferences(detail, context)).toEqual([{
			storage: 'ipfs',
			reference: 'https://blobscan.com/ipfs/bafy',
		}])
	})

	it('hard-fails missing blob transactions instead of soft-emptying $$blobs', async () => {
		getTransaction.mockResolvedValueOnce(undefined)
		await expect(
			transactionBlobsResolver.resolve.EvmNetworkTxHash.resolve({
				$network: network,
				txHash,
			}, context)
		).rejects.toThrow('transaction not found')
	})

	it('maps EvmTransaction.$$blobs from Blobscan transaction rows', async () => {
		expect(blobscanRest.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.EvmTransaction
		))).toHaveLength(1)
		getTransaction.mockResolvedValueOnce({
			hash: txHash,
			blockNumber: 12,
			from: '0xc1b634853cb333d3ad8663715b08f41a3aec47cc',
			blobs: [{
				versionedHash,
			}],
		})

		const rows = await transactionBlobsResolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		}, context)
		expect(transactionBlobsResolver.projections.Blob.$$blobs.select(rows, context)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txHash,
				},
				indexInTransaction: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmBlob, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						blockNumber: 12n,
					},
				},
				[entityFieldAddressKey(EntityType.EvmBlob, [], '$transaction')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						txHash,
					},
				},
				[entityFieldAddressKey(EntityType.EvmBlob, [], 'versionedHash')]: versionedHash,
			},
		}])
		expect(transactionBlobsResolver.projections.$block(rows, context)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: 12n,
			},
		})
		expect(getTransaction).toHaveBeenCalledOnce()
		expect(transactionBlobsResolver.projections.Blob.$$blobs.resolveCount(rows, context)).toBe(1)
	})

	it('lists Network.Evm.$$blobs from Blobscan recent blobs', async () => {
		listBlobs.mockResolvedValueOnce([{
			versionedHash,
			txHash,
			index: 0,
			blockNumber: 12,
			commitment: '0xcommit',
			dataStorageReferences: [{
				storage: 'ipfs',
				url: 'https://blobscan.com/ipfs/bafy',
			}],
		}])

		const rows = await networkBlobsResolver.resolve.Caip2.resolve(network, context)
		expect(networkBlobsResolver.projections.Evm.$$blobs(rows, context)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					txHash,
				},
				indexInTransaction: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmBlob, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						blockNumber: 12n,
					},
				},
				[entityFieldAddressKey(EntityType.EvmBlob, [], '$transaction')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						txHash,
					},
				},
				[entityFieldAddressKey(EntityType.EvmBlob, [], 'versionedHash')]: versionedHash,
				[entityFieldAddressKey(EntityType.EvmBlob, [], 'kzgCommitment')]: '0xcommit',
				[entityFieldAddressKey(EntityType.EvmBlob, [], 'blobDataStorageReferences')]: [{
					storage: 'ipfs',
					reference: 'https://blobscan.com/ipfs/bafy',
				}],
			},
		}])
		expect(listBlobs).toHaveBeenCalledWith('1', {
			limit: 16,
			offset: 0,
		})
		expect(networkBlobsResolver.projections.Evm.$$blobs.resolveCount).toBeUndefined()
	})

	it('projects enrolled EvmBlock blob-gas fields and $$transactions from getBlock', async () => {
		getBlock.mockResolvedValueOnce({
			hash: '0xca22de2c1d7c8ac391921a2e3c96872ecf805a2d398813aa0f8cb995aa85ddea',
			number: 12,
			timestamp: '2026-08-05T02:08:35.000Z',
			blobGasUsed: '131072',
			excessBlobGas: '0',
			transactions: [{
				hash: txHash,
				blobs: [{
					versionedHash,
				}],
			}],
		})

		const block = await blockResolver.resolve.EvmNetworkBlockNumber.resolve({
			$network: network,
			blockNumber: 12n,
		}, context)
		expect(blockResolver.projections.hash(block, context)).toBe(
			'0xca22de2c1d7c8ac391921a2e3c96872ecf805a2d398813aa0f8cb995aa85ddea'
		)
		expect(blockResolver.projections.timestamp(block, context)).toBe(
			Math.floor(Date.parse('2026-08-05T02:08:35.000Z') / 1_000) * 1_000
		)
		expect(blockResolver.projections.blobGasUsed(block, context)).toBe(131072n)
		expect(blockResolver.projections.excessBlobGas(block, context)).toBe(0n)
		expect(blockResolver.projections.transactionCount(block, context)).toBe(1)
		expect(blockResolver.projections.$$transactions.select(block, context)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				txHash,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						blockNumber: 12n,
					},
				},
				[entityFieldAddressKey(EntityType.EvmTransaction, [], 'envelopeType')]: 'Blob',
				[entityFieldAddressKey(EntityType.EvmTransaction, ['Blob'], '$$blobs')]: [{
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: network,
							txHash,
						},
						indexInTransaction: 0,
					},
					[EntityMetaKey.Fields]: expect.objectContaining({
						[entityFieldAddressKey(EntityType.EvmBlob, [], 'versionedHash')]: versionedHash,
					}),
				}],
			},
		}])
		expect(blockResolver.projections.$$transactions.resolveCount(block, context)).toBe(1)
	})

	it('resolves EvmBlock by hash and projects enrolled Blobscan transaction fields', async () => {
		const blockHash = '0xca22de2c1d7c8ac391921a2e3c96872ecf805a2d398813aa0f8cb995aa85ddea'
		getBlock.mockResolvedValueOnce({
			hash: blockHash,
			number: 12,
			timestamp: '2026-08-05T02:08:35.000Z',
			blobGasUsed: '131072',
			excessBlobGas: '0',
			transactions: [{
				hash: txHash,
				blobs: [{
					versionedHash,
				}],
			}],
		})
		getTransaction.mockResolvedValueOnce({
			hash: txHash,
			blockNumber: 12,
			from: '0xc1b634853cb333d3ad8663715b08f41a3aec47cc',
			to: '0x1c479675ad559dc151f6ec7ed3fbf8cee79582b6',
			index: 71,
			blobGasUsed: '393216',
			maxFeePerBlobGas: '73140170',
			blobs: [{
				versionedHash,
			}],
		})

		const block = await blockResolver.resolve.EvmNetworkBlockHash.resolve({
			$network: network,
			hash: blockHash,
		}, context)
		expect(blockResolver.projections.blockNumber(block, context)).toBe(12n)
		expect(blockResolver.projections.hash(block, context)).toBe(blockHash)

		const transactionInclusionResolver = blobscanRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmTransaction
			&& 'indexInBlock' in resolver.projections
		))
		if (transactionInclusionResolver == null)
			throw new Error('Blobscan-Rest missing EvmTransaction inclusion resolver')

		const transaction = await transactionInclusionResolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		}, context)
		expect(transactionInclusionResolver.projections.$block(transaction, context)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: 12n,
			},
		})
		expect(transactionInclusionResolver.projections.$from(transaction, context)).toEqual({
			[EntityMetaKey.Selector]: {
				address: '0xc1b634853cb333d3ad8663715b08f41a3aec47cc',
			},
		})
		expect(transactionInclusionResolver.projections.$to(transaction, context)).toEqual({
			[EntityMetaKey.Selector]: {
				address: '0x1c479675ad559dc151f6ec7ed3fbf8cee79582b6',
			},
		})
		expect(transactionInclusionResolver.projections.indexInBlock(transaction, context)).toBe(71)
		expect(transactionInclusionResolver.projections.envelopeType(transaction, context)).toBe('Blob')
		expect(transactionInclusionResolver.projections.kind(transaction, context)).toBe('ContractCall')
		expect(transactionInclusionResolver.projections.Blob.blobGasUsed(transaction, context)).toBe(393216n)
		expect(transactionInclusionResolver.projections.Blob.maxFeePerBlobGas(transaction, context)).toBe(73140170n)
	})

	it('fail-closes Blobscan transactions that omit from or blobs', async () => {
		const transactionInclusionResolver = blobscanRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmTransaction
			&& 'envelopeType' in resolver.projections
		))
		if (transactionInclusionResolver == null)
			throw new Error('Blobscan-Rest missing EvmTransaction inclusion resolver')

		getTransaction.mockResolvedValueOnce({
			hash: txHash,
			blockNumber: 12,
			to: '0x1c479675ad559dc151f6ec7ed3fbf8cee79582b6',
			blobs: [{
				versionedHash,
			}],
		})
		await expect(transactionInclusionResolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		}, context)).rejects.toThrow('missing from address')

		getTransaction.mockResolvedValueOnce({
			hash: txHash,
			blockNumber: 12,
			from: '0xc1b634853cb333d3ad8663715b08f41a3aec47cc',
			blobs: [],
		})
		await expect(transactionInclusionResolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		}, context)).rejects.toThrow('missing blobs')
	})

	it('lists Network.Evm.$$blocks from Blobscan recent blocks', async () => {
		listBlocks.mockResolvedValueOnce([{
			hash: '0xca22de2c1d7c8ac391921a2e3c96872ecf805a2d398813aa0f8cb995aa85ddea',
			number: 12,
			timestamp: '2026-08-05T02:08:35.000Z',
			blobGasUsed: '131072',
			excessBlobGas: '0',
			transactions: [{
				hash: txHash,
				blobs: [{
					versionedHash,
				}],
			}],
		}])

		const rows = await networkBlocksResolver.resolve.Caip2.resolve(network, context)
		expect(networkBlocksResolver.projections.Evm.$$blocks(rows, context)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: 12n,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'hash')]: (
					'0xca22de2c1d7c8ac391921a2e3c96872ecf805a2d398813aa0f8cb995aa85ddea'
				),
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'blockNumber')]: 12n,
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'timestamp')]: (
					Math.floor(Date.parse('2026-08-05T02:08:35.000Z') / 1_000) * 1_000
				),
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'blobGasUsed')]: 131072n,
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'excessBlobGas')]: 0n,
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'transactionCount')]: 1,
				[entityFieldAddressKey(EntityType.EvmBlock, [], '$$transactions')]: [expect.objectContaining({
					[EntityMetaKey.Selector]: {
						$network: network,
						txHash,
					},
					[EntityMetaKey.Fields]: expect.objectContaining({
						[entityFieldAddressKey(EntityType.EvmTransaction, [], 'envelopeType')]: 'Blob',
						[entityFieldAddressKey(EntityType.EvmTransaction, ['Blob'], '$$blobs')]: [expect.objectContaining({
							[EntityMetaKey.Selector]: {
								$transaction: {
									$network: network,
									txHash,
								},
								indexInTransaction: 0,
							},
						})],
					}),
				})],
			},
		}])
		expect(networkBlocksResolver.projections.Evm.$$blocks.resolveCount).toBeUndefined()
	})

	it('hard-fails missing Blobscan blocks instead of soft-emptying EvmBlock', async () => {
		getBlock.mockResolvedValueOnce(undefined)
		await expect(
			blockResolver.resolve.EvmNetworkBlockNumber.resolve({
				$network: network,
				blockNumber: 12n,
			}, context)
		).rejects.toThrow('block not found')
	})
})
