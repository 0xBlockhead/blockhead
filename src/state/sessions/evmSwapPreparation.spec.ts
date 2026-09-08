import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'

import { ActionType, zeroAddress } from '$/actions/index.ts'
import { WalletCapability, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { Source } from '$/sources/Source.ts'
import type { WalletConnection } from '$/state/wallets/adapters/types.ts'
import {
	applyEvmSwapPreparation,
	prepareEvmSwap,
} from './evmSwapPreparation.ts'

const localMutationMocks = vi.hoisted(() => ({
	writeLocalBlockheadIntentQuote: vi.fn(),
	writeLocalBlockheadSessionSimulation: vi.fn(),
	writeLocalBlockheadSwapIntent: vi.fn(async () => ({
		sessionId: 'session-1',
		actionId: 'action-1',
	})),
	writeLocalBlockheadWalletRequest: vi.fn(),
	writeLocalBlockheadWalletRequest_Timestamp: vi.fn(),
}))

vi.mock('$/collections/localMutations.ts', () => localMutationMocks)


const fromAddress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
const tokenOut = '0x1111111111111111111111111111111111111111'
const routerAddress = '0x2222222222222222222222222222222222222222'

const action = {
	sessionId: 'session-1',
	actionId: 'action-1',
	indexInSequence: 0,
	actionType: ActionType.Swap,
	selectedProtocol: 'LiFi',
	actionParams: {
		chainId: 1,
		tokenIn: zeroAddress,
		tokenOut,
		amount: 1_000n,
		slippage: 0.005,
	},
}

const walletConnection = {
	connectionKey: 'connection-1',
	walletId: 'wallet-1',
	status: BlockheadConnectionStatus.Connected,
	protocol: WalletProtocol.Eip6963,
	transportKind: WalletTransportKind.InjectedProvider,
	scopes: [{
		namespace: 'eip155',
		reference: '1',
		methods: ['eth_sendTransaction'],
		events: [],
	}],
	accounts: [{
		namespace: 'eip155',
		reference: '1',
		accountAddress: fromAddress,
		capabilities: [WalletCapability.SendTransaction],
	}],
	activeAccount: {
		namespace: 'eip155',
		reference: '1',
		accountAddress: fromAddress,
		capabilities: [WalletCapability.SendTransaction],
	},
	selected: true,
} satisfies WalletConnection

const quoteSource = {
	source: Source.Lifi_Rest,
	getQuote: vi.fn(async () => ({
		id: 'quote-1',
		providerProtocol: 'LiFi',
		amountOut: 950n,
		amountOutMin: 940n,
		validUntil: 200,
		estimatedFillSeconds: 30,
		preparedCall: {
			from: fromAddress,
			to: routerAddress,
			input: '0x12345678',
			value: 1_000n,
		},
	})),
}

const simulationTransport = {
	origin: 'https://synthetic-rpc.example',
	getBlockNumber: vi.fn(async () => 21_000_000n),
	simulate: vi.fn(async () => ({
		output: '0x01',
		gasUsed: 120_000n,
	})),
}


beforeEach(() => {
	vi.clearAllMocks()
})

it('prepares quote and simulation evidence without invoking any wallet provider', async () => {
	const preparation = await prepareEvmSwap({
		session: {
			id: 'session-1',
			lockedAt: 1,
		},
		action,
		fromAddress,
		walletConnections: [walletConnection],
		quoteSource,
		simulationTransport,
		simulationId: 'simulation-1',
		timestampMs: 100,
	})

	expect(preparation).toMatchObject({
		ready: true,
		intent: {
			sessionId: 'session-1',
			actionId: 'action-1',
			chainId: 1,
			amount: 1_000n,
		},
		quote: {
			source: Source.Lifi_Rest,
			providerProtocol: 'LiFi',
			requestedAt: 100,
		},
		quoteObservation: {
			quoteId: 'quote-1',
			validUntil: 200,
		},
		preparedCall: {
			from: fromAddress,
			to: routerAddress,
			input: '0x12345678',
			value: 1_000n,
		},
		simulation: {
			id: 'simulation-1',
			status: 'succeeded',
			forkBlockNumber: 21_000_000n,
			gasUsed: 120_000n,
		},
	})
	expect(Object.hasOwn(preparation, 'txHash')).toBe(false)
	expect(Object.hasOwn(preparation, 'evmTransaction')).toBe(false)
})

it('persists intent, quote, simulation, and only a prepared wallet request', async () => {
	const context = Object.create(null)
	const preparation = await applyEvmSwapPreparation({
		context,
		session: {
			id: 'session-1',
			lockedAt: 1,
		},
		action,
		fromAddress,
		walletConnections: [walletConnection],
		quoteSource,
		simulationTransport,
		simulationId: 'simulation-1',
		timestampMs: 100,
	})

	expect(localMutationMocks.writeLocalBlockheadSwapIntent).toHaveBeenCalledExactlyOnceWith(
		context,
		preparation.intent
	)
	expect(localMutationMocks.writeLocalBlockheadIntentQuote).toHaveBeenCalledOnce()
	expect(localMutationMocks.writeLocalBlockheadSessionSimulation).toHaveBeenCalledExactlyOnceWith(
		context,
		{ id: 'session-1' },
		preparation.simulation,
		[preparation.simulationCall]
	)
	expect(localMutationMocks.writeLocalBlockheadWalletRequest).toHaveBeenCalledWith(
		context,
		expect.objectContaining({
			id: preparation.walletRequest.id,
			requestMethod: 'eth_sendTransaction',
			requestedAt: 100,
			evm: expect.objectContaining({
				simulation: {
					id: 'simulation-1',
				},
			}),
		}),
		[walletConnection]
	)
	expect(localMutationMocks.writeLocalBlockheadWalletRequest_Timestamp).toHaveBeenCalledExactlyOnceWith(
		context,
		preparation.walletRequest,
		{
			timestampMs: 100,
			source: Source.Local_Internal,
			status: 'prepared',
		}
	)
	expect(Object.hasOwn(preparation, 'submittedAt')).toBe(false)
	expect(Object.hasOwn(preparation, 'txHash')).toBe(false)
	expect(Object.hasOwn(preparation, 'evmTransaction')).toBe(false)
})

it('uses one concrete timestamp for all persisted preparation evidence when omitted', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(321)
	const context = Object.create(null)

	await applyEvmSwapPreparation({
		context,
		session: { id: 'session-1', lockedAt: 1 },
		action,
		fromAddress,
		walletConnections: [walletConnection],
		quoteSource,
		simulationTransport,
		simulationId: 'simulation-1',
	})

	const quote = localMutationMocks.writeLocalBlockheadIntentQuote.mock.calls[0]
	const simulation = localMutationMocks.writeLocalBlockheadSessionSimulation.mock.calls[0]
	const walletRequest = localMutationMocks.writeLocalBlockheadWalletRequest.mock.calls[0]
	const walletRequestTimestamp = localMutationMocks.writeLocalBlockheadWalletRequest_Timestamp.mock.calls[0]
	expect(quote[3]).toMatchObject({ requestedAt: 321 })
	expect(quote[4]).toMatchObject({ timestampMs: 321 })
	expect(simulation[2]).toMatchObject({ createdAt: 321, completedAt: 321 })
	expect(walletRequest[1]).toMatchObject({ requestedAt: 321 })
	expect(walletRequestTimestamp[2]).toMatchObject({ timestampMs: 321 })
	vi.restoreAllMocks()
})

