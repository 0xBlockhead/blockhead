import { Caip2Namespace, Caip2Reference } from '$/constants/Network.ts'
import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { base58 } from '@scure/base'
import type { WalletAccount, WalletAdapter, WalletCandidate, WalletConnection } from './types.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

type StandardWalletAccount = {
	readonly address: string
	readonly chains: readonly string[]
	readonly features: readonly string[]
}

type StandardConnectFeature = {
	readonly version: '1.0.0'
	connect(input?: { readonly silent?: boolean }): Promise<{
		readonly accounts: readonly StandardWalletAccount[]
	}>
}

type StandardEventsFeature = {
	readonly version: '1.0.0'
	on(
		event: 'change',
		listener: (properties: {
			readonly accounts?: readonly StandardWalletAccount[]
		}) => void
	): () => void
}

type StandardDisconnectFeature = {
	readonly version: '1.0.0'
	disconnect(): Promise<void>
}

type SolanaSignMessageFeature = {
	readonly version: '1.0.0'
	signMessage(input: {
		readonly account: StandardWalletAccount
		readonly message: Uint8Array
	}): Promise<readonly {
		readonly signature: Uint8Array
	}[]>
}

export type AptosAccountInfo = {
	readonly address: string | {
		toString(): string
	}
}

export type AptosNetworkInfo = {
	readonly chainId: number
	readonly name: string
}

export type AptosUserResponse<_Args> =
	| {
		readonly status: 'Approved'
		readonly args: _Args
	}
	| {
		readonly status: 'Rejected'
	}

export type AptosSignMessageOutput = {
	readonly signature: string | string[]
}

export type AptosFeatures = {
	readonly 'aptos:connect'?: {
		readonly version: '1.0.0'
		connect(silent?: boolean, network?: AptosNetworkInfo): Promise<AptosUserResponse<AptosAccountInfo>>
	}
	readonly 'aptos:disconnect'?: {
		readonly version: '1.0.0'
		disconnect(): Promise<void>
	}
	readonly 'aptos:account'?: {
		readonly version: '1.0.0'
		account(): Promise<AptosAccountInfo | null>
	}
	readonly 'aptos:network'?: {
		readonly version: '1.0.0'
		network(): Promise<AptosNetworkInfo>
	}
	readonly 'aptos:onAccountChange'?: {
		readonly version: '1.0.0'
		onAccountChange(listener: (account: AptosAccountInfo | null) => void): Promise<void>
	}
	readonly 'aptos:onNetworkChange'?: {
		readonly version: '1.0.0'
		onNetworkChange(listener: (network: AptosNetworkInfo) => void): Promise<void>
	}
	readonly 'aptos:signMessage'?: {
		readonly version: '1.0.0'
		signMessage(input: {
			readonly message: string
			readonly nonce: string
			readonly account: StandardWalletAccount
		}): Promise<AptosUserResponse<AptosSignMessageOutput>>
	}
	readonly 'aptos:signTransaction'?: {
		readonly version: '1.0.0'
		signTransaction(...args: never[]): Promise<unknown>
	}
}

export type StandardWallet = {
	readonly name: string
	readonly icon?: string
	readonly accounts?: readonly StandardWalletAccount[]
	readonly features?: Readonly<Record<string, object | undefined>> & AptosFeatures & {
		readonly 'standard:connect'?: StandardConnectFeature
		readonly 'standard:events'?: StandardEventsFeature
		readonly 'standard:disconnect'?: StandardDisconnectFeature
		readonly 'solana:signMessage'?: SolanaSignMessageFeature
	}
}

export type WalletRegistryApi = {
	register(...wallets: StandardWallet[]): () => void
}

export type RegisterWalletEvent = CustomEvent<
	| ((api: WalletRegistryApi) => void)
	| {
		register(registerWallet: (wallet: StandardWallet) => void): void
	}
>

declare global {
	interface WindowEventMap {
		'wallet-standard:register-wallet': RegisterWalletEvent
	}
}

