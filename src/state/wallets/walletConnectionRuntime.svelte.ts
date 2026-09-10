import {
	WalletCapability,
	WalletProtocol,
	WalletTransportKind,
	walletConnectionMethodByProtocolDiscoveryKindTransportKind,
	walletConnectionMethods,
	walletProtocols,
} from '$/constants/Wallet.ts'
import { stringify } from 'devalue'
import {
	Caip2Namespace,
	Caip2Reference,
} from '$/constants/Network.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import type { ClientContext } from '$/client/$client.svelte.ts'
import {
	deleteLocalBlockheadWalletConnection,
	type LocalMutationContext,
	writeLocalBlockheadWallet,
	writeLocalBlockheadWalletConnection,
	writeLocalBlockheadWalletRequest,
	writeLocalBlockheadWalletRequest_Timestamp,
	writeLocalBlockheadWalletRequestSubmittedAt,
	writeLocalBlockheadActionAuthorityRequest,
	writeLocalBlockheadActionAuthorityDecision,
	writeLocalBlockheadActionDispatchOccurrenceStart,
	writeLocalBlockheadActionDispatchEvidence,
} from '$/collections/localMutations.ts'
import {
	actionAuthorityRequestEnvelopeHash,
	authorityRequestEnvelope,
	dispatchEvidence,
	dispatchAddress,
} from '$/actions/execution.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	entitySelectorKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { entityDefinitionByType, schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { SvelteMap, SvelteSet } from 'svelte/reactivity'
import { createAptosAip62Adapter } from './adapters/aptosAip62.ts'
import { createAptosInjectedAdapter } from './adapters/aptosInjected.ts'
import { createBitcoinInjectedAdapter } from './adapters/bitcoinInjected.ts'
import { createCardanoCip30Adapter } from './adapters/cardanoCip30.ts'
import { createCosmosOfflineSignerAdapter } from './adapters/cosmosOfflineSigner.ts'
import { createEip6963Adapter } from './adapters/eip6963.ts'
import { createPolkadotInjectedWeb3Adapter } from './adapters/polkadotInjectedWeb3.ts'
import { createXrplXamanAdapter } from './adapters/xrplXaman.ts'
import { createStarknetWalletApiAdapter } from './adapters/starknetWalletApi.ts'
import { createTonConnectAdapter } from './adapters/tonConnect.ts'
import { createTronInjectedAdapter } from './adapters/tronInjected.ts'
import {
	isWalletAdapterPreDispatchFailure,
	isWalletAdapterProviderRejection,
	isWalletAdapterResponseAuditFailure,
	type WalletAccount,
	type WalletAdapter,
	type WalletCandidate,
	type WalletConnection,
	type WalletTonInternalMessages,
	type WalletStarknetTypedData,
	type WalletTypedData,
	type WalletXrplTransactionRequest,
} from './adapters/types.ts'
import {
	buildWalletConnection,
	disconnectWalletConnection,
	isSelectedWalletConnection,
	preserveWalletConnectionSelection,
	walletConnectionFromPersisted,
	walletConnectionKey,
	withExclusiveWalletConnectionSelection,
} from './walletConnectionState.ts'
import {
	resolveWalletPrepSelection,
} from './walletRequestPreparation.ts'
import {
	preparedWalletRequestRejection,
	type PreparedTransactionWalletRequest,
	type PreparedWalletRequestRejectionObservation,
} from './preparedWalletRequestRejection.ts'
import { createWalletStandardAdapter } from './adapters/walletStandard.ts'
import { createSuiWalletStandardAdapter } from './adapters/suiWalletStandard.ts'
import {
	createWalletConnectV2Adapter,
	walletConnectV2ClientFromSignClient,
} from './adapters/walletConnectV2.ts'
import {
	createWalletConnectApplicationConsumer,
	type WalletConnectApplicationConsumer,
} from './walletConnectApplicationConsumer.ts'
import type { TauriWalletLinkHost } from './tauriWalletLink.ts'
import { browser } from '$app/environment'
import { env } from '$env/dynamic/public'

type WalletRuntime = {
	candidates: WalletCandidate[]
	connections: WalletConnection[]
	registerAdapter(adapter: WalletAdapter): void
	connect(walletId: string): Promise<void>
	reconnect(walletId: string): Promise<void>
	openWalletConnectApplication(walletConnectUri: string): Promise<void>
	signMessage(input: WalletMessageSignInput): Promise<{
		accountAddress: string
		signature: string
	}>
	signTonInternalMessages(input: WalletTonInternalMessageSignInput): Promise<{
		accountAddress: string
		internalBoc: string
	}>
	signTypedData(connectionKey: string, typedData: WalletTypedData): Promise<{
		accountAddress: string
		signature: string
	}>
	signXrplTransaction(connectionKey: string, request: WalletXrplTransactionRequest): Promise<{
		accountAddress: string
		signature: string
	}>
	signStarknetTypedData(
		connectionKey: string,
		typedData: WalletStarknetTypedData,
		apiVersion?: string
	): Promise<{
		accountAddress: string
		signature: string[]
	}>
	switchScope(
		connectionKey: string,
		scope: {
			namespace: string
			reference: string
		}
	): Promise<void>
	rejectPreparedTransactionRequest(
		request: PreparedTransactionWalletRequest,
		preparedObservation: PreparedWalletRequestRejectionObservation,
		rejectedAt: number
	): Promise<void>
	disconnect(connectionKey: string): Promise<void>
	remove(connectionKey: string): Promise<void>
	selectAccount(connectionKey: string, account: WalletAccount): Promise<void>
	destroy(): void
}

export type WalletMessageSignInput = {
	connectionKey: string
	message: string
	authorityPresentation: {
		submittedAt: number
		validUntil?: number
	}
}

export type WalletTonInternalMessageSignInput = {
	connectionKey: string
	request: WalletTonInternalMessages
	authorityPresentation: {
		submittedAt: number
		validUntil?: number
	}
}

const blockheadWalletConnectionsSelector = {
	scope: '$$blockheadWalletConnections',
} as const satisfies EntitySelector<typeof schema, EntityType._Global>

const hashWalletEvidence = async (value: string) => (
	Hash32.assert(`0x${[...new Uint8Array(await globalThis.crypto.subtle.digest(
		'SHA-256',
		new TextEncoder().encode(value)
	))].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`)
)

const snapshotTonInternalMessages = (
	request: WalletTonInternalMessages
): WalletTonInternalMessages => {
	const snapshotMessage = (message: WalletTonInternalMessages['messages'][number]) => ({
		address: message.address,
		amount: message.amount,
		...(message.payload !== undefined && { payload: message.payload }),
		...(message.stateInit !== undefined && { stateInit: message.stateInit }),
		...(message.extra_currency !== undefined && {
			extra_currency: Object.fromEntries(
				Object.entries(message.extra_currency).sort(
					([left], [right]) => left.localeCompare(right)
				)
			),
		}),
	})
	const [firstMessage, ...remainingMessages] = request.messages
	return {
		network: request.network,
		from: request.from,
		...(request.valid_until !== undefined && { valid_until: request.valid_until }),
		messages: [
			snapshotMessage(firstMessage),
			...remainingMessages.map(snapshotMessage),
		],
	}
}

const walletConnectionIdentity = (connection: WalletConnection) => ({
	connectionKey: connection.connectionKey,
	walletId: connection.walletId,
	protocol: connection.protocol,
	transportKind: connection.transportKind,
	scopes: connection.scopes.map((scope) => ({
		namespace: scope.namespace,
		reference: scope.reference,
		methods: [...scope.methods],
		events: [...scope.events],
	})),
	sessionId: connection.sessionId,
	sessionTopic: connection.sessionTopic,
})

const sameWalletConnectionIdentity = (
	left: WalletConnection,
	right: WalletConnection
) => stringify(walletConnectionIdentity(left)) === stringify(walletConnectionIdentity(right))