it.each(['account', 'connection'] as const)('refuses stale %s authority after asynchronous simulation', async (change) => {
	const connections = [structuredClone(walletConnection)]
	await expect(applyEvmSwapPreparation({
		context: Object.create(null),
		session: { id: 'session-1', lockedAt: 1 },
		action,
		fromAddress,
		walletConnections: connections,
		quoteSource,
		simulationTransport: {
			...simulationTransport,
			simulate: async () => {
				connections[0] = {
					...walletConnection,
					...(change === 'connection' && { connectionKey: 'replacement-connection' }),
					activeAccount: {
						...walletConnection.activeAccount,
						accountAddress: change === 'account' ? routerAddress : fromAddress,
					},
				}
				return { output: '0x01', gasUsed: 120_000n }
			},
		},
		simulationId: 'stale-simulation',
		timestampMs: 100,
	})).rejects.toThrow('Swap preparation lost the selected wallet binding.')
	expect(localMutationMocks.writeLocalBlockheadSwapIntent).not.toHaveBeenCalled()
	expect(localMutationMocks.writeLocalBlockheadWalletRequest).not.toHaveBeenCalled()
})

it('stops before persistence when simulation fails', async () => {
	await expect(applyEvmSwapPreparation({
		context: Object.create(null),
		session: {
			id: 'session-1',
			lockedAt: 1,
		},
		action,
		fromAddress,
		walletConnections: [walletConnection],
		quoteSource,
		simulationTransport: {
			...simulationTransport,
			simulate: async () => {
				throw new Error('execution reverted')
			},
		},
		simulationId: 'simulation-1',
		timestampMs: 100,
	})).rejects.toThrow('execution reverted')

	expect(localMutationMocks.writeLocalBlockheadSwapIntent).not.toHaveBeenCalled()
	expect(localMutationMocks.writeLocalBlockheadIntentQuote).not.toHaveBeenCalled()
	expect(localMutationMocks.writeLocalBlockheadSessionSimulation).not.toHaveBeenCalled()
	expect(localMutationMocks.writeLocalBlockheadWalletRequest).not.toHaveBeenCalled()
	expect(localMutationMocks.writeLocalBlockheadWalletRequest_Timestamp).not.toHaveBeenCalled()
})
