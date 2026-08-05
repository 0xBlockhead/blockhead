import {
	WalletCapability,
	WalletProtocol,
	WalletTransportKind,
	walletConnectionMethodByProtocolDiscoveryKindTransportKind,
	walletConnectionMethods,
	walletProtocols,
} from '$/constants/Wallet.ts'
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
} from '$/collections/localMutations.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { SvelteMap, SvelteSet } from 'svelte/reactivity'
import { createAptosInjectedAdapter } from './adapters/aptosInjected.ts'
import { createBitcoinInjectedAdapter } from './adapters/bitcoinInjected.ts'
import { createCardanoCip30Adapter } from './adapters/cardanoCip30.ts'
import { createCosmosOfflineSignerAdapter } from './adapters/cosmosOfflineSigner.ts'
import { createEip6963Adapter } from './adapters/eip6963.ts'
import { createPolkadotInjectedWeb3Adapter } from './adapters/polkadotInjectedWeb3.ts'
import { createStarknetWalletApiAdapter } from './adapters/starknetWalletApi.ts'
import { createTonConnectAdapter } from './adapters/tonConnect.ts'
import { createTronInjectedAdapter } from './adapters/tronInjected.ts'
import type { WalletAccount, WalletAdapter, WalletCandidate, WalletConnection, WalletTypedData } from './adapters/types.ts'
import {
	applyWalletConnectionSelection,
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
	reconnect(walletId: string): Promise<void>
	signMessage(connectionKey: string, message: string): Promise<{
		accountAddress: string
		signature: string
	}>
	signTypedData(connectionKey: string, typedData: WalletTypedData): Promise<{
		accountAddress: string
		signature: string
	}>
	switchScope(
		connectionKey: string,
		scope: {
			namespace: string
			reference: string
		}
	): Promise<void>
	disconnect(connectionKey: string): Promise<void>
	remove(connectionKey: string): Promise<void>
	selectAccount(connectionKey: string, account: WalletAccount): void
	destroy(): void
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

const createWalletRuntimeState = (
	context: LocalMutationContext & Pick<ClientContext<typeof schema>, 'select'>
): WalletRuntime => {
	const cleanupByConnectionKey = new SvelteMap<string, () => void>()
	const connectionAttemptByConnectionKey = new SvelteMap<string, number>()
	const adapterByWalletId = new SvelteMap<string, WalletAdapter>()
	const registeredAdapterIds = new SvelteSet<string>()
	const adapterCleanups: (() => void)[] = []
	const candidatesByAdapterId = new SvelteMap<string, WalletCandidate[]>()

	let candidates = $state<WalletCandidate[]>([])
	let connections = $state<WalletConnection[]>([])
	const runtimeMutatedConnectionKeys = new SvelteSet<string>()

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
					void upsertConnection(
						preserveWalletConnectionSelection(
							previous,
							buildWalletConnection({
								...nextConnection,
								connectionKey,
							})
						)
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
					selected: persistedConnection.selected,
					connectedAt: persistedConnection.connectedAt,
					disconnectedAt: persistedConnection.disconnectedAt,
					sessionId: persistedConnection.sessionId,
					sessionTopic: persistedConnection.sessionTopic,
					error: persistedConnection.error,
				})
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
			await connectingPersistence
			if (connectionAttemptByConnectionKey.get(walletId) !== connectionAttempt) return
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
			connectionAttemptByConnectionKey.delete(walletId)
			cleanupByConnectionKey.get(connectionKey)?.()
			cleanupByConnectionKey.set(
				connectionKey,
				adapter.subscribeConnection(
					walletId,
					(nextConnection) => {
						const previous = connections.find((candidate) => (
							walletConnectionKey(candidate) === connectionKey
						))
						void upsertConnection(
							preserveWalletConnectionSelection(
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
			)
			await upsertConnection(buildWalletConnection({
				...connection,
				connectionKey,
			}), walletId)
		}
		catch (error) {
			await connectingPersistence
			if (connectionAttemptByConnectionKey.get(walletId) !== connectionAttempt) return
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
		connectionAttemptByConnectionKey.set(
			connectionKey,
			(connectionAttemptByConnectionKey.get(connectionKey) ?? 0) + 1
		)
		await adapterByWalletId.get(walletId)?.disconnect(walletId, connectionKey)
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
			walletConnectionKey(candidate) !== connectionKey
		))
	}

	const signMessage = async (
		connectionKey: string,
		message: string
	) => {
		const selection = resolveWalletPrepSelection(connections)
		if (!selection.ready)
			throw new Error(selection.error)
		if (selection.connectionKey !== connectionKey)
			throw new Error('Wallet request connectionKey does not match the selected wallet connection.')

		const { account, connection } = selection
		if (!account.capabilities.includes(WalletCapability.SignMessage))
			throw new Error('Selected wallet account does not authorize message signing')

		const sign = adapterByWalletId.get(connection.walletId)?.signMessage
		if (sign == null)
			throw new Error('Connected wallet does not expose executable message signing')

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
		const requestMethod = (
			account.namespace === 'eip155' ?
				'personal_sign'
			: account.namespace === 'solana' ?
				'solana:signMessage'
			: account.namespace === 'aptos' ?
				'aptos:signMessage'
			:
				`${account.namespace}:signMessage`
		)
		await writeLocalBlockheadWalletRequest(context, {
			id: walletRequestSelector.id,
			walletConnection: {
				connectionKey,
			},
			account: accountSelector,
			requestKind: 'message-signature',
			requestMethod,
			requestPayloadHash: await hashWalletEvidence(JSON.stringify({
				version: 1,
				method: requestMethod,
				account: accountSelector.caip10,
				message,
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
				message,
				connectionKey
			)
		}
		catch (error) {
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
			accountAddress: account.accountAddress,
			signature,
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

	const selectAccount = (
		connectionKey: string,
		account: WalletAccount
	) => {
		const selectedConnection = connections.find((connection) => (
			walletConnectionKey(connection) === connectionKey
		))
		if (selectedConnection == null || selectedConnection.status !== BlockheadConnectionStatus.Connected)
			return

		connections = applyWalletConnectionSelection(connections, connectionKey, account)
		for (const connection of connections) {
			runtimeMutatedConnectionKeys.add(walletConnectionKey(connection))
			if (connection.status === BlockheadConnectionStatus.Connected)
				void writeLocalBlockheadWalletConnection(context, connection)
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
		reconnect: connect,
		signMessage,
		signTypedData,
		switchScope,
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
