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
import type {
	LifiChainsResponse,
	LifiStatusResponse,
} from '$/sources/Lifi/Rest/types.ts'

const fetchChains = vi.hoisted(() => vi.fn())
const fetchTransferStatus = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Lifi/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Lifi/Rest/queries.ts')>(),
	fetchChains,
	fetchTransferStatus,
}))

const { default: lifiRest } = await import('$/resolvers/Lifi-Rest.ts')

const transfer = {
	source: Source.Lifi_Rest,
	transferId: 'lifi-transfer-id',
}
const sourceTxHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const destinationTxHash = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
const chains = {
	chains: [
		{
			key: 'eth',
			chainType: 'EVM',
			name: 'Ethereum',
			coin: 'ETH',
			id: 1,
			mainnet: true,
		},
		{
			key: 'opt',
			chainType: 'EVM',
			name: 'Optimism',
			coin: 'ETH',
			id: 10,
			mainnet: true,
		},
	],
} satisfies LifiChainsResponse
const status = {
	sending: {
		txHash: sourceTxHash,
		txLink: 'https://example.com/source',
		amount: '1000000000000000000',
		token: {
			address: '0x0000000000000000000000000000000000000000',
			decimals: 18,
			symbol: 'ETH',
			chainId: 1,
			name: 'Ether',
		},
		chainId: 1,
		timestamp: 1_700_000_000,
	},
	receiving: {
		txHash: destinationTxHash,
		txLink: 'https://example.com/destination',
		amount: '999000000000000000',
		token: {
			address: '0x0000000000000000000000000000000000000000',
			decimals: 18,
			symbol: 'ETH',
			chainId: 10,
			name: 'Ether',
		},
		chainId: 10,
		timestamp: 1_700_000_100,
	},
	status: 'DONE',
	substatus: 'COMPLETED',
	substatusMessage: 'The transfer is complete.',
	tool: 'across',
	transactionId: transfer.transferId,
	fromAddress: '0x1111111111111111111111111111111111111111',
	toAddress: '0x2222222222222222222222222222222222222222',
} satisfies LifiStatusResponse

describe('LI.FI transfer status resolvers', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		fetchChains.mockReset()
		fetchTransferStatus.mockReset()
	})

	it('materializes the transfer and one current observation from official status fields', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_200_000)
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue(status)
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		const snapshot = await resolver.resolve.SourceTransferId.resolve(transfer)

		expect(fetchTransferStatus).toHaveBeenCalledWith({ txHash: transfer.transferId })
		expect(snapshot).toMatchObject({
			source: Source.Lifi_Rest,
			transferId: transfer.transferId,
			amountIn: 1_000_000_000_000_000_000n,
			amountOut: 999_000_000_000_000_000n,
			railId: 'Across',
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
							reference: '10',
						},
					},
					txHash: destinationTxHash,
				},
			},
		})
		expect(resolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs: 1_700_000_200_000,
				source: Source.Lifi_Rest,
			},
		}])
	})

	it('resolves source-tx selectors with fromChain and canonical transactionId', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue(status)
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		const sourceTxTransfer = {
			source: Source.Lifi_Rest,
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

		expect(fetchTransferStatus).toHaveBeenCalledWith({
			txHash: sourceTxHash,
			fromChain: '1',
		})
		expect(snapshot.transferId).toBe(transfer.transferId)
	})

	it('rejects status responses that do not identify the requested source transaction', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue({
			...status,
			sending: {
				...status.sending,
				txHash: destinationTxHash,
			},
		})
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		await expect(
			resolver.resolve.SourceTxSourceLogIndex.resolve({
				source: Source.Lifi_Rest,
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
			})
		).rejects.toThrow('transfer status does not match source transaction')
	})

	it('rejects mismatched transfer ids from official status', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue({
			...status,
			transactionId: 'foreign-transfer-id',
		})
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		await expect(
			resolver.resolve.SourceTransferId.resolve(transfer)
		).rejects.toThrow('transfer id does not match status')
	})

	it('projects only status fields present in the official operation', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue(status)
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer_Timestamp resolver is not registered')

		const snapshot = await resolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: transfer,
			timestampMs: 1_700_000_200_000,
			source: Source.Lifi_Rest,
		})

		expect(snapshot).toMatchObject({
			status: 'DONE',
			substatus: 'COMPLETED',
			destinationTxHash,
			completedAt: 1_700_000_100_000,
		})
		expect(resolver.projections).not.toHaveProperty('sourceConfirmations')
		expect(resolver.projections).not.toHaveProperty('requiredConfirmations')
		expect(resolver.projections).not.toHaveProperty('relayer')
		expect(resolver.projections).not.toHaveProperty('refundTxHash')
		expect(resolver.projections).not.toHaveProperty('estimatedCompletionMs')
	})

	it('hard-fails BridgeTransfer snapshots for official NOT_FOUND status', async () => {
		fetchChains.mockResolvedValue(chains)
		fetchTransferStatus.mockResolvedValue({
			status: 'NOT_FOUND',
		})
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		await expect(
			resolver.resolve.SourceTransferId.resolve(transfer)
		).rejects.toThrow('transfer not found')
	})

	it('hard-fails BridgeTransfer snapshots for official INVALID status', async () => {
		fetchTransferStatus.mockResolvedValue({
			...status,
			status: 'INVALID',
		})
		const resolver = lifiRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LI.FI BridgeTransfer resolver is not registered')

		await expect(
			resolver.resolve.SourceTransferId.resolve(transfer)
		).rejects.toThrow('transfer status invalid')
		expect(fetchChains).not.toHaveBeenCalled()
	})
})
