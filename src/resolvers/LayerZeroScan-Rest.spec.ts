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

const getMessageByGuid = vi.hoisted(() => vi.fn())
vi.mock('$/sources/LayerZeroScan/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/LayerZeroScan/Rest/queries.ts')>(),
	getMessageByGuid,
}))

const { default: layerZeroScan } = await import('$/resolvers/LayerZeroScan-Rest.ts')

const sender = '0x1111111111111111111111111111111111111111'
const receiver = '0x2222222222222222222222222222222222222222'
const sourceTxHash = `0x${'3'.repeat(64)}`
const destinationTxHash = `0x${'6'.repeat(64)}`
const guid = `0x${'4'.repeat(64)}`
const pathwayId = `30101-30110-${sender}-${receiver}`
const transfer = {
	source: Source.LayerZeroScan_Rest,
	transferId: guid,
}
const message = {
	pathway: {
		srcEid: 30101,
		dstEid: 30110,
		sender: {
			address: sender,
			chain: 'ethereum',
		},
		receiver: {
			address: receiver,
			chain: 'arbitrum',
		},
		id: pathwayId,
		nonce: 42,
	},
	source: {
		status: 'SUCCEEDED',
		tx: {
			txHash: sourceTxHash,
			blockHash: `0x${'5'.repeat(64)}`,
			blockNumber: '21000000',
			blockTimestamp: 1_784_783_358,
			from: sender,
			blockConfirmations: 64,
			value: '0',
		},
	},
	destination: {
		status: 'SUCCEEDED',
		nativeDrop: {
			status: 'N/A',
		},
		lzCompose: {
			status: 'N/A',
		},
		tx: {
			txHash: destinationTxHash,
			blockHash: `0x${'7'.repeat(64)}`,
			blockNumber: 220_000_000,
			blockTimestamp: 1_784_783_400,
		},
	},
	verification: {
		dvn: {
			status: 'SUCCEEDED',
			dvns: {},
		},
		sealer: {
			status: 'SUCCEEDED',
		},
	},
	guid,
	config: {
		error: false,
		dvnConfigError: false,
		ulnSendVersion: 'V302',
		ulnReceiveVersion: 'V302',
		outboundConfig: {
			confirmations: 15,
			executor: '0x3333333333333333333333333333333333333333',
		},
	},
	status: {
		name: 'DELIVERED',
		message: 'Destination transaction succeeded',
	},
	created: '2026-07-23T05:09:22.000Z',
	updated: '2026-07-23T05:09:40.000Z',
} as const

describe('LayerZeroScan BridgeTransfer resolvers', () => {
	afterEach(() => {
		getMessageByGuid.mockReset()
	})

	it('materializes schema-shaped transfer fields from the GUID message', async () => {
		getMessageByGuid.mockResolvedValue({
			data: [message],
		})
		const resolver = layerZeroScan.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LayerZeroScan_Rest: BridgeTransfer resolver missing')

		const snapshot = await resolver.resolve.SourceTransferId.resolve(transfer)

		expect(getMessageByGuid).toHaveBeenCalledWith({
			guid,
		})
		expect(snapshot).toMatchObject({
			source: Source.LayerZeroScan_Rest,
			transferId: guid,
			assetOutcome: 'MessageOnly',
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
					address: sender,
				},
			},
			$recipient: {
				[EntityMetaKey.Selector]: {
					address: receiver,
				},
			},
		})
		expect(resolver.projections.$$timestamps.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs: Date.parse(message.updated),
				source: Source.LayerZeroScan_Rest,
			},
		}])
		expect(resolver.projections.$$timestamps.resolveCount(snapshot)).toBe(1)
	})

	it('does not claim transaction-log-index resolution without a Scan log-index identity', () => {
		const resolver = layerZeroScan.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (resolver == null)
			throw new Error('LayerZeroScan_Rest: BridgeTransfer resolver missing')

		expect(resolver.resolve).not.toHaveProperty('SourceTxSourceLogIndex')
	})

	it('projects status observations from official message lifecycle fields', async () => {
		getMessageByGuid.mockResolvedValue({
			data: [message],
		})
		const resolver = layerZeroScan.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (resolver == null)
			throw new Error('LayerZeroScan_Rest: BridgeTransfer_Timestamp resolver missing')

		const snapshot = await resolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: transfer,
			timestampMs: Date.parse(message.updated),
			source: Source.LayerZeroScan_Rest,
		})

		expect(snapshot).toMatchObject({
			status: 'DELIVERED',
			substatus: 'Destination transaction succeeded',
			sourceConfirmations: 64,
			requiredConfirmations: 15,
			destinationTxHash,
			completedAt: 1_784_783_400_000,
			relayer: '0x3333333333333333333333333333333333333333',
		})
		expect(resolver.projections).not.toHaveProperty('refundTxHash')
		expect(resolver.projections).not.toHaveProperty('estimatedCompletionMs')
	})

	it('fails closed on empty GUID results, unmapped endpoints, and clock mismatch', async () => {
		getMessageByGuid.mockResolvedValueOnce({
			data: [],
		})
		const transferResolver = layerZeroScan.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer
		))
		if (transferResolver == null)
			throw new Error('LayerZeroScan_Rest: BridgeTransfer resolver missing')

		await expect(transferResolver.resolve.SourceTransferId.resolve(transfer))
			.rejects.toThrow('expected one message')

		getMessageByGuid.mockResolvedValueOnce({
			data: [{
				...message,
				pathway: {
					...message.pathway,
					dstEid: 30999,
					id: `30101-30999-${sender}-${receiver}`,
				},
			}],
		})
		await expect(transferResolver.resolve.SourceTransferId.resolve(transfer))
			.rejects.toThrow('unmapped endpoint id')

		getMessageByGuid.mockResolvedValueOnce({
			data: [message],
		})
		const timestampResolver = layerZeroScan.resolvers.find((candidate) => (
			candidate.entityType === EntityType.BridgeTransfer_Timestamp
		))
		if (timestampResolver == null)
			throw new Error('LayerZeroScan_Rest: BridgeTransfer_Timestamp resolver missing')

		await expect(timestampResolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: transfer,
			timestampMs: Date.parse(message.updated) + 1,
			source: Source.LayerZeroScan_Rest,
		})).rejects.toThrow('observation clock mismatch')
	})
})
