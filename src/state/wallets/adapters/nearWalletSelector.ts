import {
	WalletCapability,
	WalletDiscoveryKind,
	WalletProtocol,
	WalletTransportKind,
} from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type {
	WalletAdapter,
	WalletCandidate,
	WalletConnection,
	WalletAccount,
} from '$/state/wallets/adapters/types.ts'
import { buildWalletConnection } from '$/state/wallets/walletConnectionState.ts'

export type NearSelectorAccount = {
	accountId: string
	publicKey?: string
}

export type NearSelectorModule = {
	id: string
	type: 'browser' | 'injected' | 'instant-link' | 'hardware' | 'bridge'
	metadata: {
		name: string
		iconUrl: string
		available: boolean
		deprecated: boolean
	}
}

export type NearSelectorState = {
	modules: NearSelectorModule[]
	accounts: (NearSelectorAccount & { active: boolean })[]
	selectedWalletId: string | null
}

export type NearSelectorEvents = {
	signedIn: {
		walletId: string
		accounts: readonly NearSelectorAccount[]
	}
	signedOut: {
		walletId: string
	}
	accountsChanged: {
		walletId: string
		accounts: readonly NearSelectorAccount[]
	}
	networkChanged: {
		walletId: string
		networkId: string
	}
}

export type NearSelectorWallet = {
	signIn(params: {
		contractId?: string
		methodNames?: string[]
	}): Promise<readonly NearSelectorAccount[]>
	signOut(): Promise<void>
	getAccounts(): Promise<readonly NearSelectorAccount[]>
}

export type NearWalletSelectorLike = {
	options: {
		network: {
			networkId: string
		}
	}
	store: {
		getState(): NearSelectorState
	}
	wallet(walletId?: string): Promise<NearSelectorWallet>
	on<EventName extends keyof NearSelectorEvents>(
		eventName: EventName,
		listener: (event: NearSelectorEvents[EventName]) => void
	): { remove(): void }
}

const nearConnectionCapabilities = [
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.Disconnect,
] satisfies WalletCapability[]

const nearAccountCapabilities = [
	WalletCapability.ListAccounts,
	WalletCapability.WatchAccounts,
	WalletCapability.WatchScopes,
] satisfies WalletCapability[]

const nearCandidateCapabilities = [
	WalletCapability.Discover,
	...nearConnectionCapabilities,
	...nearAccountCapabilities,
] satisfies WalletCapability[]

const nearAccountIdPattern = /^(?=.{2,64}$)[a-z0-9]+(?:[-_][a-z0-9]+)*(?:\.[a-z0-9]+(?:[-_][a-z0-9]+)*)*$/
const nearNetworkIdPattern = /^(?=.{1,64}$)[a-z0-9]+(?:[-_.][a-z0-9]+)*$/

const validateNearAccountId = (accountId: string) => {
	if (!nearAccountIdPattern.test(accountId))
		throw new Error(`Invalid NEAR account ID: ${accountId}`)
	return accountId
}

const validateNearNetworkId = (networkId: string) => {
	if (!nearNetworkIdPattern.test(networkId))
		throw new Error(`Invalid NEAR network ID: ${networkId}`)
	return networkId
}

const validateNearAccounts = (
	accounts: readonly NearSelectorAccount[]
) => {
	for (const account of accounts)
		validateNearAccountId(account.accountId)
	return accounts
}

const nearScope = (networkId: string) => ({
	namespace: 'near',
	reference: validateNearNetworkId(networkId),
	methods: ['signIn', 'signOut', 'getAccounts'],
	events: ['signedIn', 'signedOut', 'accountsChanged', 'networkChanged'],
})

const nearAccount = (
	networkId: string,
	accountId: string
): WalletAccount => ({
	namespace: 'near',
	reference: validateNearNetworkId(networkId),
	accountAddress: validateNearAccountId(accountId),
	capabilities: [...nearAccountCapabilities],
})

