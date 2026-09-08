import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter, WalletCandidate, WalletConnection } from './types.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

type AptosInjectedAccount = {
	address: string
	publicKey: string
}

type AptosInjectedNetwork = {
	name: string
	chainId: string | number
}

type AptosInjectedWallet = {
	connect(): Promise<AptosInjectedAccount>
	disconnect(): Promise<void>
	account: AptosInjectedAccount | null
	getNetwork(): Promise<AptosInjectedNetwork>
	onAccountChange(
		listener: (account: AptosInjectedAccount | null) => void
	): void | (() => void)
	onNetworkChange(
		listener: (network: AptosInjectedNetwork) => void
	): void | (() => void)
}

type AptosConnectionState = {
	account: AptosInjectedAccount | null
	network: AptosInjectedNetwork
	connectedAt: number
}

declare global {
	interface Window {
		aptos?: AptosInjectedWallet
		martian?: AptosInjectedWallet
		pontem?: AptosInjectedWallet
	}
}

const aptosConnectionCapabilities = [
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.Disconnect,
	WalletCapability.ListAccounts,
	WalletCapability.WatchAccounts,
	WalletCapability.WatchScopes,
] satisfies WalletCapability[]

const normalizeAptosAccount = (
	account: AptosInjectedAccount | null
) => {
	if (account == null) return null

	if (!/^0x[0-9a-fA-F]{1,64}$/.test(account.address))
		throw new Error('Aptos wallet did not expose a valid account address')

	return {
		...account,
		address: `0x${account.address.slice(2).toLowerCase().padStart(64, '0')}`,
	}
}

const aptosReferenceFromNetwork = (
	network: AptosInjectedNetwork
) => {
	const reference = String(network.chainId)
	if (
		!/^[1-9][0-9]*$/.test(reference)
		|| Number(reference) > 0xff
	)
		throw new Error('Aptos wallet did not expose a canonical chain ID')

	return reference
}

const aptosConnectionFromState = (
	walletId: string,
	state: AptosConnectionState
): WalletConnection => {
	const reference = aptosReferenceFromNetwork(state.network)
	const connected = state.account != null

	return buildWalletConnection({
		walletId,
		status: (
			connected ?
				BlockheadConnectionStatus.Connected
			:
				BlockheadConnectionStatus.Disconnected
		),
		protocol: WalletProtocol.AptosInjected,
		transportKind: WalletTransportKind.InjectedSigner,
		scopes: [
			{
				namespace: 'aptos',
				reference,
				methods: [
					'connect',
					'disconnect',
					'getNetwork',
				],
				events: [
					'accountChange',
					'networkChange',
				],
			},
		],
		accounts: state.account == null ?
			[]
		:
			[
				{
					namespace: 'aptos',
					reference,
					accountAddress: state.account.address,
					capabilities: aptosConnectionCapabilities,
				},
			],
		selected: connected,
		connectedAt: state.connectedAt,
	})
}

const aptosErrorConnection = (
	walletId: string,
	connectedAt: number,
	error: string
): WalletConnection => (
	buildWalletConnection({
		walletId,
		status: BlockheadConnectionStatus.Error,
		protocol: WalletProtocol.AptosInjected,
		transportKind: WalletTransportKind.InjectedSigner,
		scopes: [],
		accounts: [],
		error,
	})
)