const connectFeature = (wallet: StandardWallet) => {
	const feature = wallet.features?.['standard:connect']

	// Wallet Standard providers are external runtime input; callable validation prevents false capability claims.
	// oxlint-disable-next-line no-runtime-shape-guards/guards
	return feature?.version === '1.0.0' && typeof feature.connect === 'function' ? feature : undefined
}

const eventsFeature = (wallet: StandardWallet) => {
	const feature = wallet.features?.['standard:events']

	// Wallet Standard providers are external runtime input; callable validation prevents false capability claims.
	// oxlint-disable-next-line no-runtime-shape-guards/guards
	return feature?.version === '1.0.0' && typeof feature.on === 'function' ? feature : undefined
}

const disconnectFeature = (wallet: StandardWallet) => {
	const feature = wallet.features?.['standard:disconnect']

	// Wallet Standard providers are external runtime input; callable validation prevents false capability claims.
	// oxlint-disable-next-line no-runtime-shape-guards/guards
	return feature?.version === '1.0.0' && typeof feature.disconnect === 'function' ? feature : undefined
}

const signMessageFeature = (wallet: StandardWallet) => {
	const feature = wallet.features?.['solana:signMessage']

	// Wallet Standard providers are external runtime input; callable validation prevents false capability claims.
	// oxlint-disable-next-line no-runtime-shape-guards/guards
	return feature?.version === '1.0.0' && typeof feature.signMessage === 'function' ? feature : undefined
}

const accountFeatureCapabilities = (features: readonly string[]) => [
	...(features.includes('solana:signMessage') ?
		[WalletCapability.SignMessage]
	:
		[]),
	...(features.includes('solana:signTransaction') ?
		[WalletCapability.SignTransaction]
	:
		[]),
	...(features.includes('solana:signAndSendTransaction') ?
		[WalletCapability.SendTransaction]
	:
		[]),
] satisfies WalletCapability[]

const capabilitiesFromWallet = (wallet: StandardWallet) => [
	WalletCapability.Discover,
	...(connectFeature(wallet) == null ?
		[]
	:
		[
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
		]),
	...(eventsFeature(wallet) == null ?
		[]
	:
		[WalletCapability.WatchAccounts]),
	...(disconnectFeature(wallet) == null ?
		[]
	:
		[WalletCapability.Disconnect]),
	...(signMessageFeature(wallet) == null ?
		[]
	:
		[WalletCapability.SignMessage]),
] satisfies WalletCapability[]

const capabilitiesFromAccount = (
	wallet: StandardWallet,
	account: StandardWalletAccount
) => [
	...capabilitiesFromWallet(wallet),
	...accountFeatureCapabilities(account.features),
] satisfies WalletCapability[]

const normalizeSolanaSignature = (signature: Uint8Array | string) => (
	typeof signature === 'string' ?
		signature
	:
		base58.encode(signature)
)

const walletStandardChain = (chain: string) => (
	chain === 'solana:mainnet' ?
		{
			namespace: Caip2Namespace.Solana,
			reference: Caip2Reference.SolanaMainnet,
		}
	:
		undefined
)

const normalizeSolanaAccount = (address: string) => {
	try {
		const decoded = base58.decode(address)

		return (
			decoded.length === 32
			&& base58.encode(decoded) === address
		) ?
			address
		:
			undefined
	} catch {
		return undefined
	}
}

const walletAccounts = (
	wallet: StandardWallet,
	accounts: readonly StandardWalletAccount[]
): WalletAccount[] => [...new Map(accounts.flatMap((account) => account.chains.flatMap((chain) => {
	const normalizedChain = walletStandardChain(chain)
	const accountAddress = (
		normalizedChain?.namespace === Caip2Namespace.Solana ?
			normalizeSolanaAccount(account.address)
		:
			undefined
	)
	if (normalizedChain == null || accountAddress == null) return []

	return [[`${normalizedChain.namespace}:${normalizedChain.reference}:${accountAddress}`, {
		...normalizedChain,
		accountAddress,
		capabilities: capabilitiesFromAccount(wallet, account),
	}] as const]
}))).values()]