const nearConnection = (
	walletId: string,
	networkId: string,
	accounts: readonly NearSelectorAccount[],
	selector: NearWalletSelectorLike,
	connectedAt?: number
): WalletConnection => {
	validateNearNetworkId(networkId)
	validateNearAccounts(accounts)
	const state = selector.store.getState()
	let activeAccount: NearSelectorAccount | undefined
	if (state.selectedWalletId === walletId) {
		const activeAccounts = state.accounts.filter((account) => account.active)
		if (activeAccounts.length > 1)
			throw new Error(`Multiple active NEAR accounts for wallet ${walletId}`)
		const activeAccountId = activeAccounts[0]?.accountId
		if (activeAccountId != null) {
			validateNearAccountId(activeAccountId)
			activeAccount = accounts.find((account) => account.accountId === activeAccountId)
			if (activeAccount == null)
				throw new Error(`Active NEAR account is not present in wallet ${walletId}`)
		}
	}
	const projectedAccounts = accounts.map((account) => nearAccount(networkId, account.accountId))

	return buildWalletConnection({
		walletId,
		status: projectedAccounts.length === 0 ?
			BlockheadConnectionStatus.Disconnected
		:
			BlockheadConnectionStatus.Connected,
		protocol: WalletProtocol.NearWalletSelector,
		transportKind: WalletTransportKind.NearSelectorModule,
		scopes: [nearScope(networkId)],
		accounts: projectedAccounts,
		...(activeAccount != null && {
			activeAccount: nearAccount(networkId, activeAccount.accountId),
		}),
		...(projectedAccounts.length > 0 && {
			selected: activeAccount != null,
			connectedAt,
		}),
		...(projectedAccounts.length === 0 && {
			disconnectedAt: Date.now(),
		}),
	})
}

const configuredCandidates = (
	selector: NearWalletSelectorLike
): WalletCandidate[] => selector.store.getState().modules
	.filter((module) => module.metadata.available && !module.metadata.deprecated)
	.filter((module) => module.type !== 'hardware')
	.map((module) => ({
		id: module.id,
		name: module.metadata.name,
		icon: module.metadata.iconUrl,
		protocol: WalletProtocol.NearWalletSelector,
		discoveryKind: WalletDiscoveryKind.Registry,
		transportKind: WalletTransportKind.NearSelectorModule,
		capabilities: [...nearCandidateCapabilities],
	}))

