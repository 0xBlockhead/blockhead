import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter, WalletCandidate, WalletConnection } from './types.ts'

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

	return {
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
	}
}

const aptosErrorConnection = (
	walletId: string,
	connectedAt: number,
	error: string
): WalletConnection => ({
	walletId,
	status: BlockheadConnectionStatus.Error,
	protocol: WalletProtocol.AptosInjected,
	transportKind: WalletTransportKind.InjectedSigner,
	scopes: [],
	accounts: [],
	selected: false,
	connectedAt,
	error,
})

export const createAptosInjectedAdapter = (): WalletAdapter => {
	const walletByWalletId = new SvelteMap<string, AptosInjectedWallet>()
	const stateByWalletId = new SvelteMap<string, AptosConnectionState>()
	const updateConnectionByWalletId = new SvelteMap<string, (connection: WalletConnection) => void>()
	const eventCleanupByWalletId = new SvelteMap<string, () => void>()
	const updateVersionByWalletId = new SvelteMap<string, number>()

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

			for (const { id, wallet } of wallets)
				walletByWalletId.set(id, wallet)

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

			return () => {
				for (const cleanup of eventCleanupByWalletId.values())
					cleanup()

				eventCleanupByWalletId.clear()
				stateByWalletId.clear()
				updateConnectionByWalletId.clear()
				updateVersionByWalletId.clear()
				walletByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return undefined

			const state = await readState(
				wallet,
				await wallet.connect(),
				Date.now()
			)
			const connection = aptosConnectionFromState(walletId, state)
			stateByWalletId.set(walletId, state)

			return connection
		},
		disconnect: async (walletId) => {
			await walletByWalletId.get(walletId)?.disconnect()
			stateByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return () => {}

			updateConnectionByWalletId.set(walletId, updateConnection)
			if (!eventCleanupByWalletId.has(walletId)) {
				const accountChangeCleanup = wallet.onAccountChange((account) => {
					const connectedAt = stateByWalletId.get(walletId)?.connectedAt ?? Date.now()
					const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
					updateVersionByWalletId.set(walletId, updateVersion)
					void readState(wallet, account, connectedAt)
						.then((state) => {
							if (updateVersionByWalletId.get(walletId) === updateVersion)
								updateState(walletId, state)
						})
						.catch((error) => updateConnectionByWalletId.get(walletId)?.(aptosErrorConnection(
							walletId,
							connectedAt,
							String(error)
						)))
				})
				const networkChangeCleanup = wallet.onNetworkChange((network) => {
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
			}

			if (!stateByWalletId.has(walletId)) {
				const connectedAt = Date.now()
				const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
				updateVersionByWalletId.set(walletId, updateVersion)
				void readState(wallet, wallet.account, connectedAt)
					.then((state) => {
						if (updateVersionByWalletId.get(walletId) === updateVersion)
							updateState(walletId, state)
					})
					.catch((error) => updateConnectionByWalletId.get(walletId)?.(aptosErrorConnection(
						walletId,
						connectedAt,
						String(error)
					)))
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
				}
			}
		},
	}
}