const walletConnection = (
	walletId: string,
	wallet: StandardWallet,
	accounts: readonly StandardWalletAccount[],
	connectedAt?: number
): WalletConnection => {
	const normalizedAccounts = walletAccounts(wallet, accounts)

	return buildWalletConnection({
		walletId,
		status: normalizedAccounts.length ?
			BlockheadConnectionStatus.Connected
		:
			BlockheadConnectionStatus.Disconnected,
		protocol: WalletProtocol.WalletStandard,
		transportKind: WalletTransportKind.InjectedSigner,
		scopes: [...new Set(normalizedAccounts.map(({ namespace, reference }) => `${namespace}:${reference}`))]
			.map((chain) => ({
				namespace: chain.slice(0, chain.indexOf(':')),
				reference: chain.slice(chain.indexOf(':') + 1),
				methods: [...new Set(accounts
					.filter((account) => account.chains.some((standardChain) => {
						const normalizedChain = walletStandardChain(standardChain)

						return normalizedChain != null
							&& `${normalizedChain.namespace}:${normalizedChain.reference}` === chain
					}))
					.flatMap((account) => account.features))],
				events: eventsFeature(wallet) == null ?
					[]
				:
					['change'],
			})),
		accounts: normalizedAccounts,
		activeAccount: normalizedAccounts[0],
		selected: normalizedAccounts.length > 0,
		...(connectedAt != null && { connectedAt }),
		...(!normalizedAccounts.length && { disconnectedAt: Date.now() }),
	})
}

