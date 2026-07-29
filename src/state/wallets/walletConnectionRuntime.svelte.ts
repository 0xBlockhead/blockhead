import {
	WalletCapability,
	WalletProtocol,
	WalletTransportKind,
	walletConnectionMethods,
	walletProtocols,
} from '$/constants/Wallet.ts'
import {
	Caip2Namespace,
	Caip2Reference,
} from '$/constants/Network.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type { ClientContext } from '$/client/$client.svelte.ts'
import {
	deleteLocalBlockheadWalletConnection,
	type LocalMutationContext,
	writeLocalBlockheadWallet,
	writeLocalBlockheadWalletConnection,
	writeLocalBlockheadWalletRequest,
} from '$/collections/localMutations.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { SvelteMap } from 'svelte/reactivity'
import { createAptosInjectedAdapter } from './adapters/aptosInjected.ts'
import { createBitcoinInjectedAdapter } from './adapters/bitcoinInjected.ts'
import { createCardanoCip30Adapter } from './adapters/cardanoCip30.ts'
import { createCosmosOfflineSignerAdapter } from './adapters/cosmosOfflineSigner.ts'
import { createEip6963Adapter } from './adapters/eip6963.ts'
import { createPolkadotInjectedWeb3Adapter } from './adapters/polkadotInjectedWeb3.ts'
import { createStarknetWalletApiAdapter } from './adapters/starknetWalletApi.ts'
import { createTonConnectAdapter } from './adapters/tonConnect.ts'
import { createTronInjectedAdapter } from './adapters/tronInjected.ts'
import type { WalletAccount, WalletAdapter, WalletCandidate, WalletConnection } from './adapters/types.ts'
import { createWalletStandardAdapter } from './adapters/walletStandard.ts'
import {
	createWalletConnectV2Adapter,
	walletConnectV2ClientFromSignClient,
} from './adapters/walletConnectV2.ts'
import { browser } from '$app/environment'
import { env } from '$env/dynamic/public'

type WalletRuntime = {
	candidates: WalletCandidate[]
	connections: WalletConnection[]
	registerAdapter(adapter: WalletAdapter): void
	connect(walletId: string): Promise<void>
	signMessage(connectionKey: string, message: string): Promise<{
		accountAddress: string
		signature: string
	}>
	disconnect(connectionKey: string): Promise<void>
	remove(connectionKey: string): Promise<void>
	selectAccount(connectionKey: string, account: WalletAccount): void
	destroy(): void
}

const blockheadWalletConnectionsSelector = {
	scope: '$$blockheadWalletConnections',
} as const satisfies EntitySelector<typeof schema, EntityType._Global>

const hashWalletEvidence = async (value: string) => (
	`0x${[...new Uint8Array(await globalThis.crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(value)
	))].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`
)