export const createAptosInjectedAdapter = (): WalletAdapter => {
	const walletByWalletId = new SvelteMap<string, AptosInjectedWallet>()
	const stateByWalletId = new SvelteMap<string, AptosConnectionState>()
	const updateConnectionByWalletId = new SvelteMap<string, (connection: WalletConnection) => void>()
	const eventCleanupByWalletId = new SvelteMap<string, () => void>()
	const updateVersionByWalletId = new SvelteMap<string, number>()
	const providerEpochByWalletId = new SvelteMap<string, number>()
	const lifecycleEpochByWalletId = new SvelteMap<string, number>()
	const subscriptionEpochByWalletId = new SvelteMap<string, number>()
	let nextStartEpoch = 0
	let activeStartEpoch = 0
	let activeStop: (() => void) | undefined

	const nextEpoch = (epochs: SvelteMap<string, number>, walletId: string) => {
		const epoch = (epochs.get(walletId) ?? 0) + 1
		epochs.set(walletId, epoch)
		return epoch
	}

	const isCurrent = (
		walletId: string,
		wallet: AptosInjectedWallet,
		startEpoch: number,
		providerEpoch: number,
		lifecycleEpoch?: number,
		subscriptionEpoch?: number
	) => (
		activeStartEpoch === startEpoch
		&& walletByWalletId.get(walletId) === wallet
		&& providerEpochByWalletId.get(walletId) === providerEpoch
		&& (lifecycleEpoch === undefined || lifecycleEpochByWalletId.get(walletId) === lifecycleEpoch)
		&& (subscriptionEpoch === undefined || subscriptionEpochByWalletId.get(walletId) === subscriptionEpoch)
	)

	const invalidateWallet = (walletId: string, wallet: AptosInjectedWallet) => {
		if (walletByWalletId.get(walletId) !== wallet)
			return

		nextEpoch(providerEpochByWalletId, walletId)
		nextEpoch(lifecycleEpochByWalletId, walletId)
		nextEpoch(subscriptionEpochByWalletId, walletId)
		eventCleanupByWalletId.get(walletId)?.()
		eventCleanupByWalletId.delete(walletId)
		stateByWalletId.delete(walletId)
		updateVersionByWalletId.set(
			walletId,
			(updateVersionByWalletId.get(walletId) ?? 0) + 1
		)
	}

	const updateState = (
		walletId: string,
		state: AptosConnectionState
	) => {
		try {
			const normalizedState = {
				...state,
				account: normalizeAptosAccount(state.account),
			}
			const connection = aptosConnectionFromState(walletId, normalizedState)
			stateByWalletId.set(walletId, normalizedState)
			updateConnectionByWalletId.get(walletId)?.(connection)
		}
		catch (error) {
			stateByWalletId.delete(walletId)
			updateConnectionByWalletId.get(walletId)?.(aptosErrorConnection(
				walletId,
				state.connectedAt,
				String(error)
			))
		}
	}

	const readState = async (
		wallet: AptosInjectedWallet,
	account: AptosInjectedAccount | null,
	connectedAt: number
): Promise<AptosConnectionState> => ({
		account: normalizeAptosAccount(account),
		network: await wallet.getNetwork(),
		connectedAt,
	})

	return {
		id: 'aptos-injected',
		start: (updateCandidates) => {
			activeStop?.()
			const startEpoch = ++nextStartEpoch
			activeStartEpoch = startEpoch
			let previousWallets = new Map<string, AptosInjectedWallet>()
			const discover = () => {
				if (activeStartEpoch !== startEpoch)
					return

				const wallets: {
					id: string
					name: string
					wallet: AptosInjectedWallet
				}[] = typeof window === 'undefined' ?
					[]
				:
					[
						...(window.aptos == null ?
							[]
						:
							[{
								id: 'aptos:petra',
								name: 'Petra',
								wallet: window.aptos,
							}]),
						...(window.martian == null ?
							[]
						:
							[{
								id: 'aptos:martian',
								name: 'Martian',
								wallet: window.martian,
							}]),
						...(window.pontem == null ?
							[]
						:
							[{
								id: 'aptos:pontem',
								name: 'Pontem',
								wallet: window.pontem,
							}]),
					]
				const nextWallets = new Map(wallets.map(({ id, wallet }) => [id, wallet]))
				const changed = (
					previousWallets.size !== nextWallets.size
					|| [...nextWallets].some(([walletId, wallet]) => previousWallets.get(walletId) !== wallet)
				)
				for (const [walletId, wallet] of walletByWalletId)
					if (nextWallets.get(walletId) !== wallet)
						invalidateWallet(walletId, wallet)

				walletByWalletId.clear()
				for (const [walletId, wallet] of nextWallets) {
					walletByWalletId.set(walletId, wallet)
					if (!providerEpochByWalletId.has(walletId))
						nextEpoch(providerEpochByWalletId, walletId)
				}
				previousWallets = nextWallets

				if (!changed)
					return

				updateCandidates(wallets.map(({ id, name }): WalletCandidate => ({
					id,
					name,
					icon: '',
					protocol: WalletProtocol.AptosInjected,
					discoveryKind: WalletDiscoveryKind.InjectedGlobal,
					transportKind: WalletTransportKind.InjectedSigner,
					capabilities: [
						WalletCapability.Discover,
						...aptosConnectionCapabilities,
					],
				})))
			}

			discover()
			const discoveryInterval = typeof window === 'undefined' ?
				undefined
			:
				globalThis.setInterval(discover, 100)

			const stop = () => {
				if (activeStop !== stop)
					return

				activeStop = undefined
				activeStartEpoch = 0
				if (discoveryInterval !== undefined)
					globalThis.clearInterval(discoveryInterval)
				for (const [walletId, wallet] of walletByWalletId)
					invalidateWallet(walletId, wallet)

				stateByWalletId.clear()
				updateConnectionByWalletId.clear()
				updateVersionByWalletId.clear()
				providerEpochByWalletId.clear()
				lifecycleEpochByWalletId.clear()
				subscriptionEpochByWalletId.clear()
				walletByWalletId.clear()
			}
			activeStop = stop
			return stop
		},
		connect: async (walletId) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null)
				return undefined

			const startEpoch = activeStartEpoch
			const providerEpoch = providerEpochByWalletId.get(walletId) ?? nextEpoch(providerEpochByWalletId, walletId)
			if (startEpoch === 0)
				return undefined

			const lifecycleEpoch = nextEpoch(lifecycleEpochByWalletId, walletId)

			const account = await wallet.connect()
			if (!isCurrent(walletId, wallet, startEpoch, providerEpoch, lifecycleEpoch))
				throw new Error('Aptos injected wallet changed during connection')
			const state = await readState(wallet, account, Date.now())
			if (!isCurrent(walletId, wallet, startEpoch, providerEpoch, lifecycleEpoch))
				throw new Error('Aptos injected wallet changed during network acquisition')
			const connection = aptosConnectionFromState(walletId, state)
			stateByWalletId.set(walletId, state)

			return connection
		},
		disconnect: async (walletId) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null)
				return

			const startEpoch = activeStartEpoch
			const providerEpoch = providerEpochByWalletId.get(walletId)
			if (startEpoch === 0 || providerEpoch === undefined)
				return

			const lifecycleEpoch = nextEpoch(lifecycleEpochByWalletId, walletId)
			eventCleanupByWalletId.get(walletId)?.()
			eventCleanupByWalletId.delete(walletId)
			updateVersionByWalletId.set(
				walletId,
				(updateVersionByWalletId.get(walletId) ?? 0) + 1
			)
			await wallet.disconnect()
			if (!isCurrent(walletId, wallet, startEpoch, providerEpoch, lifecycleEpoch))
				return

			stateByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null)
				return () => {}


			updateConnectionByWalletId.set(walletId, updateConnection)
			const startEpoch = activeStartEpoch
			const providerEpoch = providerEpochByWalletId.get(walletId)
			if (startEpoch === 0 || providerEpoch === undefined)
				return () => {}

			const lifecycleEpoch = lifecycleEpochByWalletId.get(walletId) ?? nextEpoch(lifecycleEpochByWalletId, walletId)
			const subscriptionEpoch = nextEpoch(subscriptionEpochByWalletId, walletId)
			eventCleanupByWalletId.get(walletId)?.()
			eventCleanupByWalletId.delete(walletId)
			const accountChangeCleanup = wallet.onAccountChange((account) => {
				const connectedAt = stateByWalletId.get(walletId)?.connectedAt ?? Date.now()
				const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
				updateVersionByWalletId.set(walletId, updateVersion)
				void readState(wallet, account, connectedAt)
					.then((state) => {
						if (
							updateVersionByWalletId.get(walletId) === updateVersion
							&& isCurrent(walletId, wallet, startEpoch, providerEpoch, lifecycleEpoch, subscriptionEpoch)
						)
							updateState(walletId, state)
					})
					.catch((error) => {
						if (
							updateVersionByWalletId.get(walletId) === updateVersion
							&& isCurrent(walletId, wallet, startEpoch, providerEpoch, lifecycleEpoch, subscriptionEpoch)
						)
							updateConnectionByWalletId.get(walletId)?.(aptosErrorConnection(
								walletId,
								connectedAt,
								String(error)
							))
					})
			})
			const networkChangeCleanup = wallet.onNetworkChange((network) => {
				if (!isCurrent(walletId, wallet, startEpoch, providerEpoch, lifecycleEpoch, subscriptionEpoch))
					return

				updateVersionByWalletId.set(
					walletId,
					(updateVersionByWalletId.get(walletId) ?? 0) + 1
				)
				updateState(walletId, {
					account: stateByWalletId.get(walletId)?.account ?? wallet.account,
					network,
					connectedAt: stateByWalletId.get(walletId)?.connectedAt ?? Date.now(),
				})
			})
			eventCleanupByWalletId.set(walletId, () => {
				accountChangeCleanup?.()
				networkChangeCleanup?.()
			})

			if (!stateByWalletId.has(walletId)) {
				const connectedAt = Date.now()
				const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
				updateVersionByWalletId.set(walletId, updateVersion)
				void readState(wallet, wallet.account, connectedAt)
					.then((state) => {
						if (
							updateVersionByWalletId.get(walletId) === updateVersion
							&& isCurrent(walletId, wallet, startEpoch, providerEpoch, lifecycleEpoch, subscriptionEpoch)
						)
							updateState(walletId, state)
					})
					.catch((error) => {
						if (
							updateVersionByWalletId.get(walletId) === updateVersion
							&& isCurrent(walletId, wallet, startEpoch, providerEpoch, lifecycleEpoch, subscriptionEpoch)
						)
							updateConnectionByWalletId.get(walletId)?.(aptosErrorConnection(
								walletId,
								connectedAt,
								String(error)
							))
					})
			}

			return () => {
				if (updateConnectionByWalletId.get(walletId) === updateConnection) {
					updateConnectionByWalletId.delete(walletId)
					updateVersionByWalletId.set(
						walletId,
						(updateVersionByWalletId.get(walletId) ?? 0) + 1
					)
					eventCleanupByWalletId.get(walletId)?.()
					eventCleanupByWalletId.delete(walletId)
					if (subscriptionEpochByWalletId.get(walletId) === subscriptionEpoch)
						nextEpoch(subscriptionEpochByWalletId, walletId)
				}
			}
		},
	}
}