const sameWalletAccountAuthority = (
	left: WalletAccount,
	right: WalletAccount
) => stringify({
	namespace: left.namespace,
	reference: left.reference,
	accountAddress: left.accountAddress,
	capabilities: [...left.capabilities],
}) === stringify({
	namespace: right.namespace,
	reference: right.reference,
	accountAddress: right.accountAddress,
	capabilities: [...right.capabilities],
})

const createWalletRuntimeState = (
	context: LocalMutationContext & Pick<ClientContext<typeof schema>, 'select'>,
	{
		onDestroy,
		openWalletConnectApplication,
	}: {
		onDestroy?: () => void
		openWalletConnectApplication(walletConnectUri: string): Promise<void>
	}
): WalletRuntime => {
	const cleanupByConnectionKey = new SvelteMap<string, () => void>()
	const connectionAttemptByConnectionKey = new SvelteMap<string, number>()
	const adapterByWalletId = new SvelteMap<string, WalletAdapter>()
	const adapterRegistrationEpochByWalletId = new SvelteMap<string, number>()
	const registeredAdapterIds = new SvelteSet<string>()
	const adapterCleanups: (() => void)[] = []
	const candidatesByAdapterId = new SvelteMap<string, WalletCandidate[]>()

	let candidates = $state<WalletCandidate[]>([])
	let connections = $state<WalletConnection[]>([])
	const runtimeMutatedConnectionKeys = new SvelteSet<string>()
	const preserveAdapterSelection = (
		previous: WalletConnection | undefined,
		next: WalletConnection
	) => {
		const previousActiveAccount = previous?.activeAccount
		// Polkadot publishes an account list, not the product's selected account.
		const refreshedActiveAccount = previousActiveAccount != null
			&& next.status === BlockheadConnectionStatus.Connected
			&& next.protocol === WalletProtocol.PolkadotInjectedWeb3 ?
				next.accounts.find((account) => (
					account.namespace === previousActiveAccount.namespace
					&& account.reference === previousActiveAccount.reference
					&& account.accountAddress === previousActiveAccount.accountAddress
				))
			:
				undefined
		return preserveWalletConnectionSelection(
			previous,
			refreshedActiveAccount == null ? next : {
				...next,
				activeAccount: refreshedActiveAccount,
			}
		)
	}

	const upsertConnection = async (
		connection: WalletConnection,
		replacedConnectionKey?: string
	) => {
		const connectionKey = walletConnectionKey(connection)
		runtimeMutatedConnectionKeys.add(connectionKey)
		if (replacedConnectionKey !== undefined)
			runtimeMutatedConnectionKeys.add(replacedConnectionKey)
		const normalizedConnection = buildWalletConnection({
			...connection,
			connectionKey,
			activeAccount: connection.activeAccount ?? connection.accounts.at(0),
			...(
				connection.status === BlockheadConnectionStatus.Connected ?
					{
						selected: connection.selected,
						connectedAt: connection.connectedAt,
					}
				: connection.status === BlockheadConnectionStatus.Error ?
					{
						error: connection.error,
						disconnectedAt: connection.disconnectedAt,
					}
				: connection.status === BlockheadConnectionStatus.Disconnected ?
					{
						connectedAt: connection.connectedAt,
						disconnectedAt: connection.disconnectedAt,
					}
				:
					{}
			),
		})
		const previousByKey = new Map(
			connections.map((candidate) => [
				walletConnectionKey(candidate),
				candidate,
			])
		)
		const nextConnections = withExclusiveWalletConnectionSelection([
			...connections.filter((candidate) => (
				![
					connectionKey,
					replacedConnectionKey,
				].includes(walletConnectionKey(candidate))
			)),
			normalizedConnection,
		])
		const persistedConnections = nextConnections.filter((candidate) => {
			const key = walletConnectionKey(candidate)
			return (
				key === connectionKey
				|| (
					replacedConnectionKey !== undefined
					&& key === replacedConnectionKey
				)
				|| previousByKey.get(key) !== candidate
			)
		})
		await Promise.all(persistedConnections.map((candidate) => {
			runtimeMutatedConnectionKeys.add(walletConnectionKey(candidate))
			return writeLocalBlockheadWalletConnection(context, candidate)
		}))
		connections = nextConnections
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
				(nextConnection) => {
					const connectionKey = connection.connectionKey
					const previous = connections.find((candidate) => (
						walletConnectionKey(candidate) === connectionKey
					))
					const next = buildWalletConnection({
						...nextConnection,
						connectionKey,
					})
					void upsertConnection(
						preserveAdapterSelection(previous, next)
					)
				},
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
				for (const candidate of nextCandidates)
					if (walletConnectionMethodByProtocolDiscoveryKindTransportKind[[
						candidate.protocol,
						candidate.discoveryKind,
						candidate.transportKind,
					].join(':')] == null)
						throw new Error(
							`Wallet adapter ${adapter.id} candidate ${candidate.id} has no connection method for ${candidate.protocol}/${candidate.discoveryKind}/${candidate.transportKind}`
						)

				const previousCandidateIds = new Set(
					candidatesByAdapterId.get(adapter.id)?.map((candidate) => candidate.id)
				)
				candidatesByAdapterId.set(adapter.id, nextCandidates)
				for (const candidateId of previousCandidateIds) {
					if (
						!nextCandidates.some((candidate) => candidate.id === candidateId)
						&& adapterByWalletId.get(candidateId) === adapter
					) {
						adapterByWalletId.delete(candidateId)
						adapterRegistrationEpochByWalletId.set(
							candidateId,
							(adapterRegistrationEpochByWalletId.get(candidateId) ?? 0) + 1
						)
					}
				}

				for (const candidate of nextCandidates) {
					const newlyAvailable = !adapterByWalletId.has(candidate.id)
					if (adapterByWalletId.get(candidate.id) !== adapter) {
						adapterByWalletId.set(candidate.id, adapter)
						adapterRegistrationEpochByWalletId.set(
							candidate.id,
							(adapterRegistrationEpochByWalletId.get(candidate.id) ?? 0) + 1
						)
					}
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
				if (registeredAdapter === adapter) {
					adapterByWalletId.delete(walletId)
					adapterRegistrationEpochByWalletId.set(
						walletId,
						(adapterRegistrationEpochByWalletId.get(walletId) ?? 0) + 1
					)
				}
			candidates = [...candidatesByAdapterId.values()].flat()
			throw error
		}
		registeredAdapterIds.add(adapter.id)
		adapterCleanups.push(cleanup)
	}

	registerAdapter(createEip6963Adapter())
	registerAdapter(createWalletStandardAdapter())
	registerAdapter(createSuiWalletStandardAdapter())
	registerAdapter(createAptosAip62Adapter())
	registerAdapter(createAptosInjectedAdapter())
	registerAdapter(createCardanoCip30Adapter())
	registerAdapter(createBitcoinInjectedAdapter())
	registerAdapter(createCosmosOfflineSignerAdapter([
		{
			chainId: Caip2Reference.CosmosHub,
			accountPrefix: 'cosmos',
		},
	]))
	registerAdapter(createTonConnectAdapter())
	registerAdapter(createTronInjectedAdapter())
	registerAdapter(createStarknetWalletApiAdapter())
	registerAdapter(createPolkadotInjectedWeb3Adapter())
	registerAdapter(createXrplXamanAdapter())

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
				const hydrate = async (): Promise<WalletConnection> => {
					const connectionResource = persistedConnectionSelection({
						sources: [Source.Local_Internal],
						fields: {
							status: true,
							protocol: true,
							transportKind: true,
							scopes: true,
							connectedAt: true,
							disconnectedAt: true,
							sessionId: true,
							sessionTopic: true,
							error: true,
						},
					})
					const [
						persistedConnection,
						persistedWallet,
						persistedAccounts,
						persistedActiveAccount,
					] = await Promise.all([
						connectionResource.then((connection) => connection),
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
					let selected: boolean | undefined
					try {
						if (persistedConnection.status === BlockheadConnectionStatus.Connected)
							selected = await persistedConnectionSelection.Connected.selected({
								sources: [Source.Local_Internal],
							})
					} catch (error) {
						if (connectionResource.current && connectionResource.current.status !== persistedConnection.status)
							return hydrate()
						throw error
					}
					if (connectionResource.current && connectionResource.current.status !== persistedConnection.status)
						return hydrate()

					return walletConnectionFromPersisted({
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
						...(
							selected !== undefined
							&& { selected }
						),
						connectedAt: persistedConnection.connectedAt,
						disconnectedAt: persistedConnection.disconnectedAt,
						sessionId: persistedConnection.sessionId,
						sessionTopic: persistedConnection.sessionTopic,
						error: persistedConnection.error,
					})
				}
				return hydrate()
			}))
		)

		const persistedConnectionKeys = new Set(persistedConnections.map(walletConnectionKey))
		const mergedConnections = [
			...connections.filter((connection) => {
				const connectionKey = walletConnectionKey(connection)
				return runtimeMutatedConnectionKeys.has(connectionKey) || !persistedConnectionKeys.has(connectionKey)
			}),
			...persistedConnections.filter((connection) => !runtimeMutatedConnectionKeys.has(
				walletConnectionKey(connection)
			)),
		]
		const nextConnections = withExclusiveWalletConnectionSelection(mergedConnections)
		const mergedByKey = new Map(
			mergedConnections.map((connection) => [
				walletConnectionKey(connection),
				connection,
			])
		)
		await Promise.all(
			nextConnections.flatMap((connection) => {
				const connectionKey = walletConnectionKey(connection)
				const prior = mergedByKey.get(connectionKey)
				if (
					prior == null
					|| !isSelectedWalletConnection(prior)
					|| isSelectedWalletConnection(connection)
				)
					return []

				runtimeMutatedConnectionKeys.add(connectionKey)
				return [
					writeLocalBlockheadWalletConnection(context, connection),
				]
			})
		)
		connections = nextConnections
		for (const connection of nextConnections) {
			const adapter = adapterByWalletId.get(connection.walletId)
			if (adapter == null)
				continue

			subscribePersistedConnection(connection, adapter)
		}
	})

	const connect = async (walletId: string) => {
		const adapter = adapterByWalletId.get(walletId)
		if (adapter == null) return
		const adapterRegistrationEpoch = adapterRegistrationEpochByWalletId.get(walletId)
		if (adapterRegistrationEpoch === undefined)
			return

		const isCurrentAdapterRegistration = () => (
			adapterByWalletId.get(walletId) === adapter
			&& adapterRegistrationEpochByWalletId.get(walletId) === adapterRegistrationEpoch
		)
		if (connections.some((connection) => (
			connection.walletId === walletId
			&& connection.status === BlockheadConnectionStatus.Connecting
		))) return

		const connectionAttempt = (connectionAttemptByConnectionKey.get(walletId) ?? 0) + 1
		connectionAttemptByConnectionKey.set(walletId, connectionAttempt)

		const connectingPersistence = upsertConnection(buildWalletConnection({
			walletId,
			status: BlockheadConnectionStatus.Connecting,
			protocol: candidates.find((candidate) => candidate.id === walletId)?.protocol ?? WalletProtocol.Eip6963,
			transportKind: candidates.find((candidate) => candidate.id === walletId)?.transportKind ?? WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [],
		}))

		try {
			const connection = await adapter.connect(walletId)
			if (
				connectionAttemptByConnectionKey.get(walletId) !== connectionAttempt
				|| !isCurrentAdapterRegistration()
			)
				return

			await connectingPersistence
			if (
				connectionAttemptByConnectionKey.get(walletId) !== connectionAttempt
				|| !isCurrentAdapterRegistration()
			)
				return

			if (connection == null) {
				await upsertConnection(buildWalletConnection({
					walletId,
					status: BlockheadConnectionStatus.Error,
					protocol: candidates.find((candidate) => candidate.id === walletId)?.protocol ?? WalletProtocol.Eip6963,
					transportKind: candidates.find((candidate) => candidate.id === walletId)?.transportKind ?? WalletTransportKind.InjectedProvider,
					scopes: [],
					accounts: [],
					error: 'The wallet became unavailable before the connection completed.',
				}))
				return
			}

			const connectionKey = walletConnectionKey(connection)
			cleanupByConnectionKey.get(connectionKey)?.()
			const cleanup = adapter.subscribeConnection(
				walletId,
				(nextConnection) => {
					const previous = connections.find((candidate) => (
						walletConnectionKey(candidate) === connectionKey
					))
					void upsertConnection(
						preserveAdapterSelection(
							previous,
							buildWalletConnection({
								...nextConnection,
								connectionKey,
							})
						)
					)
				},
				connectionKey
			)
			if (
				connectionAttemptByConnectionKey.get(walletId) !== connectionAttempt
				|| !isCurrentAdapterRegistration()
			) {
				cleanup()
				return
			}
			cleanupByConnectionKey.set(connectionKey, cleanup)
			connectionAttemptByConnectionKey.delete(walletId)
			await upsertConnection(buildWalletConnection({
				...connection,
				connectionKey,
			}), walletId)
			if (!isCurrentAdapterRegistration())
				return

		}
		catch (error) {
			await connectingPersistence
			if (
				connectionAttemptByConnectionKey.get(walletId) !== connectionAttempt
				|| !isCurrentAdapterRegistration()
			)
				return

			await upsertConnection(buildWalletConnection({
				walletId,
				status: BlockheadConnectionStatus.Error,
				protocol: candidates.find((candidate) => candidate.id === walletId)?.protocol ?? WalletProtocol.Eip6963,
				transportKind: candidates.find((candidate) => candidate.id === walletId)?.transportKind ?? WalletTransportKind.InjectedProvider,
				scopes: [],
				accounts: [],
				error: error instanceof Error ?
					error.message
				:
					String(error),
			}))
		}
	}

	const disconnect = async (connectionKey: string) => {
		const connection = connections.find((candidate) => (
			walletConnectionKey(candidate) === connectionKey
		))
		if (connection == null) return

		runtimeMutatedConnectionKeys.add(connectionKey)
		const { walletId } = connection
		const adapter = adapterByWalletId.get(walletId)
		const adapterRegistrationEpoch = adapterRegistrationEpochByWalletId.get(walletId)
		const isCurrentAdapterRegistration = () => adapter == null || (
			adapterRegistrationEpoch !== undefined
			&& adapterByWalletId.get(walletId) === adapter
			&& adapterRegistrationEpochByWalletId.get(walletId) === adapterRegistrationEpoch
		)
		connectionAttemptByConnectionKey.set(
			connectionKey,
			(connectionAttemptByConnectionKey.get(connectionKey) ?? 0) + 1
			)
			await adapter?.disconnect(walletId, connectionKey)
			if (!isCurrentAdapterRegistration())
				return


		cleanupByConnectionKey.get(connectionKey)?.()
		cleanupByConnectionKey.delete(connectionKey)
		const disconnected = disconnectWalletConnection(connection)
		await writeLocalBlockheadWalletConnection(context, {
			...disconnected,
			connectionKey,
		})
		connections = connections.map((candidate) => (
			walletConnectionKey(candidate) === connectionKey ?
				{
					...disconnected,
					connectionKey,
				}
			:
				candidate
		))
	}

	const remove = async (connectionKey: string) => {
		const connection = connections.find((candidate) => (
			walletConnectionKey(candidate) === connectionKey
		))
		if (connection == null) return

		runtimeMutatedConnectionKeys.add(connectionKey)
		const adapter = adapterByWalletId.get(connection.walletId)
		const adapterRegistrationEpoch = adapterRegistrationEpochByWalletId.get(connection.walletId)
		const isCurrentAdapterRegistration = () => adapter == null || (
			adapterRegistrationEpoch !== undefined
			&& adapterByWalletId.get(connection.walletId) === adapter
			&& adapterRegistrationEpochByWalletId.get(connection.walletId) === adapterRegistrationEpoch
		)
		connectionAttemptByConnectionKey.set(
			connectionKey,
			(connectionAttemptByConnectionKey.get(connectionKey) ?? 0) + 1
		)
		cleanupByConnectionKey.get(connectionKey)?.()
		cleanupByConnectionKey.delete(connectionKey)
		try {
			await adapter?.disconnect(connection.walletId, connectionKey)
		}
		catch {}
		if (!isCurrentAdapterRegistration())
			return

		await deleteLocalBlockheadWalletConnection(context, connectionKey)
		connections = connections.filter((candidate) => (
			walletConnectionKey(candidate) !== connectionKey
		))
	}

	const signMessage = async (input: WalletMessageSignInput) => {
		const requestInput = $state.snapshot(input)
		const validationClock = Date.now()
		const { connectionKey, message, authorityPresentation } = requestInput
		if (
			!Number.isFinite(authorityPresentation.submittedAt)
			|| !Number.isSafeInteger(authorityPresentation.submittedAt)
			|| authorityPresentation.submittedAt < 0
			|| authorityPresentation.submittedAt > validationClock
			|| (
				authorityPresentation.validUntil !== undefined
				&& (
					!Number.isFinite(authorityPresentation.validUntil)
					|| !Number.isSafeInteger(authorityPresentation.validUntil)
					|| authorityPresentation.validUntil < authorityPresentation.submittedAt
				)
			)
		)
			throw new Error('Wallet signing requires a valid authority presentation time range.')
		if (authorityPresentation.validUntil !== undefined && validationClock > authorityPresentation.validUntil)
			throw new Error('Wallet authority presentation expired before history creation.')
		const selection = resolveWalletPrepSelection(connections)
		if (!selection.ready)
			throw new Error(selection.error)
		if (selection.connectionKey !== connectionKey)
			throw new Error('Wallet request connectionKey does not match the selected wallet connection.')

		const snapshot = Object.freeze({
			connectionKey,
			account: $state.snapshot(selection.account),
			connection: $state.snapshot(selection.connection),
			message,
			authorityPresentation,
		})
		if (!snapshot.account.capabilities.includes(WalletCapability.SignMessage))
			throw new Error('Selected wallet account does not authorize message signing')

		const adapter = adapterByWalletId.get(snapshot.connection.walletId)
		const adapterRegistrationEpoch = adapterRegistrationEpochByWalletId.get(snapshot.connection.walletId)
		const adapterSignMessage = adapter?.signMessage
		const adapterDispatch = Object.freeze({
			adapter,
			signMessage: adapterSignMessage?.bind(adapter),
		})
		const sign = adapterDispatch.signMessage
		if (sign == null)
			throw new Error('Connected wallet does not expose executable message signing')

		const walletRequestSelector = {
			id: `wallet-request-${globalThis.crypto.randomUUID()}`,
		} as const satisfies EntitySelector<typeof schema, EntityType.BlockheadWalletRequest>
		const accountSelector = {
			caip10: {
				namespace: snapshot.account.namespace,
				reference: snapshot.account.reference,
				accountAddress: snapshot.account.accountAddress,
			},
		} as const satisfies EntitySelector<typeof schema, EntityType.Account>
		const requestedAt = snapshot.authorityPresentation.submittedAt
		const requestMethod = (
			snapshot.account.namespace === 'eip155' ?
				'personal_sign'
			: snapshot.account.namespace === 'solana' ?
				'solana:signMessage'
			: snapshot.account.namespace === 'sui' ?
				'sui:signPersonalMessage'
			: snapshot.account.namespace === 'aptos' ?
				'aptos:signMessage'
			: snapshot.account.namespace === 'bip122' ?
				'signMessage'
			: snapshot.account.namespace === 'cip34' ?
				'signData'
			: snapshot.account.namespace === 'cosmos' ?
				'signArbitrary'
			: snapshot.account.namespace === 'tron' ?
				'personal_sign'
			:
				undefined
		)
		if (requestMethod === undefined)
			throw new Error('Selected wallet account has no authority-compatible message signing method')
		const envelope = authorityRequestEnvelope.assert(
			snapshot.account.namespace === 'eip155' ?
				{
					adapterKey: 'evm.personal-sign',
					adapterVersion: '1',
					value: {
						chainId: Number(snapshot.account.reference),
						accountAddress: snapshot.account.accountAddress,
						message: snapshot.message,
					},
				}
			:
				{
					adapterKey: 'wallet.message-sign',
					adapterVersion: '1',
					value: snapshot.account.namespace === 'cosmos' ?
						{
							namespace: snapshot.account.namespace,
							method: requestMethod,
							chainId: snapshot.account.reference,
							accountAddress: snapshot.account.accountAddress,
							message: snapshot.message,
						}
					:
						{
							namespace: snapshot.account.namespace,
							method: requestMethod,
							accountAddress: snapshot.account.accountAddress,
							message: snapshot.message,
						},
				}
		)
		const requestPayload = JSON.stringify({
			version: 1,
			method: requestMethod,
			account: accountSelector.caip10,
			message: snapshot.message,
		})
		const authorityRequestSelector = {
			id: `authority-request-${globalThis.crypto.randomUUID()}`,
		} as const satisfies EntitySelector<typeof schema, EntityType.BlockheadActionAuthorityRequest>
		const occurrenceSelector = {
			id: `dispatch-occurrence-${globalThis.crypto.randomUUID()}`,
		} as const satisfies EntitySelector<typeof schema, EntityType.BlockheadActionDispatchOccurrence>
		const occurrenceAddress = dispatchAddress.assert({
			kind: 'wallet-connection',
			connectionKey: snapshot.connectionKey,
			method: requestMethod,
		})
		const assertAuthorityStillSelected = () => {
			const currentAdapter = adapterByWalletId.get(snapshot.connection.walletId)
			if (
				currentAdapter !== adapterDispatch.adapter
				|| adapterRegistrationEpochByWalletId.get(snapshot.connection.walletId) !== adapterRegistrationEpoch
				|| currentAdapter?.signMessage !== adapterSignMessage
			)
				throw new Error('Wallet adapter registration changed before dispatch.')
			if (
				snapshot.authorityPresentation.validUntil !== undefined
				&& Date.now() > snapshot.authorityPresentation.validUntil
			)
				throw new Error('Wallet authority presentation expired before dispatch.')
			const currentSelection = resolveWalletPrepSelection(connections)
			if (
				!currentSelection.ready
				|| currentSelection.connectionKey !== snapshot.connectionKey
				|| !sameWalletConnectionIdentity(currentSelection.connection, snapshot.connection)
				|| !sameWalletAccountAuthority(currentSelection.account, snapshot.account)
			)
				throw new Error('Wallet authority changed before dispatch.')
		}
		const authorityRequestSelectorKey = entitySelectorKey(
			schema,
			entityDefinitionByType[EntityType.BlockheadActionAuthorityRequest],
			authorityRequestSelector
		)
		const localAuthorityRows = (fieldName: string) => (
			context.entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][
				entityFieldAddressKey(EntityType.BlockheadActionAuthorityRequest, [], fieldName)
			].toArray.filter((row) => (
				row[EntityMetaKey.Source] === Source.Local_Internal
				&& row[EntityMetaKey.ParentSelectorKey] === authorityRequestSelectorKey
			))
		)
		const persistedAccountReferenceKey = `Entity:${entitySelectorKey(schema, entityDefinitionByType[EntityType.Account], accountSelector)}`
		const assertPersistedAuthority = () => {
			assertAuthorityStillSelected()
			const exactPrimitive = (fieldName: string, expected: JsonValue) => {
				const rows = localAuthorityRows(fieldName)
				if (rows.length !== 1 || stringify(rows[0][EntityMetaKey.Value]) !== stringify(expected))
					throw new Error(`Persisted wallet authority ${fieldName} changed before dispatch.`)
			}
			exactPrimitive('envelope', envelope)
			exactPrimitive('envelopeHash', actionAuthorityRequestEnvelopeHash(envelope))
			if (localAuthorityRows('actionRevisionBindings').length !== 0)
				throw new Error('Persisted wallet authority gained an action revision before dispatch.')
			if (localAuthorityRows('$$sessionActions').length !== 0)
				throw new Error('Persisted wallet authority gained an authored action before dispatch.')
			const accountRows = localAuthorityRows('$account')
			if (
				accountRows.length !== 1
				|| accountRows[0].valueKey !== persistedAccountReferenceKey
			)
				throw new Error('Persisted wallet authority account changed before dispatch.')
			if (localAuthorityRows('decision').length !== 0)
				throw new Error('Wallet authority request was decided without dispatch.')
		}
		const requestPayloadHash = await hashWalletEvidence(requestPayload)
		assertAuthorityStillSelected()
		await writeLocalBlockheadActionAuthorityRequest(context, {
			id: authorityRequestSelector.id,
			actionRevisionBindings: [],
			sessionActions: [],
			account: accountSelector,
			envelope,
			envelopeHash: actionAuthorityRequestEnvelopeHash(envelope),
			presentedAt: snapshot.authorityPresentation.submittedAt,
		})
		const validateBeforeOccurrence = () => {
			try {
				assertPersistedAuthority()
			}
			catch (error) {
				if (localAuthorityRows('decision').length !== 0)
					throw error
				return writeLocalBlockheadActionAuthorityDecision(context, authorityRequestSelector, {
					kind: 'prepared-without-dispatch',
					decidedAt: Date.now(),
				}).then(() => Promise.reject(error))
			}
		}
		const authorityRequestFailure = validateBeforeOccurrence()
		if (authorityRequestFailure !== undefined)
			await authorityRequestFailure
		await writeLocalBlockheadWalletRequest(context, {
			id: walletRequestSelector.id,
			walletConnection: {
				connectionKey: snapshot.connectionKey,
			},
			account: accountSelector,
			requestKind: 'message-signature',
			requestMethod,
			requestPayloadHash,
			requestedAt,
		}, [snapshot.connection])
		const walletRequestFailure = validateBeforeOccurrence()
		if (walletRequestFailure !== undefined)
			await walletRequestFailure
		await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
			timestampMs: requestedAt,
			source: Source.Local_Internal,
			status: 'requested',
		})
		const walletTimestampFailure = validateBeforeOccurrence()
		if (walletTimestampFailure !== undefined)
			await walletTimestampFailure
		assertPersistedAuthority()
		const occurrenceStartedAt = Date.now()
		await writeLocalBlockheadActionDispatchOccurrenceStart(context, {
			id: occurrenceSelector.id,
			authorityRequest: authorityRequestSelector,
			walletConnection: { connectionKey: snapshot.connectionKey },
			address: occurrenceAddress,
			startedAt: occurrenceStartedAt,
		})
		try {
			assertPersistedAuthority()
		}
		catch (error) {
			await writeLocalBlockheadActionDispatchEvidence(context, occurrenceSelector, {
				kind: 'pre-dispatch-failure',
				error: error instanceof Error ? error.message : 'Wallet authority changed before provider invocation.',
			})
			throw error
		}

		let signature: string
		try {
			signature = await sign(
				snapshot.connection.walletId,
				snapshot.account.accountAddress,
				snapshot.message,
				snapshot.connectionKey
			)
		}
		catch (error) {
			const adapterError = Object(error)
			const errorMessage = error instanceof Error && error.message.length > 0 ? error.message : 'Wallet signing request failed'
			const dispatchFailureEvidence = isWalletAdapterPreDispatchFailure(adapterError) ?
				dispatchEvidence.assert({
					kind: 'pre-dispatch-failure',
					error: errorMessage,
				})
			: isWalletAdapterResponseAuditFailure(adapterError) ?
				dispatchEvidence.assert({
					kind: 'response-audit-failure',
					returnedValueHash: await hashWalletEvidence(stringify(adapterError.returnedValue)),
					returnedValueCount: Array.isArray(adapterError.returnedValue) ? adapterError.returnedValue.length : 1,
					error: errorMessage,
				})
			: isWalletAdapterProviderRejection(adapterError) ?
				dispatchEvidence.assert({
					kind: 'definite-rejection',
					error: errorMessage,
				})
			:
				dispatchEvidence.assert({
					kind: 'ambiguous',
					reason: 'response-unreadable',
					error: errorMessage,
				})
			await writeLocalBlockheadActionDispatchEvidence(context, occurrenceSelector, dispatchFailureEvidence)
			await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
				timestampMs: Math.max(Date.now(), requestedAt + 1),
				source: Source.Local_Internal,
				status: 'failed',
				error: 'Wallet signing request failed',
			})
			throw error
		}

		const signatureHash = await hashWalletEvidence(signature).catch(async (error) => {
			await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
				timestampMs: Math.max(Date.now(), requestedAt + 1),
				source: Source.Local_Internal,
				status: 'audit-failed',
				error: 'Wallet signature evidence hashing failed',
			})
			throw error
		})
		const returnedEvidence = dispatchEvidence.assert(structuredClone(
			snapshot.account.namespace === 'eip155' ? {
				kind: 'returned',
				response: {
					adapterKey: 'evm.signature',
					adapterVersion: '1',
					value: { signatureHash },
				},
			} : {
				kind: 'returned',
				response: {
					adapterKey: 'wallet.signature',
					adapterVersion: '1',
					value: {
						namespace: snapshot.account.namespace,
						signatureHash,
					},
				},
			}
		))
		await writeLocalBlockheadActionDispatchEvidence(context, occurrenceSelector, returnedEvidence)

		const submittedAt = Math.max(Date.now(), requestedAt + 1)
		try {
			await writeLocalBlockheadWalletRequestSubmittedAt(
				context,
				walletRequestSelector,
				submittedAt
			)
			await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
				timestampMs: submittedAt,
				source: Source.Local_Internal,
				status: 'signed',
				signatureHash,
			})
		}
		catch {
			try {
				await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
					timestampMs: Math.max(Date.now(), submittedAt + 1),
					source: Source.Local_Internal,
					status: 'audit-failed',
					signatureHash,
					error: 'Wallet signature succeeded but signed history persistence failed',
				})
			}
			catch {}
			throw new Error('Wallet signature succeeded but audit persistence failed; do not retry as a wallet rejection')
		}

		return {
			accountAddress: snapshot.account.accountAddress,
			signature,
		}
	}

	const signTonInternalMessages = async (
		input: WalletTonInternalMessageSignInput
	) => {
		const requestInput = $state.snapshot(input)
		const validationClock = Date.now()
		const {
			connectionKey,
			authorityPresentation,
		} = requestInput
		if (
			!Number.isFinite(authorityPresentation.submittedAt)
			|| !Number.isSafeInteger(authorityPresentation.submittedAt)
			|| authorityPresentation.submittedAt < 0
			|| authorityPresentation.submittedAt > validationClock
			|| (
				authorityPresentation.validUntil !== undefined
				&& (
					!Number.isFinite(authorityPresentation.validUntil)
					|| !Number.isSafeInteger(authorityPresentation.validUntil)
					|| authorityPresentation.validUntil < authorityPresentation.submittedAt
				)
			)
		)
			throw new Error('Wallet signing requires a valid authority presentation time range.')
		if (
			authorityPresentation.validUntil !== undefined
			&& validationClock > authorityPresentation.validUntil
		)
			throw new Error('Wallet authority presentation expired before history creation.')
		const selection = resolveWalletPrepSelection(connections)
		if (!selection.ready)
			throw new Error(selection.error)
		if (selection.connectionKey !== connectionKey)
			throw new Error('Wallet request connectionKey does not match the selected wallet connection.')
		if (
			selection.account.namespace !== 'ton'
			|| !selection.account.capabilities.includes(WalletCapability.SignTransaction)
		)
			throw new Error('Selected wallet account does not authorize TON internal-message signing')

		const snapshot = Object.freeze({
			connectionKey,
			account: $state.snapshot(selection.account),
			connection: $state.snapshot(selection.connection),
			request: snapshotTonInternalMessages(requestInput.request),
			authorityPresentation: structuredClone(authorityPresentation),
		})
		const adapter = adapterByWalletId.get(snapshot.connection.walletId)
		const adapterRegistrationEpoch = adapterRegistrationEpochByWalletId.get(
			snapshot.connection.walletId
		)
		const adapterSignTonInternalMessages = adapter?.signTonInternalMessages
		const sign = adapterSignTonInternalMessages?.bind(adapter)
		if (sign == null)
			throw new Error('Connected wallet does not expose executable TON internal-message signing')

		const walletRequestSelector = {
			id: `wallet-request-${globalThis.crypto.randomUUID()}`,
		} as const satisfies EntitySelector<typeof schema, EntityType.BlockheadWalletRequest>
		const accountSelector = {
			caip10: {
				namespace: snapshot.account.namespace,
				reference: snapshot.account.reference,
				accountAddress: snapshot.account.accountAddress,
			},
		} as const satisfies EntitySelector<typeof schema, EntityType.Account>
		const envelope = authorityRequestEnvelope.assert({
			adapterKey: 'ton.internal-message-sign',
			adapterVersion: '1',
			value: {
				namespace: 'ton',
				reference: snapshot.account.reference,
				accountAddress: snapshot.account.accountAddress,
				method: 'signMessage',
				network: snapshot.request.network,
				from: snapshot.request.from,
				...(snapshot.request.valid_until !== undefined && {
					valid_until: snapshot.request.valid_until,
				}),
				messages: snapshot.request.messages,
			},
		})
		const requestedAt = snapshot.authorityPresentation.submittedAt
		const requestPayloadHash = await hashWalletEvidence(JSON.stringify({
			version: 1,
			method: 'signMessage',
			account: accountSelector.caip10,
			request: snapshot.request,
		}))
		const authorityRequestSelector = {
			id: `authority-request-${globalThis.crypto.randomUUID()}`,
		} as const satisfies EntitySelector<typeof schema, EntityType.BlockheadActionAuthorityRequest>
		const occurrenceSelector = {
			id: `dispatch-occurrence-${globalThis.crypto.randomUUID()}`,
		} as const satisfies EntitySelector<typeof schema, EntityType.BlockheadActionDispatchOccurrence>
		const occurrenceAddress = dispatchAddress.assert({
			kind: 'wallet-connection',
			connectionKey: snapshot.connectionKey,
			method: 'signMessage',
		})
		const assertAuthorityStillSelected = () => {
			const currentAdapter = adapterByWalletId.get(snapshot.connection.walletId)
			if (
				currentAdapter !== adapter
				|| adapterRegistrationEpochByWalletId.get(snapshot.connection.walletId)
					!== adapterRegistrationEpoch
				|| currentAdapter?.signTonInternalMessages !== adapterSignTonInternalMessages
			)
				throw new Error('Wallet adapter registration changed before dispatch.')
			if (
				snapshot.authorityPresentation.validUntil !== undefined
				&& Date.now() > snapshot.authorityPresentation.validUntil
			)
				throw new Error('Wallet authority presentation expired before dispatch.')
			const currentSelection = resolveWalletPrepSelection(connections)
			if (
				!currentSelection.ready
				|| currentSelection.connectionKey !== snapshot.connectionKey
				|| !sameWalletConnectionIdentity(currentSelection.connection, snapshot.connection)
				|| !sameWalletAccountAuthority(currentSelection.account, snapshot.account)
			)
				throw new Error('Wallet authority changed before dispatch.')
		}
		const authorityRequestSelectorKey = entitySelectorKey(
			schema,
			entityDefinitionByType[EntityType.BlockheadActionAuthorityRequest],
			authorityRequestSelector
		)
		const localAuthorityRows = (fieldName: string) => (
			context.entityFieldCollections[EntityType.BlockheadActionAuthorityRequest][
				entityFieldAddressKey(EntityType.BlockheadActionAuthorityRequest, [], fieldName)
			].toArray.filter((row) => (
				row[EntityMetaKey.Source] === Source.Local_Internal
				&& row[EntityMetaKey.ParentSelectorKey] === authorityRequestSelectorKey
			))
		)
		const persistedAccountReferenceKey = `Entity:${entitySelectorKey(schema, entityDefinitionByType[EntityType.Account], accountSelector)}`
		const assertPersistedAuthority = () => {
			assertAuthorityStillSelected()
			const exactPrimitive = (fieldName: string, expected: JsonValue) => {
				const rows = localAuthorityRows(fieldName)
				if (rows.length !== 1 || stringify(rows[0][EntityMetaKey.Value]) !== stringify(expected))
					throw new Error(`Persisted wallet authority ${fieldName} changed before dispatch.`)
			}
			exactPrimitive('envelope', envelope)
			exactPrimitive('envelopeHash', actionAuthorityRequestEnvelopeHash(envelope))
			const accountRows = localAuthorityRows('$account')
			if (
				accountRows.length !== 1
				|| accountRows[0].valueKey !== persistedAccountReferenceKey
			)
				throw new Error('Persisted wallet authority account changed before dispatch.')
			if (
				localAuthorityRows('actionRevisionBindings').length !== 0
				|| localAuthorityRows('$$sessionActions').length !== 0
			)
				throw new Error('Persisted wallet authority gained an authored action before dispatch.')
			if (localAuthorityRows('decision').length !== 0)
				throw new Error('Wallet authority request was decided without dispatch.')
		}
		assertAuthorityStillSelected()
		await writeLocalBlockheadActionAuthorityRequest(context, {
			id: authorityRequestSelector.id,
			actionRevisionBindings: [],
			sessionActions: [],
			account: accountSelector,
			envelope,
			envelopeHash: actionAuthorityRequestEnvelopeHash(envelope),
			presentedAt: requestedAt,
		})
		const validateBeforeOccurrence = () => {
			try {
				assertPersistedAuthority()
			}
			catch (error) {
				if (localAuthorityRows('decision').length !== 0)
					throw error
				return writeLocalBlockheadActionAuthorityDecision(context, authorityRequestSelector, {
					kind: 'prepared-without-dispatch',
					decidedAt: Date.now(),
				})
					.then(() => Promise.reject(error))
			}
		}
		const authorityRequestFailure = validateBeforeOccurrence()
		if (authorityRequestFailure !== undefined)
			await authorityRequestFailure
		await writeLocalBlockheadWalletRequest(context, {
			id: walletRequestSelector.id,
			walletConnection: { connectionKey: snapshot.connectionKey },
			account: accountSelector,
			requestKind: 'ton-internal-message-signature',
			requestMethod: 'signMessage',
			requestPayloadHash,
			requestedAt,
		}, [snapshot.connection])
		const walletRequestFailure = validateBeforeOccurrence()
		if (walletRequestFailure !== undefined)
			await walletRequestFailure
		await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
			timestampMs: requestedAt,
			source: Source.Local_Internal,
			status: 'requested',
		})
		const walletTimestampFailure = validateBeforeOccurrence()
		if (walletTimestampFailure !== undefined)
			await walletTimestampFailure
		assertPersistedAuthority()
		await writeLocalBlockheadActionDispatchOccurrenceStart(context, {
			id: occurrenceSelector.id,
			authorityRequest: authorityRequestSelector,
			walletConnection: { connectionKey: snapshot.connectionKey },
			address: occurrenceAddress,
			startedAt: Date.now(),
		})
		try {
			assertPersistedAuthority()
		}
		catch (error) {
			await writeLocalBlockheadActionDispatchEvidence(context, occurrenceSelector, {
				kind: 'pre-dispatch-failure',
				error: error instanceof Error ? error.message : 'Wallet authority changed before provider invocation.',
			})
			throw error
		}

		let internalBoc: string
		try {
			internalBoc = await sign(
				snapshot.connection.walletId,
				snapshot.account.accountAddress,
				snapshot.request,
				snapshot.connectionKey
			)
		}
		catch (error) {
			const adapterError = Object(error)
			const errorMessage = (
				error instanceof Error && error.message.length > 0 ?
					error.message
				:
					'TON internal-message signing request failed'
			)
			let failureEvidence: typeof dispatchEvidence.infer
			if (isWalletAdapterPreDispatchFailure(adapterError))
				failureEvidence = dispatchEvidence.assert({
					kind: 'pre-dispatch-failure',
					error: errorMessage,
				})
			else if (isWalletAdapterResponseAuditFailure(adapterError))
				failureEvidence = dispatchEvidence.assert({
					kind: 'response-audit-failure',
					returnedValueHash: await hashWalletEvidence(stringify(adapterError.returnedValue)),
					returnedValueCount: Array.isArray(adapterError.returnedValue) ? adapterError.returnedValue.length : 1,
					error: errorMessage,
				})
			else if (isWalletAdapterProviderRejection(adapterError))
				failureEvidence = dispatchEvidence.assert({
					kind: 'definite-rejection',
					error: errorMessage,
				})
			else
				failureEvidence = dispatchEvidence.assert({
					kind: 'ambiguous',
					reason: 'response-unreadable',
					error: errorMessage,
				})
			await writeLocalBlockheadActionDispatchEvidence(context, occurrenceSelector, failureEvidence)
			await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
				timestampMs: Math.max(Date.now(), requestedAt + 1),
				source: Source.Local_Internal,
				status: 'failed',
				error: errorMessage,
			})
			throw error
		}

		let internalBocHash: typeof Hash32.infer | undefined
		const submittedAt = Math.max(Date.now(), requestedAt + 1)
		try {
			internalBocHash = await hashWalletEvidence(internalBoc)
			await writeLocalBlockheadActionDispatchEvidence(
				context,
				occurrenceSelector,
				dispatchEvidence.assert({
					kind: 'returned',
					response: {
						adapterKey: 'ton.internal-message-sign',
						adapterVersion: '1',
						value: { internalBocHash },
					},
				})
			)
			await writeLocalBlockheadWalletRequestSubmittedAt(context, walletRequestSelector, submittedAt)
			await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
				timestampMs: submittedAt,
				source: Source.Local_Internal,
				status: 'signed',
				signatureHash: internalBocHash,
			})
		}
		catch {
			try {
				await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
					timestampMs: Math.max(Date.now(), submittedAt + 1),
					source: Source.Local_Internal,
					status: 'audit-failed',
					...(internalBocHash !== undefined && { signatureHash: internalBocHash }),
					error: 'TON internal-message signing succeeded but terminal history persistence failed',
				})
			}
			catch {}
			throw new Error('TON internal-message signing succeeded but audit persistence failed; do not retry as a wallet rejection')
		}

		return {
			accountAddress: snapshot.account.accountAddress,
			internalBoc,
		}
	}

	const signTypedData = async (
		connectionKey: string,
		typedData: WalletTypedData
	) => {
		const selection = resolveWalletPrepSelection(connections)
		if (!selection.ready)
			throw new Error(selection.error)
		if (selection.connectionKey !== connectionKey)
			throw new Error('Wallet request connectionKey does not match the selected wallet connection.')

		const { account, connection } = selection
		if (!account.capabilities.includes(WalletCapability.SignTypedData))
			throw new Error('Selected wallet account does not authorize typed data signing')
		if (account.namespace !== 'eip155')
			throw new Error('Typed data signing requires an EVM wallet account')

		const sign = adapterByWalletId.get(connection.walletId)?.signTypedData
		if (sign == null)
			throw new Error('Connected wallet does not expose executable typed data signing')

		const walletRequestSelector = {
			id: `wallet-request-${globalThis.crypto.randomUUID()}`,
		} as const satisfies EntitySelector<typeof schema, EntityType.BlockheadWalletRequest>
		const accountSelector = {
			caip10: {
				namespace: account.namespace,
				reference: account.reference,
				accountAddress: account.accountAddress,
			},
		} as const satisfies EntitySelector<typeof schema, EntityType.Account>
		const requestedAt = Date.now()
		await writeLocalBlockheadWalletRequest(context, {
			id: walletRequestSelector.id,
			walletConnection: {
				connectionKey,
			},
			account: accountSelector,
			requestKind: 'typed-data-signature',
			requestMethod: 'eth_signTypedData_v4',
			requestPayloadHash: await hashWalletEvidence(JSON.stringify({
				version: 1,
				method: 'eth_signTypedData_v4',
				account: accountSelector.caip10,
				typedData,
			})),
			requestedAt,
		}, connections)
		await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
			timestampMs: requestedAt,
			source: Source.Local_Internal,
			status: 'requested',
		})

		let signature: string
		try {
			signature = await sign(
				connection.walletId,
				account.accountAddress,
				typedData,
				connectionKey
			)
		}
		catch (error) {
			await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
				timestampMs: Math.max(Date.now(), requestedAt + 1),
				source: Source.Local_Internal,
				status: 'failed',
				error: 'Wallet typed data signing request failed',
			})
			throw error
		}

		const signatureHash = await hashWalletEvidence(signature).catch(async (error) => {
			await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
				timestampMs: Math.max(Date.now(), requestedAt + 1),
				source: Source.Local_Internal,
				status: 'audit-failed',
				error: 'Wallet typed data signature evidence hashing failed',
			})
			throw error
		})

		const submittedAt = Math.max(Date.now(), requestedAt + 1)
		try {
			await writeLocalBlockheadWalletRequestSubmittedAt(
				context,
				walletRequestSelector,
				submittedAt
			)
			await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
				timestampMs: submittedAt,
				source: Source.Local_Internal,
				status: 'signed',
				signatureHash,
			})
		}
		catch {
			try {
				await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
					timestampMs: Math.max(Date.now(), submittedAt + 1),
					source: Source.Local_Internal,
					status: 'audit-failed',
					signatureHash,
					error: 'Wallet typed data signature succeeded but signed history persistence failed',
				})
			}
			catch {}
			throw new Error('Wallet typed data signature succeeded but audit persistence failed; do not retry as a wallet rejection')
		}

		return {
			accountAddress: account.accountAddress,
			signature,
		}
	}

	const signXrplTransaction = async (
		connectionKey: string,
		request: WalletXrplTransactionRequest
	) => {
		const selection = resolveWalletPrepSelection(connections)
		if (!selection.ready)
			throw new Error(selection.error)
		if (selection.connectionKey !== connectionKey || selection.account.namespace !== 'xrpl')
			throw new Error('XRPL signing request does not match the selected wallet connection')
		const { account, connection } = selection
		if (!account.capabilities.includes(WalletCapability.SignTransaction))
			throw new Error('Selected wallet account does not authorize XRPL transaction signing')
		if (request.Account !== account.accountAddress)
			throw new Error('XRPL transaction account does not match the selected wallet account')
		throw new Error('Durable XRPL authority dispatch is not implemented')
	}

	const signStarknetTypedData = async (
		connectionKey: string,
		typedData: WalletStarknetTypedData,
		apiVersion?: string
	) => {
		const selection = resolveWalletPrepSelection(connections)
		if (!selection.ready)
			throw new Error(selection.error)
		if (selection.connectionKey !== connectionKey)
			throw new Error('Wallet request connectionKey does not match the selected wallet connection.')

		const { account, connection } = selection
		if (!account.capabilities.includes(WalletCapability.SignStarknetTypedData))
			throw new Error('Selected wallet account does not authorize Starknet typed data signing')
		if (account.namespace !== 'starknet')
			throw new Error('Starknet typed data signing requires a Starknet wallet account')

		const selectedAdapter = adapterByWalletId.get(connection.walletId)
		const selectedSign = selectedAdapter?.signStarknetTypedData
		if (selectedAdapter == null || selectedSign == null)
			throw new Error('Connected wallet does not expose executable Starknet typed data signing')

		const selectedWalletId = connection.walletId
		const selectedConnectionKey = connectionKey
		const selectedAccountAddress = account.accountAddress
		const selectedReference = account.reference
		const selectedApiVersion = apiVersion
		const selectedTypedData = structuredClone(typedData)
		const sign = selectedSign.bind(selectedAdapter)

		const walletRequestSelector = {
			id: `wallet-request-${globalThis.crypto.randomUUID()}`,
		} as const satisfies EntitySelector<typeof schema, EntityType.BlockheadWalletRequest>
		const accountSelector = {
			caip10: {
				namespace: 'starknet',
				reference: selectedReference,
				accountAddress: selectedAccountAddress,
			},
		} as const satisfies EntitySelector<typeof schema, EntityType.Account>
		const requestedAt = Date.now()
		await writeLocalBlockheadWalletRequest(context, {
			id: walletRequestSelector.id,
			walletConnection: {
				connectionKey: selectedConnectionKey,
			},
			account: accountSelector,
			requestKind: 'typed-data-signature',
			requestMethod: 'wallet_signTypedData',
			requestPayloadHash: await hashWalletEvidence(JSON.stringify({
				version: 1,
				method: 'wallet_signTypedData',
				account: accountSelector.caip10,
				typedData: selectedTypedData,
					...(selectedApiVersion !== undefined && { apiVersion: selectedApiVersion }),
			})),
			requestedAt,
		}, connections)
		await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
			timestampMs: requestedAt,
			source: Source.Local_Internal,
			status: 'requested',
		})

		let signature: string[]
		try {
			const returnedSignature = await sign(
				selectedWalletId,
				selectedAccountAddress,
				selectedReference,
				selectedTypedData,
				selectedApiVersion,
				selectedConnectionKey
			)
			signature = [...returnedSignature]
		}
		catch (error) {
			const responseAuditFailure = isWalletAdapterResponseAuditFailure(Object(error))
			await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
				timestampMs: Math.max(Date.now(), requestedAt + 1),
				source: Source.Local_Internal,
				status: responseAuditFailure ? 'audit-failed' : 'failed',
				error: responseAuditFailure ?
					'Wallet Starknet typed data signature response could not be audited'
				:
					'Wallet Starknet typed data signing request failed',
			})
			throw error
		}

		const signatureHash = await hashWalletEvidence(JSON.stringify(signature)).catch(async (error) => {
			await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
				timestampMs: Math.max(Date.now(), requestedAt + 1),
				source: Source.Local_Internal,
				status: 'audit-failed',
				error: 'Wallet Starknet typed data signature evidence hashing failed',
			})
			throw error
		})

		const submittedAt = Math.max(Date.now(), requestedAt + 1)
		try {
			await writeLocalBlockheadWalletRequestSubmittedAt(
				context,
				walletRequestSelector,
				submittedAt
			)
			await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
				timestampMs: submittedAt,
				source: Source.Local_Internal,
				status: 'signed',
				signatureHash,
			})
		}
		catch {
			try {
				await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
					timestampMs: Math.max(Date.now(), submittedAt + 1),
					source: Source.Local_Internal,
					status: 'audit-failed',
					signatureHash,
					error: 'Wallet Starknet typed data signature succeeded but signed history persistence failed',
				})
			}
			catch {}
			throw new Error('Wallet signature succeeded but audit persistence failed; do not retry as a wallet rejection')
		}

		return {
			accountAddress: selectedAccountAddress,
			signature,
		}
	}

	const switchScope = async (
		connectionKey: string,
		scope: {
			namespace: string
			reference: string
		}
	) => {
		const connection = connections.find((candidate) => (
			walletConnectionKey(candidate) === connectionKey
		))
		if (connection == null)
			throw new Error('Wallet connection is unavailable')
		if (connection.status !== BlockheadConnectionStatus.Connected)
			throw new Error('Wallet connection is not connected')

		const account = connection.activeAccount ?? connection.accounts.at(0)
		if (account == null)
			throw new Error('Wallet connection has no account')
		if (!account.capabilities.includes(WalletCapability.SwitchScope))
			throw new Error('Selected wallet account does not authorize scope switching')

		const switchScopeOnAdapter = adapterByWalletId.get(connection.walletId)?.switchScope
		if (switchScopeOnAdapter == null)
			throw new Error('Connected wallet does not expose executable scope switching')

		const nextConnection = await switchScopeOnAdapter(
			connection.walletId,
			scope,
			connectionKey
		)
		if (nextConnection == null)
			throw new Error('Wallet did not return an updated connection after switchScope')

		await upsertConnection(
			preserveWalletConnectionSelection(
				connection,
				buildWalletConnection({
					...nextConnection,
					connectionKey,
				})
			)
		)
	}

	const rejectPreparedTransactionRequest = async (
		request: PreparedTransactionWalletRequest,
		preparedObservation: PreparedWalletRequestRejectionObservation,
		rejectedAt: number
	) => {
		const rejection = preparedWalletRequestRejection({
			request,
			preparedObservation,
			rejectedAt,
		})
		await writeLocalBlockheadWalletRequest_Timestamp(
			context,
			rejection.walletRequestSelector,
			rejection.observation
		)
	}

	const selectAccount = async (
		connectionKey: string,
		account: WalletAccount
	): Promise<void> => {
		const selectedConnection = connections.find((connection) => (
			walletConnectionKey(connection) === connectionKey
		))
		if (selectedConnection == null || selectedConnection.status !== BlockheadConnectionStatus.Connected)
			return

		await upsertConnection({
			...selectedConnection,
			selected: true,
			activeAccount: account,
		})
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
		reconnect: connect,
		openWalletConnectApplication,
		signMessage,
		signTonInternalMessages,
		signTypedData,
		signXrplTransaction,
		signStarknetTypedData,
		switchScope,
		rejectPreparedTransactionRequest,
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
			adapterRegistrationEpochByWalletId.clear()
			registeredAdapterIds.clear()
			runtimeMutatedConnectionKeys.clear()
			candidatesByAdapterId.clear()
			onDestroy?.()
			walletRuntime = null
		},
	}
}