const createWalletRuntimeState = (
	context: LocalMutationContext & Pick<ClientContext<typeof schema>, 'select'>
): WalletRuntime => {
	const cleanupByConnectionKey = new SvelteMap<string, () => void>()
	const connectionAttemptByConnectionKey = new SvelteMap<string, number>()
	const adapterByWalletId = new SvelteMap<string, WalletAdapter>()
	const registeredAdapterIds = new Set<string>()
	const adapterCleanups: (() => void)[] = []
	const candidatesByAdapterId = new SvelteMap<string, WalletCandidate[]>()

	let candidates = $state<WalletCandidate[]>([])
	let connections = $state<WalletConnection[]>([])
	const runtimeMutatedConnectionKeys = new Set<string>()

	const upsertConnection = async (
		connection: WalletConnection,
		replacedConnectionKey?: string
	) => {
		const connectionKey = connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId
		runtimeMutatedConnectionKeys.add(connectionKey)
		if (replacedConnectionKey !== undefined)
			runtimeMutatedConnectionKeys.add(replacedConnectionKey)
		const normalizedConnection = {
			...connection,
			connectionKey,
			activeAccount: connection.activeAccount ?? connection.accounts.at(0),
		}
		await writeLocalBlockheadWalletConnection(context, normalizedConnection)
		connections = [
			...connections.filter((candidate) => (
				![
					connectionKey,
					replacedConnectionKey,
				].includes(candidate.connectionKey ?? candidate.sessionTopic ?? candidate.sessionId ?? candidate.walletId)
			)),
			normalizedConnection,
		]
		if (replacedConnectionKey !== undefined && replacedConnectionKey !== connectionKey)
			await deleteLocalBlockheadWalletConnection(context, replacedConnectionKey)
	}

	const subscribePersistedConnection = (
		connection: WalletConnection,
		adapter: WalletAdapter
	) => {
		if (
			connection.status !== BlockheadConnectionStatus.Connected
			|| connection.connectionKey == null
			|| cleanupByConnectionKey.has(connection.connectionKey)
		) return

		cleanupByConnectionKey.get(connection.connectionKey)?.()
		cleanupByConnectionKey.set(
			connection.connectionKey,
			adapter.subscribeConnection(
				connection.walletId,
				(nextConnection) => upsertConnection({
					...nextConnection,
					connectionKey: connection.connectionKey,
				}),
				connection.connectionKey
			)
		)
	}

	const registerAdapter = (adapter: WalletAdapter) => {
		if (registeredAdapterIds.has(adapter.id))
			throw new Error(`Wallet adapter ${adapter.id} is already registered`)

		let cleanup: () => void
		try {
			cleanup = adapter.start((nextCandidates) => {
				candidatesByAdapterId.set(adapter.id, nextCandidates)

				for (const candidate of nextCandidates) {
					const newlyAvailable = !adapterByWalletId.has(candidate.id)
					adapterByWalletId.set(candidate.id, adapter)
					if (newlyAvailable) {
						writeLocalBlockheadWallet(context, candidate)
						for (const connection of connections)
							if (connection.walletId === candidate.id)
								subscribePersistedConnection(connection, adapter)
					}
				}

				candidates = [...candidatesByAdapterId.values()].flat()
			})
		}
		catch (error) {
			candidatesByAdapterId.delete(adapter.id)
			for (const [walletId, registeredAdapter] of adapterByWalletId)
				if (registeredAdapter === adapter)
					adapterByWalletId.delete(walletId)
			candidates = [...candidatesByAdapterId.values()].flat()
			throw error
		}
		registeredAdapterIds.add(adapter.id)
		adapterCleanups.push(cleanup)
	}

	registerAdapter(createEip6963Adapter())
	registerAdapter(createWalletStandardAdapter())
	registerAdapter(createAptosInjectedAdapter())
	registerAdapter(createCardanoCip30Adapter())
	registerAdapter(createBitcoinInjectedAdapter())
	registerAdapter(createCosmosOfflineSignerAdapter())
	registerAdapter(createTonConnectAdapter())
	registerAdapter(createTronInjectedAdapter())
	registerAdapter(createStarknetWalletApiAdapter())
	registerAdapter(createPolkadotInjectedWeb3Adapter())

	void context.select(
		EntityType._Global,
		blockheadWalletConnectionsSelector
	).$$blockheadWalletConnections({
		sources: [Source.Local_Internal],
	}).then(async (persistedConnectionReferences) => {
		const persistedConnections = (
			await Promise.all(persistedConnectionReferences.values.map(async (persistedConnectionReference) => {
				const persistedConnectionSelection = context.select(
					EntityType.BlockheadWalletConnection,
					persistedConnectionReference[EntityMetaKey.Selector],
					{
						sources: [Source.Local_Internal],
					}
				)
				const [
					persistedConnection,
					persistedWallet,
					persistedAccounts,
					persistedActiveAccount,
				] = await Promise.all([
					persistedConnectionSelection({
						sources: [Source.Local_Internal],
						fields: {
							status: true,
							protocol: true,
							transportKind: true,
							scopes: true,
							selected: true,
							connectedAt: true,
							disconnectedAt: true,
							sessionId: true,
							sessionTopic: true,
							error: true,
						},
					}).then((connection) => connection),
					persistedConnectionSelection.$wallet,
					persistedConnectionSelection.$$accounts({
						sources: [Source.Local_Internal],
					}),
					persistedConnectionSelection.$activeAccount,
				])
				const candidate = candidates.find(({ id }) => (
					id === persistedWallet[EntityMetaKey.Selector].id
				))

				const accounts = persistedAccounts.values.map((account) => ({
					...account[EntityMetaKey.Selector].caip10,
					capabilities: [...(candidate?.capabilities ?? [])],
				}))
				const protocol = walletProtocols.find(({ protocol }) => (
					protocol === persistedConnection.protocol
				))?.protocol
				const transportKind = walletConnectionMethods.find(({ transportKind }) => (
					transportKind === persistedConnection.transportKind
				))?.transportKind
				if (protocol == null || transportKind == null)
					throw new Error(`Persisted wallet connection ${persistedConnectionReference.connectionKey} has an unknown protocol or transport`)

				return {
					connectionKey: persistedConnectionReference.connectionKey,
					walletId: persistedWallet[EntityMetaKey.Selector].id,
					status: persistedConnection.status,
					protocol,
					transportKind,
					scopes: persistedConnection.scopes,
					accounts,
					activeAccount: accounts.find((account) => (
						account.namespace === persistedActiveAccount?.[EntityMetaKey.Selector].caip10.namespace
						&& account.reference === persistedActiveAccount[EntityMetaKey.Selector].caip10.reference
						&& account.accountAddress === persistedActiveAccount[EntityMetaKey.Selector].caip10.accountAddress
					)),
					selected: persistedConnection.selected,
					connectedAt: persistedConnection.connectedAt,
					disconnectedAt: persistedConnection.disconnectedAt,
					sessionId: persistedConnection.sessionId,
					sessionTopic: persistedConnection.sessionTopic,
					error: persistedConnection.error,
				}
			}))
		)

		const persistedConnectionKeys = new Set(persistedConnections.map((connection) => (
			connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId
		)))
		connections = [
			...connections.filter((connection) => {
				const connectionKey = connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId
				return runtimeMutatedConnectionKeys.has(connectionKey) || !persistedConnectionKeys.has(connectionKey)
			}),
			...persistedConnections.filter((connection) => !runtimeMutatedConnectionKeys.has(
				connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId
			)),
		]
		for (const connection of persistedConnections) {
			const adapter = adapterByWalletId.get(connection.walletId)
			if (adapter == null)
				continue

			subscribePersistedConnection(connection, adapter)
		}
	})

	const connect = async (walletId: string) => {
		const adapter = adapterByWalletId.get(walletId)
		if (adapter == null) return
		if (connections.some((connection) => (
			connection.walletId === walletId
			&& connection.status === BlockheadConnectionStatus.Connecting
		))) return

		const connectionAttempt = (connectionAttemptByConnectionKey.get(walletId) ?? 0) + 1
		connectionAttemptByConnectionKey.set(walletId, connectionAttempt)

		const connectingPersistence = upsertConnection({
			walletId,
			status: BlockheadConnectionStatus.Connecting,
			protocol: candidates.find((candidate) => candidate.id === walletId)?.protocol ?? WalletProtocol.Eip6963,
			transportKind: candidates.find((candidate) => candidate.id === walletId)?.transportKind ?? WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [],
			selected: false,
		})

		try {
			const connection = await adapter.connect(walletId)
			await connectingPersistence
			if (connectionAttemptByConnectionKey.get(walletId) !== connectionAttempt) return
			if (connection == null) {
				await upsertConnection({
					walletId,
					status: BlockheadConnectionStatus.Error,
					protocol: candidates.find((candidate) => candidate.id === walletId)?.protocol ?? WalletProtocol.Eip6963,
					transportKind: candidates.find((candidate) => candidate.id === walletId)?.transportKind ?? WalletTransportKind.InjectedProvider,
					scopes: [],
					accounts: [],
					selected: false,
					error: 'The wallet became unavailable before the connection completed.',
				})
				return
			}

			const connectionKey = connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId
			connectionAttemptByConnectionKey.delete(walletId)
			cleanupByConnectionKey.get(connectionKey)?.()
			cleanupByConnectionKey.set(
				connectionKey,
				adapter.subscribeConnection(
					walletId,
					(nextConnection) => upsertConnection({
						...nextConnection,
						connectionKey,
					}),
					connectionKey
				)
			)
			await upsertConnection(connection, walletId)
		}
		catch (error) {
			await connectingPersistence
			if (connectionAttemptByConnectionKey.get(walletId) !== connectionAttempt) return
			await upsertConnection({
				walletId,
				status: BlockheadConnectionStatus.Error,
				protocol: candidates.find((candidate) => candidate.id === walletId)?.protocol ?? WalletProtocol.Eip6963,
				transportKind: candidates.find((candidate) => candidate.id === walletId)?.transportKind ?? WalletTransportKind.InjectedProvider,
				scopes: [],
				accounts: [],
				selected: false,
				error: error instanceof Error ?
					error.message
				:
					String(error),
			})
		}
	}

	const disconnect = async (connectionKey: string) => {
		const connection = connections.find((candidate) => (
			(candidate.connectionKey ?? candidate.sessionTopic ?? candidate.sessionId ?? candidate.walletId) === connectionKey
		))
		if (connection == null) return

		runtimeMutatedConnectionKeys.add(connectionKey)
		const { walletId } = connection
		connectionAttemptByConnectionKey.set(
			connectionKey,
			(connectionAttemptByConnectionKey.get(connectionKey) ?? 0) + 1
		)
		await adapterByWalletId.get(walletId)?.disconnect(walletId, connectionKey)
		cleanupByConnectionKey.get(connectionKey)?.()
		cleanupByConnectionKey.delete(connectionKey)
		const disconnectedAt = Date.now()
		await writeLocalBlockheadWalletConnection(context, {
			...connection,
			connectionKey,
			status: BlockheadConnectionStatus.Disconnected,
			selected: false,
			disconnectedAt,
		})
		connections = connections.map((candidate) => (
			(candidate.connectionKey ?? candidate.sessionTopic ?? candidate.sessionId ?? candidate.walletId) === connectionKey ?
				{
					...candidate,
					status: BlockheadConnectionStatus.Disconnected,
					selected: false,
					disconnectedAt,
				}
			:
				candidate
		))
	}

	const remove = async (connectionKey: string) => {
		const connection = connections.find((candidate) => (
			(candidate.connectionKey ?? candidate.sessionTopic ?? candidate.sessionId ?? candidate.walletId) === connectionKey
		))
		if (connection == null) return

		runtimeMutatedConnectionKeys.add(connectionKey)
		connectionAttemptByConnectionKey.set(
			connectionKey,
			(connectionAttemptByConnectionKey.get(connectionKey) ?? 0) + 1
		)
		cleanupByConnectionKey.get(connectionKey)?.()
		cleanupByConnectionKey.delete(connectionKey)
		try {
			await adapterByWalletId.get(connection.walletId)?.disconnect(connection.walletId, connectionKey)
		}
		catch {}
		await deleteLocalBlockheadWalletConnection(context, connectionKey)
		connections = connections.filter((candidate) => (
			(candidate.connectionKey ?? candidate.sessionTopic ?? candidate.sessionId ?? candidate.walletId) !== connectionKey
		))
	}

	const signMessage = async (
		connectionKey: string,
		message: string
	) => {
		const connection = connections.find((candidate) => (
			(candidate.connectionKey ?? candidate.sessionTopic ?? candidate.sessionId ?? candidate.walletId) === connectionKey
		))
		const account = connection?.activeAccount ?? connection?.accounts.at(0)
		if (connection == null || account == null)
			throw new Error('Connected wallet account is unavailable')
		if (connection.status !== BlockheadConnectionStatus.Connected || !connection.selected)
			throw new Error('Selected wallet connection is not connected')
		if (!account.capabilities.includes(WalletCapability.SignMessage))
			throw new Error('Selected wallet account does not authorize message signing')
		if (account.namespace !== 'eip155')
			throw new Error('Farcaster connection proof requires an EVM wallet account')

		const sign = adapterByWalletId.get(connection.walletId)?.signMessage
		if (sign == null)
			throw new Error('Connected wallet does not expose executable message signing')

		const walletRequestId = `wallet-request-${globalThis.crypto.randomUUID()}`
		const requestedAt = Date.now()
		const requestPayloadHash = await hashWalletEvidence(message)
		const request = {
			id: walletRequestId,
			walletConnectionKey: connectionKey,
			walletProtocol: connection.protocol,
			caip10: {
				namespace: account.namespace,
				reference: account.reference,
				accountAddress: account.accountAddress,
			},
			requestKind: 'message-signature',
			requestMethod: 'personal_sign',
			chainId: Number(account.reference),
			fromAddress: account.accountAddress,
			requestPayloadHash,
			requestedAt,
		}
		await writeLocalBlockheadWalletRequest(context, {
			...request,
			timestamps: [{
				timestampMs: requestedAt,
				source: Source.Local_Internal,
				status: 'requested',
			}],
		})

		let signature: string
		try {
			signature = await sign(connection.walletId, account.accountAddress, message)
		}
		catch (error) {
			await writeLocalBlockheadWalletRequest(context, {
				...request,
				timestamps: [
					{
						timestampMs: requestedAt,
						source: Source.Local_Internal,
						status: 'requested',
					},
					{
						timestampMs: Math.max(Date.now(), requestedAt + 1),
						source: Source.Local_Internal,
						status: 'failed',
						error: 'Wallet signing request failed',
					},
				],
			})
			throw error
		}

		let signatureHash: string
		try {
			signatureHash = await hashWalletEvidence(signature)
		}
		catch (error) {
			await writeLocalBlockheadWalletRequest(context, {
				...request,
				timestamps: [
					{
						timestampMs: requestedAt,
						source: Source.Local_Internal,
						status: 'requested',
					},
					{
						timestampMs: Math.max(Date.now(), requestedAt + 1),
						source: Source.Local_Internal,
						status: 'audit-failed',
						error: 'Wallet signature evidence hashing failed',
					},
				],
			})
			throw error
		}

		const submittedAt = Math.max(Date.now(), requestedAt + 1)
		try {
			await writeLocalBlockheadWalletRequest(context, {
				...request,
				submittedAt,
				timestamps: [
					{
						timestampMs: requestedAt,
						source: Source.Local_Internal,
						status: 'requested',
					},
					{
						timestampMs: submittedAt,
						source: Source.Local_Internal,
						status: 'signed',
						signatureHash,
					},
				],
			})
		}
		catch {
			try {
				await writeLocalBlockheadWalletRequest(context, {
					...request,
					submittedAt,
					timestamps: [
						{
							timestampMs: requestedAt,
							source: Source.Local_Internal,
							status: 'requested',
						},
						{
							timestampMs: submittedAt,
							source: Source.Local_Internal,
							status: 'audit-failed',
							signatureHash,
							error: 'Wallet signature succeeded but signed history persistence failed',
						},
					],
				})
			}
			catch {}
			throw new Error('Wallet signature succeeded but audit persistence failed; do not retry as a wallet rejection')
		}

		return {
			accountAddress: account.accountAddress,
			signature,
		}
	}

	const selectAccount = (
		connectionKey: string,
		account: WalletAccount
	) => {
		const selectedConnection = connections.find((connection) => (
			(connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId) === connectionKey
		))
		if (selectedConnection == null) return

		connections = connections.map((connection) => ({
			...connection,
			selected: (
				(connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId)
				=== connectionKey
			),
			...(
				(connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId)
				=== connectionKey
				&& {
				activeAccount: account,
				}
			),
		}))
		for (const connection of connections) {
			runtimeMutatedConnectionKeys.add(
				connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId
			)
			if (connection.connectedAt !== undefined)
				void writeLocalBlockheadWalletConnection(context, {
					...connection,
					connectedAt: connection.connectedAt,
				})
		}
	}

	return {
		get candidates() {
			return candidates
		},
		get connections() {
			return connections
		},
		registerAdapter,
		connect,
		signMessage,
		disconnect,
		remove,
		selectAccount,
		destroy: () => {
			for (const cleanup of adapterCleanups)
				cleanup()

			for (const cleanup of cleanupByConnectionKey.values())
				cleanup()

			cleanupByConnectionKey.clear()
			connectionAttemptByConnectionKey.clear()
			adapterByWalletId.clear()
			registeredAdapterIds.clear()
			runtimeMutatedConnectionKeys.clear()
			candidatesByAdapterId.clear()
			walletRuntime = null
		},
	}
}

