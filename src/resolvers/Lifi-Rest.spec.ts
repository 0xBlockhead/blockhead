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
		})
		expect(resolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs: 1_700_000_200_000,
				source: Source.Lifi_Rest,
			},
		}])
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
})