let walletRuntime = $state<WalletRuntime | null>(null)

export type WalletConnectionRuntimeOptions = Readonly<{
	tauriWalletLinkHost?: TauriWalletLinkHost
}>

export const mountWalletConnectionRuntime = (
	context: LocalMutationContext & Pick<ClientContext<typeof schema>, 'select'>,
	options: WalletConnectionRuntimeOptions = {}
) => {
	if (walletRuntime != null) return walletRuntime

	const applicationConsumer: WalletConnectApplicationConsumer | undefined = (
		options.tauriWalletLinkHost == null ?
			undefined
		:
			createWalletConnectApplicationConsumer({
				host: options.tauriWalletLinkHost,
			})
	)
	walletRuntime = createWalletRuntimeState(context, {
		onDestroy: () => applicationConsumer?.destroy(),
		openWalletConnectApplication: async (walletConnectUri) => {
			if (applicationConsumer == null) {
				globalThis.location.assign(walletConnectUri)
				return
			}

			await applicationConsumer.start()
			await applicationConsumer.openPairing(walletConnectUri)
		},
	})
	const mountedWalletRuntime = walletRuntime
	const walletConnectProjectId = env.PUBLIC_WALLETCONNECT2_PROJECT_ID?.trim()
	const walletConnectRelayUrl = env.PUBLIC_WALLETCONNECT2_RELAY_URL?.trim()

	if (
		browser
		&& walletConnectProjectId
	)
		void import('@walletconnect/sign-client')
			.then(({ default: SignClient }) => SignClient.init({
				projectId: walletConnectProjectId,
				...(walletConnectRelayUrl && {
					relayUrl: walletConnectRelayUrl,
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
					applicationConsumer,
					client: walletConnectV2ClientFromSignClient(signClient),
					requestedScopes: [
						{
							namespace: Caip2Namespace.Eip155,
							reference: Caip2Reference.EthereumMainnet,
							methods: [
								'eth_accounts',
								'personal_sign',
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
