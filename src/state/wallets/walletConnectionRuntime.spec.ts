import { afterEach, describe, expect, it, vi } from 'vitest'
import { stringify } from 'devalue'

import { createAptosInjectedAdapter } from './adapters/aptosInjected.ts'
import { createBitcoinInjectedAdapter } from './adapters/bitcoinInjected.ts'
import { createCardanoCip30Adapter } from './adapters/cardanoCip30.ts'
import { createCosmosOfflineSignerAdapter } from './adapters/cosmosOfflineSigner.ts'
import { createDiscoveryOnlyAdapter } from './adapters/createDiscoveryOnlyAdapter.ts'
import { eipCandidateFromDetail, eipConnectionFromAccounts } from './adapters/eip6963.ts'
import { onAccountsChanged } from './adapters/eip1193.ts'
import { createPolkadotInjectedWeb3Adapter } from './adapters/polkadotInjectedWeb3.ts'
import { createStarknetWalletApiAdapter } from './adapters/starknetWalletApi.ts'
import { createTronInjectedAdapter } from './adapters/tronInjected.ts'
import { createWalletStandardAdapter } from './adapters/walletStandard.ts'
import type { WalletAdapter, WalletCandidate, WalletConnection } from './adapters/types.ts'
import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
	walletConnectionMethodById,
	walletConnectionMethodByProtocolDiscoveryKindTransportKind,
	walletConnectionMethods,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type MockRow = Record<string, string | number | boolean | object | readonly object[] | undefined>

const mountMockWalletRuntime = async ({
	candidateAvailable = true,
	connectionResults = [],
	disconnect = vi.fn(),
	persistWalletRequest = vi.fn(),
	persistWalletRequestObservation = vi.fn(),
	persistWalletRequestSubmittedAt = vi.fn(),
	persistedConnections,
	persistedProtocol = WalletProtocol.Eip6963,
	persistedStatus,
	persistedTransportKind = WalletTransportKind.InjectedProvider,
	persistedWalletId = 'eip6963:com.example.wallet',
	signMessage = vi.fn(async () => '0xsigned'),
	signTypedData = vi.fn(async () => '0xtyped'),
	switchScope,
}: {
	candidateAvailable?: boolean
	connectionResults?: (Error | WalletConnection)[]
	disconnect?: (walletId: string, connectionKey?: string) => void | Promise<void>
	persistWalletRequest?: (context: object, request: object) => void | Promise<void>
	persistWalletRequestObservation?: (
		context: object,
		walletRequestSelector: object,
		observation: object
	) => void | Promise<void>
	persistWalletRequestSubmittedAt?: (
		context: object,
		walletRequestSelector: object,
		submittedAt: number
	) => void | Promise<void>
	persistedConnections?: {
		connectionKey: string
		walletId: string
		status: BlockheadConnectionStatus
		protocol: WalletProtocol
		transportKind: WalletTransportKind
		selected: boolean
	}[]
	persistedProtocol?: WalletProtocol
	persistedStatus?: BlockheadConnectionStatus
	persistedTransportKind?: WalletTransportKind
	persistedWalletId?: string
	signMessage?: (walletId: string, accountAddress: string, message: string) => Promise<string>
	signTypedData?: (
		walletId: string,
		accountAddress: string,
		typedData: object
	) => Promise<string>
	switchScope?: (
		walletId: string,
		scope: {
			namespace: string
			reference: string
		},
		connectionKey?: string
	) => Promise<WalletConnection | undefined>
}) => {
	const walletId = persistedWalletId
	const account = {
		namespace: 'eip155',
		reference: '1',
		accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
		capabilities: [WalletCapability.SignMessage],
	}
	const persistedRows = (
		persistedConnections
		?? (
			persistedStatus == null ?
				[]
			:
				[
					{
						connectionKey: 'persisted-session',
						walletId,
						status: persistedStatus,
						protocol: persistedProtocol,
						transportKind: persistedTransportKind,
						selected: persistedStatus === BlockheadConnectionStatus.Connected,
					},
				]
		)
	)
	const persistedByKey = Object.fromEntries(
		persistedRows.map((row) => [
			row.connectionKey,
			{
				...row,
				scopes: [],
				accounts: [account],
				activeAccount: account,
			},
		])
	)
	const subscribeConnection = vi.fn((
		_walletId: string,
		_updateConnection: (connection: WalletConnection) => void,
		_connectionKey?: string
	) => () => {})
	const deleteConnection = vi.fn()
	const writeConnection = vi.fn()
	const writeWalletRequest = vi.fn(persistWalletRequest)
	const writeWalletRequestObservation = vi.fn(persistWalletRequestObservation)
	const writeWalletRequestSubmittedAt = vi.fn(persistWalletRequestSubmittedAt)

	vi.doMock('./adapters/eip6963.ts', () => ({
		createEip6963Adapter: () => ({
			id: 'eip6963',
			start: (updateCandidates: (candidates: WalletCandidate[]) => void) => {
				updateCandidates(
					candidateAvailable ?
						[
							{
								id: walletId,
								name: 'Example Wallet',
								icon: '',
								protocol: WalletProtocol.Eip6963,
								discoveryKind: WalletDiscoveryKind.InjectedEvent,
								transportKind: WalletTransportKind.InjectedProvider,
								capabilities: [WalletCapability.Connect],
							},
						]
					:
						[]
				)

				return () => {}
			},
			connect: async () => {
				const connectionResult = connectionResults.shift()
				if (connectionResult instanceof Error)
					throw connectionResult

				return connectionResult
			},
			signMessage,
			signTypedData,
			...(switchScope != null && { switchScope }),
			disconnect,
			subscribeConnection,
		}),
	}))
	vi.doMock('$/collections/localMutations.ts', () => ({
		deleteLocalBlockheadWalletConnection: deleteConnection,
		writeLocalBlockheadWallet: vi.fn(),
		writeLocalBlockheadWalletConnection: writeConnection,
		writeLocalBlockheadWalletRequest: writeWalletRequest,
		writeLocalBlockheadWalletRequest_Timestamp: writeWalletRequestObservation,
		writeLocalBlockheadWalletRequestSubmittedAt: writeWalletRequestSubmittedAt,
	}))

	const selectionFor = (
		connectionKey: string
	) => {
		const persistedConnection = persistedByKey[connectionKey]
		const persistedConnectionPromise = Promise.resolve(persistedConnection)
		return Object.assign(
			() => persistedConnectionPromise,
			{
				then: persistedConnectionPromise.then.bind(persistedConnectionPromise),
				catch: persistedConnectionPromise.catch.bind(persistedConnectionPromise),
				finally: persistedConnectionPromise.finally.bind(persistedConnectionPromise),
				$wallet: Promise.resolve({
					[EntityMetaKey.Selector]: {
						id: persistedConnection?.walletId ?? walletId,
					},
				}),
				$$accounts: () => Promise.resolve({
					values: persistedConnection?.accounts.map((persistedAccount) => ({
						[EntityMetaKey.Selector]: {
							caip10: {
								namespace: persistedAccount.namespace,
								reference: persistedAccount.reference,
								accountAddress: persistedAccount.accountAddress,
							},
						},
					})) ?? [],
				}),
				$activeAccount: Promise.resolve(
					persistedConnection?.activeAccount == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: {
								caip10: {
									namespace: persistedConnection.activeAccount.namespace,
									reference: persistedConnection.activeAccount.reference,
									accountAddress: persistedConnection.activeAccount.accountAddress,
								},
							},
						}
				),
			}
		)
	}
	const { mountWalletConnectionRuntime } = await import('./walletConnectionRuntime.svelte.ts')
	const runtime = mountWalletConnectionRuntime({
		entityCollections: {},
		entityFieldCollections: {},
		entityFieldCountCollections: {},
		select: (
			entityType: EntityType,
			selector?: {
				connectionKey?: string
			}
		) => (
			entityType === EntityType._Global ?
				{
					$$blockheadWalletConnections: () => Promise.resolve({
						values: persistedRows.map((row) => ({
							connectionKey: row.connectionKey,
							[EntityMetaKey.Selector]: {
								connectionKey: row.connectionKey,
							},
						})),
					}),
				}
			:
				selectionFor(selector?.connectionKey ?? persistedRows[0]?.connectionKey ?? 'persisted-session')
		),
	})

	return {
		deleteConnection,
		disconnect,
		runtime,
		subscribeConnection,
		writeConnection,
		writeWalletRequest,
		writeWalletRequestObservation,
		writeWalletRequestSubmittedAt,
	}
}

