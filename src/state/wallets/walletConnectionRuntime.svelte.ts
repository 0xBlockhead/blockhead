import { WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import {
	deleteLocalBlockheadWalletConnection,
	type LocalMutationContext,
	writeLocalBlockheadWallet,
	writeLocalBlockheadWalletConnection,
} from '$/collections/localMutations.ts'
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
	disconnect(walletId: string): void
	destroy(): void
}

const createWalletRuntimeState = (
	context: LocalMutationContext
): WalletRuntime => {
	const cleanupByWalletId = new SvelteMap<string, () => void>()
	const adapterByWalletId = new SvelteMap<string, WalletAdapter>()
	const adapterCleanups: (() => void)[] = []
	const candidatesByAdapterId = new SvelteMap<string, WalletCandidate[]>()

	let candidates = $state<WalletCandidate[]>([])
	let connections = $state<WalletConnection[]>([])

	const upsertConnection = (connection: WalletConnection) => {
		connections = [
			...connections.filter((candidate) => candidate.walletId !== connection.walletId),
			connection,
		]
		writeLocalBlockheadWalletConnection(context, connection)
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

	const connect = async (walletId: string) => {
		const adapter = adapterByWalletId.get(walletId)
		if (adapter == null) return

		upsertConnection({
			walletId,
			status: BlockheadConnectionStatus.Connecting,
			protocol: candidates.find((candidate) => candidate.id === walletId)?.protocol ?? WalletProtocol.Eip6963,
			transportKind: candidates.find((candidate) => candidate.id === walletId)?.transportKind ?? WalletTransportKind.InjectedProvider,
			scopes: [],
			accounts: [],
			selected: false,
			connectedAt: Date.now(),
		})

		try {
			const connection = await adapter.connect(walletId)
			if (connection == null) return

			upsertConnection(connection)
			cleanupByWalletId.get(walletId)?.()
			cleanupByWalletId.set(walletId, adapter.subscribeConnection(walletId, upsertConnection))
		}
		catch (error) {
			upsertConnection({
				walletId,
				status: BlockheadConnectionStatus.Error,
				protocol: candidates.find((candidate) => candidate.id === walletId)?.protocol ?? WalletProtocol.Eip6963,
				transportKind: candidates.find((candidate) => candidate.id === walletId)?.transportKind ?? WalletTransportKind.InjectedProvider,
				scopes: [],
				accounts: [],
				selected: false,
				connectedAt: Date.now(),
				error: error instanceof Error ?
					error.message
				:
					String(error),
			})
		}
	}

	const disconnect = (walletId: string) => {
		cleanupByWalletId.get(walletId)?.()
		cleanupByWalletId.delete(walletId)
		adapterByWalletId.get(walletId)?.disconnect(walletId)
		connections = connections.filter((connection) => connection.walletId !== walletId)
		deleteLocalBlockheadWalletConnection(context, walletId)
	}

	return {
		get candidates() {
			return candidates
		},
		get connections() {
			return connections
		},
		connect,
		disconnect,
		destroy: () => {
			for (const cleanup of adapterCleanups)
				cleanup()

			for (const cleanup of cleanupByWalletId.values())
				cleanup()

			cleanupByWalletId.clear()
			adapterByWalletId.clear()
			candidatesByAdapterId.clear()
		},
	}
}

let walletRuntime = $state<WalletRuntime | null>(null)

export const mountWalletConnectionRuntime = (
	context: LocalMutationContext
) => {
	if (walletRuntime != null) return walletRuntime

	walletRuntime = createWalletRuntimeState(context)

	return walletRuntime
}

export const getWalletConnectionRuntime = () => walletRuntime