export const createNearWalletSelectorAdapter = (
	selector: NearWalletSelectorLike
): WalletAdapter => {
	validateNearNetworkId(selector.options.network.networkId)
	const accountsByWalletId = new Map<string, readonly NearSelectorAccount[]>()
	const networkByWalletId = new Map<string, string>()
	const updateByWalletId = new Map<string, (connection: WalletConnection) => void>()
	const versionByWalletId = new Map<string, number>()
	const pendingConnectByWalletId = new Map<string, {
		startGeneration: number
		walletVersion: number
		phase: 'wallet-lookup' | 'sign-in'
	}>()
	let updateCandidates: ((candidates: WalletCandidate[]) => void) | undefined
	let activeStop: (() => void) | undefined
	let activeStartGeneration = 0

	const networkId = (walletId: string) => validateNearNetworkId(
		networkByWalletId.get(walletId) ?? selector.options.network.networkId
	)
	const publish = (
		walletId: string,
		startGeneration: number,
		accounts: readonly NearSelectorAccount[],
		walletVersion?: number,
		connectedAt?: number
	) => {
		if (startGeneration !== activeStartGeneration) return
		if (walletVersion != null && versionByWalletId.get(walletId) !== walletVersion) return
		const validatedAccounts = validateNearAccounts(accounts)
		accountsByWalletId.set(walletId, validatedAccounts)
		const update = updateByWalletId.get(walletId)
		if (update != null)
			update(nearConnection(walletId, networkId(walletId), validatedAccounts, selector, connectedAt))
	}
	const nextVersion = (walletId: string) => {
		const version = (versionByWalletId.get(walletId) ?? 0) + 1
		versionByWalletId.set(walletId, version)
		return version
	}
	const clearWalletState = (walletId: string) => {
		accountsByWalletId.delete(walletId)
		networkByWalletId.delete(walletId)
	}
	const stopActive = () => {
		activeStop?.()
		activeStop = undefined
	}

	return {
		id: 'near-wallet-selector',
		start: (nextUpdateCandidates) => {
			stopActive()
			activeStartGeneration += 1
			const startGeneration = activeStartGeneration
			updateCandidates = nextUpdateCandidates
			const candidates = configuredCandidates(selector)
			const configuredWalletIds = new Set(candidates.map((candidate) => candidate.id))
			updateCandidates(candidates)
			const subscriptions = [
				selector.on('signedIn', ({ walletId, accounts }) => {
					if (!configuredWalletIds.has(walletId) || startGeneration !== activeStartGeneration) return
					const pendingConnect = pendingConnectByWalletId.get(walletId)
					if (
						pendingConnect?.startGeneration === startGeneration
						&& pendingConnect.phase === 'sign-in'
					) {
						validateNearAccounts(accounts)
						return
					}
					const walletVersion = nextVersion(walletId)
					publish(walletId, startGeneration, accounts, walletVersion)
				}),
				selector.on('accountsChanged', ({ walletId, accounts }) => {
					if (!configuredWalletIds.has(walletId) || startGeneration !== activeStartGeneration) return
					const walletVersion = nextVersion(walletId)
					publish(walletId, startGeneration, accounts, walletVersion)
				}),
				selector.on('networkChanged', ({ walletId, networkId: nextNetworkId }) => {
					if (!configuredWalletIds.has(walletId) || startGeneration !== activeStartGeneration) return
					networkByWalletId.set(walletId, validateNearNetworkId(nextNetworkId))
					const cachedAccounts = accountsByWalletId.get(walletId)
					if (cachedAccounts != null) {
						const walletVersion = versionByWalletId.get(walletId)
						publish(walletId, startGeneration, cachedAccounts, walletVersion)
					}
				}),
				selector.on('signedOut', ({ walletId }) => {
					if (!configuredWalletIds.has(walletId) || startGeneration !== activeStartGeneration) return
					const walletVersion = nextVersion(walletId)
					publish(walletId, startGeneration, [], walletVersion)
				}),
			]
			const stop = () => {
				if (activeStop !== stop) return
				for (const subscription of subscriptions)
					subscription.remove()
				activeStop = undefined
				updateCandidates = undefined
				accountsByWalletId.clear()
				networkByWalletId.clear()
				updateByWalletId.clear()
				versionByWalletId.clear()
				pendingConnectByWalletId.clear()
				activeStartGeneration += 1
			}
			activeStop = stop
			return stop
		},
		connect: async (walletId) => {
			const startGeneration = activeStartGeneration
			const startVersion = nextVersion(walletId)
			const pendingConnect: {
				startGeneration: number
				walletVersion: number
				phase: 'wallet-lookup' | 'sign-in'
			} = {
				startGeneration,
				walletVersion: startVersion,
				phase: 'wallet-lookup',
			}
			pendingConnectByWalletId.set(walletId, pendingConnect)
			try {
				const wallet = await selector.wallet(walletId)
				if (
					startGeneration !== activeStartGeneration
					|| versionByWalletId.get(walletId) !== startVersion
					|| pendingConnectByWalletId.get(walletId) !== pendingConnect
				)
					return undefined
				pendingConnect.phase = 'sign-in'
				const accounts = await wallet.signIn({})
				validateNearAccounts(accounts)
				if (
					startGeneration !== activeStartGeneration
					|| versionByWalletId.get(walletId) !== startVersion
					|| pendingConnectByWalletId.get(walletId) !== pendingConnect
				)
					return undefined
				const connectedAt = Date.now()
				accountsByWalletId.set(walletId, accounts)
				const update = updateByWalletId.get(walletId)
				const connection = nearConnection(walletId, networkId(walletId), accounts, selector, connectedAt)
				update?.(connection)
				return connection
			} finally {
				if (pendingConnectByWalletId.get(walletId) === pendingConnect)
					pendingConnectByWalletId.delete(walletId)
			}
		},
		disconnect: async (walletId) => {
			const startGeneration = activeStartGeneration
			const disconnectVersion = nextVersion(walletId)
			clearWalletState(walletId)
			const wallet = await selector.wallet(walletId)
			if (
				startGeneration !== activeStartGeneration
				|| versionByWalletId.get(walletId) !== disconnectVersion
			)
				return
			await wallet.signOut()
			if (
				startGeneration !== activeStartGeneration
				|| versionByWalletId.get(walletId) !== disconnectVersion
			)
				return
			clearWalletState(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			if (activeStop == null) return () => {}
			const startGeneration = activeStartGeneration
			updateByWalletId.set(walletId, updateConnection)
			const walletVersion = nextVersion(walletId)
			const cachedAccounts = accountsByWalletId.get(walletId)
			if (cachedAccounts != null) {
				publish(walletId, startGeneration, cachedAccounts, walletVersion)
			} else {
				void selector.wallet(walletId).then((wallet) => wallet.getAccounts()).then((accounts) => {
					if (
						startGeneration === activeStartGeneration
						&& versionByWalletId.get(walletId) === walletVersion
						&& updateByWalletId.get(walletId) === updateConnection
					)
						publish(walletId, startGeneration, accounts, walletVersion)
				}).catch(() => {})
			}

			return () => {
				if (updateByWalletId.get(walletId) !== updateConnection) return
				updateByWalletId.delete(walletId)
				nextVersion(walletId)
			}
		},
	}
}
