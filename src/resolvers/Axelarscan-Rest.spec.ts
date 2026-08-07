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

vi.mock('$/sources/Axelarscan/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Axelarscan/Rest/queries.ts')>(),
	getGmpMessages,
}))

const { default: axelarscanResolvers } = await import('$/resolvers/Axelarscan-Rest.ts')

const bridgeTransferResolver = axelarscanResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BridgeTransfer
))
const bridgeTransferTimestampResolver = axelarscanResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BridgeTransfer_Timestamp
))
const evmAccountResolver = axelarscanResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmAccount
))

if (bridgeTransferResolver == null)
	throw new Error('Axelarscan_Rest: BridgeTransfer resolver missing')
if (bridgeTransferTimestampResolver == null)
	throw new Error('Axelarscan_Rest: BridgeTransfer_Timestamp resolver missing')
if (evmAccountResolver == null)
	throw new Error('Axelarscan_Rest: EvmAccount resolver missing')

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
		logIndex: 519,
		_logIndex: 1,
		id: `${sourceTransactionHash}_2_519`,
		blockNumber: 1_000,
		block_timestamp: 1_784_780_000,
		event: 'ContractCall',
		receipt: {
			confirmations: 12,
			gasUsed: '21000',
			effectiveGasPrice: '1000',
		},
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
		sourceTransactionLogIndex: 519,
		relayerAddress,
		receipt: {
			gasUsed: '397688',
			effectiveGasPrice: '6000000',
			confirmations: 5,
		},
	},
	fees: {
		base_fee_usd: 0.014628501,
		destination_native_token: {
			decimals: 18,
			token_price: {
				usd: 2500,
			},
		},
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
		expect(bridgeTransferResolver.projections.bridgeFeeUsd(snapshot)).toBe('0.014628501')
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
		expect(bridgeTransferResolver.projections.$$timestamps.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transfer: transfer,
				timestampMs: 1_784_780_004_000,
				source: Source.Axelarscan_Rest,
			},
		}])
		expect(bridgeTransferResolver.projections.$$timestamps.resolveCount(snapshot)).toBe(1)
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
		expect(bridgeTransferTimestampResolver.projections.sourceConfirmations(observation)).toBe(12)
		expect(bridgeTransferTimestampResolver.projections.fillGasFee(observation)).toBe(397688n * 6000000n)
		expect(bridgeTransferTimestampResolver.projections.fillGasFeeUsd(observation)).toBe(
			String(Number(397688n * 6000000n) / 1e18 * 2500)
		)
	})

	it('projects destination execution error detail when simplified status is failed', async () => {
		getGmpMessages.mockResolvedValueOnce({
			data: [{
				...message,
				executed: undefined,
				simplified_status: 'failed',
				status: 'error',
				error: {
					chain: 'base',
					sourceChain: 'moonbeam',
					error: {
						reason: 'execution reverted',
						message: 'GMP execution reverted: insufficient gas',
					},
				},
			}],
			total: 1,
			time_spent: 1,
		})

		const observation = await bridgeTransferTimestampResolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: {
				source: Source.Axelarscan_Rest,
				transferId: message.message_id,
			},
			timestampMs: 1_784_780_000_000,
			source: Source.Axelarscan_Rest,
		}, resolverContext)
		expect(bridgeTransferTimestampResolver.projections.error(observation)).toBe(
			'GMP execution reverted: insufficient gas'
		)
		expect(bridgeTransferTimestampResolver.projections.fillGasFeeUsd(observation)).toBeUndefined()
	})

	it('lists EvmAccount.$$bridgeTransfers by senderAddress with offset continuation', async () => {
		getGmpMessages.mockResolvedValueOnce({
			data: [message, {
				...message,
				call: {
					...message.call,
					chain: 'cosmoshub',
					returnValues: {
						...message.call.returnValues,
						destinationChain: 'osmosis',
					},
				},
				message_id: `${sourceTransactionHash}-99`,
			}],
			total: 42,
			time_spent: 1,
		})

		const snapshot = await evmAccountResolver.resolve.AddressInteropAddress.resolve({
			address: sourceAddress,
			interopAddress: undefined,
		}, {
			...resolverContext,
			pagination: {
				offset: 0,
			},
		})

		expect(getGmpMessages).toHaveBeenCalledWith({
			senderAddress: sourceAddress,
			from: 0,
			size: 25,
		})
		expect(evmAccountResolver.projections.$$bridgeTransfers.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				source: Source.Axelarscan_Rest,
				transferId: message.message_id,
			},
		}])
		expect(evmAccountResolver.projections.$$bridgeTransfers).not.toHaveProperty('resolveCount')
		expect(evmAccountResolver.projections.$$bridgeTransfers.continuation(snapshot)).toMatchObject({
			operation: 'account-bridge-transfers',
			target: 'axelarscan',
			terminal: false,
			token: '25',
		})
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

	it('omits cosmos relayer identities instead of failing closed', async () => {
		getGmpMessages.mockResolvedValueOnce({
			data: [{
				...message,
				executed: {
					...message.executed!,
					relayerAddress: 'axelar1j4ypvp2m8n0jxj5thtfampd42vjl3chlnuv9e4',
					from: undefined,
					receipt: {
						...message.executed!.receipt!,
						from: undefined,
					},
				},
			}],
			total: 1,
			time_spent: 1,
		})

		const observation = await bridgeTransferTimestampResolver.resolve.TransferTimestampMsSource.resolve({
			$transfer: {
				source: Source.Axelarscan_Rest,
				transferId: message.message_id,
			},
			timestampMs: 1_784_780_004_000,
			source: Source.Axelarscan_Rest,
		}, resolverContext)
		expect(bridgeTransferTimestampResolver.projections.relayer(observation)).toBeUndefined()
	})
})
