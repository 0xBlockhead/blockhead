import { WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import type { ClientContext } from '$/client/$client.svelte.ts'
import {
	deleteLocalBlockheadWalletConnection,
	type LocalMutationContext,
	writeLocalBlockheadWallet,
	writeLocalBlockheadWalletConnection,
} from '$/collections/localMutations.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
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
import { createTronInjectedAdapter } from './adapters/tronInjected.ts'
import type { WalletAccount, WalletAdapter, WalletCandidate, WalletConnection } from './adapters/types.ts'
import { createWalletStandardAdapter } from './adapters/walletStandard.ts'

type WalletRuntime = {
	candidates: WalletCandidate[]
	connections: WalletConnection[]
	connect(walletId: string): Promise<void>
	signMessage(connectionKey: string, message: string): Promise<{
		accountAddress: string
		signature: string
	}>
	disconnect(connectionKey: string): void
	selectAccount(connectionKey: string, account: WalletAccount): void
	destroy(): void
}

const createWalletRuntimeState = (
	context: LocalMutationContext & Pick<ClientContext<typeof schema>, 'select'>
): WalletRuntime => {
	const cleanupByWalletId = new SvelteMap<string, () => void>()
	const connectionAttemptByWalletId = new SvelteMap<string, number>()
	const adapterByWalletId = new SvelteMap<string, WalletAdapter>()
	const adapterCleanups: (() => void)[] = []
	const candidatesByAdapterId = new SvelteMap<string, WalletCandidate[]>()

	let candidates = $state<WalletCandidate[]>([])
	let connections = $state<WalletConnection[]>([])
	let hasRuntimeMutation = false

	const upsertConnection = (connection: WalletConnection) => {
		hasRuntimeMutation = true
		const connectionKey = connection.connectionKey ?? connection.sessionTopic ?? connection.sessionId ?? connection.walletId
		connections = [
			...connections.filter((candidate) => (
				(candidate.connectionKey ?? candidate.sessionTopic ?? candidate.sessionId ?? candidate.walletId) !== connectionKey
			)),
			{
				...connection,
				connectionKey,
				activeAccount: connection.activeAccount ?? connection.accounts.at(0),
			},
		]
		writeLocalBlockheadWalletConnection(context, {
			...connection,
			connectionKey,
			activeAccount: connection.activeAccount ?? connection.accounts.at(0),
		})
	}

	const adapters = [
		createEip6963Adapter(),
		createWalletStandardAdapter(),
		createAptosInjectedAdapter(),
		createCardanoCip30Adapter(),
		createBitcoinInjectedAdapter(),
		createCosmosOfflineSignerAdapter(),
		createTronInjectedAdapter(),
		createStarknetWalletApiAdapter(),
		createPolkadotInjectedWeb3Adapter(),
	]

	for (const adapter of adapters)
		adapterCleanups.push(adapter.start((nextCandidates) => {
			candidatesByAdapterId.set(adapter.id, nextCandidates)

			for (const candidate of nextCandidates)
				adapterByWalletId.set(candidate.id, adapter)

			candidates = [...candidatesByAdapterId.values()].flat()

			for (const candidate of nextCandidates)
				writeLocalBlockheadWallet(context, candidate)
		}))

	void context.select(EntityType._Global, {
		scope: '$$blockheadWalletConnections',
	}).$$blockheadWalletConnections({
		sources: [Source.Local_Internal],
		count: true,
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
							scopes: true,
							selected: true,
							connectedAt: true,
							disconnectedAt: true,
							sessionId: true,
							sessionTopic: true,
							error: true,
						},
					}),
					persistedConnectionSelection.$wallet,
					persistedConnectionSelection.$$connectedAccounts({
						sources: [Source.Local_Internal],
						count: true,
					}),
					persistedConnectionSelection.$activeAccount,
				])
				const candidate = candidates.find(({ id }) => (
					id === persistedWallet[EntityMetaKey.Selector].id
				))
				if (candidate == null)
					return

				const accounts = persistedAccounts.values.map((account) => ({
					...account[EntityMetaKey.Selector].caip10,
					capabilities: [...candidate.capabilities],
				}))

				return {
					connectionKey: persistedConnectionReference.connectionKey,
					walletId: persistedWallet[EntityMetaKey.Selector].id,
					status: persistedConnection.status,
					protocol: candidate.protocol,
					transportKind: candidate.transportKind,
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
		).filter((connection) => connection !== undefined)

		if (!hasRuntimeMutation) {
			connections = persistedConnections
			for (const connection of persistedConnections) {
				const adapter = adapterByWalletId.get(connection.walletId)
				if (adapter == null)
					continue

				cleanupByWalletId.get(connection.walletId)?.()
				cleanupByWalletId.set(
					connection.walletId,
					adapter.subscribeConnection(connection.walletId, upsertConnection)
				)
			}
		}
	})

	const connect = async (walletId: string) => {
		const adapter = adapterByWalletId.get(walletId)
		if (adapter == null) return
		if (connections.some((connection) => (
			connection.walletId === walletId
			&& connection.status === BlockheadConnectionStatus.Connecting
		))) return

		const connectionAttempt = (connectionAttemptByWalletId.get(walletId) ?? 0) + 1
		connectionAttemptByWalletId.set(walletId, connectionAttempt)

		upsertConnection({
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
			if (connectionAttemptByWalletId.get(walletId) !== connectionAttempt) return
			if (connection == null) {
				upsertConnection({
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

			upsertConnection(connection)
			cleanupByWalletId.get(walletId)?.()
			cleanupByWalletId.set(walletId, adapter.subscribeConnection(walletId, upsertConnection))
		}
		catch (error) {
			if (connectionAttemptByWalletId.get(walletId) !== connectionAttempt) return
			upsertConnection({
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

	const disconnect = (connectionKey: string) => {
		hasRuntimeMutation = true
		const connection = connections.find((candidate) => (
			(candidate.connectionKey ?? candidate.sessionTopic ?? candidate.sessionId ?? candidate.walletId) === connectionKey
		))
		if (connection == null) return

		const { walletId } = connection
		connectionAttemptByWalletId.set(
			walletId,
			(connectionAttemptByWalletId.get(walletId) ?? 0) + 1
		)
		cleanupByWalletId.get(walletId)?.()
		cleanupByWalletId.delete(walletId)
		adapterByWalletId.get(walletId)?.disconnect(walletId)
		connections = connections.filter((candidate) => (
			(candidate.connectionKey ?? candidate.sessionTopic ?? candidate.sessionId ?? candidate.walletId) !== connectionKey
		))
		deleteLocalBlockheadWalletConnection(context, connectionKey)
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
		if (account.namespace !== 'eip155')
			throw new Error('Farcaster connection proof requires an EVM wallet account')

		const sign = adapterByWalletId.get(connection.walletId)?.signMessage
		if (sign == null)
			throw new Error('Connected wallet does not expose executable message signing')

		return {
			accountAddress: account.accountAddress,
			signature: await sign(connection.walletId, account.accountAddress, message),
		}
	}

	const selectAccount = (
		connectionKey: string,
		account: WalletAccount
	) => {
		hasRuntimeMutation = true
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
		for (const connection of connections)
			if (connection.connectedAt !== undefined)
				writeLocalBlockheadWalletConnection(context, {
					...connection,
					connectedAt: connection.connectedAt,
				})
	}

	return {
		get candidates() {
			return candidates
		},
		get connections() {
			return connections
		},
		connect,
		signMessage,
		disconnect,
		selectAccount,
		destroy: () => {
			for (const cleanup of adapterCleanups)
				cleanup()

			for (const cleanup of cleanupByWalletId.values())
				cleanup()

			cleanupByWalletId.clear()
			connectionAttemptByWalletId.clear()
			adapterByWalletId.clear()
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

	return walletRuntime
}

export const getWalletConnectionRuntime = () => walletRuntime
