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
import type { WalletCandidate, WalletConnection } from './adapters/types.ts'
import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletImplementationStatus,
	WalletProtocol,
	WalletTransportKind,
	walletConnectionMethods,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
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
	persistedStatus,
	signMessage = vi.fn(async () => '0xsigned'),
}: {
	candidateAvailable?: boolean
	connectionResults?: WalletConnection[]
	disconnect?: (walletId: string, connectionKey?: string) => void | Promise<void>
	persistWalletRequest?: (context: object, request: object) => void | Promise<void>
	persistedStatus?: BlockheadConnectionStatus
	signMessage?: (walletId: string, accountAddress: string, message: string) => Promise<string>
}) => {
	const walletId = 'eip6963:com.example.wallet'
	const account = {
		namespace: 'eip155',
		reference: '1',
		accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
		capabilities: [WalletCapability.SignMessage],
	}
	const persistedConnection = (
		persistedStatus == null ?
			undefined
		:
			{
				connectionKey: 'persisted-session',
				walletId,
				status: persistedStatus,
				protocol: WalletProtocol.Eip6963,
				transportKind: WalletTransportKind.InjectedProvider,
				scopes: [],
				accounts: [account],
				activeAccount: account,
				selected: persistedStatus === BlockheadConnectionStatus.Connected,
			}
	)
	const subscribeConnection = vi.fn((
		_walletId: string,
		_updateConnection: (connection: WalletConnection) => void,
		_connectionKey?: string
	) => () => {})
	const deleteConnection = vi.fn()
	const writeWalletRequest = vi.fn(persistWalletRequest)

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
			connect: async () => connectionResults.shift(),
			signMessage,
			disconnect,
			subscribeConnection,
		}),
	}))
	vi.doMock('$/collections/localMutations.ts', () => ({
		deleteLocalBlockheadWalletConnection: deleteConnection,
		writeLocalBlockheadWallet: vi.fn(),
		writeLocalBlockheadWalletConnection: vi.fn(),
		writeLocalBlockheadWalletRequest: writeWalletRequest,
	}))

	const persistedConnectionPromise = Promise.resolve(persistedConnection)
	const persistedConnectionSelection = Object.assign(
		() => persistedConnectionPromise,
		{
			then: persistedConnectionPromise.then.bind(persistedConnectionPromise),
			catch: persistedConnectionPromise.catch.bind(persistedConnectionPromise),
			finally: persistedConnectionPromise.finally.bind(persistedConnectionPromise),
			$wallet: Promise.resolve({
				[EntityMetaKey.Selector]: {
					id: walletId,
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
	const { mountWalletConnectionRuntime } = await import('./walletConnectionRuntime.svelte.ts')
	const runtime = mountWalletConnectionRuntime({
		entityCollections: {},
		entityFieldCollections: {},
		entityFieldCountCollections: {},
		select: (entityType: EntityType) => (
			entityType === EntityType._Global ?
				{
					$$blockheadWalletConnections: () => Promise.resolve({
						values: persistedConnection == null ?
							[]
						:
							[
								{
									connectionKey: persistedConnection.connectionKey,
									[EntityMetaKey.Selector]: {
										connectionKey: persistedConnection.connectionKey,
									},
								},
							],
					}),
				}
			:
				persistedConnectionSelection
		),
	})

	return {
		deleteConnection,
		disconnect,
		runtime,
		subscribeConnection,
		writeWalletRequest,
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
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
		})

		await runtime.connect(connection.walletId)
		expect(await runtime.signMessage(connection.connectionKey, 'Sign this private challenge')).toEqual({
			accountAddress: connection.accounts[0].accountAddress,
			signature: '0xsigned',
		})

		expect(writeWalletRequest).toHaveBeenCalledTimes(2)
		expect(writeWalletRequest.mock.calls[0][1]).toMatchObject({
			id: 'wallet-request-00000000-0000-4000-8000-000000000001',
			walletConnectionKey: connection.connectionKey,
			walletProtocol: WalletProtocol.Eip6963,
			caip10: {
				namespace: 'eip155',
				reference: '1',
				accountAddress: connection.accounts[0].accountAddress,
			},
			requestKind: 'message-signature',
			requestMethod: 'personal_sign',
			chainId: 1,
			fromAddress: connection.accounts[0].accountAddress,
			requestPayloadHash: '0x01b40af6b67ecf862be67d3b7ab43bfbda4e9c1cdf4cc06761a7db5d1d676e94',
			requestedAt: 1_700_000_000_000,
			timestamps: [{
				status: 'requested',
			}],
		})
		expect(writeWalletRequest.mock.calls[1][1]).toMatchObject({
			submittedAt: 1_700_000_000_001,
			timestamps: [
				{
					status: 'requested',
				},
				{
					status: 'signed',
					signatureHash: '0x318db428059e86506988fdc8079f42b03dcf1ca107807005a014128fdbcc1e94',
				},
			],
		})
		expect(JSON.stringify(writeWalletRequest.mock.calls.map(([, request]) => request))).not.toContain(
			'Sign this private challenge'
		)
		expect(JSON.stringify(writeWalletRequest.mock.calls.map(([, request]) => request))).not.toContain('0xsigned')
		expect(writeWalletRequest.mock.calls[1][1].timestamps[1]).not.toHaveProperty('transactionHash')
		expect(writeWalletRequest.mock.calls[1][1].timestamps[1]).not.toHaveProperty('transactionId')
	})

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

		expect(writeWalletRequest).toHaveBeenCalledTimes(2)
		expect(writeWalletRequest.mock.calls[1][1]).not.toHaveProperty('submittedAt')
		expect(writeWalletRequest.mock.calls[1][1].timestamps[1]).toMatchObject({
			status: 'failed',
			error: 'Wallet signing request failed',
		})
		expect(writeWalletRequest.mock.calls[1][1].timestamps[1]).not.toHaveProperty('signatureHash')
		expect(JSON.stringify(writeWalletRequest.mock.calls.map(([, request]) => request))).not.toContain(
			'Reject this challenge'
		)
		expect(JSON.stringify(writeWalletRequest.mock.calls.map(([, request]) => request))).not.toContain(
			'User rejected the wallet request'
		)
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
			persistWalletRequest: () => new Promise<void>((resolve) => {
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
			writeWalletRequest,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		await expect(runtime.signMessage(connection.connectionKey, 'Audit separately')).rejects.toThrow(
			'Audit digest unavailable'
		)

		expect(signing).toHaveBeenCalledOnce()
		expect(writeWalletRequest.mock.calls[1][1].timestamps[1]).toMatchObject({
			status: 'audit-failed',
			error: 'Wallet signature evidence hashing failed',
		})
		expect(writeWalletRequest.mock.calls[1][1].timestamps[1]).not.toHaveProperty('signatureHash')
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
			writeWalletRequest,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistWalletRequest: async () => {
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
		expect(writeWalletRequest).toHaveBeenCalledTimes(3)
		expect(writeWalletRequest.mock.calls[1][1].timestamps[1].status).toBe('signed')
		expect(writeWalletRequest.mock.calls[2][1].timestamps[1]).toMatchObject({
			status: 'audit-failed',
			signatureHash: '0x318db428059e86506988fdc8079f42b03dcf1ca107807005a014128fdbcc1e94',
			error: 'Wallet signature succeeded but signed history persistence failed',
		})
	})

	it('keeps implemented catalog methods aligned with mounted adapter protocols', () => {
		const mountedProtocols = [
			WalletProtocol.Eip6963,
			WalletProtocol.WalletStandard,
			WalletProtocol.AptosInjected,
			WalletProtocol.CardanoCip30,
			WalletProtocol.BitcoinInjected,
			WalletProtocol.CosmosOfflineSigner,
			WalletProtocol.TronTip1193,
			WalletProtocol.StarknetWalletApi,
			WalletProtocol.PolkadotInjectedWeb3,
		]

		expect(walletConnectionMethods
			.filter((walletConnectionMethod) => (
				walletConnectionMethod.implementationStatus === WalletImplementationStatus.Implemented
				|| walletConnectionMethod.implementationStatus === WalletImplementationStatus.DiscoveryImplemented
			))
			.map((walletConnectionMethod) => walletConnectionMethod.protocol)
			.toSorted()
		).toEqual(mountedProtocols.toSorted())
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
			status: BlockheadConnectionStatus.Disconnected,
			protocol: WalletProtocol.CardanoCip30,
			transportKind: WalletTransportKind.InjectedSigner,
			scopes: [],
			accounts: [],
			selected: false,
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
					replaceRowsWithAuthority: replaceRows,
					writeUpsert,
					writeUpsertWithAuthority: writeUpsert,
				},
			}
		}

		const context = {
			entityCollections: {
				[EntityType.BlockheadWallet]: {
					startSyncImmediate: () => {},
					utils: {
						waitForPersistence,
						deleteSelectorRowsAndAuthority: (_predicate: (row: MockRow) => boolean, selectorKey: string) => {
							entityDeletes.push(stringify([
								Source.Local_Internal,
								selectorKey,
							]))
						},
						refresh: () => {},
						writeUpsert: (row: MockRow) => entityUpserts.push(row),
						writeUpsertWithAuthority: (row: MockRow) => entityUpserts.push(row),
					},
				},
				[EntityType.Account]: {
					startSyncImmediate: () => {},
					utils: {
						deleteSelectorRowsAndAuthority: (_predicate: (row: MockRow) => boolean, selectorKey: string) => {
							entityDeletes.push(stringify([
								Source.Local_Internal,
								selectorKey,
							]))
						},
						refresh: () => {},
						writeUpsert: (row: MockRow) => entityUpserts.push(row),
						writeUpsertWithAuthority: (row: MockRow) => entityUpserts.push(row),
					},
				},
				[EntityType.BlockheadAccount]: {
					startSyncImmediate: () => {},
					utils: {
						waitForPersistence,
						deleteSelectorRowsAndAuthority: (_predicate: (row: MockRow) => boolean, selectorKey: string) => {
							entityDeletes.push(stringify([
								Source.Local_Internal,
								selectorKey,
							]))
						},
						refresh: () => {},
						writeUpsert: (row: MockRow) => entityUpserts.push(row),
						writeUpsertWithAuthority: (row: MockRow) => entityUpserts.push(row),
					},
				},
				[EntityType.BlockheadWalletConnection]: {
					delete: (key: string) => entityDeletes.push(key),
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
							selectorKey: string
						) => {
							entityDeletes.push(stringify([
								Source.Local_Internal,
								selectorKey,
							]))
						},
						refresh: () => {},
						writeUpsert: (row: MockRow) => entityUpserts.push(row),
						writeUpsertWithAuthority: (row: MockRow) => entityUpserts.push(row),
					},
				},
				[EntityType.EvmAccount]: {
					startSyncImmediate: () => {},
					utils: {
						writeUpsert: (row: MockRow) => entityUpserts.push(row),
						writeUpsertWithAuthority: (row: MockRow) => entityUpserts.push(row),
					},
				},
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
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'websiteUrl')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'capabilities')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'adapterId')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'sourceWalletKey')]: fieldCollection(),
					[entityFieldAddressKey(EntityType.BlockheadWallet, [], 'detectedAt')]: fieldCollection(),
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
								selectorKey: string
							) => {
								if (rows.length === 0)
									countDeletes.push(selectorKey)
								else
									countUpserts.push(...rows)
							},
							writeUpsert: (row: MockRow) => countUpserts.push(row),
							writeUpsertWithAuthority: (row: MockRow) => countUpserts.push(row),
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
		const blockheadAccountSelectorKey = stringify({
			$account: {
				caip10: {
					namespace: 'eip155',
					reference: '1',
					accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
				},
			},
		})
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
					$account: {
						caip10: {
							namespace: 'eip155',
							reference: '1',
							accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
						},
					},
				},
				[EntityMetaKey.SelectorKey]: blockheadAccountSelectorKey,
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
				fieldName: '$$blockheadAccounts',
				[EntityMetaKey.Value]: {
					[EntityMetaKey.Selector]: {
						$account: {
							caip10: {
								namespace: 'eip155',
								reference: '1',
								accountAddress: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
							},
						},
					},
					[EntityMetaKey.SelectorKey]: blockheadAccountSelectorKey,
				},
				valueKey: `Entity:${blockheadAccountSelectorKey}`,
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

	}, 15_000)

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
		let accountAddresses = ['cosmos1first']
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
				capabilities: [
					WalletCapability.Discover,
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
					WalletCapability.SignTransaction,
				],
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
					accountAddress: 'cosmos1first',
				}),
			],
		})
		expect(enable).toHaveBeenCalledWith('cosmoshub-4')

		const connectionUpdates: WalletConnection[] = []
		const stopConnection = adapter.subscribeConnection(
			walletId,
			(connection) => connectionUpdates.push(connection)
		)
		accountAddresses = ['cosmos1second']
		eventListeners.get(keystoreChangeEvent)?.()
		await vi.waitFor(() => {
			expect(connectionUpdates.at(-1)?.accounts).toEqual([
				expect.objectContaining({
					accountAddress: 'cosmos1second',
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
					accountAddress: 'cosmos1second',
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
			'session-1',
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