export const createWalletStandardAdapter = (): WalletAdapter => {
	const walletById = new Map<string, StandardWallet>()
	const walletIdByWallet = new WeakMap<StandardWallet, string>()
	const connectedAtByWalletId = new Map<string, number>()
	const accountsByWalletId = new Map<string, readonly StandardWalletAccount[]>()
	let updateCandidates: ((candidates: WalletCandidate[]) => void) | undefined

	const emitCandidates = () => updateCandidates?.(
		[...walletById].map(([id, wallet]) => ({
			id,
			name: wallet.name,
			icon: wallet.icon ?? '',
			protocol: WalletProtocol.WalletStandard,
			discoveryKind: WalletDiscoveryKind.Registry,
			transportKind: WalletTransportKind.InjectedSigner,
			capabilities: capabilitiesFromWallet(wallet),
		}))
	)
	const registry: WalletRegistryApi = {
		register: (...wallets) => {
			for (const wallet of wallets) {
				if (walletIdByWallet.has(wallet)) continue
				// Aptos AIP-62 wallets share the Wallet Standard registry events but are owned by aptosAip62.
				// oxlint-disable-next-line no-runtime-shape-guards/guards -- Callable aptos:connect is the AIP-62 ownership signal.
				if (typeof wallet.features?.['aptos:connect']?.connect === 'function') continue

				let walletId = `wallet-standard:${wallet.name}`
				let duplicateIndex = 2

				while (walletById.has(walletId)) {
					walletId = `wallet-standard:${wallet.name}:${duplicateIndex}`
					duplicateIndex++
				}

				walletById.set(walletId, wallet)
				walletIdByWallet.set(wallet, walletId)
			}

			emitCandidates()

			return () => {
				for (const wallet of wallets) {
					const walletId = walletIdByWallet.get(wallet)
					if (walletId == null) continue

					walletById.delete(walletId)
					walletIdByWallet.delete(wallet)
					connectedAtByWalletId.delete(walletId)
					accountsByWalletId.delete(walletId)
				}

				emitCandidates()
			}
		},
	}

	return {
		id: 'wallet-standard',
		start: (nextUpdateCandidates) => {
			if (typeof window === 'undefined') return () => {}

			updateCandidates = nextUpdateCandidates
			const onRegisterWallet = (event: RegisterWalletEvent) => {
				// The official registry callback and the repo's legacy event fixture meet at this browser boundary.
				// oxlint-disable-next-line no-runtime-shape-guards/guards
				if (typeof event.detail === 'function') {
					event.detail(registry)
					return
				}

				event.detail.register((wallet) => registry.register(wallet))
			}

			window.addEventListener('wallet-standard:register-wallet', onRegisterWallet)
			window.dispatchEvent(new CustomEvent('wallet-standard:app-ready', {
				detail: registry,
			}))
			emitCandidates()

			return () => {
				window.removeEventListener('wallet-standard:register-wallet', onRegisterWallet)
				updateCandidates = undefined
				walletById.clear()
				connectedAtByWalletId.clear()
				accountsByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const wallet = walletById.get(walletId)
			if (wallet == null) return undefined

			const standardConnect = connectFeature(wallet)
			if (standardConnect == null)
				throw new Error(`${wallet.name} does not implement standard:connect 1.0.0`)

			const { accounts } = await standardConnect.connect()
			if (!walletAccounts(wallet, accounts).length)
				throw new Error(`${wallet.name} did not authorize a valid account on a supported chain`)

			connectedAtByWalletId.set(walletId, Date.now())
			accountsByWalletId.set(walletId, accounts)
			return walletConnection(walletId, wallet, accounts, connectedAtByWalletId.get(walletId))
		},
		signMessage: async (walletId, accountAddress, message) => {
			const wallet = walletById.get(walletId)
			if (wallet == null)
				throw new Error('Wallet Standard wallet is unavailable')

			const solanaSignMessage = signMessageFeature(wallet)
			if (solanaSignMessage == null)
				throw new Error(`${wallet.name} does not implement solana:signMessage 1.0.0`)

			const accounts = accountsByWalletId.get(walletId) ?? []
			const account = accounts.find((candidate) => (
				normalizeSolanaAccount(candidate.address) === accountAddress
			))
			if (account == null)
				throw new Error(`${wallet.name} is not connected with Solana account ${accountAddress}`)

			const [output] = await solanaSignMessage.signMessage({
				account,
				message: new TextEncoder().encode(message),
			})
			if (output?.signature == null)
				throw new Error(`${wallet.name} returned an invalid solana:signMessage signature`)

			return normalizeSolanaSignature(output.signature)
		},
		disconnect: async (walletId) => {
			const wallet = walletById.get(walletId)
			if (wallet == null) return

			await disconnectFeature(wallet)?.disconnect()
			connectedAtByWalletId.delete(walletId)
			accountsByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const wallet = walletById.get(walletId)
			if (wallet == null) return () => {}

			const standardEvents = eventsFeature(wallet)
			let subscribed = true
			let connectionVersion = 0
			const unsubscribe = standardEvents?.on('change', ({ accounts }) => {
				if (accounts == null) return

				connectionVersion++
				accountsByWalletId.set(walletId, accounts)
				updateConnection(walletConnection(
					walletId,
					wallet,
					accounts,
					connectedAtByWalletId.get(walletId)
				))
			}) ?? (() => {})

			if (!connectedAtByWalletId.has(walletId)) {
				const restoreVersion = connectionVersion
				void connectFeature(wallet)?.connect({
					silent: true,
				}).then(({ accounts }) => {
					if (!subscribed || connectionVersion !== restoreVersion) return

					const connectedAt = Date.now()
					connectedAtByWalletId.set(walletId, connectedAt)
					accountsByWalletId.set(walletId, accounts)
					updateConnection(walletConnection(
						walletId,
						wallet,
						accounts,
						connectedAt
					))
				}).catch(() => {
					if (!subscribed || connectionVersion !== restoreVersion) return

					accountsByWalletId.delete(walletId)
					updateConnection(walletConnection(
						walletId,
						wallet,
						[],
						connectedAtByWalletId.get(walletId)
					))
				})
			}

			return () => {
				subscribed = false
				unsubscribe()
			}
		},
	}
}
