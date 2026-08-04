import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	BridgeAssetOutcome,
	BridgeRailId,
	BridgeSettlementModel,
	BridgeVerificationModel,
} from '$/constants/Bridge.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { WormholescanOperation } from '$/sources/Wormholescan/Rest/types.ts'

const getOperationById = vi.hoisted(() => vi.fn())
const getOperations = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Wormholescan/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Wormholescan/Rest/queries.ts')>(),
	getOperationById,
	getOperations,
}))

const { default: wormholescanRest } = await import('$/resolvers/Wormholescan-Rest.ts')

const transfer = {
	source: Source.Wormholescan,
	transferId: '2/0000000000000000000000001111111111111111111111111111111111111111/42',
}
const sourceTxHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const destinationTxHash = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
const operation = {
	id: transfer.transferId,
	emitterChain: 2,
	content: {
		standarizedProperties: {
			amount: '1000000000000000000',
			fromChain: 2,
			toChain: 23,
			fromAddress: '0000000000000000000000001111111111111111111111111111111111111111',
			toAddress: '0000000000000000000000002222222222222222222222222222222222222222',
		},
	},
	sourceChain: {
		chainId: 2,
		status: 'confirmed',
		timestamp: '2026-01-02T03:04:05.000Z',
		from: '0000000000000000000000001111111111111111111111111111111111111111',
		transaction: {
			txHash: sourceTxHash,
		},
	},
	targetChain: {
		chainId: 23,
		status: 'completed',
		timestamp: '2026-01-02T03:05:06.000Z',
		to: '0000000000000000000000002222222222222222222222222222222222222222',
		transaction: {
			txHash: destinationTxHash,
		},
	},
} satisfies WormholescanOperation

describe('Wormholescan BridgeTransfer resolvers', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		getOperationById.mockReset()
		getOperations.mockReset()
	})

	it('materializes schema-shaped fields from an official operation id', async () => {
		getOperationById.mockResolvedValue(operation)
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer resolver is not registered')

		const snapshot = await resolver.resolve.SourceTransferId.resolve(transfer)

		expect(getOperationById).toHaveBeenCalledWith({
			chainId: 2,
			emitter: '0000000000000000000000001111111111111111111111111111111111111111',
			sequence: '42',
		})
		expect(snapshot).toMatchObject({
			source: Source.Wormholescan,
			transferId: transfer.transferId,
			amountIn: 1_000_000_000_000_000_000n,
			railId: BridgeRailId.Wormhole,
			settlementModel: BridgeSettlementModel.LockMint,
			verificationModel: BridgeVerificationModel.External,
			assetOutcome: BridgeAssetOutcome.WrappedMint,
			$sourceTx: {
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					txHash: sourceTxHash,
				},
			},
			$destinationTx: {
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '42161',
						},
					},
					txHash: destinationTxHash,
				},
			},
			$sender: {
				[EntityMetaKey.Selector]: {
					address: '0x1111111111111111111111111111111111111111',
				},
			},
			$recipient: {
				[EntityMetaKey.Selector]: {
					address: '0x2222222222222222222222222222222222222222',
				},
			},
		})
		expect(resolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs: Date.parse('2026-01-02T03:05:06.000Z'),
				source: Source.Wormholescan,
			},
		}])
	})

	it('looks up an operation by source transaction hash selector', async () => {
		getOperations.mockResolvedValue([operation])
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer resolver is not registered')

		const sourceTxTransfer = {
			source: Source.Wormholescan,
			$sourceTx: {
				$network: {
					caip2: {
						namespace: 'eip155' as const,
						reference: '1',
					},
				},
				txHash: sourceTxHash,
			},
			logIndex: 0,
		}
		const snapshot = await resolver.resolve.SourceTxSourceLogIndex.resolve(sourceTxTransfer)

		expect(getOperations).toHaveBeenCalledWith({ txHash: sourceTxHash })
		expect(snapshot.transferId).toBe(transfer.transferId)
	})

	it('projects destination status fields from the official operation', async () => {
		getOperationById.mockResolvedValue(operation)
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer_Timestamp resolver is not registered')

		const snapshot = await resolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: transfer,
			timestampMs: Date.parse('2026-01-02T03:05:06.000Z'),
			source: Source.Wormholescan,
		})

		expect(snapshot).toMatchObject({
			status: 'completed',
			destinationTxHash,
			completedAt: Date.parse('2026-01-02T03:05:06.000Z'),
		})
	})

	it('rejects foreign bridge transfer sources before transport', async () => {
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer resolver is not registered')

		await expect(resolver.resolve.SourceTransferId.resolve({
			source: Source.Lifi_Rest,
			transferId: 'foreign',
		})).rejects.toThrow('Wormholescan: unsupported bridge transfer source')
		expect(getOperationById).not.toHaveBeenCalled()
	})
})
