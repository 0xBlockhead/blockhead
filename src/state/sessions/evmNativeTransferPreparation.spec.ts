import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { ActionType, zeroAddress } from '$/constants/actions.ts'
import { WalletCapability, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'
import type { WalletConnection } from '$/state/wallets/adapters/types.ts'
import {
	applyEvmNativeTransferPreparation,
	type EvmNativeTransferExecutionTransport,
	prepareEvmNativeTransfer,
} from './evmNativeTransferPreparation.ts'

const localMutationMocks = vi.hoisted(() => ({
	writeLocalBlockheadActionReadinessChecks: vi.fn(),
	writeLocalBlockheadSessionSimulation: vi.fn(),
	writeLocalBlockheadTransferIntent: vi.fn(),
	writeLocalBlockheadWalletRequest: vi.fn(),
	writeLocalBlockheadWalletRequest_Timestamp: vi.fn(),
}))

vi.mock('$/collections/localMutations.ts', () => localMutationMocks)


const fromAddress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
const uppercaseFromAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
const toAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
const secondToAddress = '0x3333333333333333333333333333333333333333'
const expectedParamsHash = '0x2794f5ea61c302942d597479cd8700c04dee988b2dafe7f1f78af7be5dfe502d'
const expectedResultHash = '0xcc5693b5ef1922db451cab54d37683180721b36fbb6d2ea6691a1d8014eecc17'
const expectedEmptyDataHash = '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
const expectedWalletRequestIdBySimulationId = {
	'simulation-application': '0x9855d71980eb5d6907d816e7625109a80d3ce822b85842288779a5ed4ae47f9e',
	'simulation-fallback': '0x19c4728df25c9a40df7a992c851f022b8e4b663b0d8cc0724b1af3e2dd2569e4',
	'simulation-application-retry': '0x574f9dbdefe5ba95e02c325e21083d99cd5f8882458d0864680dc46a2c56eef9',
} as const

const transferAction = ({
	sessionId = 'session-1',
	actionId = 'action-1',
	indexInSequence = 0,
	actionType = ActionType.Transfer,
	actionParams = {
		fromActor: uppercaseFromAddress,
		toActor: toAddress,
		chainId: 1,
		tokenAddress: zeroAddress,
		amount: 2n,
	},
}: {
	sessionId?: string
	actionId?: string
	indexInSequence?: number
	actionType?: ActionType
	actionParams?: object
} = {}) => ({
	sessionId,
	actionId,
	indexInSequence,
	actionType,
	actionParams,
})

const connectedWallet = ({
	selected = true,
	status = BlockheadConnectionStatus.Connected,
	accountAddress = fromAddress,
	reference = '1',
	namespace = 'eip155',
	capabilities = [WalletCapability.SendTransaction],
	methods = ['eth_sendTransaction'],
	activeAccount = true,
}: {
	selected?: boolean
	status?: BlockheadConnectionStatus
	accountAddress?: string
	reference?: string
	namespace?: string
	capabilities?: WalletCapability[]
	methods?: string[]
	activeAccount?: boolean
} = {}): WalletConnection => ({
	connectionKey: 'connection-1',
	walletId: 'wallet-1',
	status,
	protocol: WalletProtocol.Eip6963,
	transportKind: WalletTransportKind.InjectedProvider,
	scopes: [{
		namespace,
		reference,
		methods,
		events: [],
	}],
	accounts: [{
		namespace,
		reference,
		accountAddress,
		capabilities,
	}],
	...(activeAccount && { activeAccount: {
		namespace,
		reference,
		accountAddress,
		capabilities,
	} }),
	selected,
})

const executionTransport = ({
	origin = 'https://ethereum.example',
	blockNumber = '0x2a',
	callOutput = '0x',
	gas = 21_000n,
	getBlockByNumber: getBlockByNumberOverride,
}: {
	origin?: string
	blockNumber?: string
	callOutput?: string
	gas?: bigint
	getBlockByNumber?: EvmNativeTransferExecutionTransport['getBlockByNumber']
} = {}) => {
	const getBlockByNumber = vi.fn<EvmNativeTransferExecutionTransport['getBlockByNumber']>(
		getBlockByNumberOverride
		?? (async () => ({ number: blockNumber }))
	)
	const getCall = vi.fn(async () => callOutput)
	const estimateGas = vi.fn(async () => gas)
	return {
		transport: {
			origin,
			getBlockByNumber,
			getCall,
			estimateGas,
		} satisfies EvmNativeTransferExecutionTransport,
		getBlockByNumber,
		getCall,
		estimateGas,
	}
}


describe('EVM native transfer preparation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it.each([
		{
			name: 'unlocked session',
			session: { id: 'session-1' },
			actions: [transferAction()],
			expectedCheck: 'session-locked',
		},
		{
			name: 'no action',
			session: { id: 'session-1', lockedAt: 1 },
			actions: [],
			expectedCheck: 'single-transfer-action',
		},
		{
			name: 'multiple actions',
			session: { id: 'session-1', lockedAt: 1 },
			actions: [
				transferAction(),
				transferAction({ actionId: 'action-2', indexInSequence: 1 }),
			],
			expectedCheck: 'single-transfer-action',
		},
		{
			name: 'action from another session',
			session: { id: 'session-1', lockedAt: 1 },
			actions: [transferAction({ sessionId: 'session-2' })],
			expectedCheck: 'single-transfer-action',
		},
		{
			name: 'non-leading only action',
			session: { id: 'session-1', lockedAt: 1 },
			actions: [transferAction({ indexInSequence: 1 })],
			expectedCheck: 'single-transfer-action',
		},
		{
			name: 'non-transfer action',
			session: { id: 'session-1', lockedAt: 1 },
			actions: [transferAction({
				actionType: ActionType.Swap,
				actionParams: {
					chainId: 1,
					tokenIn: zeroAddress,
					tokenOut: zeroAddress,
					amount: 2n,
					slippage: 0.005,
				},
			})],
			expectedCheck: 'single-transfer-action',
		},
		{
			name: 'malformed native params',
			session: { id: 'session-1', lockedAt: 1 },
			actions: [transferAction({
				actionParams: {
					fromActor: 'invalid',
					toActor: toAddress,
					chainId: 1,
					tokenAddress: zeroAddress,
					amount: 2n,
				},
			})],
			expectedCheck: 'native-transfer-params',
		},
		{
			name: 'unsafe EIP-155 chain ID',
			session: { id: 'session-1', lockedAt: 1 },
			actions: [transferAction({
				actionParams: {
					fromActor: fromAddress,
					toActor: toAddress,
					chainId: Number.MAX_SAFE_INTEGER + 1,
					tokenAddress: zeroAddress,
					amount: 2n,
				},
			})],
			expectedCheck: 'native-transfer-params',
		},
		{
			name: 'ERC-20 token',
			session: { id: 'session-1', lockedAt: 1 },
			actions: [transferAction({
				actionParams: {
					fromActor: fromAddress,
					toActor: toAddress,
					chainId: 1,
					tokenAddress: '0x9999999999999999999999999999999999999999',
					amount: 2n,
				},
			})],
			expectedCheck: 'native-transfer-params',
		},
		{
			name: 'zero amount',
			session: { id: 'session-1', lockedAt: 1 },
			actions: [transferAction({
				actionParams: {
					fromActor: fromAddress,
					toActor: toAddress,
					chainId: 1,
					tokenAddress: zeroAddress,
					amount: 0n,
				},
			})],
			expectedCheck: 'native-transfer-params',
		},
	])('blocks $name without touching RPC', async ({
		session,
		actions,
		expectedCheck,
	}) => {
		const transport = executionTransport()
		const result = await prepareEvmNativeTransfer({
			session,
			actions,
			walletConnections: [connectedWallet()],
			executionTransport: transport.transport,
			simulationId: 'simulation-invalid-input',
			timestampMs: 100,
		})

		expect(result.ready).toBe(false)
		expect(result.readiness.find(({ checkId }) => checkId === expectedCheck)?.status).toBe('blocked')
		expect(result.readiness.find(({ checkId }) => checkId === 'rpc-simulation')?.status).toBe('not-evaluated')
		expect(transport.getBlockByNumber).not.toHaveBeenCalled()
		expect(transport.getCall).not.toHaveBeenCalled()
		expect(transport.estimateGas).not.toHaveBeenCalled()
	})

	it('rejects Date.now()-shaped sequence indexes with the locked-prep e2e blocked copy', async () => {
		const result = await prepareEvmNativeTransfer({
			session: {
				id: 'session-1',
				lockedAt: 1,
			},
			actions: [transferAction({
				indexInSequence: 1785834781924,
			})],
			walletConnections: [connectedWallet()],
			executionTransport: executionTransport().transport,
			simulationId: 'simulation-timestamp-index',
			timestampMs: 100,
		})

		expect(result.ready).toBe(false)
		expect(result.error).toBe('The single transfer action must be first in the session sequence.')
		expect(result.walletRequest).toBeUndefined()
	})

	it.each([
		{
			name: 'no selected connection',
			walletConnections: [connectedWallet({ selected: false })],
			expectedCheck: 'wallet-account',
		},
		{
			name: 'multiple selected connections',
			walletConnections: [
				connectedWallet(),
				{
					...connectedWallet(),
					connectionKey: 'connection-2',
					walletId: 'wallet-2',
				},
			],
			expectedCheck: 'wallet-account',
		},
		{
			name: 'disconnected selected connection',
			walletConnections: [connectedWallet({ status: BlockheadConnectionStatus.Disconnected })],
			expectedCheck: 'wallet-account',
		},
		{
			name: 'selected connection without an active account',
			walletConnections: [connectedWallet({ activeAccount: false })],
			expectedCheck: 'wallet-account',
		},
		{
			name: 'wrong account namespace',
			walletConnections: [connectedWallet({ namespace: 'solana' })],
			expectedCheck: 'wallet-account',
		},
		{
			name: 'wrong account chain',
			walletConnections: [connectedWallet({ reference: '10' })],
			expectedCheck: 'wallet-account',
		},
		{
			name: 'wrong sender account',
			walletConnections: [connectedWallet({ accountAddress: secondToAddress })],
			expectedCheck: 'wallet-account',
		},
		{
			name: 'missing SendTransaction capability',
			walletConnections: [connectedWallet({ capabilities: [] })],
			expectedCheck: 'send-transaction-capability',
		},
		{
			name: 'missing eth_sendTransaction scope',
			walletConnections: [connectedWallet({ methods: ['personal_sign'] })],
			expectedCheck: 'eth-send-transaction-scope',
		},
	])('returns persistable $name readiness without touching RPC', async ({
		walletConnections,
		expectedCheck,
	}) => {
		const transport = executionTransport()
		const result = await prepareEvmNativeTransfer({
			session: { id: 'session-1', lockedAt: 1 },
			actions: [transferAction()],
			walletConnections,
			executionTransport: transport.transport,
			simulationId: 'simulation-wallet-readiness',
			timestampMs: 100,
		})
		const failedReadiness = result.readiness.find(({ checkId }) => checkId === expectedCheck)

		expect(result.ready).toBe(false)
		expect(result.paramsHash).toBe(expectedParamsHash)
		expect(result.intent).toBeDefined()
		expect(failedReadiness).toMatchObject({
			status: 'blocked',
			check: {
				sessionId: 'session-1',
				actionId: 'action-1',
				checkId: expectedCheck,
			},
			observation: {
				timestampMs: 100,
				status: 'blocked',
			},
		})
		expect(result.readiness.find(({ checkId }) => checkId === 'rpc-simulation')).toMatchObject({
			status: 'not-evaluated',
			observation: {
				source: Source.Voltaire_JsonRpc,
				status: 'not-evaluated',
			},
		})
		expect(transport.getBlockByNumber).not.toHaveBeenCalled()
	})

	it('normalizes identities and simulates both calls at one captured block and origin', async () => {
		const transport = executionTransport()
		const result = await prepareEvmNativeTransfer({
			session: { id: 'session-1', lockedAt: 1 },
			actions: [transferAction()],
			walletConnections: [connectedWallet()],
			executionTransport: transport.transport,
			simulationId: 'simulation-success',
			timestampMs: 100,
		})

		expect(result).toMatchObject({
			ready: true,
			intent: {
				sessionId: 'session-1',
				actionId: 'action-1',
				fromCaip10: {
					namespace: 'eip155',
					reference: '1',
					accountAddress: fromAddress,
				},
				toCaip10: {
					namespace: 'eip155',
					reference: '1',
					accountAddress: toAddress,
				},
				networkCaip2: {
					namespace: 'eip155',
					reference: '1',
				},
				assetCaip19: 'eip155:1/slip44:60',
				fromAddress,
				toAddress,
				chainId: 1,
				tokenAddress: zeroAddress,
				$token: {
					[EntityMetaKey.Selector]: {
						type: CoinInstanceType.NativeCurrency,
					},
				},
				amount: 2n,
			},
			transaction: {
				from: fromAddress,
				to: toAddress,
				input: '0x',
				value: 2n,
			},
			simulation: {
				status: 'succeeded',
				forkBlockNumber: 42n,
				forkRpcOrigin: 'https://ethereum.example',
				actionCount: 1,
				gasUsed: 21_000n,
			},
			simulationCall: {
				callPath: '0',
				callType: 'CALL',
				fromAddress,
				toAddress,
				value: 2n,
				gasUsed: 21_000n,
				reverted: false,
			},
		})
		expect(result.paramsHash).toBe(expectedParamsHash)
		expect(result.simulation?.resultPayloadHash).toBe(expectedResultHash)
		expect(result.simulationCall?.inputDataHash).toBe(expectedEmptyDataHash)
		expect(result.simulationCall?.outputDataHash).toBe(expectedEmptyDataHash)
		expect(result.readiness).toHaveLength(7)
		expect(result.readiness.every(({ status }) => status === 'ready')).toBe(true)
		expect(result.readiness.every(({ check, observation }) => (
			check != null
			&& observation?.$readinessCheck[EntityMetaKey.Selector].checkId === check.checkId
		))).toBe(true)
		expect(transport.getBlockByNumber).toHaveBeenCalledWith({
			blockNumber: 'latest',
			txObjects: false,
		})
		const expectedSimulationCall = {
			from: fromAddress,
			to: toAddress,
			input: '0x',
			value: 2n,
			blockTag: '0x2a',
		}
		expect(transport.getCall).toHaveBeenCalledWith(expectedSimulationCall)
		expect(transport.estimateGas).toHaveBeenCalledWith(expectedSimulationCall)
	})

	it.each([
		{
			name: 'missing transport',
			configure: () => undefined,
			expectedError: 'No EVM execution transport',
			expectedCallCount: 0,
		},
		{
			name: 'missing latest block',
			configure: () => {
				const configured = executionTransport()
				configured.getBlockByNumber.mockResolvedValue(null)
				return configured
			},
			expectedError: 'returned no latest block',
			expectedCallCount: 0,
		},
		{
			name: 'invalid RPC origin',
			configure: () => executionTransport({ origin: 'invalid' }),
			expectedError: 'could not capture an execution block',
			expectedCallCount: 0,
		},
		{
			name: 'block fetch rejection',
			configure: () => {
				const configured = executionTransport()
				configured.getBlockByNumber.mockRejectedValue(new Error('block unavailable'))
				return configured
			},
			expectedError: 'block unavailable',
			expectedCallCount: 0,
		},
		{
			name: 'eth_call rejection',
			configure: () => {
				const configured = executionTransport()
				configured.getCall.mockRejectedValue(new Error('execution reverted'))
				return configured
			},
			expectedError: 'eth_call: execution reverted',
			expectedCallCount: 1,
		},
		{
			name: 'malformed eth_call output',
			configure: () => executionTransport({ callOutput: 'malformed' }),
			expectedError: 'malformed eth_call data',
			expectedCallCount: 1,
		},
		{
			name: 'eth_estimateGas rejection',
			configure: () => {
				const configured = executionTransport()
				configured.estimateGas.mockRejectedValue(new Error('insufficient funds'))
				return configured
			},
			expectedError: 'eth_estimateGas: insufficient funds',
			expectedCallCount: 1,
		},
	])('returns $name as simulation evidence instead of throwing', async ({
		configure,
		expectedError,
		expectedCallCount,
	}) => {
		const configured = configure()
		const result = await prepareEvmNativeTransfer({
			session: { id: 'session-1', lockedAt: 1 },
			actions: [transferAction()],
			walletConnections: [connectedWallet()],
			executionTransport: configured?.transport,
			simulationId: 'simulation-failure',
			timestampMs: 100,
		})

		expect(result.ready).toBe(false)
		expect(result.error).toContain(expectedError)
		expect(result.paramsHash).toBe(expectedParamsHash)
		expect(result.intent).toBeDefined()
		expect(result.simulation).toMatchObject({
			status: 'failed',
			paramsHash: result.paramsHash,
		})
		expect(result.readiness.find(({ checkId }) => checkId === 'rpc-simulation')).toMatchObject({
			status: 'blocked',
			observation: {
				status: 'blocked',
			},
		})
		if (configured != null) {
			expect(configured.getCall).toHaveBeenCalledTimes(expectedCallCount)
			expect(configured.estimateGas).toHaveBeenCalledTimes(expectedCallCount)
		}
	})

	it('keeps same-timestamp retry hashes stable while attempt IDs stay unique and edits stale prior evidence', async () => {
		const first = await prepareEvmNativeTransfer({
			session: { id: 'session-1', lockedAt: 1 },
			actions: [transferAction()],
			walletConnections: [connectedWallet()],
			executionTransport: executionTransport({
				origin: 'https://first.example',
				blockNumber: '0x2a',
			}).transport,
			simulationId: 'simulation-first',
			timestampMs: 100,
		})
		const retry = await prepareEvmNativeTransfer({
			session: { id: 'session-1', lockedAt: 2 },
			actions: [transferAction({
				actionParams: {
					fromActor: fromAddress.toUpperCase().replace('0X', '0x'),
					toActor: toAddress.toUpperCase().replace('0X', '0x'),
					chainId: 1,
					tokenAddress: zeroAddress,
					amount: 2n,
				},
			})],
			walletConnections: [connectedWallet()],
			executionTransport: executionTransport({
				origin: 'https://second.example',
				blockNumber: '0x2b',
			}).transport,
			simulationId: 'simulation-retry',
			timestampMs: 100,
		})
		const edited = await prepareEvmNativeTransfer({
			session: { id: 'session-1', lockedAt: 2 },
			actions: [transferAction({
				actionParams: {
					fromActor: fromAddress,
					toActor: secondToAddress,
					chainId: 1,
					tokenAddress: zeroAddress,
					amount: 3n,
				},
			})],
			walletConnections: [connectedWallet()],
			executionTransport: executionTransport().transport,
			simulationId: 'simulation-edited',
			timestampMs: 300,
		})

		expect(first.ready).toBe(true)
		expect(retry.ready).toBe(true)
		expect(edited.ready).toBe(true)
		expect(retry.paramsHash).toBe(first.paramsHash)
		expect(first.simulation?.id).toBe('simulation-first')
		expect(retry.simulation?.id).toBe('simulation-retry')
		expect(retry.intent?.$sessionAction[EntityMetaKey.Selector]).toEqual(
			first.intent?.$sessionAction[EntityMetaKey.Selector]
		)
		expect(edited.paramsHash).not.toBe(first.paramsHash)
		expect(first.simulation?.paramsHash).not.toBe(edited.paramsHash)
	})
})

