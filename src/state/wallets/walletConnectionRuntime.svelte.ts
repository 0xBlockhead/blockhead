import {
	entityCollectionByEntityType,
	entityFieldCollections,
} from '$/collections/entityCollections.ts'
import { WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { Source } from '$/sources/Source.ts'
import { stringify } from 'devalue'
import { SvelteMap } from 'svelte/reactivity'
import { createAptosAip62Adapter } from './adapters/aptosAip62.ts'
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

const writeGlobalWalletReference = (
	entityId: { id: string },
) => {
	entityFieldCollections[EntityType._Global].$$blockheadWallets.utils.writeUpsert({
		[EntityMetaKey.ParentId]: { scope: '$$blockheadWallets' },
		[EntityMetaKey.ParentIdKey]: stringify({ scope: '$$blockheadWallets' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		},
	})
}

const writeGlobalWalletConnectionReference = (
	entityId: { $wallet: { id: string } },
) => {
	entityFieldCollections[EntityType._Global].$$blockheadWalletConnections.utils.writeUpsert({
		[EntityMetaKey.ParentId]: { scope: '$$blockheadWalletConnections' },
		[EntityMetaKey.ParentIdKey]: stringify({ scope: '$$blockheadWalletConnections' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		},
	})
}

const writeGlobalWalletAccountReference = (
	entityId: { caip10: { namespace: string, reference: string, accountAddress: string } },
) => {
	entityFieldCollections[EntityType._Global].$$blockheadWalletAccounts.utils.writeUpsert({
		[EntityMetaKey.ParentId]: { scope: '$$blockheadWalletAccounts' },
		[EntityMetaKey.ParentIdKey]: stringify({ scope: '$$blockheadWalletAccounts' }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Value]: {
			[EntityMetaKey.Id]: entityId,
			[EntityMetaKey.IdKey]: stringify(entityId),
		},
	})
}


const writeCandidate = (
	candidate: WalletCandidate,
) => {
	entityCollectionByEntityType[EntityType.BlockheadWallet].utils.writeUpsert({
		[EntityMetaKey.Id]: { id: candidate.id },
		[EntityMetaKey.IdKey]: stringify({ id: candidate.id }),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: {
			name: candidate.name,
			icon: candidate.icon,
			protocol: candidate.protocol,
			discoveryKind: candidate.discoveryKind,
			transportKind: candidate.transportKind,
			...(candidate.rdns != null && { rdns: candidate.rdns }),
			capabilities: candidate.capabilities,
		},
		name: candidate.name,
		icon: candidate.icon,
		protocol: candidate.protocol,
		discoveryKind: candidate.discoveryKind,
		transportKind: candidate.transportKind,
		...(candidate.rdns != null && { rdns: candidate.rdns }),
		capabilities: candidate.capabilities,
	})
	writeGlobalWalletReference({ id: candidate.id })
}

const writeAccount = (
	account: WalletAccount,
) => {
	const entityId = {
		caip10: {
			namespace: account.namespace,
			reference: account.reference,
			accountAddress: account.accountAddress,
		},
	}
	const fields = {
		$network: {
			[EntityMetaKey.Id]: {
				caip2: {
					namespace: account.namespace,
					reference: account.reference,
				},
			},
		},
		address: account.accountAddress,
		capabilities: account.capabilities,
	}

	entityCollectionByEntityType[EntityType.BlockheadWalletAccount].utils.writeUpsert({
		[EntityMetaKey.Id]: entityId,
		[EntityMetaKey.IdKey]: stringify(entityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	writeGlobalWalletAccountReference(entityId)
}

const writeConnection = (
	connection: WalletConnection,
) => {
	const activeAccount = connection.accounts.at(0)
	const entityId = {
		$wallet: {
			id: connection.walletId,
		},
	}
	const fields = {
		status: connection.status,
		protocol: connection.protocol,
		transportKind: connection.transportKind,
		scopes: connection.scopes,
		$$connectedAccounts: connection.accounts.map((account) => ({
			[EntityMetaKey.Id]: {
				caip10: {
					namespace: account.namespace,
					reference: account.reference,
					accountAddress: account.accountAddress,
				},
			},
		})),
		...(activeAccount != null && {
			$activeAccount: {
				[EntityMetaKey.Id]: {
					caip10: {
						namespace: activeAccount.namespace,
						reference: activeAccount.reference,
						accountAddress: activeAccount.accountAddress,
					},
				},
			},
		}),
		selected: connection.selected,
		connectedAt: connection.connectedAt,
		...(connection.error != null && { error: connection.error }),
	}

	for (const account of connection.accounts)
		writeAccount(account)

	entityCollectionByEntityType[EntityType.BlockheadWalletConnection].utils.writeUpsert({
		[EntityMetaKey.Id]: entityId,
		[EntityMetaKey.IdKey]: stringify(entityId),
		[EntityMetaKey.Source]: Source.Local_Internal,
		[EntityMetaKey.Fields]: fields,
		...fields,
	})
	writeGlobalWalletConnectionReference(entityId)
}

const createWalletRuntimeState = (): WalletRuntime => {
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
		writeConnection(connection)
	}

	const adapters = [
		createEip6963Adapter(),
		createWalletStandardAdapter(),
		createAptosAip62Adapter(),
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
				writeCandidate(candidate)
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
		entityCollectionByEntityType[EntityType.BlockheadWalletConnection].delete([
			Source.Local_Internal,
			stringify({
				$wallet: {
					id: walletId,
				},
			}),
		].join('\x1E'))
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

export const mountWalletConnectionRuntime = () => {
	if (walletRuntime != null) return walletRuntime

	walletRuntime = createWalletRuntimeState()

	return walletRuntime
}

export const getWalletConnectionRuntime = () => walletRuntime
