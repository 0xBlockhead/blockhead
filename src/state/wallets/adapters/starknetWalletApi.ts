import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter, WalletCandidate, WalletConnection } from './types.ts'

type StarknetRequest =
	| {
		type: 'wallet_requestAccounts'
		params: {
			silent_mode: boolean
		}
	}
	| {
		type: 'wallet_requestChainId'
	}

type StarknetWindowObject = {
	id?: string
	name?: string
	icon?: string
	request(call: Extract<StarknetRequest, { type: 'wallet_requestAccounts' }>): Promise<string[]>
	request(call: Extract<StarknetRequest, { type: 'wallet_requestChainId' }>): Promise<string>
	on(event: 'accountsChanged', listener: (accounts?: string[]) => void): void
	on(event: 'networkChanged', listener: (chainId?: string, accounts?: string[]) => void): void
	off(event: 'accountsChanged', listener: (accounts?: string[]) => void): void
	off(event: 'networkChanged', listener: (chainId?: string, accounts?: string[]) => void): void
}

type StarknetConnectionState = {
	accounts: string[]
	reference: string
	connectedAt: number
}

declare global {
	interface Window {
		starknet?: StarknetWindowObject
		starknet_argentX?: StarknetWindowObject
		starknet_braavos?: StarknetWindowObject
	}
}

const starknetConnectionCapabilities = [
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.ListAccounts,
	WalletCapability.WatchAccounts,
	WalletCapability.WatchScopes,
] satisfies WalletCapability[]

const starknetPrime = 0x800000000000011000000000000000000000000000000000000000000000001n

const starknetAccounts = (accounts: string[]) => {
	const normalizedAccounts = accounts.map((account) => {
		if (!/^0x[0-9a-fA-F]{1,64}$/.test(account))
			throw new Error('Starknet wallet returned an invalid account address')

		const fieldElement = BigInt(account)
		if (fieldElement >= starknetPrime)
			throw new Error('Starknet wallet returned an invalid account address')

		return `0x${fieldElement.toString(16).padStart(64, '0')}`
	})

	return [...new Set(normalizedAccounts)]
}

const starknetReference = (chainId: string) => {
	if (!/^0x(?:[0-9a-fA-F]{2})+$/.test(chainId))
		throw new Error('Starknet wallet did not expose a canonical chain ID')

	const reference = chainId
		.slice(2)
		.match(/.{2}/g)
		?.map((byte) => String.fromCharCode(Number.parseInt(byte, 16)))
		.join('')

	if (reference == null || !/^[-_a-zA-Z0-9]{1,32}$/.test(reference))
		throw new Error('Starknet wallet did not expose a canonical chain ID')

	return reference
}

const starknetConnection = (
	walletId: string,
	state: StarknetConnectionState,
	status = state.accounts.length > 0 ?
		BlockheadConnectionStatus.Connected
	:
		BlockheadConnectionStatus.Disconnected
): WalletConnection => ({
	walletId,
	status,
	protocol: WalletProtocol.StarknetWalletApi,
	transportKind: WalletTransportKind.InjectedProvider,
	scopes: [
		{
			namespace: 'starknet',
			reference: state.reference,
			methods: [
				'wallet_requestAccounts',
				'wallet_requestChainId',
			],
			events: [
				'accountsChanged',
				'networkChanged',
			],
		},
	],
	accounts: state.accounts.map((accountAddress) => ({
		namespace: 'starknet',
		reference: state.reference,
		accountAddress,
		capabilities: starknetConnectionCapabilities,
	})),
	activeAccount: state.accounts.at(0) == null ?
		undefined
	:
		{
			namespace: 'starknet',
			reference: state.reference,
			accountAddress: state.accounts[0],
			capabilities: starknetConnectionCapabilities,
		},
	selected: status === BlockheadConnectionStatus.Connected && state.accounts.length > 0,
	connectedAt: state.connectedAt,
	...(status === BlockheadConnectionStatus.Disconnected && { disconnectedAt: Date.now() }),
})

const readStarknetState = async (
	wallet: StarknetWindowObject,
	silentMode: boolean,
	connectedAt: number
): Promise<StarknetConnectionState> => {
	const accounts = await wallet.request({
		type: 'wallet_requestAccounts',
		params: {
			silent_mode: silentMode,
		},
	})
	const chainId = await wallet.request({ type: 'wallet_requestChainId' })

	return {
		accounts: starknetAccounts(accounts),
		reference: starknetReference(chainId),
		connectedAt,
	}
}