describe('EVM native transfer preparation application', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('selects the first declared chain transport and durably applies every present output', async () => {
		const context = Object.create(null)
		const firstTransport = executionTransport()
		const secondTransport = executionTransport({
			origin: 'https://secondary.ethereum.example',
		})
		const preparation = await applyEvmNativeTransferPreparation({
			context,
			session: {
				id: 'session-1',
				lockedAt: 1,
			},
			actions: [transferAction()],
			walletConnections: [connectedWallet()],
			executionTransportsByChainId: {
				1: [
					firstTransport.transport,
					secondTransport.transport,
				],
			},
			simulationId: 'simulation-application',
			timestampMs: 10,
		})

		expect(preparation.ready).toBe(true)
		expect(firstTransport.getBlockByNumber).toHaveBeenCalledOnce()
		expect(firstTransport.getCall).toHaveBeenCalledOnce()
		expect(firstTransport.estimateGas).toHaveBeenCalledOnce()
		expect(secondTransport.getBlockByNumber).not.toHaveBeenCalled()
		expect(localMutationMocks.writeLocalBlockheadTransferIntent).toHaveBeenCalledExactlyOnceWith(
			context,
			preparation.intent
		)
		expect(localMutationMocks.writeLocalBlockheadActionReadinessChecks).toHaveBeenCalledExactlyOnceWith(
			context,
			{
				sessionId: 'session-1',
				actionId: 'action-1',
			},
			preparation.readiness.map(({ check, observation }) => ({
				check,
				observation,
			}))
		)
		expect(localMutationMocks.writeLocalBlockheadSessionSimulation).toHaveBeenCalledExactlyOnceWith(
			context,
			{ id: 'session-1' },
			preparation.simulation,
			preparation.simulationCall
		)
		expect(preparation.walletRequest).toEqual({
			id: expectedWalletRequestIdBySimulationId['simulation-application'],
		})
		expect(localMutationMocks.writeLocalBlockheadWalletRequest).toHaveBeenCalledExactlyOnceWith(
			context,
			expect.objectContaining({
				id: preparation.walletRequest?.id,
				sessionAction: {
					sessionId: 'session-1',
					actionId: 'action-1',
				},
				walletConnection: {
					connectionKey: 'connection-1',
				},
				account: {
					caip10: {
						namespace: 'eip155',
						reference: '1',
						accountAddress: fromAddress,
					},
				},
				requestKind: 'transaction',
				requestMethod: 'eth_sendTransaction',
				requestedAt: 10,
				evm: {
					network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					simulation: {
						id: 'simulation-application',
					},
					calls: [{
						toAddress: toAddress,
						value: 2n,
						inputDataHash: expectedEmptyDataHash,
					}],
				},
			})
		)
		expect(localMutationMocks.writeLocalBlockheadWalletRequest_Timestamp).toHaveBeenCalledExactlyOnceWith(
			context,
			preparation.walletRequest,
			{
				timestampMs: 10,
				source: Source.Local_Internal,
				status: 'prepared',
			}
		)
	})

	it('retries later chain transports after an RPC simulation block', async () => {
		const failingTransport = executionTransport({
			getBlockByNumber: async () => {
				throw new Error('primary transport offline')
			},
		})
		const recoveryTransport = executionTransport({
			origin: 'https://secondary.ethereum.example',
		})
		const preparation = await applyEvmNativeTransferPreparation({
			context: Object.create(null),
			session: {
				id: 'session-1',
				lockedAt: 1,
			},
			actions: [transferAction()],
			walletConnections: [connectedWallet()],
			executionTransportsByChainId: {
				1: [
					failingTransport.transport,
					recoveryTransport.transport,
				],
			},
			simulationId: 'simulation-fallback',
			timestampMs: 12,
		})

		expect(preparation.ready).toBe(true)
		expect(failingTransport.getBlockByNumber).toHaveBeenCalledOnce()
		expect(recoveryTransport.getBlockByNumber).toHaveBeenCalledOnce()
		expect(recoveryTransport.getCall).toHaveBeenCalledOnce()
		expect(recoveryTransport.estimateGas).toHaveBeenCalledOnce()
		expect(preparation.walletRequest).toEqual({
			id: expectedWalletRequestIdBySimulationId['simulation-fallback'],
		})
	})

	it('creates a distinct wallet request when simulation identity changes', async () => {
		const context = Object.create(null)
		const preparation = await applyEvmNativeTransferPreparation({
			context,
			session: {
				id: 'session-1',
				lockedAt: 1,
			},
			actions: [transferAction()],
			walletConnections: [connectedWallet()],
			executionTransportsByChainId: {
				1: [executionTransport().transport],
			},
			simulationId: 'simulation-application-retry',
			timestampMs: 11,
		})

		expect(preparation.ready).toBe(true)
		expect(preparation.walletRequest).toEqual({
			id: expectedWalletRequestIdBySimulationId['simulation-application-retry'],
		})
		expect(localMutationMocks.writeLocalBlockheadWalletRequest).toHaveBeenCalledExactlyOnceWith(
			context,
			expect.objectContaining({
				id: preparation.walletRequest?.id,
				evm: expect.objectContaining({
					simulation: {
						id: 'simulation-application-retry',
					},
				}),
			})
		)
		expect(localMutationMocks.writeLocalBlockheadWalletRequest_Timestamp).toHaveBeenCalledExactlyOnceWith(
			context,
			preparation.walletRequest,
			{
				timestampMs: 11,
				source: Source.Local_Internal,
				status: 'prepared',
			}
		)
	})

	it('reuses an existing prepared wallet request definition on identical re-prepare', async () => {
		const context = Object.create(null)
		const requestId = expectedWalletRequestIdBySimulationId['simulation-application']
		localMutationMocks.writeLocalBlockheadWalletRequest.mockRejectedValueOnce(
			new Error(`Wallet request definition already exists: ${requestId}`)
		)
		const preparation = await applyEvmNativeTransferPreparation({
			context,
			session: {
				id: 'session-1',
				lockedAt: 1,
			},
			actions: [transferAction()],
			walletConnections: [connectedWallet()],
			executionTransportsByChainId: {
				1: [executionTransport().transport],
			},
			simulationId: 'simulation-application',
			timestampMs: 11,
		})

		expect(preparation.ready).toBe(true)
		expect(preparation.walletRequest).toEqual({
			id: requestId,
		})
		expect(localMutationMocks.writeLocalBlockheadWalletRequest).toHaveBeenCalledOnce()
		expect(localMutationMocks.writeLocalBlockheadWalletRequest_Timestamp).toHaveBeenCalledExactlyOnceWith(
			context,
			preparation.walletRequest,
			{
				timestampMs: 11,
				source: Source.Local_Internal,
				status: 'prepared',
			}
		)
	})

	it('does not select or persist an absent action-owned result', async () => {
		const transport = executionTransport()
		const preparation = await applyEvmNativeTransferPreparation({
			context: Object.create(null),
			session: {
				id: 'session-1',
				lockedAt: 1,
			},
			actions: [],
			walletConnections: [connectedWallet()],
			executionTransportsByChainId: {
				1: [transport.transport],
			},
		})

		expect(preparation.ready).toBe(false)
		expect(transport.getBlockByNumber).not.toHaveBeenCalled()
		expect(transport.getCall).not.toHaveBeenCalled()
		expect(transport.estimateGas).not.toHaveBeenCalled()
		expect(localMutationMocks.writeLocalBlockheadTransferIntent).not.toHaveBeenCalled()
		expect(localMutationMocks.writeLocalBlockheadActionReadinessChecks).not.toHaveBeenCalled()
		expect(localMutationMocks.writeLocalBlockheadSessionSimulation).not.toHaveBeenCalled()
		expect(localMutationMocks.writeLocalBlockheadWalletRequest).not.toHaveBeenCalled()
		expect(localMutationMocks.writeLocalBlockheadWalletRequest_Timestamp).not.toHaveBeenCalled()
		expect(preparation.walletRequest).toBeUndefined()
	})

	it('persists owned invalid-parameter readiness without intent, simulation, or RPC work', async () => {
		const context = Object.create(null)
		const transport = executionTransport()
		const preparation = await applyEvmNativeTransferPreparation({
			context,
			session: {
				id: 'session-1',
				lockedAt: 1,
			},
			actions: [transferAction({
				actionParams: {
					fromActor: fromAddress,
					toActor: toAddress,
					chainId: 1,
					tokenAddress: zeroAddress,
					amount: 0n,
				},
			})],
			walletConnections: [connectedWallet()],
			executionTransportsByChainId: {
				1: [transport.transport],
			},
			timestampMs: 10,
		})

		expect(preparation.ready).toBe(false)
		expect(transport.getBlockByNumber).not.toHaveBeenCalled()
		expect(transport.getCall).not.toHaveBeenCalled()
		expect(transport.estimateGas).not.toHaveBeenCalled()
		expect(localMutationMocks.writeLocalBlockheadTransferIntent).not.toHaveBeenCalled()
		expect(localMutationMocks.writeLocalBlockheadSessionSimulation).not.toHaveBeenCalled()
		expect(localMutationMocks.writeLocalBlockheadWalletRequest).not.toHaveBeenCalled()
		expect(localMutationMocks.writeLocalBlockheadWalletRequest_Timestamp).not.toHaveBeenCalled()
		expect(preparation.walletRequest).toBeUndefined()
		expect(localMutationMocks.writeLocalBlockheadActionReadinessChecks).toHaveBeenCalledExactlyOnceWith(
			context,
			{
				sessionId: 'session-1',
				actionId: 'action-1',
			},
			preparation.readiness.map(({ check, observation }) => ({
				check,
				observation,
			}))
		)
	})
})
