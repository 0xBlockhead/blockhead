import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { BridgeAssetOutcome } from '$/constants/Bridge.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { AxelarscanGmpMessage } from '$/sources/Axelarscan/Rest/types.ts'

const getGmpMessages = vi.fn()

vi.mock('$/sources/Axelarscan/Rest/queries.ts', () => ({
	getGmpMessages,
}))

const { default: axelarscanResolvers } = await import('$/resolvers/Axelarscan-Rest.ts')

const bridgeTransferResolver = axelarscanResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BridgeTransfer
))
const bridgeTransferTimestampResolver = axelarscanResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BridgeTransfer_Timestamp
))

if (bridgeTransferResolver == null)
	throw new Error('Axelarscan_Rest: BridgeTransfer resolver missing')
if (bridgeTransferTimestampResolver == null)
	throw new Error('Axelarscan_Rest: BridgeTransfer_Timestamp resolver missing')

const sourceTransactionHash = `0x${'1'.repeat(64)}`
const executionTransactionHash = `0x${'4'.repeat(64)}`
const payloadHash = `0x${'5'.repeat(64)}`
const sourceAddress = `0x${'a'.repeat(40)}`
const destinationAddress = `0x${'b'.repeat(40)}`
const relayerAddress = `0x${'c'.repeat(40)}`

const message = {
	call: {
		chain: 'moonbeam',
		transactionHash: sourceTransactionHash,
		transactionIndex: 2,
		logIndex: 1,
		id: `${sourceTransactionHash}_2_1`,
		blockNumber: 1_000,
		block_timestamp: 1_784_780_000,
		event: 'ContractCall',
		returnValues: {
			sender: sourceAddress,
			destinationChain: 'base',
			destinationContractAddress: destinationAddress,
			payloadHash,
			payload: '0x1234',
		},
	},
	message_id: `${sourceTransactionHash}-1`,
	executed: {
		chain: 'base',
		transactionHash: executionTransactionHash,
		transactionIndex: 5,
		logIndex: 4,
		id: `${executionTransactionHash}_5_4`,
		blockNumber: 2_000,
		block_timestamp: 1_784_780_004,
		event: 'execute',
		sourceTransactionHash,
		sourceTransactionIndex: 2,
		sourceTransactionLogIndex: 1,
		relayerAddress,
	},
	status: 'executed',
	simplified_status: 'received',
} as const satisfies AxelarscanGmpMessage

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Axelarscan BridgeTransfer resolvers', () => {
	beforeEach(() => {
		getGmpMessages.mockReset()
		getGmpMessages.mockResolvedValue({
			data: [message],
			total: 1,
			time_spent: 1,
		})
	})

	it('materializes GMP message identity into schema-shaped BridgeTransfer fields', async () => {
		const transfer = {
			source: Source.Axelarscan_Rest,
			transferId: message.message_id,
		}
		const snapshot = await bridgeTransferResolver.resolve.SourceTransferId.resolve(
			transfer,
			resolverContext
		)

		expect(getGmpMessages).toHaveBeenCalledWith({
			transactionHash: sourceTransactionHash,
		})
		expect(bridgeTransferResolver.projections.source(snapshot)).toBe(Source.Axelarscan_Rest)
		expect(bridgeTransferResolver.projections.transferId(snapshot)).toBe(message.message_id)
		expect(bridgeTransferResolver.projections.logIndex(snapshot)).toBe(1)
		expect(bridgeTransferResolver.projections.assetOutcome(snapshot)).toBe(BridgeAssetOutcome.MessageOnly)
		expect(bridgeTransferResolver.projections.$fromNetwork(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				caip2: {
					namespace: 'eip155',
					reference: '1284',
				},
			},
		})
		expect(bridgeTransferResolver.projections.$toNetwork(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				caip2: {
					namespace: 'eip155',
					reference: '8453',
				},
			},
		})
		expect(bridgeTransferResolver.projections.$sourceTx(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1284',
					},
				},
				txHash: sourceTransactionHash,
			},
		})
		expect(bridgeTransferResolver.projections.$destinationTx(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '8453',
					},
				},
				txHash: executionTransactionHash,
			},
		})
		expect(bridgeTransferResolver.projections.$sender(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				address: sourceAddress,
			},
		})
		expect(bridgeTransferResolver.projections.$$timestamps(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs: 1_784_780_004_000,
				source: Source.Axelarscan_Rest,
			},
		}])
	})

	it('resolves SourceTxSourceLogIndex and BridgeTransfer_Timestamp observations', async () => {
		const transfer = {
			source: Source.Axelarscan_Rest,
			transferId: message.message_id,
		}
		const byLog = await bridgeTransferResolver.resolve.SourceTxSourceLogIndex.resolve({
			$sourceTx: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1284',
					},
				},
				txHash: sourceTransactionHash,
			},
			source: Source.Axelarscan_Rest,
			logIndex: 1,
		}, resolverContext)
		expect(bridgeTransferResolver.projections.transferId(byLog)).toBe(message.message_id)

		const observation = await bridgeTransferTimestampResolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: transfer,
			timestampMs: 1_784_780_004_000,
			source: Source.Axelarscan_Rest,
		}, resolverContext)
		expect(bridgeTransferTimestampResolver.projections.status(observation)).toBe('executed')
		expect(bridgeTransferTimestampResolver.projections.substatus(observation)).toBe('received')
		expect(bridgeTransferTimestampResolver.projections.destinationTxHash(observation)).toBe(executionTransactionHash)
		expect(bridgeTransferTimestampResolver.projections.relayer(observation)).toBe(relayerAddress)
		expect(bridgeTransferTimestampResolver.projections.completedAt(observation)).toBe(1_784_780_004_000)
	})

	it('rejects non-EVM GMP legs and clock mismatches before projection', async () => {
		getGmpMessages.mockResolvedValueOnce({
			data: [{
				...message,
				call: {
					...message.call,
					chain: 'cosmoshub',
				},
			}],
			total: 1,
			time_spent: 1,
		})
		await expect(bridgeTransferResolver.resolve.SourceTransferId.resolve({
			source: Source.Axelarscan_Rest,
			transferId: message.message_id,
		}, resolverContext)).rejects.toThrow('unmapped EVM chain key')

		getGmpMessages.mockResolvedValueOnce({
			data: [message],
			total: 1,
			time_spent: 1,
		})
		await expect(bridgeTransferTimestampResolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: {
				source: Source.Axelarscan_Rest,
				transferId: message.message_id,
			},
			timestampMs: 1,
			source: Source.Axelarscan_Rest,
		}, resolverContext)).rejects.toThrow('observation clock mismatch')
	})
})