let walletRuntime = $state<WalletRuntime | null>(null)

export const mountWalletConnectionRuntime = (
	context: LocalMutationContext & Pick<ClientContext<typeof schema>, 'select'>
) => {
	if (walletRuntime != null) return walletRuntime

	walletRuntime = createWalletRuntimeState(context)
	const mountedWalletRuntime = walletRuntime
	if (
		browser
		&& env.PUBLIC_WALLETCONNECT2_PROJECT_ID.trim()
	)
		void import('@walletconnect/sign-client')
			.then(({ default: SignClient }) => SignClient.init({
				projectId: env.PUBLIC_WALLETCONNECT2_PROJECT_ID.trim(),
				...(env.PUBLIC_WALLETCONNECT2_RELAY_URL.trim() && {
					relayUrl: env.PUBLIC_WALLETCONNECT2_RELAY_URL.trim(),
				}),
				metadata: {
					name: 'Blockhead',
					description: 'Explore public blockchain data and local wallet activity.',
					url: globalThis.location.origin,
					icons: [
						new URL('/favicon.png', globalThis.location.origin).href,
					],
				},
			}))
			.then((signClient) => {
				if (walletRuntime !== mountedWalletRuntime) {
					void signClient.core.relayer.transportClose()
					return
				}

				mountedWalletRuntime.registerAdapter(createWalletConnectV2Adapter({
					client: walletConnectV2ClientFromSignClient(signClient),
					requestedScopes: [
						{
							namespace: Caip2Namespace.Eip155,
							reference: Caip2Reference.EthereumMainnet,
							methods: [
								'eth_accounts',
							],
							events: [
								'accountsChanged',
								'chainChanged',
							],
						},
						{
							namespace: Caip2Namespace.Solana,
							reference: Caip2Reference.SolanaMainnet,
							methods: [
								'solana_getAccounts',
							],
							events: [],
						},
					],
				}))
			})
			.catch((error) => {
				if (walletRuntime === mountedWalletRuntime)
					console.warn('WalletConnect Sign Client initialization failed', error)
			})

	return walletRuntime
}

export const getWalletConnectionRuntime = () => walletRuntime
