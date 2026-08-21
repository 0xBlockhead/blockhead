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
	emitterAddress: {
		hex: '0000000000000000000000001111111111111111111111111111111111111111',
	},
	sequence: '42',
	content: {
		standarizedProperties: {
			amount: '1000000000000000000',
			fromChain: 2,
			toChain: 23,
			fromAddress: '0000000000000000000000001111111111111111111111111111111111111111',
			toAddress: '0000000000000000000000002222222222222222222222222222222222222222',
			tokenAddress: '000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			tokenChain: 2,
		},
	},
	sourceChain: {
		chainId: 2,
		status: 'confirmed',
		timestamp: '2026-01-02T03:04:05.000Z',
		from: '0000000000000000000000001111111111111111111111111111111111111111',
		feeUSD: '1.25',
		transaction: {
			txHash: sourceTxHash,
		},
	},
	targetChain: {
		chainId: 23,
		status: 'completed',
		timestamp: '2026-01-02T03:05:06.000Z',
		to: '0000000000000000000000002222222222222222222222222222222222222222',
		fee: '21000',
		feeUSD: '0.42',
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

	it('registers only the event-scoped observation selector', () => {
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer_Timestamp resolver is not registered')

		expect(resolver.resolve).toHaveProperty('TransferTimestampMsSourceEventKind')
		expect(resolver.resolve).not.toHaveProperty('TransferTimestampMsSource')
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
			bridgeFeeUsd: '1.25',
			railId: BridgeRailId.Wormhole,
			settlementModel: BridgeSettlementModel.LockMint,
			verificationModel: BridgeVerificationModel.External,
			assetOutcome: BridgeAssetOutcome.WrappedMint,
			sourceTransactionAtMs: Date.parse('2026-01-02T03:04:05.000Z'),
			destinationTransactionAtMs: Date.parse('2026-01-02T03:05:06.000Z'),
			transactionLatencyMs: 61_000,
			$fromToken: {
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					type: 'Erc20Token',
					$contract: {
						$network: {
							caip2: {
								namespace: 'eip155',
								reference: '1',
							},
						},
						address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
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
		expect(resolver.projections.$$timestamps.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$transfer: transfer,
					timestampMs: Date.parse('2026-01-02T03:04:05.000Z'),
					source: Source.Wormholescan,
					eventKind: 'sourceTransaction',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$transfer: transfer,
					timestampMs: Date.parse('2026-01-02T03:05:06.000Z'),
					source: Source.Wormholescan,
					eventKind: 'destinationTransaction',
				},
			},
		])
		expect(resolver.projections.$$timestamps.resolveCount(snapshot)).toBe(2)
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

	it('rejects ambiguous operation matches for a source transaction selector', async () => {
		getOperations.mockResolvedValue([
			operation,
			{
				...operation,
				id: '2/0000000000000000000000001111111111111111111111111111111111111111/43',
				sequence: '43',
			},
		])
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer resolver is not registered')

		await expect(resolver.resolve.SourceTxSourceLogIndex.resolve({
			source: Source.Wormholescan,
			$sourceTx: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				txHash: sourceTxHash,
			},
			logIndex: 0,
		})).rejects.toThrow(`Wormholescan_Rest: ambiguous operations for source tx ${sourceTxHash}`)
	})

	it('resolves an official opaque operation sequence', async () => {
		const sequence = '55ee23ea14ca558ffda4e033257cee58b30db3868bd68bdbb60266f0cf2020ce-0'
		getOperationById.mockResolvedValue({
			...operation,
			id: `2/0000000000000000000000001111111111111111111111111111111111111111/${sequence}`,
		})
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer resolver is not registered')

		await expect(resolver.resolve.SourceTransferId.resolve({
			source: Source.Wormholescan,
			transferId: `2/0000000000000000000000001111111111111111111111111111111111111111/${sequence}`,
		})).resolves.toMatchObject({
			transferId: `2/0000000000000000000000001111111111111111111111111111111111111111/${sequence}`,
		})
		expect(getOperationById).toHaveBeenCalledWith({
			chainId: 2,
			emitter: '0000000000000000000000001111111111111111111111111111111111111111',
			sequence,
		})
	})

	it('projects destination status fields from the official operation', async () => {
		getOperationById.mockResolvedValue(operation)
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer_Timestamp resolver is not registered')

		const snapshot = await resolver.resolve.TransferTimestampMsSourceEventKind.resolve({
			$transfer: transfer,
			timestampMs: Date.parse('2026-01-02T03:05:06.000Z'),
			source: Source.Wormholescan,
			eventKind: 'destinationTransaction',
		})

		expect(snapshot).toMatchObject({
			status: 'completed',
			destinationTxHash,
			fillGasFee: 21000n,
			fillGasFeeUsd: '0.42',
		})
	})

	it('keeps source confirmation on its source transaction clock', async () => {
		getOperationById.mockResolvedValue(operation)
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer_Timestamp resolver is not registered')

		const snapshot = await resolver.resolve.TransferTimestampMsSourceEventKind.resolve({
			$transfer: transfer,
			timestampMs: Date.parse('2026-01-02T03:04:05.000Z'),
			source: Source.Wormholescan,
			eventKind: 'sourceTransaction',
		})

		expect(snapshot).toMatchObject({
			status: 'confirmed',
		})
		expect(snapshot).not.toHaveProperty('destinationTxHash')
		expect(snapshot).not.toHaveProperty('fillGasFee')
		expect(snapshot).not.toHaveProperty('fillGasFeeUsd')
	})

	it('fails closed on observation clock mismatch', async () => {
		getOperationById.mockResolvedValue(operation)
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer_Timestamp resolver is not registered')

		await expect(resolver.resolve.TransferTimestampMsSourceEventKind.resolve({
			$transfer: transfer,
			timestampMs: Date.parse('2026-01-02T03:05:06.000Z') + 1,
			source: Source.Wormholescan,
			eventKind: 'destinationTransaction',
		})).rejects.toThrow('Wormholescan_Rest: observation clock mismatch')
	})

	it('keeps source and destination events distinct when their clocks are equal', async () => {
		getOperationById.mockResolvedValue({
			...operation,
			targetChain: {
				...operation.targetChain,
				timestamp: operation.sourceChain.timestamp,
			},
		})
		const transferResolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (transferResolver == null)
			throw new Error('Wormholescan BridgeTransfer resolver is not registered')
		const observationResolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (observationResolver == null)
			throw new Error('Wormholescan BridgeTransfer_Timestamp resolver is not registered')

		const snapshot = await transferResolver.resolve.SourceTransferId.resolve(transfer)
		expect(transferResolver.projections.$$timestamps.select(snapshot)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: expect.objectContaining({ eventKind: 'sourceTransaction' }),
			}),
			expect.objectContaining({
				[EntityMetaKey.Selector]: expect.objectContaining({ eventKind: 'destinationTransaction' }),
			}),
		])
		await expect(observationResolver.resolve.TransferTimestampMsSourceEventKind.resolve({
			$transfer: transfer,
			timestampMs: Date.parse(operation.sourceChain.timestamp),
			source: Source.Wormholescan,
			eventKind: 'destinationTransaction',
		})).resolves.toMatchObject({ eventKind: 'destinationTransaction' })
	})

	it('fails closed on contradictory operation chain coordinates', async () => {
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer resolver is not registered')

		getOperationById.mockResolvedValueOnce({
			...operation,
			content: {
				standarizedProperties: {
					...operation.content.standarizedProperties,
					fromChain: 23,
				},
			},
		})
		await expect(resolver.resolve.SourceTransferId.resolve(transfer))
			.rejects.toThrow('source chain coordinates disagree')

		getOperationById.mockResolvedValueOnce({
			...operation,
			sourceChain: {
				...operation.sourceChain,
				chainId: 23,
			},
			content: undefined,
		})
		await expect(resolver.resolve.SourceTransferId.resolve(transfer))
			.rejects.toThrow('emitter and source chains disagree')
	})

	it('does not attach destination lifecycle facts to the source clock', async () => {
		getOperationById.mockResolvedValue({
			...operation,
			targetChain: {
				...operation.targetChain,
				timestamp: undefined,
			},
		})
		const resolver = wormholescanRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('Wormholescan BridgeTransfer_Timestamp resolver is not registered')

		await expect(resolver.resolve.TransferTimestampMsSourceEventKind.resolve({
			$transfer: transfer,
			timestampMs: Date.parse(operation.sourceChain.timestamp),
			source: Source.Wormholescan,
			eventKind: 'sourceTransaction',
		})).rejects.toThrow('destination lifecycle facts lack a destination clock')
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

	it('rejects a transport detail that does not echo the VAA selector', async () => {
		getVaaById.mockResolvedValue({
			id: `2/${vaaEmitter}/43`,
			sequence: '43',
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

		await expect(resolver.resolve.EmitterChainEmitterSequence.resolve(vaaSelector))
			.rejects.toThrow('Wormholescan_Rest: mismatched VAA identity')
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
