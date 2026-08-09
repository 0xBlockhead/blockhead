import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getDeposit = vi.hoisted(() => vi.fn())
const getDeposits = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Across/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Across/Rest/queries.ts')>(),
	getDeposit,
	getDeposits,
}))

const { default: across } = await import('$/resolvers/Across-Rest.ts')

const depositor = '0xA4d353BBc130cbeF1811f27ac70989F9d568CeAB'
const recipient = '0xB4d353BBc130cbeF1811f27ac70989F9d568CeAB'
const inputToken = '0x4200000000000000000000000000000000000006'
const outputToken = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
const depositTxnRef = `0x${'1'.repeat(64)}`
const fillTxnRef = `0x${'2'.repeat(64)}`
const depositId = '900719925474099312345'
const transferId = `8453/${depositId}`
const transfer = {
	source: Source.Across_Rest,
	transferId,
}
const deposit = {
	id: 14_503_095,
	relayHash: `0x${'3'.repeat(64)}`,
	depositId,
	originChainId: 8453,
	destinationChainId: 42161,
	depositor,
	recipient,
	inputToken,
	inputAmount: '900719925474099312345',
	outputToken,
	outputAmount: '900719925474099300000',
	message: '0x',
	messageHash: `0x${'0'.repeat(64)}`,
	exclusiveRelayer: '0xCad97616f91872C02BA3553dB315Db4015cBE850',
	exclusivityDeadline: null,
	fillDeadline: '2026-07-24T19:26:20.000Z',
	quoteTimestamp: '2026-07-24T16:07:11.000Z',
	depositBlockNumber: 33_292_078,
	depositBlockTimestamp: '2026-07-24T16:11:43.000Z',
	depositTxnRef,
	status: 'filled',
	depositRefundTxnRef: null,
	bridgeFeeUsd: '0.017884155707075979',
	fillGasFee: '2532354948000',
	fillGasFeeUsd: '0.009488583742324977',
	relayer: '0xCad97616f91872C02BA3553dB315Db4015cBE850',
	fillBlockNumber: 44_135_258,
	fillBlockTimestamp: '2026-07-24T16:12:03.000Z',
	fillTxnRef,
	speedups: [],
} as const