export const createStarknetWalletApiAdapter = (): WalletAdapter => {
	const walletByWalletId = new SvelteMap<string, StarknetWindowObject>()
	const stateByWalletId = new SvelteMap<string, StarknetConnectionState>()
	const cleanupByWalletId = new SvelteMap<string, () => void>()
	const updateConnectionByWalletId = new SvelteMap<string, (connection: WalletConnection) => void>()
	const updateVersionByWalletId = new SvelteMap<string, number>()

	const emit = (
		walletId: string,
		state: StarknetConnectionState
	) => {
		stateByWalletId.set(walletId, state)
		updateConnectionByWalletId.get(walletId)?.(starknetConnection(walletId, state))
	}

	return {
		id: 'starknet-wallet-api',
		start: (updateCandidates) => {
			const wallets: {
				id: string
				name: string
				wallet: StarknetWindowObject
			}[] = typeof window === 'undefined' ?
				[]
			:
				[
					...(window.starknet == null ? [] : [{ id: 'starknet:injected', name: 'Starknet injected wallet', wallet: window.starknet }]),
					...(window.starknet_argentX == null ? [] : [{ id: 'starknet:argentx', name: 'Argent X', wallet: window.starknet_argentX }]),
					...(window.starknet_braavos == null ? [] : [{ id: 'starknet:braavos', name: 'Braavos', wallet: window.starknet_braavos }]),
				]

			for (const { id, wallet } of wallets)
				walletByWalletId.set(id, wallet)

			updateCandidates(wallets.map(({ id, name, wallet }): WalletCandidate => ({
				id,
				name: wallet.name ?? name,
				icon: wallet.icon ?? '',
				protocol: WalletProtocol.StarknetWalletApi,
				discoveryKind: WalletDiscoveryKind.InjectedGlobal,
				transportKind: WalletTransportKind.InjectedProvider,
				capabilities: [
					WalletCapability.Discover,
					...starknetConnectionCapabilities,
				],
			})))

			return () => {
				for (const cleanup of cleanupByWalletId.values())
					cleanup()

				cleanupByWalletId.clear()
				stateByWalletId.clear()
				updateConnectionByWalletId.clear()
				updateVersionByWalletId.clear()
				walletByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return undefined

			const state = await readStarknetState(wallet, false, Date.now())
			stateByWalletId.set(walletId, state)

			return starknetConnection(walletId, state)
		},
		disconnect: (walletId) => {
			stateByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const wallet = walletByWalletId.get(walletId)
			if (wallet == null) return () => {}

			updateConnectionByWalletId.set(walletId, updateConnection)
			if (!cleanupByWalletId.has(walletId)) {
				const accountsChanged = (accounts: string[] = []) => {
					let normalizedAccounts: string[]
					try {
						normalizedAccounts = starknetAccounts(accounts)
					} catch {
						return
					}

					const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
					updateVersionByWalletId.set(walletId, updateVersion)
					const state = stateByWalletId.get(walletId)
					if (state != null) {
						emit(walletId, {
							...state,
							accounts: normalizedAccounts,
						})
						return
					}

					void wallet.request({
						type: 'wallet_requestChainId',
					}).then((chainId) => {
						if (
							updateVersionByWalletId.get(walletId) === updateVersion
							&& updateConnectionByWalletId.get(walletId) === updateConnection
						)
							emit(walletId, {
								accounts: normalizedAccounts,
								reference: starknetReference(chainId),
								connectedAt: Date.now(),
							})
					}).catch(() => {})
				}
				const networkChanged = (chainId?: string, accounts?: string[]) => {
					if (chainId == null) return

					let normalizedAccounts: string[]
					try {
						normalizedAccounts = starknetAccounts(
							accounts ?? stateByWalletId.get(walletId)?.accounts ?? []
						)
					} catch {
						return
					}

					updateVersionByWalletId.set(
						walletId,
						(updateVersionByWalletId.get(walletId) ?? 0) + 1
					)
					emit(walletId, {
						accounts: normalizedAccounts,
						reference: starknetReference(chainId),
						connectedAt: stateByWalletId.get(walletId)?.connectedAt ?? Date.now(),
					})
				}
				wallet.on('accountsChanged', accountsChanged)
				wallet.on('networkChanged', networkChanged)
				cleanupByWalletId.set(walletId, () => {
					wallet.off('accountsChanged', accountsChanged)
					wallet.off('networkChanged', networkChanged)
				})
			}

			if (!stateByWalletId.has(walletId)) {
				const connectedAt = Date.now()
				const updateVersion = (updateVersionByWalletId.get(walletId) ?? 0) + 1
				updateVersionByWalletId.set(walletId, updateVersion)
				void readStarknetState(wallet, true, connectedAt)
					.then((state) => {
						if (
							updateVersionByWalletId.get(walletId) === updateVersion
							&& updateConnectionByWalletId.get(walletId) === updateConnection
						)
							emit(walletId, state)
					})
					.catch(() => {})
			}

			return () => {
				if (updateConnectionByWalletId.get(walletId) === updateConnection) {
					updateConnectionByWalletId.delete(walletId)
					updateVersionByWalletId.set(
						walletId,
						(updateVersionByWalletId.get(walletId) ?? 0) + 1
					)
					cleanupByWalletId.get(walletId)?.()
					cleanupByWalletId.delete(walletId)
				}
			}
		},
	}
}