describe('wallet connection runtime normalization', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
		vi.resetModules()
		vi.doUnmock('./adapters/eip6963.ts')
		vi.doUnmock('$/collections/localMutations.ts')
		vi.doUnmock('$/routes/+layout.svelte')
	})

	it('normalizes EIP-6963 provider details into wallet candidates', () => {
		expect(eipCandidateFromDetail({
			info: {
				uuid: 'wallet-uuid',
				name: 'Example Wallet',
				icon: 'data:image/svg+xml,example',
				rdns: 'com.example.wallet',
			},
			provider: {
				request: async () => [],
			},
		})).toMatchObject({
			id: 'eip6963:wallet-uuid',
			name: 'Example Wallet',
			icon: 'data:image/svg+xml,example',
			protocol: WalletProtocol.Eip6963,
			discoveryKind: WalletDiscoveryKind.InjectedEvent,
			transportKind: WalletTransportKind.InjectedProvider,
			rdns: 'com.example.wallet',
		})
	})

	it('normalizes EIP accounts into CAIP-scoped wallet connection rows', () => {
		expect(eipConnectionFromAccounts(
			'eip6963:com.example.wallet',
			[
				'0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			],
			1,
			BlockheadConnectionStatus.Connected,
			1_700_000_000_000
		)).toMatchObject({
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			selected: true,
			connectedAt: 1_700_000_000_000,
			scopes: [
				{
					namespace: 'eip155',
					reference: '1',
					methods: expect.arrayContaining(['eth_accounts', 'eth_requestAccounts']),
					events: expect.arrayContaining(['accountsChanged', 'chainChanged']),
				},
			],
			accounts: [
				{
					namespace: 'eip155',
					reference: '1',
					accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
					capabilities: expect.arrayContaining([WalletCapability.SignMessage]),
				},
			],
		})
	})

	it('does not fabricate Ethereum identity before an EIP chain is known', () => {
		expect(eipConnectionFromAccounts(
			'eip6963:com.example.wallet',
			[
				'0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			],
			null,
			BlockheadConnectionStatus.Connected
		)).toMatchObject({
			accounts: [],
			scopes: [],
			selected: false,
		})
	})

	it('does not assign connection success time to disconnected adapter results', async () => {
		expect(eipConnectionFromAccounts(
			'eip6963:com.example.wallet',
			[],
			1,
			BlockheadConnectionStatus.Disconnected
		)).not.toHaveProperty('connectedAt')

		expect(await createDiscoveryOnlyAdapter({
			id: 'test-discovery',
			candidate: {
				protocol: WalletProtocol.CardanoCip30,
				discoveryKind: WalletDiscoveryKind.InjectedGlobal,
				transportKind: WalletTransportKind.InjectedSigner,
				capabilities: [WalletCapability.Connect],
			},
			getCandidates: () => [],
		}).connect('cip30:test-wallet')).not.toHaveProperty('connectedAt')
	})

	it('preserves an empty accountsChanged notification as a disconnected signal', () => {
		let accountsChanged: ((accounts: JsonValue) => void) | undefined
		const observedAccounts: string[][] = []
		onAccountsChanged(
			{
				request: async () => [],
				on: (_event, listener) => {
					accountsChanged = listener
				},
			},
			(accounts) => observedAccounts.push(accounts)
		)

		accountsChanged?.([])

		expect(observedAccounts).toEqual([[]])
	})

	it('persists message-signing request lifecycle as hashes without claiming chain finality', async () => {
		vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001')
		vi.spyOn(Date, 'now')
			.mockReturnValueOnce(1_700_000_000_000)
			.mockReturnValueOnce(1_700_000_000_001)
		const connection = {
			connectionKey: 'wallet-session',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [{
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				capabilities: [WalletCapability.SignMessage],
			}],
			selected: true,
		} satisfies WalletConnection
		const {
			runtime,
			writeWalletRequest,
			writeWalletRequestObservation,
			writeWalletRequestSubmittedAt,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
		})

		await runtime.connect(connection.walletId)
		expect(await runtime.signMessage(connection.connectionKey, 'Sign this private challenge')).toEqual({
			accountAddress: connection.accounts[0].accountAddress,
			signature: '0xsigned',
		})

		expect(writeWalletRequest).toHaveBeenCalledOnce()
		expect(writeWalletRequest.mock.calls[0][1]).toEqual({
			id: 'wallet-request-00000000-0000-4000-8000-000000000001',
			walletConnection: {
				connectionKey: connection.connectionKey,
			},
			account: {
				caip10: {
					namespace: 'eip155',
					reference: '1',
					accountAddress: connection.accounts[0].accountAddress,
				},
			},
			requestKind: 'message-signature',
			requestMethod: 'personal_sign',
			requestPayloadHash: '0xb5f1626380702aa5c4ba37eb674066a75516c0a2481a735471a46dc8838e036c',
			requestedAt: 1_700_000_000_000,
		})
		expect(writeWalletRequestObservation.mock.calls.map(([, selector, observation]) => ({
			selector,
			observation,
		}))).toEqual([
			{
				selector: {
					id: 'wallet-request-00000000-0000-4000-8000-000000000001',
				},
				observation: expect.objectContaining({
					status: 'requested',
				}),
			},
			{
				selector: {
					id: 'wallet-request-00000000-0000-4000-8000-000000000001',
				},
				observation: expect.objectContaining({
					status: 'signed',
					signatureHash: '0x318db428059e86506988fdc8079f42b03dcf1ca107807005a014128fdbcc1e94',
				}),
			},
		])
		expect(writeWalletRequestSubmittedAt).toHaveBeenCalledWith(
			expect.anything(),
			{
				id: 'wallet-request-00000000-0000-4000-8000-000000000001',
			},
			1_700_000_000_001
		)
		expect(JSON.stringify([
			...writeWalletRequest.mock.calls,
			...writeWalletRequestObservation.mock.calls,
		])).not.toContain(
			'Sign this private challenge'
		)
		expect(JSON.stringify(writeWalletRequestObservation.mock.calls)).not.toContain('0xsigned')
		expect(writeWalletRequestObservation.mock.calls[1][2]).not.toHaveProperty('transactionHash')
		expect(writeWalletRequestObservation.mock.calls[1][2]).not.toHaveProperty('transactionId')
	}, 30_000)

	it('persists typed-data signing as hashes without claiming chain finality', async () => {
		vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-0000000000td')
		vi.spyOn(Date, 'now')
			.mockReturnValueOnce(1_700_000_000_100)
			.mockReturnValueOnce(1_700_000_000_101)
		const typedData = {
			types: {
				EIP712Domain: [
					{ name: 'name', type: 'string' },
				],
				Mail: [
					{ name: 'contents', type: 'string' },
				],
			},
			primaryType: 'Mail',
			domain: {
				name: 'Blockhead',
			},
			message: {
				contents: 'hello',
			},
		}
		const connection = {
			connectionKey: 'wallet-session',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [{
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				capabilities: [WalletCapability.SignTypedData],
			}],
			selected: true,
		} satisfies WalletConnection
		const {
			runtime,
			writeWalletRequest,
			writeWalletRequestObservation,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
		})

		await runtime.connect(connection.walletId)
		expect(await runtime.signTypedData(connection.connectionKey, typedData)).toEqual({
			accountAddress: connection.accounts[0].accountAddress,
			signature: '0xtyped',
		})

		expect(writeWalletRequest.mock.calls[0][1]).toMatchObject({
			requestKind: 'typed-data-signature',
			requestMethod: 'eth_signTypedData_v4',
		})
		expect(JSON.stringify(writeWalletRequest.mock.calls)).not.toContain('hello')
		expect(writeWalletRequestObservation.mock.calls.at(-1)?.[2]).toMatchObject({
			status: 'signed',
		})
		expect(writeWalletRequestObservation.mock.calls.at(-1)?.[2]).not.toHaveProperty('transactionHash')
	}, 30_000)

	it('switches scope through the selected connected wallet and upserts discoverable scopes', async () => {
		const connection = {
			connectionKey: 'wallet-session',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [{
				namespace: 'eip155',
				reference: '1',
				methods: ['wallet_switchEthereumChain'],
				events: ['chainChanged'],
			}],
			accounts: [{
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				capabilities: [WalletCapability.SwitchScope],
			}],
			selected: true,
		} satisfies WalletConnection
		const { runtime, writeConnection } = await mountMockWalletRuntime({
			connectionResults: [connection],
			switchScope: async (_walletId, scope) => ({
				...connection,
				scopes: [{
					namespace: scope.namespace,
					reference: scope.reference,
					methods: ['wallet_switchEthereumChain'],
					events: ['chainChanged'],
				}],
				accounts: [{
					...connection.accounts[0],
					reference: scope.reference,
				}],
			}),
		})

		await runtime.connect(connection.walletId)
		await runtime.switchScope(connection.connectionKey, {
			namespace: 'eip155',
			reference: '137',
		})

		expect(runtime.connections[0]).toMatchObject({
			scopes: [
				expect.objectContaining({
					reference: '137',
				}),
			],
			accounts: [
				expect.objectContaining({
					reference: '137',
				}),
			],
		})
		expect(writeConnection).toHaveBeenCalled()
	}, 30_000)

	it('exposes reconnect as the same connect lifecycle', async () => {
		const connection = {
			connectionKey: 'wallet-session',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [{
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				capabilities: [WalletCapability.Reconnect],
			}],
			selected: true,
		} satisfies WalletConnection
		const { runtime } = await mountMockWalletRuntime({
			connectionResults: [
				connection,
				{
					...connection,
					connectedAt: 2,
				},
			],
		})

		await runtime.connect(connection.walletId)
		await runtime.reconnect(connection.walletId)
		expect(runtime.connections.some((entry) => (
			entry.status === BlockheadConnectionStatus.Connected
		))).toBe(true)
	}, 30_000)

	it('persists failed message-signing requests without fabricating submission evidence', async () => {
		vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000002')
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
		const connection = {
			connectionKey: 'wallet-session',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [{
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				capabilities: [WalletCapability.SignMessage],
			}],
			selected: true,
		} satisfies WalletConnection
		const {
			runtime,
			writeWalletRequest,
			writeWalletRequestObservation,
			writeWalletRequestSubmittedAt,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			signMessage: async () => {
				throw new Error('User rejected the wallet request')
			},
		})

		await runtime.connect(connection.walletId)
		await expect(runtime.signMessage(connection.connectionKey, 'Reject this challenge')).rejects.toThrow(
			'User rejected the wallet request'
		)

		expect(writeWalletRequest).toHaveBeenCalledOnce()
		expect(writeWalletRequestSubmittedAt).not.toHaveBeenCalled()
		expect(writeWalletRequestObservation.mock.calls[1][2]).toMatchObject({
			status: 'failed',
			error: 'Wallet signing request failed',
		})
		expect(writeWalletRequestObservation.mock.calls[1][2]).not.toHaveProperty('signatureHash')
		expect(JSON.stringify(writeWalletRequest.mock.calls)).not.toContain(
			'Reject this challenge'
		)
		expect(JSON.stringify(writeWalletRequestObservation.mock.calls)).not.toContain(
			'User rejected the wallet request'
		)
	}, 30_000)

	it('persists prepared transaction rejection without rewriting or submitting the request', async () => {
		const {
			runtime,
			writeWalletRequest,
			writeWalletRequestObservation,
			writeWalletRequestSubmittedAt,
		} = await mountMockWalletRuntime({})

		await runtime.rejectPreparedTransactionRequest(
			{
				id: 'wallet-request-prepared',
				requestKind: 'transaction',
				requestMethod: 'eth_sendTransaction',
				requestedAt: 10,
			},
			{
				timestampMs: 20,
				status: 'prepared',
			},
			21
		)

		expect(writeWalletRequest).not.toHaveBeenCalled()
		expect(writeWalletRequestSubmittedAt).not.toHaveBeenCalled()
		expect(writeWalletRequestObservation).toHaveBeenCalledExactlyOnceWith(
			expect.anything(),
			{
				id: 'wallet-request-prepared',
			},
			{
				timestampMs: 21,
				source: Source.Local_Internal,
				status: 'failed',
				error: 'Wallet signing request rejected',
			}
		)
		expect(writeWalletRequestObservation.mock.calls[0][2]).not.toHaveProperty('submittedAt')
		expect(writeWalletRequestObservation.mock.calls[0][2]).not.toHaveProperty('transactionId')
		expect(writeWalletRequestObservation.mock.calls[0][2]).not.toHaveProperty('evmTransactions')
	})

	it('awaits durable request and terminal observations around the provider call', async () => {
		let persistRequested: () => void = () => {}
		let persistTerminal: () => void = () => {}
		let requestedPersistenceStarted = false
		const signing = vi.fn(async () => '0xsigned')
		const connection = {
			connectionKey: 'wallet-session',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [{
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				capabilities: [WalletCapability.SignMessage],
			}],
			selected: true,
		} satisfies WalletConnection
		const { runtime } = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistWalletRequestObservation: () => new Promise<void>((resolve) => {
				if (signing.mock.calls.length === 0) {
					requestedPersistenceStarted = true
					persistRequested = resolve
				}
				else
					persistTerminal = resolve
			}),
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		const result = runtime.signMessage(connection.connectionKey, 'Persist in order')
		await vi.waitFor(() => expect(requestedPersistenceStarted).toBe(true))
		expect(signing).not.toHaveBeenCalled()
		persistRequested()
		await vi.waitFor(() => expect(signing).toHaveBeenCalledOnce())
		let settled = false
		void result.finally(() => {
			settled = true
		})
		expect(settled).toBe(false)
		persistTerminal()
		await expect(result).resolves.toMatchObject({
			signature: '0xsigned',
		})
	})

	it('rejects signing without connected selected capability authority', async () => {
		const signing = vi.fn(async () => '0xsigned')
		const {
			runtime,
			writeWalletRequest,
		} = await mountMockWalletRuntime({
			connectionResults: [{
				connectionKey: 'wallet-session',
				walletId: 'eip6963:com.example.wallet',
				status: BlockheadConnectionStatus.Connected,
				protocol: WalletProtocol.Eip6963,
				transportKind: WalletTransportKind.InjectedProvider,
				scopes: [],
				accounts: [{
					namespace: 'eip155',
					reference: '1',
					accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
					capabilities: [WalletCapability.SignMessage],
				}],
				selected: true,
			}],
			signMessage: signing,
		})

		await runtime.connect('eip6963:com.example.wallet')
		for (const mutateConnection of [
			(connection: WalletConnection) => {
				connection.status = BlockheadConnectionStatus.Disconnected
			},
			(connection: WalletConnection) => {
				connection.status = BlockheadConnectionStatus.Connected
				connection.selected = false
			},
			(connection: WalletConnection) => {
				connection.selected = true
				connection.accounts[0].capabilities = []
			},
		]) {
			mutateConnection(runtime.connections[0])
			await expect(runtime.signMessage('wallet-session', 'Unauthorized')).rejects.toThrow()
		}
		expect(signing).not.toHaveBeenCalled()
		expect(writeWalletRequest).not.toHaveBeenCalled()
	})

	it('classifies signature evidence hashing failure separately from provider failure', async () => {
		vi.spyOn(globalThis.crypto.subtle, 'digest')
			.mockResolvedValueOnce(new Uint8Array(32).buffer)
			.mockRejectedValueOnce(new Error('Audit digest unavailable'))
		const signing = vi.fn(async () => '0xsigned')
		const connection = {
			connectionKey: 'wallet-session',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [{
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				capabilities: [WalletCapability.SignMessage],
			}],
			selected: true,
		} satisfies WalletConnection
		const {
			runtime,
			writeWalletRequestObservation,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		await expect(runtime.signMessage(connection.connectionKey, 'Audit separately')).rejects.toThrow(
			'Audit digest unavailable'
		)

		expect(signing).toHaveBeenCalledOnce()
		expect(writeWalletRequestObservation.mock.calls[1][2]).toMatchObject({
			status: 'audit-failed',
			error: 'Wallet signature evidence hashing failed',
		})
		expect(writeWalletRequestObservation.mock.calls[1][2]).not.toHaveProperty('signatureHash')
	})

	it('reconciles signed-history persistence failure without reporting wallet rejection', async () => {
		let persistenceAttempt = 0
		const signing = vi.fn(async () => '0xsigned')
		const connection = {
			connectionKey: 'wallet-session',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [{
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				capabilities: [WalletCapability.SignMessage],
			}],
			selected: true,
		} satisfies WalletConnection
		const {
			runtime,
			writeWalletRequestObservation,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistWalletRequestObservation: async () => {
				persistenceAttempt++
				if (persistenceAttempt === 2)
					throw new Error('Signed history adapter failed')
			},
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		await expect(runtime.signMessage(connection.connectionKey, 'Persist terminal history')).rejects.toThrow(
			'Wallet signature succeeded but audit persistence failed; do not retry as a wallet rejection'
		)

		expect(signing).toHaveBeenCalledOnce()
		expect(writeWalletRequestObservation).toHaveBeenCalledTimes(3)
		expect(writeWalletRequestObservation.mock.calls[1][2].status).toBe('signed')
		expect(writeWalletRequestObservation.mock.calls[2][2]).toMatchObject({
			status: 'audit-failed',
			signatureHash: '0x318db428059e86506988fdc8079f42b03dcf1ca107807005a014128fdbcc1e94',
			error: 'Wallet signature succeeded but signed history persistence failed',
		})
	})

	it('maps every built-in adapter candidate tuple to exactly one connection method', () => {
		const builtInAdapterConnectionMethodIds = [
			'aptos-injected-globals',
			'bitcoin-injected-globals',
			'cardano-cip30',
			'cosmos-offline-signer',
			'eip6963',
			'polkadot-injected-web3',
			'sats-connect',
			'starknet-wallet-api',
			'ton-connect-injected',
			'tron-tip1193',
			'tron-tip6963',
			'wallet-standard',
			'walletconnect-v2',
		]

		expect(Object.keys(walletConnectionMethodByProtocolDiscoveryKindTransportKind)).toHaveLength(walletConnectionMethods.length)
		expect(builtInAdapterConnectionMethodIds.map((connectionMethodId) => {
			const connectionMethod = walletConnectionMethodById[connectionMethodId]
			return connectionMethod == null ? undefined : walletConnectionMethodByProtocolDiscoveryKindTransportKind[[
				connectionMethod.protocol,
				connectionMethod.discoveryKind,
				connectionMethod.transportKind,
			].join(':')]?.id
		})).toEqual(builtInAdapterConnectionMethodIds)
	})

	it('rejects an unmapped adapter candidate before exposing it', async () => {
		const { runtime } = await mountMockWalletRuntime({})

		expect(() => runtime.registerAdapter({
			id: 'invalid-adapter',
			start: (updateCandidates) => {
				updateCandidates([{
					id: 'invalid-wallet',
					name: 'Invalid wallet',
					icon: '',
					protocol: WalletProtocol.Eip6963,
					discoveryKind: WalletDiscoveryKind.DirectHardware,
					transportKind: WalletTransportKind.WebHid,
					capabilities: [],
				}])
				return () => {}
			},
			connect: async () => undefined,
			disconnect: () => {},
			subscribeConnection: () => () => {},
		})).toThrow('Wallet adapter invalid-adapter candidate invalid-wallet has no connection method for eip6963/direct-hardware/webhid')
		expect(runtime.candidates).not.toContainEqual(expect.objectContaining({
			id: 'invalid-wallet',
		}))

		runtime.destroy()
	})

	it('returns disconnected rows for discovery-only adapters without prompting', async () => {
		const adapter = createDiscoveryOnlyAdapter({
			id: 'test-discovery',
			candidate: {
				protocol: WalletProtocol.CardanoCip30,
				discoveryKind: WalletDiscoveryKind.InjectedGlobal,
				transportKind: WalletTransportKind.InjectedSigner,
				capabilities: [WalletCapability.Connect],
			},
			getCandidates: () => [
				{
					id: 'cip30:test-wallet',
					name: 'Test Wallet',
					icon: '',
				},
			],
		})
		const candidateUpdates: WalletCandidate[][] = []

		adapter.start((candidates) => candidateUpdates.push(candidates))

		expect(candidateUpdates).toEqual([[
			expect.objectContaining({
				id: 'cip30:test-wallet',
				capabilities: [WalletCapability.Discover],
			}),
		]])
		expect(await adapter.connect('cip30:test-wallet')).toMatchObject({
			walletId: 'cip30:test-wallet',
			status: BlockheadConnectionStatus.Error,
			protocol: WalletProtocol.CardanoCip30,
			transportKind: WalletTransportKind.InjectedSigner,
			scopes: [],
			accounts: [],
			error: 'This wallet protocol is discovered but connection is not implemented yet.',
		})
	})

	it('writes wallet and account local mutations through the sanctioned boundary', async () => {
		const entityUpserts: MockRow[] = []
		const fieldUpserts: MockRow[] = []
		const countUpserts: MockRow[] = []
		const entityDeletes: string[] = []
		const fieldDeletes: string[] = []
		const countDeletes: string[] = []
		const waitForPersistence = async () => {}
		const applyAuthority = (
			onApplied?: () => void | Promise<void>
		) => (
			Promise.resolve(onApplied?.()).then(() => {})
		)
		const fieldCollection = () => {
			const currentRows: MockRow[] = []
			const replaceRows = (
				predicate: (row: MockRow) => boolean,
				rows: MockRow[]
			) => {
				currentRows.splice(
					0,
					currentRows.length,
					...currentRows.filter((row) => !predicate(row)),
					...rows
				)
				if (rows.length === 0)
					fieldDeletes.push('replacement')
				else
					fieldUpserts.push(...rows)
			}
			const writeUpsert = (row: MockRow) => {
				currentRows.push(row)
				fieldUpserts.push(row)
			}

			return {
				delete: (key: string) => fieldDeletes.push(key),
				get toArray() {
					return currentRows
				},
				startSyncImmediate: () => {},
				utils: {
					waitForPersistence,
					deleteSelectorRowsAndAuthority: (predicate: (row: MockRow) => boolean, selectorKey: string) => {
						replaceRows(predicate, [])
						fieldDeletes.push(selectorKey)
					},
					refresh: () => {},
					replaceRows,
					replaceRowsWithAuthority: (
						predicate: (row: MockRow) => boolean,
						rows: MockRow[],
						_selectorKey: string,
						_authorityKey: string,
						_resolution: string,
						onApplied?: () => void | Promise<void>
					) => {
						replaceRows(predicate, rows)
						return applyAuthority(onApplied)
					},
					writeUpsert,
					writeUpsertWithAuthority: (
						row: MockRow,
						_selectorKey: string,
						_authorityKey: string,
						_resolution: string,
						onApplied?: () => void | Promise<void>
					) => {
						writeUpsert(row)
						return applyAuthority(onApplied)
					},
				},
			}
		}
		const entityCollection = ({
			trackDeletes = false,
		}: {
			trackDeletes?: boolean
		} = {}) => ({
			...(trackDeletes && {
				delete: (key: string) => entityDeletes.push(key),
			}),
			startSyncImmediate: () => {},
			utils: {
				waitForPersistence,
				deleteSelectorRowsAndAuthority: (_predicate: (row: MockRow) => boolean, selectorKey: string) => {
					entityDeletes.push(stringify([
						Source.Local_Internal,
						selectorKey,
					]))
				},
				replaceRowsWithAuthority: (
					_predicate: (row: MockRow) => boolean,
					_rows: MockRow[],
					selectorKey: string,
					_authorityKey?: string,
					_resolution?: string,
					onApplied?: () => void | Promise<void>
				) => {
					entityDeletes.push(stringify([
						Source.Local_Internal,
						selectorKey,
					]))
					return applyAuthority(onApplied)
				},
				refresh: () => {},
				writeUpsert: (row: MockRow) => entityUpserts.push(row),
				writeUpsertWithAuthority: (
					row: MockRow,
					_selectorKey: string,
					_authorityKey: string,
					_resolution: string,
					onApplied?: () => void | Promise<void>
				) => {
					entityUpserts.push(row)
					return applyAuthority(onApplied)
				},
			},
		})

		const context = {
			entityCollections: {
				[EntityType.BlockheadWallet]: entityCollection(),
				[EntityType.Account]: entityCollection(),
				[EntityType.BlockheadAccount]: entityCollection(),
				[EntityType.BlockheadWalletConnection]: entityCollection({ trackDeletes: true }),
				[EntityType.EvmAccount]: entityCollection(),
			},
			entityFieldCollections: {
				[EntityType._Global]: {
					[entityFieldAddressKey(EntityType._Global, [], '$$actors')]: fieldCollection(),
					[entityFieldAddressKey(EntityType._Global, [], '$$blockheadWallets')]: fieldCollection(),
					[entityFieldAddressKey(EntityType._Global, [], '$$blockheadAccounts')]: fieldCollection(),
					[entityFieldAddressKey(EntityType._Global, [], '$$blockheadWalletConnections')]: fieldCollection(),
				},
				[EntityType.BlockheadWallet]: {
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'name')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'icon')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'protocol')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'discoveryKind')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'transportKind')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'rdns')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'capabilities')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], '$connectionMethod')]: fieldCollection(),
				},
				[EntityType.BlockheadAccount]: {
					[entityFieldAddressKey(EntityType.BlockheadAccount, [], '$account')]: fieldCollection(),
				},
				[EntityType.BlockheadWalletConnection]: {
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'connectionKey')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], '$wallet')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'status')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'protocol')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'transportKind')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'scopes')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], '$$accounts')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], '$activeAccount')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'selected')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'connectedAt')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'disconnectedAt')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'sessionId')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'sessionTopic')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], 'error')]: fieldCollection(),
				},
			},
			entityFieldCountCollections: {
				[EntityType._Global]: {},
				[EntityType.BlockheadWallet]: {},
				[EntityType.BlockheadWalletConnection]: {
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, [], '$$accounts')]: {
						delete: (key: string) => countDeletes.push(key),
						startSyncImmediate: () => {},
						utils: {
							waitForPersistence,
							deleteSelectorRowsAndAuthority: (_predicate: (row: MockRow) => boolean, selectorKey: string) => {
								countDeletes.push(selectorKey)
							},
							replaceRowsWithAuthority: (
								_predicate: (row: MockRow) => boolean,
								rows: MockRow[],
								selectorKey: string,
								_authorityKey?: string,
								_resolution?: string,
								onApplied?: () => void | Promise<void>
							) => {
								if (rows.length === 0)
									countDeletes.push(selectorKey)
								else
									countUpserts.push(...rows)
								return applyAuthority(onApplied)
							},
							writeUpsert: (row: MockRow) => countUpserts.push(row),
							writeUpsertWithAuthority: (
								row: MockRow,
								_selectorKey: string,
								_authorityKey: string,
								_resolution: string,
								onApplied?: () => void | Promise<void>
							) => {
								countUpserts.push(row)
								return applyAuthority(onApplied)
							},
						},
					},
				},
			},
		}

		const {
			deleteLocalBlockheadWalletConnection,
			writeLocalBlockheadWallet,
			writeLocalBlockheadWalletConnection,
		} = await import('$/collections/localMutations.ts')

		await writeLocalBlockheadWallet(context, {
			id: 'eip6963:com.example.wallet',
			name: 'Example Wallet',
			icon: 'data:image/svg+xml,example',
			protocol: WalletProtocol.Eip6963,
			discoveryKind: WalletDiscoveryKind.InjectedEvent,
			transportKind: WalletTransportKind.InjectedProvider,
			capabilities: [
				WalletCapability.Connect,
			],
		})
		await writeLocalBlockheadWalletConnection(context, {
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			selected: true,
			connectedAt: 1,
			scopes: [],
			accounts: [
				{
					namespace: 'eip155',
					reference: '1',
					accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
					capabilities: [
						WalletCapability.SignMessage,
					],
				},
			],
		})
		await deleteLocalBlockheadWalletConnection(context, 'eip6963:com.example.wallet')

		const walletSelectorKey = stringify({ id: 'eip6963:com.example.wallet' })
		const accountSelectorKey = stringify({
			caip10: {
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			},
		})
		const connectionMethodSelectorKey = stringify({ id: 'eip6963' })
		const walletConnectionSelectorKey = stringify({
			connectionKey: 'eip6963:com.example.wallet',
		})

		expect(entityUpserts).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					id: 'eip6963:com.example.wallet',
				},
				[EntityMetaKey.SelectorKey]: walletSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
			}),
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					connectionKey: 'eip6963:com.example.wallet',
				},
				[EntityMetaKey.SelectorKey]: walletConnectionSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
			}),
		])
		expect(fieldUpserts.every((row) => row[EntityMetaKey.Source] === Source.Local_Internal)).toBe(true)
		expect(fieldUpserts).toEqual(expect.arrayContaining([
			expect.objectContaining({
				fieldName: '$$blockheadWallets',
				[EntityMetaKey.Value]: {
					[EntityMetaKey.Selector]: {
						id: 'eip6963:com.example.wallet',
					},
					[EntityMetaKey.SelectorKey]: walletSelectorKey,
				},
				valueKey: `Entity:${walletSelectorKey}`,
			}),
			expect.objectContaining({
				fieldName: '$connectionMethod',
				[EntityMetaKey.Value]: {
					[EntityMetaKey.Selector]: {
						id: 'eip6963',
					},
					[EntityMetaKey.SelectorKey]: connectionMethodSelectorKey,
				},
				valueKey: `Entity:${connectionMethodSelectorKey}`,
			}),
			expect.objectContaining({
				fieldName: '$$blockheadWalletConnections',
				[EntityMetaKey.Value]: {
					[EntityMetaKey.Selector]: {
						connectionKey: 'eip6963:com.example.wallet',
					},
					[EntityMetaKey.SelectorKey]: walletConnectionSelectorKey,
				},
				valueKey: `Entity:${walletConnectionSelectorKey}`,
			}),
			expect.objectContaining({
				fieldName: '$wallet',
				[EntityMetaKey.ParentSelectorKey]: walletConnectionSelectorKey,
				valueKey: `Entity:${walletSelectorKey}`,
			}),
			expect.objectContaining({
				fieldName: '$$accounts',
				valueIndex: 0,
				[EntityMetaKey.ParentSelectorKey]: walletConnectionSelectorKey,
				valueKey: `Entity:${accountSelectorKey}`,
			}),
		]))
		expect(countUpserts).toContainEqual(expect.objectContaining({
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.ParentSelectorKey]: walletConnectionSelectorKey,
			[EntityMetaKey.Value]: 1,
			fieldName: '$$accounts',
			filterKey: stringify({}),
		}))
		expect(entityDeletes).toEqual([
			stringify([
				Source.Local_Internal,
				walletConnectionSelectorKey,
			]),
		])
		expect(fieldDeletes).toContain('replacement')
		expect(countDeletes).toEqual([
			walletConnectionSelectorKey,
		])

	}, 90_000)

	it('discovers Aptos injected signer globals with executable connection capabilities', () => {
		vi.stubGlobal('window', {
			aptos: {},
			martian: {},
			pontem: {},
		})

		const updates: WalletCandidate[][] = []
		const cleanup = createAptosInjectedAdapter().start((candidates) => {
			updates.push(candidates)
		})

		expect(updates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'aptos:petra',
				name: 'Petra',
				protocol: WalletProtocol.AptosInjected,
				capabilities: expect.arrayContaining([
					WalletCapability.Discover,
					WalletCapability.Connect,
				]),
			}),
			expect.objectContaining({
				id: 'aptos:martian',
				name: 'Martian',
				protocol: WalletProtocol.AptosInjected,
				capabilities: expect.arrayContaining([
					WalletCapability.Discover,
					WalletCapability.Connect,
				]),
			}),
			expect.objectContaining({
				id: 'aptos:pontem',
				name: 'Pontem',
				protocol: WalletProtocol.AptosInjected,
				capabilities: expect.arrayContaining([
					WalletCapability.Discover,
					WalletCapability.Connect,
				]),
			}),
		])

		cleanup()
	})

	it('connects Cardano CIP-30 wallets into CAIP-style account rows', async () => {
		vi.stubGlobal('window', {
			cardano: {
				nami: {
					name: 'Nami',
					icon: 'nami-icon',
					enable: async () => ({
						getNetworkId: async () => 1,
						getUnusedAddresses: async () => [],
						getUsedAddresses: async () => [
							'019493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251',
						],
					}),
				},
			},
		})

		const adapter = createCardanoCip30Adapter()
		adapter.start(() => {})

		expect(await adapter.connect('cip30:nami')).toMatchObject({
			walletId: 'cip30:nami',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.CardanoCip30,
			accounts: [
				{
					namespace: 'cip34',
					reference: '1-764824073',
					accountAddress: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x',
				},
			],
			scopes: [
				expect.objectContaining({
					namespace: 'cip34',
					reference: '1-764824073',
					events: [],
				}),
			],
		})

		adapter.disconnect('cip30:nami')
		await expect(adapter.connect('cip30:nami')).resolves.toBeDefined()
	})

	it('uses CIP-142 network magic for Cardano testnet identity and rejects ambiguous testnets', async () => {
		vi.stubGlobal('window', {
			cardano: {
				lace: {
					enable: async () => ({
						cip142: {
							getNetworkMagic: async () => 2,
						},
						getNetworkId: async () => 0,
						getUsedAddresses: async () => [
							'009493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251',
						],
					}),
				},
				nami: {
					enable: async () => ({
						getNetworkId: async () => 0,
						getUsedAddresses: async () => [
							'009493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251',
						],
					}),
				},
			},
		})

		const adapter = createCardanoCip30Adapter()
		adapter.start(() => {})

		expect(await adapter.connect('cip30:lace')).toMatchObject({
			accounts: [
				{
					namespace: 'cip34',
					reference: '0-2',
					accountAddress: 'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgs68faae',
				},
			],
		})
		await expect(adapter.connect('cip30:nami')).rejects.toThrow(
			'Cardano CIP-30 wallet did not expose a canonical CIP-34 network'
		)
	})

	it('rejects non-hex and network-mismatched CIP-30 address results', async () => {
		vi.stubGlobal('window', {
			cardano: {
				malformed: {
					enable: async () => ({
						getNetworkId: async () => 1,
						getUsedAddresses: async () => [
							'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x',
						],
					}),
				},
				mismatch: {
					enable: async () => ({
						getNetworkId: async () => 1,
						getUsedAddresses: async () => [
							'009493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251',
						],
					}),
				},
			},
		})

		const adapter = createCardanoCip30Adapter()
		adapter.start(() => {})

		await expect(adapter.connect('cip30:malformed')).rejects.toThrow()
		await expect(adapter.connect('cip30:mismatch')).rejects.toThrow(
			'Cardano CIP-30 address network does not match the wallet network'
		)
	})

	it('connects Polkadot injectedWeb3 wallets into CAIP-style account rows', async () => {
		let updateAccounts = (_accounts: {
			address: string
			genesisHash?: string
		}[]) => {}
		const unsubscribe = vi.fn()

		vi.stubGlobal('window', {
			injectedWeb3: {
				polkadotjs: {
					enable: async () => ({
						accounts: {
							get: async () => [
								{
									address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
									genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182d',
								},
							],
							subscribe: (callback: typeof updateAccounts) => {
								updateAccounts = callback

								return unsubscribe
							},
						},
					}),
				},
			},
		})

		const adapter = createPolkadotInjectedWeb3Adapter()
		adapter.start(() => {})

		expect(await adapter.connect('polkadot:polkadotjs')).toMatchObject({
			walletId: 'polkadot:polkadotjs',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.PolkadotInjectedWeb3,
			accounts: [
				{
					namespace: 'polkadot',
					reference: '91b171bb158e2d3848fa23a9f1c25182',
					accountAddress: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
				},
			],
			scopes: [
				expect.objectContaining({
					namespace: 'polkadot',
					reference: '91b171bb158e2d3848fa23a9f1c25182',
				}),
			],
		})

		const updates: WalletConnection[] = []
		const cleanup = adapter.subscribeConnection(
			'polkadot:polkadotjs',
			(connection) => updates.push(connection)
		)
		updateAccounts([
			{
				address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
				genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182d',
			},
			{
				address: 'unsupported',
			},
		])

		expect(updates).toEqual([
			expect.objectContaining({
				accounts: [
					expect.objectContaining({
						accountAddress: '15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5',
						reference: '91b171bb158e2d3848fa23a9f1c25182',
					}),
				],
			}),
		])

		cleanup()
		expect(unsubscribe).toHaveBeenCalledOnce()

		adapter.disconnect('polkadot:polkadotjs')
		await expect(adapter.connect('polkadot:polkadotjs')).resolves.toBeDefined()
	})

	it('discovers Bitcoin injected signer globals without connecting', () => {
		vi.stubGlobal('window', {
			LeatherProvider: {},
			magicEden: {
				bitcoin: {},
			},
			unisat: {},
			XverseProviders: {},
		})

		const updates: WalletCandidate[][] = []
		const cleanup = createBitcoinInjectedAdapter().start((candidates) => {
			updates.push(candidates)
		})

		expect(updates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'bitcoin:leather',
				name: 'Leather',
				protocol: WalletProtocol.SatsConnect,
				capabilities: [
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.ListAccounts,
				],
			}),
			expect.objectContaining({
				id: 'bitcoin:xverse',
				name: 'Xverse',
				protocol: WalletProtocol.SatsConnect,
				capabilities: [WalletCapability.Discover],
			}),
			expect.objectContaining({
				id: 'bitcoin:unisat',
				name: 'UniSat',
				protocol: WalletProtocol.BitcoinInjected,
				capabilities: [
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
					WalletCapability.WatchScopes,
				],
			}),
			expect.objectContaining({
				id: 'bitcoin:magiceden',
				name: 'Magic Eden',
				protocol: WalletProtocol.BitcoinInjected,
				capabilities: [WalletCapability.Discover],
			}),
		])

		cleanup()
	})

	it.each([
		['Keplr', 'keplr', 'cosmos:keplr', 'keplr_keystorechange'],
		['Leap', 'leap', 'cosmos:leap', 'leap_keystorechange'],
	] as const)('connects %s to canonical Cosmos Hub accounts and follows keystore changes', async (
		walletName,
		walletGlobal,
		walletId,
		keystoreChangeEvent
	) => {
		let accountAddresses = ['cosmos1ruszzg3rysjjvfeg9y4zktpd9chnqvfje038ze']
		const eventListeners = new Map<string, () => void>()
		const enable = vi.fn()
		vi.stubGlobal('window', {
			[walletGlobal]: {
				enable,
				getOfflineSignerAuto: async () => ({
					getAccounts: async () => accountAddresses.map((address) => ({
						address,
						pubkey: new Uint8Array(),
						algo: 'secp256k1',
					})),
				}),
			},
			addEventListener: (eventName: string, listener: () => void) => {
				eventListeners.set(eventName, listener)
			},
			removeEventListener: (eventName: string) => {
				eventListeners.delete(eventName)
			},
		})

		const adapter = createCosmosOfflineSignerAdapter()
		const candidateUpdates: WalletCandidate[][] = []
		const stopDiscovery = adapter.start((candidates) => {
			candidateUpdates.push(candidates)
		})

		expect(candidateUpdates.at(-1)).toEqual([
			expect.objectContaining({
				id: walletId,
				name: walletName,
				protocol: WalletProtocol.CosmosOfflineSigner,
				capabilities: expect.arrayContaining([
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
					WalletCapability.SignTransaction,
				]),
			}),
		])
		expect(await adapter.connect(walletId)).toMatchObject({
			connectionKey: `${walletId}:cosmoshub-4`,
			walletId,
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.CosmosOfflineSigner,
			selected: true,
			scopes: [
				{
					namespace: 'cosmos',
					reference: 'cosmoshub-4',
					events: [keystoreChangeEvent],
				},
			],
			accounts: [
				expect.objectContaining({
					namespace: 'cosmos',
					reference: 'cosmoshub-4',
					accountAddress: 'cosmos1ruszzg3rysjjvfeg9y4zktpd9chnqvfje038ze',
				}),
			],
		})
		expect(enable).toHaveBeenCalledWith('cosmoshub-4')

		const connectionUpdates: WalletConnection[] = []
		const stopConnection = adapter.subscribeConnection(
			walletId,
			(connection) => connectionUpdates.push(connection)
		)
		accountAddresses = ['cosmos18cl5qs2zgdzy23j8fpy55j6vf48y75z395ggwe']
		eventListeners.get(keystoreChangeEvent)?.()
		await vi.waitFor(() => {
			expect(connectionUpdates.at(-1)?.accounts).toEqual([
				expect.objectContaining({
					accountAddress: 'cosmos18cl5qs2zgdzy23j8fpy55j6vf48y75z395ggwe',
				}),
			])
		})

		stopConnection()
		expect(eventListeners.has(keystoreChangeEvent)).toBe(false)
		adapter.disconnect(walletId)

		const restoredConnectionUpdates: WalletConnection[] = []
		const stopRestoredConnection = adapter.subscribeConnection(
			walletId,
			(connection) => restoredConnectionUpdates.push(connection)
		)
		await vi.waitFor(() => {
			expect(restoredConnectionUpdates.at(-1)?.accounts).toEqual([
				expect.objectContaining({
					accountAddress: 'cosmos18cl5qs2zgdzy23j8fpy55j6vf48y75z395ggwe',
				}),
			])
		})
		stopRestoredConnection()
		adapter.disconnect(walletId)

		accountAddresses = []
		await expect(adapter.connect(walletId)).rejects.toThrow('Cosmos wallet did not return any accounts')
		stopDiscovery()
	})

	it('discovers TRON injected provider globals without connecting', () => {
		vi.stubGlobal('window', {
			tronLink: {},
		})

		const updates: WalletCandidate[][] = []
		const cleanup = createTronInjectedAdapter().start((candidates) => {
			updates.push(candidates)
		})

		expect(updates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'tron:injected',
				name: 'TRON injected wallet',
				protocol: WalletProtocol.TronTip1193,
				capabilities: [
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
					WalletCapability.WatchScopes,
				],
			}),
		])

		cleanup()
	})

	it('discovers Starknet injected wallet globals without connecting', () => {
		vi.stubGlobal('window', {
			starknet_argentX: {},
			starknet_braavos: {},
		})

		const updates: WalletCandidate[][] = []
		const cleanup = createStarknetWalletApiAdapter().start((candidates) => {
			updates.push(candidates)
		})

		expect(updates.at(-1)).toEqual([
			expect.objectContaining({
				id: 'starknet:argentx',
				name: 'Argent X',
				protocol: WalletProtocol.StarknetWalletApi,
				capabilities: [
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
					WalletCapability.WatchScopes,
				],
			}),
			expect.objectContaining({
				id: 'starknet:braavos',
				name: 'Braavos',
				protocol: WalletProtocol.StarknetWalletApi,
				capabilities: [
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
					WalletCapability.WatchScopes,
				],
			}),
		])

		cleanup()
	})

	it('discovers Wallet Standard candidates through register-wallet events', () => {
		const eventListeners = new Map<string, (event: Event) => void>()
		vi.stubGlobal('window', {
			addEventListener: (eventName: string, listener: (event: Event) => void) => {
				eventListeners.set(eventName, listener)
			},
			removeEventListener: (eventName: string) => {
				eventListeners.delete(eventName)
			},
			dispatchEvent: (event: Event) => {
				eventListeners.get(event.type)?.(event)
				return true
			},
		})

		const adapter = createWalletStandardAdapter()
		const updates: WalletCandidate[][] = []
		const cleanup = adapter.start((candidates) => {
			updates.push(candidates)
		})

		globalThis.window.dispatchEvent(new CustomEvent('wallet-standard:register-wallet', {
			detail: {
				register: (register: (wallet: { name: string, icon?: string }) => void) => {
					register({
						name: 'Standard Wallet',
						icon: 'standard-icon',
					})
				},
			},
		}))

		expect(updates.at(-1)).toContainEqual(expect.objectContaining({
			id: 'wallet-standard:Standard Wallet',
			name: 'Standard Wallet',
			icon: 'standard-icon',
			protocol: WalletProtocol.WalletStandard,
			capabilities: [WalletCapability.Discover],
		}))

		cleanup()
	})

	it('hydrates persisted connections when their wallet provider is unavailable', async () => {
		const { runtime } = await mountMockWalletRuntime({
			candidateAvailable: false,
			persistedStatus: BlockheadConnectionStatus.Connected,
		})

		await vi.waitFor(() => expect(runtime.connections).toEqual([
			expect.objectContaining({
				connectionKey: 'persisted-session',
				walletId: 'eip6963:com.example.wallet',
				status: BlockheadConnectionStatus.Connected,
				protocol: WalletProtocol.Eip6963,
				transportKind: WalletTransportKind.InjectedProvider,
				accounts: [
					expect.objectContaining({
						namespace: 'eip155',
						reference: '1',
						accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
						capabilities: [],
					}),
				],
			}),
		]))

		runtime.destroy()
	})

	it('demotes extra selected persisted connections on hydrate so prepare stays single-selected', async () => {
		const { runtime, writeConnection } = await mountMockWalletRuntime({
			candidateAvailable: false,
			persistedConnections: [
				{
					connectionKey: 'older-selected',
					walletId: 'eip6963:com.example.wallet',
					status: BlockheadConnectionStatus.Connected,
					protocol: WalletProtocol.Eip6963,
					transportKind: WalletTransportKind.InjectedProvider,
					selected: true,
				},
				{
					connectionKey: 'newer-selected',
					walletId: 'eip6963:com.example.other',
					status: BlockheadConnectionStatus.Connected,
					protocol: WalletProtocol.Eip6963,
					transportKind: WalletTransportKind.InjectedProvider,
					selected: true,
				},
			],
		})

		await vi.waitFor(() => expect(runtime.connections).toEqual([
			expect.objectContaining({
				connectionKey: 'older-selected',
				status: BlockheadConnectionStatus.Connected,
				selected: false,
			}),
			expect.objectContaining({
				connectionKey: 'newer-selected',
				status: BlockheadConnectionStatus.Connected,
				selected: true,
			}),
		]))
		expect(writeConnection).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				connectionKey: 'older-selected',
				status: BlockheadConnectionStatus.Connected,
				selected: false,
			})
		)

		runtime.destroy()
	})

	it('registers a vendor-backed adapter after runtime bootstrap without remounting wallet state', async () => {
		const { runtime } = await mountMockWalletRuntime({
			candidateAvailable: false,
			persistedProtocol: WalletProtocol.WalletConnectV2,
			persistedStatus: BlockheadConnectionStatus.Connected,
			persistedTransportKind: WalletTransportKind.WalletConnectRelay,
			persistedWalletId: 'walletconnect-v2',
		})
		await vi.waitFor(() => expect(runtime.connections).toContainEqual(
			expect.objectContaining({
				connectionKey: 'persisted-session',
				walletId: 'walletconnect-v2',
			})
		))
		const cleanup = vi.fn()
		const subscribeConnection = vi.fn(() => () => {})
		const adapter = {
			id: 'walletconnect-v2',
			start: (updateCandidates) => {
				updateCandidates([{
					id: 'walletconnect-v2',
					name: 'WalletConnect',
					icon: '',
					protocol: WalletProtocol.WalletConnectV2,
					discoveryKind: WalletDiscoveryKind.QrDeeplink,
					transportKind: WalletTransportKind.WalletConnectRelay,
					capabilities: [WalletCapability.Connect],
				}])

				return cleanup
			},
			connect: async () => ({
				connectionKey: 'vendor-topic',
				walletId: 'walletconnect-v2',
				status: BlockheadConnectionStatus.Connected,
				protocol: WalletProtocol.WalletConnectV2,
				transportKind: WalletTransportKind.WalletConnectRelay,
				scopes: [],
				accounts: [],
				selected: true,
				sessionTopic: 'vendor-topic',
			}),
			disconnect: async () => {},
			subscribeConnection,
		} satisfies WalletAdapter

		expect(() => runtime.registerAdapter({
			...adapter,
			start: () => {
				throw new Error('WalletConnect client unavailable')
			},
		})).toThrow('WalletConnect client unavailable')
		runtime.registerAdapter(adapter)
		expect(runtime.candidates).toContainEqual(expect.objectContaining({
			id: 'walletconnect-v2',
			protocol: WalletProtocol.WalletConnectV2,
		}))
		expect(subscribeConnection).toHaveBeenCalledWith(
			'walletconnect-v2',
			expect.any(Function),
			'persisted-session'
		)
		await runtime.connect('walletconnect-v2')
		expect(runtime.connections).toContainEqual(expect.objectContaining({
			connectionKey: 'vendor-topic',
			walletId: 'walletconnect-v2',
			status: BlockheadConnectionStatus.Connected,
		}))
		expect(() => runtime.registerAdapter(adapter)).toThrow(
			'Wallet adapter walletconnect-v2 is already registered'
		)

		runtime.destroy()
		expect(cleanup).toHaveBeenCalledOnce()
	}, 15_000)

	it('does not subscribe persisted disconnected connections', async () => {
		const {
			runtime,
			subscribeConnection,
		} = await mountMockWalletRuntime({
			persistedStatus: BlockheadConnectionStatus.Disconnected,
		})

		await vi.waitFor(() => expect(runtime.connections).toEqual([
			expect.objectContaining({
				connectionKey: 'persisted-session',
				status: BlockheadConnectionStatus.Disconnected,
			}),
		]))
		expect(subscribeConnection).not.toHaveBeenCalled()

		runtime.destroy()
	})

	it('preserves distinct connection histories for the same wallet', async () => {
		const {
			deleteConnection,
			disconnect,
			runtime,
			subscribeConnection,
		} = await mountMockWalletRuntime({
			connectionResults: [
				{
					connectionKey: 'session-1',
					walletId: 'eip6963:com.example.wallet',
					status: BlockheadConnectionStatus.Connected,
					protocol: WalletProtocol.Eip6963,
					transportKind: WalletTransportKind.InjectedProvider,
					scopes: [],
					accounts: [],
					selected: true,
				},
				{
					connectionKey: 'session-2',
					walletId: 'eip6963:com.example.wallet',
					status: BlockheadConnectionStatus.Connected,
					protocol: WalletProtocol.Eip6963,
					transportKind: WalletTransportKind.InjectedProvider,
					scopes: [],
					accounts: [],
					selected: true,
				},
			],
		})

		await runtime.connect('eip6963:com.example.wallet')
		await runtime.connect('eip6963:com.example.wallet')

		expect(runtime.connections).toEqual([
			expect.objectContaining({
				connectionKey: 'session-1',
				walletId: 'eip6963:com.example.wallet',
			}),
			expect.objectContaining({
				connectionKey: 'session-2',
				walletId: 'eip6963:com.example.wallet',
			}),
		])
		expect(deleteConnection.mock.calls).toEqual([
			[
				expect.anything(),
				'eip6963:com.example.wallet',
			],
			[
				expect.anything(),
				'eip6963:com.example.wallet',
			],
		])
		expect(subscribeConnection.mock.calls.map(([, , connectionKey]) => connectionKey)).toEqual([
			'session-1',
			'session-2',
		])

		await runtime.disconnect('session-1')
		expect(disconnect).toHaveBeenCalledWith(
			'eip6963:com.example.wallet',
			'session-1'
		)
		expect(runtime.connections).toEqual([
			expect.objectContaining({
				connectionKey: 'session-1',
				status: BlockheadConnectionStatus.Disconnected,
			}),
			expect.objectContaining({
				connectionKey: 'session-2',
				status: BlockheadConnectionStatus.Connected,
			}),
		])

		runtime.destroy()
	})

	it('keeps exactly one selected Connected row across successive connects', async () => {
		const account = {
			namespace: 'eip155',
			reference: '1',
			accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			capabilities: [WalletCapability.SignMessage],
		}
		const {
			runtime,
		} = await mountMockWalletRuntime({
			connectionResults: [
				{
					connectionKey: 'session-1',
					walletId: 'eip6963:com.example.wallet',
					status: BlockheadConnectionStatus.Connected,
					protocol: WalletProtocol.Eip6963,
					transportKind: WalletTransportKind.InjectedProvider,
					scopes: [],
					accounts: [account],
					activeAccount: account,
					selected: true,
				},
				{
					connectionKey: 'session-2',
					walletId: 'eip6963:com.example.wallet',
					status: BlockheadConnectionStatus.Connected,
					protocol: WalletProtocol.Eip6963,
					transportKind: WalletTransportKind.InjectedProvider,
					scopes: [],
					accounts: [account],
					activeAccount: account,
					selected: true,
				},
			],
		})

		await runtime.connect('eip6963:com.example.wallet')
		expect(runtime.connections.map((connection) => ({
			connectionKey: connection.connectionKey,
			selected: connection.status === BlockheadConnectionStatus.Connected && connection.selected,
		}))).toEqual([
			{
				connectionKey: 'session-1',
				selected: true,
			},
		])

		await runtime.connect('eip6963:com.example.wallet')
		expect(runtime.connections.map((connection) => ({
			connectionKey: connection.connectionKey,
			selected: connection.status === BlockheadConnectionStatus.Connected && connection.selected,
		}))).toEqual([
			{
				connectionKey: 'session-1',
				selected: false,
			},
			{
				connectionKey: 'session-2',
				selected: true,
			},
		])

		runtime.destroy()
	})

	it('revokes rejected connect authority and permits a successful retry', async () => {
		const connection = {
			connectionKey: 'session-after-retry',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.Eip6963,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [{
				namespace: 'eip155',
				reference: '1',
				accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				capabilities: [WalletCapability.SignMessage],
			}],
			selected: true,
		} satisfies WalletConnection
		const {
			deleteConnection,
			runtime,
			writeConnection,
		} = await mountMockWalletRuntime({
			connectionResults: [
				new Error('User rejected wallet connection'),
				connection,
			],
		})

		await runtime.connect(connection.walletId)
		expect(runtime.connections).toEqual([
			expect.objectContaining({
				walletId: connection.walletId,
				status: BlockheadConnectionStatus.Error,
				error: 'User rejected wallet connection',
			}),
		])
		expect(runtime.connections[0]).not.toHaveProperty('selected')

		await runtime.connect(connection.walletId)
		expect(runtime.connections).toEqual([
			expect.objectContaining({
				connectionKey: connection.connectionKey,
				status: BlockheadConnectionStatus.Connected,
				selected: true,
			}),
		])
		expect(deleteConnection).toHaveBeenCalledWith(
			expect.anything(),
			connection.walletId
		)
		expect(writeConnection.mock.calls.map(([, persistedConnection]) => persistedConnection)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					walletId: connection.walletId,
					status: BlockheadConnectionStatus.Error,
					error: 'User rejected wallet connection',
				}),
				expect.objectContaining({
					connectionKey: connection.connectionKey,
					status: BlockheadConnectionStatus.Connected,
					selected: true,
				}),
			])
		)

		runtime.destroy()
	})

	it('keeps a connection active when asynchronous wallet disconnect is rejected', async () => {
		const disconnect = vi.fn(async () => {
			throw new Error('Wallet rejected disconnect')
		})
		const {
			runtime,
		} = await mountMockWalletRuntime({
			connectionResults: [{
				connectionKey: 'session-1',
				walletId: 'eip6963:com.example.wallet',
				status: BlockheadConnectionStatus.Connected,
				protocol: WalletProtocol.Eip6963,
				transportKind: WalletTransportKind.InjectedProvider,
				scopes: [],
				accounts: [],
				selected: true,
			}],
			disconnect,
		})

		await runtime.connect('eip6963:com.example.wallet')
		await expect(runtime.disconnect('session-1')).rejects.toThrow('Wallet rejected disconnect')
		expect(runtime.connections).toEqual([
			expect.objectContaining({
				connectionKey: 'session-1',
				status: BlockheadConnectionStatus.Connected,
			}),
		])

		runtime.destroy()
	})
})