describe('Across BridgeTransfer resolvers', () => {
	afterEach(() => {
		getDeposit.mockReset()
		getDeposits.mockReset()
	})

	it('materializes deposit/fill identity into schema-shaped BridgeTransfer fields', async () => {
		getDeposit.mockResolvedValue({
			deposit,
			pagination: {
				currentIndex: 0,
				maxIndex: 0,
			},
		})
		const resolver = across.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('Across_Rest: BridgeTransfer resolver missing')

		const snapshot = await resolver.resolve.SourceTransferId.resolve(transfer)

		expect(getDeposit).toHaveBeenCalledWith(expect.objectContaining({
			source: Source.Across_Rest,
		}), {
			originChainId: 8453,
			depositId,
		})
		expect(snapshot).toMatchObject({
			source: Source.Across_Rest,
			transferId,
			railId: 'Across',
			settlementModel: 'IntentFill',
			verificationModel: 'Optimistic',
			assetOutcome: 'SameNative',
			amountIn: BigInt(deposit.inputAmount),
			amountOut: BigInt(deposit.outputAmount),
			bridgeFeeUsd: deposit.bridgeFeeUsd,
			exclusiveRelayer: deposit.exclusiveRelayer.toLowerCase(),
			$sourceTx: {
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '8453',
						},
					},
					txHash: depositTxnRef.toLowerCase(),
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
					txHash: fillTxnRef.toLowerCase(),
				},
			},
			$sender: {
				[EntityMetaKey.Selector]: {
					address: depositor.toLowerCase(),
				},
			},
			$recipient: {
				[EntityMetaKey.Selector]: {
					address: recipient.toLowerCase(),
				},
			},
		})
		expect(resolver.projections.$$timestamps.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs: Date.parse(deposit.fillBlockTimestamp),
				source: Source.Across_Rest,
			},
		}])
		expect(resolver.projections.$$timestamps.resolveCount(snapshot)).toBe(1)
	})

	it('projects fill status, relayer, and destination hash from deposit lifecycle', async () => {
		getDeposit.mockResolvedValue({
			deposit,
			pagination: {
				currentIndex: 0,
				maxIndex: 0,
			},
		})
		const resolver = across.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('Across_Rest: BridgeTransfer_Timestamp resolver missing')

		const snapshot = await resolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: transfer,
			timestampMs: Date.parse(deposit.fillBlockTimestamp),
			source: Source.Across_Rest,
		})

		expect(snapshot).toMatchObject({
			status: 'filled',
			destinationTxHash: fillTxnRef.toLowerCase(),
			relayer: deposit.relayer.toLowerCase(),
			completedAt: Date.parse(deposit.fillBlockTimestamp),
			fillGasFee: BigInt(deposit.fillGasFee),
			fillGasFeeUsd: deposit.fillGasFeeUsd,
		})
		expect(snapshot).not.toHaveProperty('refundTxHash')
	})

	it('fails closed on bad transfer ids, unsupported chains, and clock mismatch', async () => {
		const transferResolver = across.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		const observationResolver = across.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (transferResolver == null || observationResolver == null)
			throw new Error('Across_Rest: resolvers missing')

		await expect(transferResolver.resolve.SourceTransferId.resolve({
			source: Source.Across_Rest,
			transferId: '8453',
		})).rejects.toThrow('invalid deposit transfer id')

		await expect(transferResolver.resolve.SourceTransferId.resolve({
			source: Source.Across_Rest,
			transferId: `999999/${depositId}`,
		})).rejects.toThrow('unsupported origin chain id')

		getDeposit.mockResolvedValue({
			deposit,
			pagination: {
				currentIndex: 0,
				maxIndex: 0,
			},
		})
		await expect(observationResolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: transfer,
			timestampMs: Date.parse(deposit.depositBlockTimestamp),
			source: Source.Across_Rest,
		})).rejects.toThrow('observation clock mismatch')
	})

	it('projects expired deposit status labels onto observation errors', async () => {
		getDeposit.mockResolvedValue({
			deposit: {
				...deposit,
				status: 'expired',
				fillTxnRef: null,
				fillBlockTimestamp: null,
				fillBlockNumber: null,
				relayer: null,
				fillGasFee: null,
				fillGasFeeUsd: null,
			},
			pagination: {
				currentIndex: 0,
				maxIndex: 0,
			},
		})
		const resolver = across.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('Across_Rest: BridgeTransfer_Timestamp resolver missing')

		const snapshot = await resolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: transfer,
			timestampMs: Date.parse(deposit.depositBlockTimestamp),
			source: Source.Across_Rest,
		})

		expect(snapshot).toMatchObject({
			status: 'expired',
			error: 'Fill deadline passed; refund pending on origin',
			estimatedCompletionMs: Date.parse(deposit.fillDeadline!),
		})
	})

	it('lists depositor-scoped deposits for Address and AddressInteropAddress', async () => {
		getDeposits.mockResolvedValue([deposit])
		const resolver = across.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmAccount
		))
		if (resolver == null)
			throw new Error('Across_Rest: EvmAccount resolver missing')

		const byAddress = await resolver.resolve.Address.resolve(
			{
				address: depositor,
			},
			{
				pagination: {
					limit: 50,
				},
			}
		)
		expect(resolver.projections.$$bridgeTransfers.select(byAddress)).toEqual([{
			[EntityMetaKey.Selector]: {
				source: Source.Across_Rest,
				transferId,
			},
		}])

		const bridgeTransfers = await resolver.resolve.AddressInteropAddress.resolve(
			{
				address: depositor,
			},
			{
				pagination: {
					limit: 50,
				},
			}
		)

		expect(getDeposits).toHaveBeenCalledWith({
			depositor,
			limit: 50,
			skip: 0,
		})
		expect(resolver.projections.$$bridgeTransfers.select(bridgeTransfers)).toEqual([{
			[EntityMetaKey.Selector]: {
				source: Source.Across_Rest,
				transferId,
			},
		}])
		expect(resolver.projections.$$bridgeTransfers).not.toHaveProperty('resolveCount')
		expect(resolver.projections.$$bridgeTransfers.continuation(bridgeTransfers)).toMatchObject({
			operation: 'account-bridge-transfers',
			target: 'across',
			terminal: true,
		})
	})

	it('continues depositor-scoped deposits when the page is full', async () => {
		getDeposits.mockResolvedValue([deposit])
		const resolver = across.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmAccount
		))
		if (resolver == null)
			throw new Error('Across_Rest: EvmAccount resolver missing')

		const bridgeTransfers = await resolver.resolve.AddressInteropAddress.resolve(
			{
				address: depositor,
			},
			{
				pagination: {
					limit: 1,
				},
			}
		)

		expect(getDeposits).toHaveBeenCalledWith({
			depositor,
			limit: 1,
			skip: 0,
		})
		expect(resolver.projections.$$bridgeTransfers.continuation(bridgeTransfers)).toEqual({
			operation: 'account-bridge-transfers',
			target: 'across',
			terminal: false,
			token: '1',
		})
	})

	it('preserves an empty depositor-scoped list without inventing transfers', async () => {
		getDeposits.mockResolvedValue([])
		const resolver = across.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmAccount
		))
		if (resolver == null)
			throw new Error('Across_Rest: EvmAccount resolver missing')

		const bridgeTransfers = await resolver.resolve.AddressInteropAddress.resolve(
			{
				address: depositor,
			},
			{
				pagination: {
					limit: 50,
				},
			}
		)
		expect(resolver.projections.$$bridgeTransfers.select(bridgeTransfers)).toEqual([])
	})

	it('fails closed on a depositor deposit missing a deposit id', async () => {
		getDeposits.mockResolvedValue([{
			...deposit,
			depositId: null,
		}])
		const resolver = across.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmAccount
		))
		if (resolver == null)
			throw new Error('Across_Rest: EvmAccount resolver missing')

		await expect(resolver.resolve.AddressInteropAddress.resolve(
			{
				address: depositor,
			},
			{
				pagination: {
					limit: 50,
				},
			}
		)).rejects.toThrow('deposit missing deposit id')
	})

	it('projects fill-deadline estimates for unfinished transfers', async () => {
		getDeposit.mockResolvedValue({
			deposit: {
				...deposit,
				status: 'pending',
				fillTxnRef: null,
				fillBlockTimestamp: null,
				fillBlockNumber: null,
				relayer: null,
			},
			pagination: {
				currentIndex: 0,
				maxIndex: 0,
			},
		})
		const resolver = across.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('Across_Rest: BridgeTransfer_Timestamp resolver missing')

		const snapshot = await resolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: transfer,
			timestampMs: Date.parse(deposit.depositBlockTimestamp),
			source: Source.Across_Rest,
		})

		expect(snapshot).toMatchObject({
			status: 'pending',
			estimatedCompletionMs: Date.parse(deposit.fillDeadline!),
		})
		expect(snapshot).not.toHaveProperty('completedAt')
		expect(snapshot).not.toHaveProperty('destinationTxHash')
	})

	it('exports Across_Rest as the registered source module', () => {
		expect(across.source).toBe(Source.Across_Rest)
		expect(across.resolvers.length).toBeGreaterThan(0)
	})
})
