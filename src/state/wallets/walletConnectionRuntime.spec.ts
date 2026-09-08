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
import type {
	WalletAdapter,
	WalletCandidate,
	WalletConnection,
	WalletTonInternalMessages,
	WalletStarknetTypedData,
} from '$/state/wallets/adapters/types.ts'
import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { EntityMetaKey, entityFieldAddressKey, entitySelectorKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { entityDefinitionByType, schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type { TauriWalletLinkHost } from './tauriWalletLink.ts'

type MockRow = Record<string, string | number | boolean | object | readonly object[] | undefined>

const mountMockWalletRuntime = async ({
	candidateAvailable = true,
	disconnectDuringHydration,
	connectionResults = [],
	disconnect = vi.fn(),
	authorityDecisionBeforeOccurrence,
	persistActionAuthorityRequest = vi.fn(),
	persistDispatchOccurrenceStart = vi.fn(),
	persistDispatchEvidence = vi.fn(),
	persistWalletRequest = vi.fn(),
	persistWalletRequestObservation = vi.fn(),
	persistWalletRequestSubmittedAt = vi.fn(),
	persistedConnections,
	persistedProtocol = WalletProtocol.Eip6963,
	persistedStatus,
	persistedTransportKind = WalletTransportKind.InjectedProvider,
	persistedWalletId = 'eip6963:com.example.wallet',
	candidateProtocol = WalletProtocol.Eip6963,
	candidateDiscoveryKind = WalletDiscoveryKind.InjectedEvent,
	candidateCapabilities = [WalletCapability.Connect],
	accountNamespace = 'eip155',
	accountReference = '1',
	accountAddress = '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
	accountCapabilities = [WalletCapability.SignMessage],
	selectedError,
	signMessage = vi.fn(async () => '0xsigned'),
	signTonInternalMessages = vi.fn(async () => 'te6ccgEBAQEA'),
	signStarknetTypedData = vi.fn(async () => ['0x1', '0x2']),
	signTypedData = vi.fn(async () => '0xtyped'),
	switchScope,
	tauriWalletLinkHost,
}: {
	candidateAvailable?: boolean
	disconnectDuringHydration?: 'resolve' | 'reject'
	connectionResults?: (Error | WalletConnection)[]
	disconnect?: (walletId: string, connectionKey?: string) => void | Promise<void>
	authorityDecisionBeforeOccurrence?: 'denied' | 'cancelled' | 'prepared-without-dispatch'
	persistActionAuthorityRequest?: (context: object, request: { id: string }) => void | Promise<void>
	persistDispatchOccurrenceStart?: (context: object, occurrence: object) => void | Promise<void>
	persistDispatchEvidence?: (context: object, occurrence: object, evidence: object) => void | Promise<void>
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
	candidateProtocol?: WalletProtocol
	candidateDiscoveryKind?: WalletDiscoveryKind
	candidateCapabilities?: WalletCapability[]
	accountNamespace?: string
	accountReference?: string
	accountAddress?: string
	accountCapabilities?: WalletCapability[]
	selectedError?: Error
	signMessage?: (walletId: string, accountAddress: string, message: string, connectionKey?: string) => Promise<string>
	signTonInternalMessages?: (walletId: string, accountAddress: string, request: WalletTonInternalMessages, connectionKey?: string) => Promise<string>
	signStarknetTypedData?: (
		walletId: string,
		accountAddress: string,
		reference: string,
		typedData: WalletStarknetTypedData,
		apiVersion?: string,
		connectionKey?: string
	) => Promise<string[]>
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
	tauriWalletLinkHost?: TauriWalletLinkHost
}) => {
	let adapter: WalletAdapter | undefined
	let updateAdapterCandidates: ((candidates: WalletCandidate[]) => void) | undefined
	let updateConnection: ((connection: WalletConnection) => void) | undefined
	const walletId = persistedWalletId
	const account = {
		namespace: accountNamespace,
		reference: accountReference,
		accountAddress,
		capabilities: accountCapabilities,
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
	) => {
		updateConnection = _updateConnection
		return () => {}
	})
	const deleteConnection = vi.fn()
	const writeConnection = vi.fn()
	const writeWalletRequest = vi.fn(persistWalletRequest)
	const writeWalletRequestObservation = vi.fn(persistWalletRequestObservation)
	const writeWalletRequestSubmittedAt = vi.fn(persistWalletRequestSubmittedAt)
	const authorityDecisionRows: MockRow[] = []
	const authorityRowsByField = new Map<string, MockRow[]>([
		['decision', authorityDecisionRows],
		['actionRevisionBindings', []],
		['$$sessionActions', []],
	])
	const writeActionAuthorityRequest = vi.fn(async (context: object, request: {
		id: string
		envelope: object
		envelopeHash: string
		account: object
	}) => {
		await persistActionAuthorityRequest(context, request)
		const parentSelectorKey = entitySelectorKey(
			schema,
			entityDefinitionByType[EntityType.BlockheadActionAuthorityRequest],
			{ id: request.id }
		)
		for (const [fieldName, value] of [
			['envelope', request.envelope],
			['envelopeHash', request.envelopeHash],
			['$account', { [EntityMetaKey.Selector]: request.account }],
		] as const)
			authorityRowsByField.set(fieldName, [{
				[EntityMetaKey.ParentSelectorKey]: parentSelectorKey,
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.Value]: value,
			}])
		if (authorityDecisionBeforeOccurrence)
			authorityDecisionRows.push({
				[EntityMetaKey.ParentSelectorKey]: entitySelectorKey(
					schema,
					entityDefinitionByType[EntityType.BlockheadActionAuthorityRequest],
					{ id: request.id }
				),
				[EntityMetaKey.Source]: Source.Local_Internal,
				[EntityMetaKey.Value]: authorityDecisionBeforeOccurrence === 'denied' ? {
					kind: authorityDecisionBeforeOccurrence,
					decidedAt: 2,
					reason: 'test decision',
				} : {
					kind: authorityDecisionBeforeOccurrence,
					decidedAt: 2,
				},
			})
		return { id: 'authority-request' }
	})
	const writeDispatchOccurrenceStart = vi.fn(async (context: object, occurrence: object) => {
		await persistDispatchOccurrenceStart(context, occurrence)
		return { id: 'dispatch-occurrence' }
	})
	const writeDispatchEvidence = vi.fn(async (context: object, occurrence: object, evidence: object) => {
		await persistDispatchEvidence(context, occurrence, evidence)
	})
	const writeActionAuthorityDecision = vi.fn(async (
		_context: object,
		_selector: object,
		decision: object
	) => {
		authorityDecisionRows.push({
			[EntityMetaKey.ParentSelectorKey]: authorityRowsByField.get('envelope')?.[0][EntityMetaKey.ParentSelectorKey],
			[EntityMetaKey.Source]: Source.Local_Internal,
			[EntityMetaKey.Value]: decision,
		})
	})

	vi.doMock('./adapters/eip6963.ts', () => ({
		createEip6963Adapter: () => {
			adapter = {
			id: 'eip6963',
			start: (updateCandidates: (candidates: WalletCandidate[]) => void) => {
				updateAdapterCandidates = updateCandidates
				updateCandidates(
					candidateAvailable ?
						[
							{
								id: walletId,
								name: 'Example Wallet',
								icon: '',
								protocol: candidateProtocol,
								discoveryKind: candidateDiscoveryKind,
								transportKind: WalletTransportKind.InjectedProvider,
								capabilities: candidateCapabilities,
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
			signTonInternalMessages,
			signStarknetTypedData,
			signTypedData,
			...(switchScope != null && { switchScope }),
			disconnect,
			subscribeConnection,
			}
			return adapter
		},
	}))
	vi.doMock('$/collections/localMutations.ts', () => ({
		deleteLocalBlockheadWalletConnection: deleteConnection,
		writeLocalBlockheadWallet: vi.fn(),
		writeLocalBlockheadWalletConnection: writeConnection,
		writeLocalBlockheadWalletRequest: writeWalletRequest,
		writeLocalBlockheadWalletRequest_Timestamp: writeWalletRequestObservation,
		writeLocalBlockheadWalletRequestSubmittedAt: writeWalletRequestSubmittedAt,
		writeLocalBlockheadActionAuthorityRequest: writeActionAuthorityRequest,
		writeLocalBlockheadActionAuthorityDecision: writeActionAuthorityDecision,
		writeLocalBlockheadActionDispatchOccurrenceStart: writeDispatchOccurrenceStart,
		writeLocalBlockheadActionDispatchEvidence: writeDispatchEvidence,
	}))

	const selectionFor = (
		connectionKey: string
	) => {
		let persistedConnection = persistedByKey[connectionKey]
		const persistedConnectionPromise = Promise.resolve(persistedConnection)
		return Object.assign(
			() => Object.defineProperty(Promise.resolve(persistedConnection), 'current', {
				get: () => persistedConnection,
			}),
			{
				then: persistedConnectionPromise.then.bind(persistedConnectionPromise),
				catch: persistedConnectionPromise.catch.bind(persistedConnectionPromise),
				finally: persistedConnectionPromise.finally.bind(persistedConnectionPromise),
				Connected: {
					selected: () => {
						if (disconnectDuringHydration) {
							const selected = persistedConnection.selected
							persistedConnection = {
								...persistedConnection,
								status: BlockheadConnectionStatus.Disconnected,
								selected: false,
							}
							return disconnectDuringHydration === 'reject' ?
								Promise.reject(new Error('Connected.selected cleared by disconnect'))
							:
								Promise.resolve(selected)
						}
						if (selectedError)
							return Promise.reject(selectedError)

						return Promise.resolve(persistedConnection.selected)
					},
				},
				$wallet: Promise.resolve({
					[EntityMetaKey.Selector]: {
						id: persistedConnection.walletId,
					},
				}),
				$$accounts: () => Promise.resolve({
					values: persistedConnection.accounts.map((persistedAccount) => ({
						[EntityMetaKey.Selector]: {
							caip10: {
								namespace: persistedAccount.namespace,
								reference: persistedAccount.reference,
								accountAddress: persistedAccount.accountAddress,
							},
						},
					})),
				}),
				$activeAccount: Promise.resolve({
					[EntityMetaKey.Selector]: {
						caip10: {
							namespace: persistedConnection.activeAccount.namespace,
							reference: persistedConnection.activeAccount.reference,
							accountAddress: persistedConnection.activeAccount.accountAddress,
						},
					},
				}),
			}
		)
	}
	const persistedReferences = {
		values: persistedRows.map((row) => ({
			connectionKey: row.connectionKey,
			[EntityMetaKey.Selector]: {
				connectionKey: row.connectionKey,
			},
		})),
	}
	const hydration = Promise.withResolvers<void>()
	void hydration.promise.catch(() => {})
	const { mountWalletConnectionRuntime } = await import('./walletConnectionRuntime.svelte.ts')
	const runtime = mountWalletConnectionRuntime({
		entityCollections: {},
		entityFieldCollections: {
			[EntityType.BlockheadActionAuthorityRequest]: Object.fromEntries([
					'decision',
					'envelope',
					'envelopeHash',
					'actionRevisionBindings',
					'$$sessionActions',
					'$account',
				].map((fieldName) => [
					entityFieldAddressKey(EntityType.BlockheadActionAuthorityRequest, [], fieldName),
					{
						get toArray() {
							return authorityRowsByField.get(fieldName) ?? []
						},
					},
				])),
		},
		entityFieldCountCollections: {},
		select: (
			entityType: EntityType,
			selector?: {
				connectionKey?: string
			}
		) => (
			entityType === EntityType._Global ?
				{
					$$blockheadWalletConnections: () => ({
						then: (hydrate: (references: typeof persistedReferences) => Promise<void>) => (
							Promise.resolve(persistedReferences)
								.then(hydrate)
								.then(hydration.resolve, (error: Error) => {
									hydration.reject(error)
									if (!selectedError)
										throw error
								})
						),
					}),
					}
				:
					selectionFor(selector.connectionKey ?? persistedRows[0].connectionKey)
		),
	}, {
		...(tauriWalletLinkHost != null && { tauriWalletLinkHost }),
	})

	return {
		adapter: () => {
			if (adapter == null)
				throw new Error('Mock adapter is unavailable')
			return adapter
		},
		updateAdapterCandidates: (candidates: WalletCandidate[]) => {
			if (updateAdapterCandidates == null)
				throw new Error('Mock adapter candidate updater is unavailable')
			updateAdapterCandidates(candidates)
		},
		updateConnection: (connection: WalletConnection) => {
			if (updateConnection == null)
				throw new Error('Mock connection updater is unavailable')
			updateConnection(connection)
		},
		hydration: hydration.promise,
		deleteConnection,
		disconnect,
		runtime,
		subscribeConnection,
		writeConnection,
		writeWalletRequest,
		writeWalletRequestObservation,
		writeWalletRequestSubmittedAt,
		writeActionAuthorityRequest,
		writeActionAuthorityDecision,
		writeDispatchOccurrenceStart,
		writeDispatchEvidence,
		authorityDecisionRows,
	}
}

describe('wallet connection runtime normalization', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
		vi.resetModules()
		vi.doUnmock('./adapters/eip6963.ts')
		vi.doUnmock('$/collections/localMutations.ts')
		vi.doUnmock('$/routes/applicationClient.ts')
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
			.mockReturnValueOnce(1_700_000_000_002)
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
			writeActionAuthorityRequest,
			writeDispatchOccurrenceStart,
			writeDispatchEvidence,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
		})

		await runtime.connect(connection.walletId)
		expect(await runtime.signMessage({ connectionKey: connection.connectionKey, message: 'Sign this private challenge', authorityPresentation: { submittedAt: 1_700_000_000_000 } })).toEqual({
			accountAddress: connection.accounts[0].accountAddress,
			signature: '0xsigned',
		})
		expect(writeActionAuthorityRequest).toHaveBeenCalledOnce()
		expect(writeDispatchOccurrenceStart).toHaveBeenCalledOnce()
		expect(writeDispatchOccurrenceStart.mock.calls[0][1]).toMatchObject({
			startedAt: 1_700_000_000_001,
		})
		expect(writeDispatchEvidence).toHaveBeenCalledOnce()
		expect(writeDispatchEvidence.mock.calls[0][2]).toEqual({
			kind: 'returned',
			response: {
				adapterKey: 'evm.signature',
				adapterVersion: '1',
				value: {
					signatureHash: '0x318db428059e86506988fdc8079f42b03dcf1ca107807005a014128fdbcc1e94',
				},
			},
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
			1_700_000_000_002
		)
		expect(JSON.stringify([
			...writeWalletRequest.mock.calls.map(([, request]) => request),
			...writeWalletRequestObservation.mock.calls.map(([, selector, observation]) => ({ selector, observation })),
		])).not.toContain(
			'Sign this private challenge'
		)
		expect(JSON.stringify(writeWalletRequestObservation.mock.calls)).not.toContain('0xsigned')
		expect(writeWalletRequestObservation.mock.calls[1][2]).not.toHaveProperty('transactionHash')
		expect(writeWalletRequestObservation.mock.calls[1][2]).not.toHaveProperty('transactionId')
	}, 30_000)

	it('binds controlled Sui personal-message authority through dispatch and returned evidence', async () => {
		vi.spyOn(Date, 'now')
			.mockReturnValueOnce(100)
			.mockReturnValueOnce(101)
			.mockReturnValueOnce(102)
		const signMessage = vi.fn(async () => '0xsui-signature')
		const connection = {
			connectionKey: 'sui-session',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.WalletStandard,
			transportKind: WalletTransportKind.InjectedSigner,
			scopes: [],
			accounts: [{
				namespace: 'sui',
				reference: 'mainnet',
				accountAddress: '0x1234',
				capabilities: [WalletCapability.SignMessage],
			}],
			selected: true,
		} satisfies WalletConnection
		const {
			runtime,
			writeActionAuthorityRequest,
			writeDispatchOccurrenceStart,
			writeDispatchEvidence,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			signMessage,
		})

		await runtime.connect(connection.walletId)
		await expect(runtime.signMessage({
			connectionKey: connection.connectionKey,
			message: 'Sign this exact Sui message',
			authorityPresentation: { submittedAt: 100 },
		})).resolves.toMatchObject({
			accountAddress: '0x1234',
			signature: '0xsui-signature',
		})

		expect(writeActionAuthorityRequest.mock.calls[0][1]).toMatchObject({
			envelope: {
				adapterKey: 'wallet.message-sign',
				adapterVersion: '1',
				value: {
					namespace: 'sui',
					method: 'sui:signPersonalMessage',
					accountAddress: '0x1234',
					message: 'Sign this exact Sui message',
				},
			},
		})
		expect(writeDispatchOccurrenceStart.mock.calls[0][1]).toMatchObject({
			address: {
				kind: 'wallet-connection',
				connectionKey: 'sui-session',
				method: 'sui:signPersonalMessage',
			},
			startedAt: 101,
		})
		expect(writeDispatchEvidence.mock.calls[0][2]).toMatchObject({
			kind: 'returned',
			response: {
				adapterKey: 'wallet.signature',
				adapterVersion: '1',
				value: { namespace: 'sui' },
			},
		})
	})

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

	it('snapshots and audits Starknet typed-data authority across delayed persistence', async () => {
		vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-0000000000sn')
		vi.spyOn(Date, 'now')
			.mockReturnValueOnce(1_700_000_000_200)
			.mockReturnValueOnce(1_700_000_000_201)
		const starknetTypedData = {
			types: {
				StarknetDomain: [
					{ name: 'name', type: 'shortstring' },
					{ name: 'version', type: 'shortstring' },
					{ name: 'chainId', type: 'shortstring' },
					{ name: 'revision', type: 'shortstring' },
				],
				Message: [
					{ name: 'contents', type: 'felt' },
				],
			},
			primaryType: 'Message',
			domain: {
				name: 'Blockhead',
				version: '1',
				chainId: 'SN_MAIN',
				revision: '1',
			},
			message: {
				contents: '0x1234',
			},
		} satisfies WalletStarknetTypedData
		const accountAddress = '0x0000000000000000000000000000000000000000000000000000000000001234'
		const connection = {
			connectionKey: 'starknet-session',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.StarknetWalletApi,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [{
				namespace: 'starknet',
				reference: 'SN_MAIN',
				methods: ['wallet_signTypedData'],
				events: [],
			}],
			accounts: [{
				namespace: 'starknet',
				reference: 'SN_MAIN',
				accountAddress,
				capabilities: [WalletCapability.SignStarknetTypedData],
			}],
			selected: true,
		} satisfies WalletConnection
		let releasePersistence = () => {}
		const persistenceDelay = new Promise<void>((resolve) => {
			releasePersistence = resolve
		})
		let releaseSignedPersistence = () => {}
		const signedPersistenceDelay = new Promise<void>((resolve) => {
			releaseSignedPersistence = resolve
		})
		let selectedAdapter: WalletAdapter | undefined
		const returnedSignature = ['0x1', '0xabc']
		const signStarknetTypedData = vi.fn(function(
			this: WalletAdapter,
			_walletId: string,
			_accountAddress: string,
			_reference: string,
			_typedData: WalletStarknetTypedData
		) {
			expect(this).toBe(selectedAdapter)
			return Promise.resolve(returnedSignature)
		})
		const {
			adapter,
			runtime,
			writeWalletRequest,
			writeWalletRequestObservation,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistWalletRequest: () => persistenceDelay,
			persistWalletRequestObservation: async (
				_context,
				_selector,
				observation: { status?: string }
			) => {
				if (observation.status !== 'signed')
					return
				returnedSignature[1] = '0xdead'
				await signedPersistenceDelay
			},
			signStarknetTypedData,
		})

		await runtime.connect(connection.walletId)
		selectedAdapter = adapter()
		const signing = runtime.signStarknetTypedData(
			connection.connectionKey,
			starknetTypedData,
			'0.8'
		)
		await vi.waitFor(() => expect(writeWalletRequest).toHaveBeenCalledOnce())
		starknetTypedData.message.contents = '0x9999'
		runtime.connections[0].walletId = 'starknet:mutated'
		runtime.connections[0].connectionKey = 'mutated-session'
		runtime.connections[0].accounts[0].accountAddress = (
			'0x0000000000000000000000000000000000000000000000000000000000009999'
		)
		runtime.connections[0].accounts[0].reference = 'SN_SEPOLIA'
		selectedAdapter.signStarknetTypedData = vi.fn(async () => ['0x9'])
		releasePersistence()
		await vi.waitFor(() => expect(
			writeWalletRequestObservation.mock.calls.some(([, , observation]) => (
				observation.status === 'signed'
			))
		).toBe(true))
		releaseSignedPersistence()

		await expect(signing).resolves.toEqual({
			accountAddress,
			signature: ['0x1', '0xabc'],
		})
		expect(signStarknetTypedData).toHaveBeenCalledWith(
			'eip6963:com.example.wallet',
			accountAddress,
			'SN_MAIN',
			expect.objectContaining({
				message: {
					contents: '0x1234',
				},
			}),
			'0.8',
			'starknet-session'
		)
		expect(selectedAdapter.signStarknetTypedData).not.toHaveBeenCalled()
		const intendedPayload = JSON.stringify({
			version: 1,
			method: 'wallet_signTypedData',
			account: {
				namespace: 'starknet',
				reference: 'SN_MAIN',
				accountAddress,
			},
			typedData: {
				...starknetTypedData,
				message: {
					contents: '0x1234',
				},
			},
			apiVersion: '0.8',
		})
		const digest = async (value: string) => (
			`0x${Array.from(new Uint8Array(await globalThis.crypto.subtle.digest(
				'SHA-256',
				new TextEncoder().encode(value)
			)))
				.map((byte) => byte.toString(16).padStart(2, '0'))
				.join('')}`
		)
		const persistedRequest: MockRow | undefined = writeWalletRequest.mock.calls[0][1]
		await expect(digest(intendedPayload)).resolves.toBe(
			persistedRequest?.requestPayloadHash
		)
		expect(writeWalletRequest.mock.calls[0][1]).toMatchObject({
			requestKind: 'typed-data-signature',
			requestMethod: 'wallet_signTypedData',
		})
		const signedObservation: MockRow | undefined = writeWalletRequestObservation.mock.calls.at(-1)?.[2]
		expect(signedObservation).toMatchObject({
			status: 'signed',
		})
		await expect(digest(JSON.stringify(['0x1', '0xabc']))).resolves.toBe(
			signedObservation?.signatureHash
		)
		expect(signedObservation).not.toHaveProperty('transactionHash')
	}, 30_000)

	it('records Starknet response-audit failure distinctly from provider rejection', async () => {
		const typedData = {
			types: {
				StarknetDomain: [
					{ name: 'name', type: 'shortstring' },
					{ name: 'version', type: 'shortstring' },
					{ name: 'chainId', type: 'shortstring' },
					{ name: 'revision', type: 'shortstring' },
				],
				Message: [
					{ name: 'contents', type: 'felt' },
				],
			},
			primaryType: 'Message',
			domain: {
				name: 'Blockhead',
				version: '1',
				chainId: 'SN_MAIN',
				revision: '1',
			},
			message: {
				contents: '0x1234',
			},
		} satisfies WalletStarknetTypedData
		const connection = {
			connectionKey: 'starknet-audit-session',
			walletId: 'eip6963:com.example.wallet',
			status: BlockheadConnectionStatus.Connected,
			protocol: WalletProtocol.StarknetWalletApi,
			transportKind: WalletTransportKind.InjectedProvider,
			scopes: [{
				namespace: 'starknet',
				reference: 'SN_MAIN',
				methods: ['wallet_signTypedData'],
				events: [],
			}],
			accounts: [{
				namespace: 'starknet',
				reference: 'SN_MAIN',
				accountAddress: '0x0000000000000000000000000000000000000000000000000000000000001234',
				capabilities: [WalletCapability.SignStarknetTypedData],
			}],
			selected: true,
		} satisfies WalletConnection
		const malformedSignature = ['not-a-felt']
		const providerDispatch = vi.fn(async () => malformedSignature)
		let responseAuditFailure: Error | undefined
		const providerRejection = new Error('User refused')
		const signStarknetTypedData = vi.fn()
			.mockImplementationOnce(async () => {
				const returnedValue = await providerDispatch()
				expect(returnedValue).toBe(malformedSignature)
				const { WalletAdapterResponseAuditFailure } = await import('./adapters/types.ts')
				const auditFailure = new WalletAdapterResponseAuditFailure(
					'Starknet wallet returned a malformed typed data signature',
					returnedValue
				)
				responseAuditFailure = auditFailure
				throw auditFailure
			})
			.mockRejectedValueOnce(providerRejection)
		const {
			runtime,
			writeWalletRequestObservation,
			writeWalletRequestSubmittedAt,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			signStarknetTypedData,
		})

		await runtime.connect(connection.walletId)
		const caughtResponseAuditFailure = await runtime.signStarknetTypedData(
			connection.connectionKey,
			typedData
		).catch((error: Error) => error)
		expect(caughtResponseAuditFailure).toBe(responseAuditFailure)
		expect(providerDispatch).toHaveBeenCalledOnce()
		expect(writeWalletRequestObservation.mock.calls.at(-1)?.[2]).toMatchObject({
			status: 'audit-failed',
			error: 'Wallet Starknet typed data signature response could not be audited',
		})
		expect(writeWalletRequestSubmittedAt).not.toHaveBeenCalled()

		await expect(runtime.signStarknetTypedData(
			connection.connectionKey,
			typedData
		)).rejects.toBe(providerRejection)
		expect(writeWalletRequestObservation.mock.calls.at(-1)?.[2]).toMatchObject({
			status: 'failed',
			error: 'Wallet Starknet typed data signing request failed',
		})
		expect(writeWalletRequestSubmittedAt).not.toHaveBeenCalled()
		expect(signStarknetTypedData).toHaveBeenCalledTimes(2)
	})

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
			writeDispatchOccurrenceStart,
			writeDispatchEvidence,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			signMessage: async () => {
				throw new Error('User rejected the wallet request')
			},
		})

		await runtime.connect(connection.walletId)
		await expect(runtime.signMessage({ connectionKey: connection.connectionKey, message: 'Reject this challenge', authorityPresentation: { submittedAt: 1 } })).rejects.toThrow(
			'User rejected the wallet request'
		)

		expect(writeWalletRequest).toHaveBeenCalledOnce()
		expect(writeDispatchOccurrenceStart).toHaveBeenCalledOnce()
		expect(writeDispatchEvidence).toHaveBeenCalledOnce()
		expect(writeDispatchEvidence.mock.calls[0][2]).toEqual({
			kind: 'ambiguous',
			reason: 'response-unreadable',
			error: 'User rejected the wallet request',
		})
		expect(writeWalletRequestSubmittedAt).not.toHaveBeenCalled()
		expect(writeWalletRequestObservation.mock.calls[1][2]).toMatchObject({
			status: 'failed',
			error: 'Wallet signing request failed',
		})
		expect(writeWalletRequestObservation.mock.calls[1][2]).not.toHaveProperty('signatureHash')
		expect(JSON.stringify(writeWalletRequest.mock.calls.map(([, request]) => request))).not.toContain(
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
		const events: string[] = []
		const persistRequested = Promise.withResolvers<void>()
		const persistTerminal = Promise.withResolvers<void>()
		const signing = vi.fn(async () => {
			events.push('provider')
			return '0xsigned'
		})
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
			writeActionAuthorityRequest,
			writeDispatchOccurrenceStart,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistActionAuthorityRequest: () => {
				events.push('authority-request')
			},
			persistWalletRequest: () => {
				events.push('wallet-request')
			},
			persistWalletRequestObservation: (_context, _selector, observation: { status: string }) => {
				events.push(`wallet-timestamp:${observation.status}`)
				if (observation.status === 'requested')
					return persistRequested.promise
				return persistTerminal.promise
			},
			persistDispatchOccurrenceStart: () => {
				events.push('occurrence-start')
			},
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		const result = runtime.signMessage({ connectionKey: connection.connectionKey, message: 'Persist in order', authorityPresentation: { submittedAt: 1 } })
		await vi.waitFor(() => expect(events).toEqual([
			'authority-request',
			'wallet-request',
			'wallet-timestamp:requested',
		]))
		expect(signing).not.toHaveBeenCalled()
		expect(writeActionAuthorityRequest).toHaveBeenCalledOnce()
		expect(writeDispatchOccurrenceStart).not.toHaveBeenCalled()
		persistRequested.resolve()
		await vi.waitFor(() => expect(signing).toHaveBeenCalledOnce())
		expect(events.slice(0, 5)).toEqual([
			'authority-request',
			'wallet-request',
			'wallet-timestamp:requested',
			'occurrence-start',
			'provider',
		])
		expect(writeDispatchOccurrenceStart).toHaveBeenCalledOnce()
		let settled = false
		void result.finally(() => {
			settled = true
		})
		expect(settled).toBe(false)
		persistTerminal.resolve()
		await expect(result).resolves.toMatchObject({
			signature: '0xsigned',
		})
	})

	it.each([
		[{ submittedAt: -1 }, 'valid authority presentation'],
		[{ submittedAt: Number.NaN }, 'valid authority presentation'],
		[{ submittedAt: 22 }, 'valid authority presentation'],
		[{ submittedAt: 10, validUntil: 9 }, 'valid authority presentation'],
		[{ submittedAt: 10, validUntil: 10.5 }, 'valid authority presentation'],
		[{ submittedAt: 10, validUntil: 20 }, 'expired before history'],
	] as const)('refuses invalid or expired presentation %# before history', async (authorityPresentation, error) => {
		vi.spyOn(Date, 'now').mockReturnValue(21)
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
		const { runtime, writeActionAuthorityRequest, writeWalletRequest } = await mountMockWalletRuntime({
			connectionResults: [connection],
		})

		await runtime.connect(connection.walletId)
		await expect(runtime.signMessage({
			connectionKey: connection.connectionKey,
			message: 'Never persisted',
			authorityPresentation,
		})).rejects.toThrow(error)
		expect(writeActionAuthorityRequest).not.toHaveBeenCalled()
		expect(writeWalletRequest).not.toHaveBeenCalled()
	})

	it('records prepared-without-dispatch when presentation expires after request persistence', async () => {
		let now = 10
		vi.spyOn(Date, 'now').mockImplementation(() => now)
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
		const { runtime, writeActionAuthorityDecision, writeDispatchOccurrenceStart } = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistActionAuthorityRequest: () => {
				now = 21
			},
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		await expect(runtime.signMessage({
			connectionKey: connection.connectionKey,
			message: 'Expires while persisting',
			authorityPresentation: { submittedAt: 10, validUntil: 20 },
		})).rejects.toThrow('expired before dispatch')
		expect(writeActionAuthorityDecision).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			{ kind: 'prepared-without-dispatch', decidedAt: 21 }
		)
		expect(writeDispatchOccurrenceStart).not.toHaveBeenCalled()
		expect(signing).not.toHaveBeenCalled()
	})

	it.each([
		['connection key', (connection: WalletConnection) => {
			connection.connectionKey = 'mutated-session'
		}],
		['wallet id', (connection: WalletConnection) => {
			connection.walletId = 'eip6963:mutated-wallet'
		}],
		['account namespace', (connection: WalletConnection) => {
			Object.assign(connection.accounts[0], { namespace: 'solana' })
			if (connection.activeAccount != null)
				Object.assign(connection.activeAccount, { namespace: 'solana' })
		}],
		['account reference', (connection: WalletConnection) => {
			Object.assign(connection.accounts[0], { reference: '137' })
			if (connection.activeAccount != null)
				Object.assign(connection.activeAccount, { reference: '137' })
		}],
		['account address', (connection: WalletConnection) => {
			const accountAddress = '0x0000000000000000000000000000000000000001'
			Object.assign(connection.accounts[0], { accountAddress })
			if (connection.activeAccount != null)
				Object.assign(connection.activeAccount, { accountAddress })
		}],
	] as const)('refuses %s mutation after request persistence and before dispatch', async (_label, mutate) => {
		const persistRequested = Promise.withResolvers<void>()
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
			writeActionAuthorityDecision,
			writeWalletRequestObservation,
			writeDispatchOccurrenceStart,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistWalletRequestObservation: (_context, _selector, observation: { status: string }) => (
				observation.status === 'requested' ? persistRequested.promise : undefined
			),
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		const result = runtime.signMessage({ connectionKey: connection.connectionKey, message: 'Mutating authority', authorityPresentation: {
						submittedAt: 1,
		} })
		await vi.waitFor(() => expect(writeWalletRequestObservation).toHaveBeenCalledOnce())
		mutate(runtime.connections[0])
		persistRequested.resolve()

		await expect(result).rejects.toThrow('Wallet authority changed before dispatch.')
		expect(signing).not.toHaveBeenCalled()
		expect(writeDispatchOccurrenceStart).not.toHaveBeenCalled()
		expect(writeActionAuthorityDecision).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.objectContaining({ kind: 'prepared-without-dispatch' })
		)
	})

	it('keeps the validated adapter method receiver-bound through persistence awaits', async () => {
		const persistRequested = Promise.withResolvers<void>()
		let receiver: WalletAdapter | undefined
		const signing = vi.fn(function (this: WalletAdapter) {
			receiver = this
			return Promise.resolve('0xsigned')
		})
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
			adapter,
			writeWalletRequestObservation,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistWalletRequestObservation: (_context, _selector, observation: { status: string }) => (
				observation.status === 'requested' ? persistRequested.promise : undefined
			),
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		const result = runtime.signMessage({ connectionKey: connection.connectionKey, message: 'Receiver-sensitive signing', authorityPresentation: {
						submittedAt: 1,
		} })
		await vi.waitFor(() => expect(writeWalletRequestObservation).toHaveBeenCalledOnce())
		const selectedAdapter = adapter()
		persistRequested.resolve()

		await expect(result).resolves.toMatchObject({ signature: '0xsigned' })
		expect(signing).toHaveBeenCalledOnce()
		expect(receiver).toBe(selectedAdapter)
	})

	it('rejects delayed adapter method replacement before provider invocation', async () => {
		const persistRequested = Promise.withResolvers<void>()
		const signing = vi.fn(async () => '0xsigned')
		const replacement = vi.fn(async () => '0xreplacement')
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
			adapter,
			writeActionAuthorityDecision,
			writeDispatchOccurrenceStart,
			writeWalletRequestObservation,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistWalletRequestObservation: (_context, _selector, observation: { status: string }) => (
				observation.status === 'requested' ? persistRequested.promise : undefined
			),
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		const result = runtime.signMessage({
			connectionKey: connection.connectionKey,
			message: 'Reject stale adapter method',
			authorityPresentation: { submittedAt: 1 },
		})
		await vi.waitFor(() => expect(writeWalletRequestObservation).toHaveBeenCalledOnce())
		adapter().signMessage = replacement
		persistRequested.resolve()

		await expect(result).rejects.toThrow('Wallet adapter registration changed before dispatch.')
		expect(signing).not.toHaveBeenCalled()
		expect(replacement).not.toHaveBeenCalled()
		expect(writeDispatchOccurrenceStart).not.toHaveBeenCalled()
		expect(writeActionAuthorityDecision).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.objectContaining({ kind: 'prepared-without-dispatch' })
		)
	})

	it.each([
		['removal', false],
		['removal and same-adapter re-registration (ABA)', true],
	] as const)('rejects delayed adapter registration %s before provider invocation', async (_label, readd) => {
		const persistRequested = Promise.withResolvers<void>()
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
			updateAdapterCandidates,
			writeActionAuthorityDecision,
			writeDispatchOccurrenceStart,
			writeWalletRequestObservation,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistWalletRequestObservation: (_context, _selector, observation: { status: string }) => (
				observation.status === 'requested' ? persistRequested.promise : undefined
			),
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		const result = runtime.signMessage({
			connectionKey: connection.connectionKey,
			message: 'Reject adapter registration ABA',
			authorityPresentation: { submittedAt: 1 },
		})
		await vi.waitFor(() => expect(writeWalletRequestObservation).toHaveBeenCalledOnce())
		updateAdapterCandidates([])
		if (readd)
			updateAdapterCandidates([{
				id: connection.walletId,
				name: 'Example Wallet',
				icon: '',
				protocol: WalletProtocol.Eip6963,
				discoveryKind: WalletDiscoveryKind.InjectedEvent,
				transportKind: WalletTransportKind.InjectedProvider,
				capabilities: [WalletCapability.Connect],
			}])
		persistRequested.resolve()

		await expect(result).rejects.toThrow('Wallet adapter registration changed before dispatch.')
		expect(signing).not.toHaveBeenCalled()
		expect(writeDispatchOccurrenceStart).not.toHaveBeenCalled()
		expect(writeActionAuthorityDecision).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.objectContaining({ kind: 'prepared-without-dispatch' })
		)
	})

	it('captures occurrence startedAt after delayed authority and wallet history writes', async () => {
		let now = 10
		vi.spyOn(Date, 'now').mockImplementation(() => now)
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
		const { runtime, writeDispatchOccurrenceStart } = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistActionAuthorityRequest: () => { now = 11 },
			persistWalletRequest: () => { now = 12 },
			persistWalletRequestObservation: (_context, _selector, observation: { status: string }) => {
				if (observation.status === 'requested') now = 13
			},
			signMessage: async () => '0xsigned',
		})

		await runtime.connect(connection.walletId)
		await runtime.signMessage({
			connectionKey: connection.connectionKey,
			message: 'Delayed history clock',
			authorityPresentation: { submittedAt: 10 },
		})

		expect(writeDispatchOccurrenceStart).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ startedAt: 13 })
		)
		expect(writeDispatchOccurrenceStart.mock.calls[0][1]).not.toMatchObject({ startedAt: 10 })
	})

	it('revalidates authority after occurrence persistence before the provider call', async () => {
		const occurrenceStarted = Promise.withResolvers<void>()
		const occurrenceRelease = Promise.withResolvers<void>()
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
			writeDispatchOccurrenceStart,
			writeDispatchEvidence,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistDispatchOccurrenceStart: async () => {
				occurrenceStarted.resolve()
				await occurrenceRelease.promise
			},
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		const result = runtime.signMessage({ connectionKey: connection.connectionKey, message: 'Occurrence revalidation', authorityPresentation: {
						submittedAt: 1,
		} })
		await occurrenceStarted.promise
		Object.assign(runtime.connections[0].accounts[0], { reference: '137' })
		if (runtime.connections[0].activeAccount != null)
			Object.assign(runtime.connections[0].activeAccount, { reference: '137' })
		occurrenceRelease.resolve()

		await expect(result).rejects.toThrow('Wallet authority changed before dispatch.')
		expect(writeDispatchOccurrenceStart).toHaveBeenCalledOnce()
		expect(signing).not.toHaveBeenCalled()
		expect(writeDispatchEvidence).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
		{
			kind: 'pre-dispatch-failure',
			error: 'Wallet authority changed before dispatch.',
		}
	)
	})

	it('records pre-dispatch failure when presentation expires during occurrence persistence', async () => {
		let now = 10
		vi.spyOn(Date, 'now').mockImplementation(() => now)
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
		const { runtime, writeDispatchEvidence } = await mountMockWalletRuntime({
			connectionResults: [connection],
			persistDispatchOccurrenceStart: () => {
				now = 21
			},
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		await expect(runtime.signMessage({
			connectionKey: connection.connectionKey,
			message: 'Expires after occurrence',
			authorityPresentation: { submittedAt: 10, validUntil: 20 },
		})).rejects.toThrow('expired before dispatch')
		expect(signing).not.toHaveBeenCalled()
		expect(writeDispatchEvidence).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
		{
			kind: 'pre-dispatch-failure',
			error: 'Wallet authority presentation expired before dispatch.',
		}
	)
	})

	it.each([
		['authority request', { persistActionAuthorityRequest: async () => {
			throw new Error('authority request persistence failed')
		} }],
		['wallet request', { persistWalletRequest: async () => {
			throw new Error('wallet request persistence failed')
		} }],
		['requested timestamp', { persistWalletRequestObservation: async () => {
			throw new Error('requested timestamp persistence failed')
		} }],
	] as const)('leaves provider and occurrence absent when %s persistence fails', async (_label, persistenceFailure) => {
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
			writeDispatchOccurrenceStart,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			signMessage: signing,
			...persistenceFailure,
		})

		await runtime.connect(connection.walletId)
		await expect(runtime.signMessage({ connectionKey: connection.connectionKey, message: 'Persistence failure', authorityPresentation: {
						submittedAt: 1,
		} })).rejects.toThrow(/persistence failed/)
		expect(signing).not.toHaveBeenCalled()
		expect(writeDispatchOccurrenceStart).not.toHaveBeenCalled()
	})

	it.each([
		'denied',
		'cancelled',
		'prepared-without-dispatch',
	] as const)('refuses a %s authority decision before the occurrence boundary', async (decisionKind) => {
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
			writeDispatchOccurrenceStart,
			writeDispatchEvidence,
			authorityDecisionRows,
		} = await mountMockWalletRuntime({
			connectionResults: [connection],
			authorityDecisionBeforeOccurrence: decisionKind,
			signMessage: signing,
		})

		await runtime.connect(connection.walletId)
		await expect(runtime.signMessage({ connectionKey: connection.connectionKey, message: 'Denied before dispatch', authorityPresentation: {
						submittedAt: 1,
		} })).rejects.toThrow('decided without dispatch')
		expect(authorityDecisionRows).toHaveLength(1)
		expect(signing).not.toHaveBeenCalled()
		expect(writeDispatchOccurrenceStart).not.toHaveBeenCalled()
		expect(writeDispatchEvidence).not.toHaveBeenCalled()
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
			await expect(runtime.signMessage({ connectionKey: 'wallet-session', message: 'Unauthorized', authorityPresentation: { submittedAt: 1 } })).rejects.toThrow()
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
		await expect(runtime.signMessage({ connectionKey: connection.connectionKey, message: 'Audit separately', authorityPresentation: { submittedAt: 1 } })).rejects.toThrow(
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
		await expect(runtime.signMessage({ connectionKey: connection.connectionKey, message: 'Persist terminal history', authorityPresentation: { submittedAt: 1 } })).rejects.toThrow(
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
					[entityFieldAddressKey(EntityType.BlockheadWalletConnection, ['Connected'], 'selected')]: fieldCollection(),
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
					WalletCapability.SignMessage,
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
		expect(enable).toHaveBeenCalledWith(['cosmoshub-4'])

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
					WalletCapability.SignMessage,
					WalletCapability.SignTransaction,
					WalletCapability.SendTransaction,
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
					WalletCapability.SignStarknetTypedData,
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
					WalletCapability.SignStarknetTypedData,
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

	it.each(['resolve', 'reject'] as const)('hydrates the newer disconnected snapshot when the stale Connected field read settles with %s', async (disconnectDuringHydration) => {
		const { runtime, hydration } = await mountMockWalletRuntime({
			candidateAvailable: false,
			persistedStatus: BlockheadConnectionStatus.Connected,
			disconnectDuringHydration,
		})
		await hydration
		expect(runtime.connections).toEqual([
			expect.objectContaining({
				connectionKey: 'persisted-session',
				status: BlockheadConnectionStatus.Disconnected,
			}),
		])
		expect(runtime.connections[0]).not.toHaveProperty('selected')
		runtime.destroy()
	})

	it('rejects missing required selected data when hydration still describes a Connected connection', async () => {
		const selectedError = new Error('Connected.selected resolved without a required value')
		const { runtime, hydration } = await mountMockWalletRuntime({
			candidateAvailable: false,
			persistedStatus: BlockheadConnectionStatus.Connected,
			selectedError,
		})
		await expect(hydration).rejects.toBe(selectedError)
		expect(runtime.connections).toEqual([])
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

	it('opens WalletConnect through the MetaMask Tauri consumer only when a host is supplied', async () => {
		const openUrl = vi.fn(async () => {})
		const stopOpenUrls = vi.fn()
		const { runtime } = await mountMockWalletRuntime({
			tauriWalletLinkHost: {
				openUrl,
				getCurrent: async () => null,
				onOpenUrl: async () => stopOpenUrls,
			},
		})

		await runtime.openWalletConnectApplication(
			'wc:runtime-topic@2?relay-protocol=irn&symKey=secret'
		)
		expect(openUrl).toHaveBeenCalledWith(
			'metamask://wc?uri=wc%3Aruntime-topic%402%3Frelay-protocol%3Dirn%26symKey%3Dsecret'
		)

		runtime.destroy()
		expect(stopOpenUrls).toHaveBeenCalledOnce()
	})

	it('keeps the explicit browser open path when no Tauri host is supplied', async () => {
		const assign = vi.fn()
		vi.stubGlobal('location', { assign })
		const { runtime } = await mountMockWalletRuntime({})

		await runtime.openWalletConnectApplication('wc:browser-topic@2')
		expect(assign).toHaveBeenCalledWith('wc:browser-topic@2')

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

	describe('TON internal-message authority dispatch', () => {
		const tonRequest = (): WalletTonInternalMessages => ({
			network: '-239',
			from: '0:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			valid_until: 4_000_000_000,
			messages: [
				{
					address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
					amount: '1000',
					payload: 'te6ccgEBAQEA',
					extra_currency: {
						'2': '7',
						'1': '3',
					},
				},
			],
		})
		const mountTon = (options: Parameters<typeof mountMockWalletRuntime>[0] = {}) => mountMockWalletRuntime({
			candidateProtocol: WalletProtocol.TonConnect,
			candidateDiscoveryKind: WalletDiscoveryKind.InjectedGlobal,
			candidateCapabilities: [
				WalletCapability.Connect,
				WalletCapability.SignTransaction,
			],
			accountNamespace: 'ton',
			accountReference: '-239',
			accountAddress: '0:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			accountCapabilities: [WalletCapability.SignTransaction],
			persistedProtocol: WalletProtocol.TonConnect,
			persistedStatus: BlockheadConnectionStatus.Connected,
			...options,
		})

		it('persists the protocol envelope, dispatches once, and records the internal BOC hash', async () => {
			const signTonInternalMessages = vi.fn(async () => 'te6ccgEBAQEB')
			const {
				runtime,
				hydration,
				writeActionAuthorityRequest,
				writeDispatchEvidence,
			} = await mountTon({ signTonInternalMessages })
			await hydration
			const result = await runtime.signTonInternalMessages({
				connectionKey: 'persisted-session',
				request: tonRequest(),
				authorityPresentation: { submittedAt: 1 },
			})
			expect(result.internalBoc).toBe('te6ccgEBAQEB')
			expect(signTonInternalMessages).toHaveBeenCalledTimes(1)
			expect(signTonInternalMessages.mock.calls[0]?.[2]).toEqual(tonRequest())
			expect(writeActionAuthorityRequest.mock.calls[0]?.[1]).toMatchObject({
				envelope: {
					adapterKey: 'ton.internal-message-sign',
					value: {
						namespace: 'ton',
						reference: '-239',
						method: 'signMessage',
					},
				},
			})
			expect(writeDispatchEvidence.mock.calls.at(-1)?.[2]).toMatchObject({
				kind: 'returned',
				response: {
					adapterKey: 'ton.internal-message-sign',
					value: {
						internalBocHash: expect.stringMatching(/^0x[0-9a-f]{64}$/),
					},
				},
			})
			runtime.destroy()
		})

		it('uses the synchronous request snapshot while history persistence is delayed', async () => {
			const authorityPersistence = Promise.withResolvers<void>()
			const signTonInternalMessages = vi.fn(async () => 'te6ccgEBAQEB')
			const {
				runtime,
				hydration,
			} = await mountTon({
				signTonInternalMessages,
				persistActionAuthorityRequest: async () => authorityPersistence.promise,
			})
			await hydration
			const request = tonRequest()
			const pending = runtime.signTonInternalMessages({
				connectionKey: 'persisted-session',
				request,
				authorityPresentation: { submittedAt: 1 },
			})
			await Promise.resolve()
			request.messages[0].amount = '999999'
			request.messages[0].extra_currency = { '9': '99' }
			authorityPersistence.resolve()
			await pending
			expect(signTonInternalMessages.mock.calls[0]?.[2]).toEqual(tonRequest())
			runtime.destroy()
		})

		it('fences adapter-registration ABA before dispatch without a provider call', async () => {
			const authorityPersistence = Promise.withResolvers<void>()
			const signTonInternalMessages = vi.fn(async () => 'te6ccgEBAQEB')
			const {
				runtime,
				hydration,
				updateAdapterCandidates,
			} = await mountTon({
				signTonInternalMessages,
				persistActionAuthorityRequest: async () => authorityPersistence.promise,
			})
			await hydration
			const pending = runtime.signTonInternalMessages({
				connectionKey: 'persisted-session',
				request: tonRequest(),
				authorityPresentation: { submittedAt: 1 },
			})
			await Promise.resolve()
			updateAdapterCandidates([])
			updateAdapterCandidates([
				{
					id: 'eip6963:com.example.wallet',
					name: 'Example Wallet',
					icon: '',
					protocol: WalletProtocol.TonConnect,
					discoveryKind: WalletDiscoveryKind.InjectedGlobal,
					transportKind: WalletTransportKind.InjectedProvider,
					capabilities: [
						WalletCapability.Connect,
						WalletCapability.SignTransaction,
					],
				},
			])
			authorityPersistence.resolve()
			await expect(pending).rejects.toThrow('adapter registration changed')
			expect(signTonInternalMessages).not.toHaveBeenCalled()
			runtime.destroy()
		})

		it('records provider-declared rejection as definite rejection', async () => {
			const { WalletAdapterProviderRejection } = await import('$/state/wallets/adapters/types.ts')
			const rejected = vi.fn(async () => {
				throw new WalletAdapterProviderRejection('wallet rejected signing')
			})
			const rejectedRuntime = await mountTon({ signTonInternalMessages: rejected })
			await rejectedRuntime.hydration
			await expect(rejectedRuntime.runtime.signTonInternalMessages({
				connectionKey: 'persisted-session',
				request: tonRequest(),
				authorityPresentation: { submittedAt: 1 },
			})).rejects.toThrow('wallet rejected signing')
			expect(rejectedRuntime.writeDispatchEvidence.mock.calls.at(-1)?.[2]).toMatchObject({ kind: 'definite-rejection' })
			rejectedRuntime.runtime.destroy()
		})

		it('records transport errors as ambiguous without claiming wallet rejection', async () => {
			const transportFailure = vi.fn(async () => {
				throw new Error('bridge disconnected')
			})
			const transportRuntime = await mountTon({ signTonInternalMessages: transportFailure })
			await transportRuntime.hydration
			await expect(transportRuntime.runtime.signTonInternalMessages({
				connectionKey: 'persisted-session',
				request: tonRequest(),
				authorityPresentation: { submittedAt: 1 },
			})).rejects.toThrow('bridge disconnected')
			expect(transportRuntime.writeDispatchEvidence.mock.calls.at(-1)?.[2]).toMatchObject({
				kind: 'ambiguous',
				reason: 'response-unreadable',
			})
			transportRuntime.runtime.destroy()
		})

		it('records malformed provider responses as response-audit failure', async () => {
			const { WalletAdapterResponseAuditFailure: ResponseAuditFailure } = await import('$/state/wallets/adapters/types.ts')
			const audited = vi.fn(async () => {
				throw new ResponseAuditFailure('malformed response', {
					malformed: true,
				})
			})
			const auditedRuntime = await mountTon({ signTonInternalMessages: audited })
			await auditedRuntime.hydration
			await expect(auditedRuntime.runtime.signTonInternalMessages({
				connectionKey: 'persisted-session',
				request: tonRequest(),
				authorityPresentation: { submittedAt: 1 },
			})).rejects.toThrow('malformed response')
			expect(auditedRuntime.writeDispatchEvidence.mock.calls.at(-1)?.[2]).toMatchObject({ kind: 'response-audit-failure' })
			auditedRuntime.runtime.destroy()
		})

		it('does not retry after terminal evidence persistence failure', async () => {
			const returned = vi.fn(async () => 'te6ccgEBAQEB')
			const terminalRuntime = await mountTon({
				signTonInternalMessages: returned,
				persistWalletRequestSubmittedAt: async () => {
					throw new Error('history unavailable')
				},
			})
			await terminalRuntime.hydration
			await expect(terminalRuntime.runtime.signTonInternalMessages({
				connectionKey: 'persisted-session',
				request: tonRequest(),
				authorityPresentation: { submittedAt: 1 },
			})).rejects.toThrow('do not retry')
			expect(returned).toHaveBeenCalledTimes(1)
			expect(terminalRuntime.writeDispatchEvidence.mock.calls.at(-1)?.[2]).toMatchObject({ kind: 'returned' })
			terminalRuntime.runtime.destroy()
		})

		it('does not retry when returned dispatch evidence persistence fails', async () => {
			const returned = vi.fn(async () => 'te6ccgEBAQEB')
			const writeEvidence = vi.fn(async () => {
				throw new Error('journal unavailable')
			})
			const evidenceRuntime = await mountTon({
				signTonInternalMessages: returned,
				persistDispatchEvidence: writeEvidence,
			})
			await evidenceRuntime.hydration
			await expect(evidenceRuntime.runtime.signTonInternalMessages({
				connectionKey: 'persisted-session',
				request: tonRequest(),
				authorityPresentation: { submittedAt: 1 },
			})).rejects.toThrow('do not retry')
			expect(returned).toHaveBeenCalledTimes(1)
			expect(writeEvidence).toHaveBeenCalledTimes(1)
			evidenceRuntime.runtime.destroy()
		})
	})
})
