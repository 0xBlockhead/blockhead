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
const getVaaById = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Wormholescan/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Wormholescan/Rest/queries.ts')>(),
	getOperationById,
	getOperations,
	getVaaById,
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
		getVaaById.mockReset()
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
		})).rejects.toThrow('Wormholescan_Rest: unsupported bridge transfer source')
		expect(getOperationById).not.toHaveBeenCalled()
	})

	it('ignores standarizedProperties chain 0 sentinels and uses sourceChain', async () => {
		getOperationById.mockResolvedValue({
			...operation,
			content: {
				standarizedProperties: {
					amount: '',
					fromChain: 0,
					toChain: 0,
					fromAddress: '',
					toAddress: '',
				},
			},
			targetChain: undefined,
		})
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer resolver is not registered')

		const snapshot = await resolver.resolve.SourceTransferId.resolve(transfer)

		expect(snapshot).toMatchObject({
			assetOutcome: BridgeAssetOutcome.MessageOnly,
			$fromNetwork: {
				[EntityMetaKey.Selector]: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
			},
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
			$sender: {
				[EntityMetaKey.Selector]: {
					address: '0x1111111111111111111111111111111111111111',
				},
			},
		})
		expect(snapshot).not.toHaveProperty('amountIn')
		expect(snapshot).not.toHaveProperty('$toNetwork')
	})
})

const vaaEmitter = '0000000000000000000000001111111111111111111111111111111111111111'
const vaaSelector = {
	emitterChain: 2,
	emitter: vaaEmitter,
	sequence: '42',
}
const vaaTxHash = '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'

describe('Wormholescan WormholeVaa resolvers', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		getVaaById.mockReset()
	})

	it('materializes schema-shaped fields from getVaaById', async () => {
		getVaaById.mockResolvedValue({
			id: `2/${vaaEmitter}/42`,
			sequence: '42',
			emitterChain: 2,
			emitterAddr: vaaEmitter,
			timestamp: '2026-01-02T03:04:05.000Z',
			vaa: 'AQAAAA',
			digest: 'deadbeef',
			guardianSetIndex: 3,
			emitterNativeAddr: '0x1111111111111111111111111111111111111111',
			txHash: vaaTxHash,
		})
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.WormholeVaa
		))
		if (resolver == null)
			throw new Error('Wormholescan WormholeVaa resolver is not registered')

		const snapshot = await resolver.resolve.EmitterChainEmitterSequence.resolve(vaaSelector)

		expect(getVaaById).toHaveBeenCalledWith({
			chainId: 2,
			emitter: vaaEmitter,
			sequence: '42',
		})
		expect(snapshot).toEqual({
			emitterChain: 2,
			emitter: vaaEmitter,
			sequence: '42',
			digest: 'deadbeef',
			guardianSetIndex: 3,
			timestamp: '2026-01-02T03:04:05.000Z',
			emitterNativeAddr: '0x1111111111111111111111111111111111111111',
			txHash: vaaTxHash,
		})
		expect(resolver.projections.emitterChain(snapshot)).toBe(vaaSelector.emitterChain)
		expect(resolver.projections.emitter(snapshot)).toBe(vaaSelector.emitter)
		expect(resolver.projections.sequence(snapshot)).toBe(vaaSelector.sequence)
	})

	it('omits optional emitterNativeAddr and txHash when absent', async () => {
		getVaaById.mockResolvedValue({
			id: `2/${vaaEmitter}/42`,
			sequence: '42',
			emitterChain: 2,
			emitterAddr: vaaEmitter,
			timestamp: '2026-01-02T03:04:05.000Z',
			vaa: 'AQAAAA',
			digest: 'deadbeef',
			guardianSetIndex: 3,
		})
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.WormholeVaa
		))
		if (resolver == null)
			throw new Error('Wormholescan WormholeVaa resolver is not registered')

		const snapshot = await resolver.resolve.EmitterChainEmitterSequence.resolve(vaaSelector)

		expect(snapshot).toEqual({
			emitterChain: 2,
			emitter: vaaEmitter,
			sequence: '42',
			digest: 'deadbeef',
			guardianSetIndex: 3,
			timestamp: '2026-01-02T03:04:05.000Z',
		})
	})

	it('hard-fails when digest is missing', async () => {
		getVaaById.mockResolvedValue({
			id: `2/${vaaEmitter}/42`,
			sequence: '42',
			emitterChain: 2,
			emitterAddr: vaaEmitter,
			timestamp: '2026-01-02T03:04:05.000Z',
			vaa: 'AQAAAA',
			guardianSetIndex: 3,
		})
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.WormholeVaa
		))
		if (resolver == null)
			throw new Error('Wormholescan WormholeVaa resolver is not registered')

		await expect(resolver.resolve.EmitterChainEmitterSequence.resolve(vaaSelector))
			.rejects.toThrow('Wormholescan_Rest: VAA missing digest')
	})

	it('hard-fails when guardianSetIndex is missing', async () => {
		getVaaById.mockResolvedValue({
			id: `2/${vaaEmitter}/42`,
			sequence: '42',
			emitterChain: 2,
			emitterAddr: vaaEmitter,
			timestamp: '2026-01-02T03:04:05.000Z',
			vaa: 'AQAAAA',
			digest: 'deadbeef',
		})
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.WormholeVaa
		))
		if (resolver == null)
			throw new Error('Wormholescan WormholeVaa resolver is not registered')

		await expect(resolver.resolve.EmitterChainEmitterSequence.resolve(vaaSelector))
			.rejects.toThrow('Wormholescan_Rest: VAA missing guardian set index')
	})
})
