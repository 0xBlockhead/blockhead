import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import type { WalletAdapter, WalletCandidate } from './types.ts'
import type {
	AptosAccountInfo,
	AptosFeatures,
	AptosNetworkInfo,
	RegisterWalletEvent,
	StandardWallet,
	WalletRegistryApi,
} from './walletStandard.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

const requiredAptosFeatureNames = [
	'aptos:connect',
	'aptos:disconnect',
	'aptos:account',
	'aptos:network',
	'aptos:onAccountChange',
	'aptos:onNetworkChange',
	'aptos:signMessage',
	'aptos:signTransaction',
] as const

const aptosCapabilities = [
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.Disconnect,
	WalletCapability.ListAccounts,
	WalletCapability.WatchAccounts,
	WalletCapability.WatchScopes,
	WalletCapability.SignMessage,
	WalletCapability.SignTransaction,
] satisfies WalletCapability[]

const aptosFeatures = (wallet: StandardWallet) => (
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- AIP-62 discovery is defined by the registered wallet's callable feature surface.
	typeof wallet.features?.['aptos:connect']?.connect === 'function'
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- AIP-62 discovery is defined by the registered wallet's callable feature surface.
	&& typeof wallet.features['aptos:disconnect']?.disconnect === 'function'
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- AIP-62 discovery is defined by the registered wallet's callable feature surface.
	&& typeof wallet.features['aptos:account']?.account === 'function'
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- AIP-62 discovery is defined by the registered wallet's callable feature surface.
	&& typeof wallet.features['aptos:network']?.network === 'function'
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- AIP-62 discovery is defined by the registered wallet's callable feature surface.
	&& typeof wallet.features['aptos:onAccountChange']?.onAccountChange === 'function'
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- AIP-62 discovery is defined by the registered wallet's callable feature surface.
	&& typeof wallet.features['aptos:onNetworkChange']?.onNetworkChange === 'function'
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- AIP-62 discovery is defined by the registered wallet's callable feature surface.
	&& typeof wallet.features['aptos:signMessage']?.signMessage === 'function'
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- AIP-62 discovery is defined by the registered wallet's callable feature surface.
	&& typeof wallet.features['aptos:signTransaction']?.signTransaction === 'function' ?
		wallet.features
	:
		undefined
)

const normalizeAptosAddress = (account: AptosAccountInfo) => {
	const address = String(account.address)
	if (!/^0x[0-9a-fA-F]{1,64}$/.test(address))
		throw new Error('Aptos AIP-62 wallet did not expose a valid account address')

	return `0x${address.slice(2).toLowerCase().padStart(64, '0')}`
}

const aptosReference = (network: AptosNetworkInfo) => {
	const reference = String(network.chainId)
	if (!/^[1-9][0-9]*$/.test(reference) || network.chainId > 0xff)
		throw new Error('Aptos AIP-62 wallet did not expose a canonical chain ID')

	return reference
}

const aptosConnection = (
	walletId: string,
	features: AptosFeatures,
	account: AptosAccountInfo | null,
	network: AptosNetworkInfo,
	connectedAt?: number
) => {
	const reference = aptosReference(network)
	const accountAddress = account == null ? undefined : normalizeAptosAddress(account)

	return buildWalletConnection({
		walletId,
		status: accountAddress == null ?
			BlockheadConnectionStatus.Disconnected
		:
			BlockheadConnectionStatus.Connected,
		protocol: WalletProtocol.AptosAip62,
		transportKind: WalletTransportKind.InjectedSigner,
		scopes: [
			{
				namespace: 'aptos',
				reference,
				methods: requiredAptosFeatureNames.map((featureName) => featureName.slice('aptos:'.length)),
				events: [
					'accountChange',
					'networkChange',
				],
			},
		],
		accounts: accountAddress == null ?
			[]
		:
			[
				{
					namespace: 'aptos',
					reference,
					accountAddress,
					capabilities: aptosCapabilities,
				},
			],
		...(accountAddress != null && {
			activeAccount: {
				namespace: 'aptos',
				reference,
				accountAddress,
				capabilities: aptosCapabilities,
			},
			selected: true,
			connectedAt,
		}),
		...(accountAddress == null && {
			disconnectedAt: Date.now(),
		}),
	})
}

const aptosSignMessageAccount = (
	account: AptosAccountInfo,
	network: AptosNetworkInfo
): {
	readonly address: string
	readonly chains: readonly string[]
	readonly features: readonly string[]
} => ({
	address: String(account.address),
	chains: [`aptos:${aptosReference(network)}`],
	features: [...requiredAptosFeatureNames],
})

const normalizeAptosSignature = (signature: string | string[]) => {
	const value = (
		typeof signature === 'string' ?
			signature
		:
			signature[0]
	)
	if (value == null || value.length === 0)
		throw new Error('Aptos AIP-62 wallet returned an invalid aptos:signMessage signature')

	return value
}

export const createAptosAip62Adapter = (): WalletAdapter => {
	const walletIdByWallet = new WeakMap<StandardWallet, string>()
	const walletById = new Map<string, StandardWallet>()
	const connectedAtByWalletId = new Map<string, number>()
	const accountByWalletId = new Map<string, AptosAccountInfo>()
	const networkByWalletId = new Map<string, AptosNetworkInfo>()
	let updateCandidates: ((candidates: WalletCandidate[]) => void) | undefined

	const emitCandidates = () => updateCandidates?.(
		[...walletById].map(([id, wallet]) => ({
			id,
			name: wallet.name,
			icon: wallet.icon ?? '',
			protocol: WalletProtocol.AptosAip62,
			discoveryKind: WalletDiscoveryKind.InjectedEvent,
			transportKind: WalletTransportKind.InjectedSigner,
			capabilities: [
				WalletCapability.Discover,
				...aptosCapabilities,
			],
		}))
	)
	const registry: WalletRegistryApi = {
		register: (...wallets) => {
			for (const wallet of wallets) {
				if (
					walletIdByWallet.has(wallet)
					|| aptosFeatures(wallet) == null
				) continue

				let walletId = `aptos-aip62:${wallet.name}`
				let duplicateIndex = 2
				while (walletById.has(walletId)) {
					walletId = `aptos-aip62:${wallet.name}:${duplicateIndex}`
					duplicateIndex++
				}

				walletIdByWallet.set(wallet, walletId)
				walletById.set(walletId, wallet)
			}

			emitCandidates()

			return () => {
				for (const wallet of wallets) {
					const walletId = walletIdByWallet.get(wallet)
					if (walletId == null) continue

					walletIdByWallet.delete(wallet)
					walletById.delete(walletId)
					connectedAtByWalletId.delete(walletId)
				}

				emitCandidates()
			}
		},
	}

	return {
		id: 'aptos-aip62',
		start: (nextUpdateCandidates) => {
			if (typeof window === 'undefined') return () => {}

			updateCandidates = nextUpdateCandidates
			const onRegisterWallet = (event: RegisterWalletEvent) => {
				// oxlint-disable-next-line no-runtime-shape-guards/guards -- Wallet Standard supports callback registration and the repo's legacy registry fixture.
				if (typeof event.detail === 'function')
					event.detail(registry)
				else
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
				accountByWalletId.clear()
				networkByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const wallet = walletById.get(walletId)
			const features = wallet == null ? undefined : aptosFeatures(wallet)
			if (wallet == null || features == null) return undefined

			const response = await features['aptos:connect']?.connect()
			if (response == null)
				throw new Error(`${wallet.name} does not implement aptos:connect 1.0.0`)
			if (response.status === 'Rejected')
				throw new Error(`${wallet.name} rejected Aptos account access`)

			const network = await features['aptos:network']?.network()
			if (network == null)
				throw new Error(`${wallet.name} does not implement aptos:network 1.0.0`)

			const connectedAt = Date.now()
			connectedAtByWalletId.set(walletId, connectedAt)
			accountByWalletId.set(walletId, response.args)
			networkByWalletId.set(walletId, network)

			return aptosConnection(
				walletId,
				features,
				response.args,
				network,
				connectedAt
			)
		},
		signMessage: async (walletId, accountAddress, message) => {
			const wallet = walletById.get(walletId)
			const features = wallet == null ? undefined : aptosFeatures(wallet)
			if (wallet == null || features == null)
				throw new Error('Aptos AIP-62 wallet is unavailable')

			const account = accountByWalletId.get(walletId)
			const network = networkByWalletId.get(walletId)
			if (account == null || network == null)
				throw new Error(`${wallet.name} is not connected`)

			if (normalizeAptosAddress(account) !== accountAddress)
				throw new Error(`${wallet.name} is not connected with Aptos account ${accountAddress}`)

			const signMessage = features['aptos:signMessage']?.signMessage
			if (signMessage == null)
				throw new Error(`${wallet.name} does not implement aptos:signMessage 1.0.0`)

			const response = await signMessage({
				message,
				nonce: globalThis.crypto.randomUUID(),
				account: aptosSignMessageAccount(account, network),
			})
			if (response.status === 'Rejected')
				throw new Error(`${wallet.name} rejected message signing`)

			return normalizeAptosSignature(response.args.signature)
		},
		disconnect: async (walletId) => {
			const wallet = walletById.get(walletId)
			if (wallet == null) return

			await aptosFeatures(wallet)?.['aptos:disconnect']?.disconnect()
			connectedAtByWalletId.delete(walletId)
			accountByWalletId.delete(walletId)
			networkByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const wallet = walletById.get(walletId)
			const features = wallet == null ? undefined : aptosFeatures(wallet)
			if (features == null) return () => {}

			let subscribed = true
			let updateVersion = 0
			void features['aptos:onAccountChange']?.onAccountChange((account) => {
				const version = ++updateVersion
				if (account == null) {
					accountByWalletId.delete(walletId)
					connectedAtByWalletId.delete(walletId)
				}
				else
					accountByWalletId.set(walletId, account)
				void features['aptos:network']?.network().then((network) => {
					if (!subscribed || version !== updateVersion || network == null) return

					networkByWalletId.set(walletId, network)
					updateConnection(aptosConnection(
						walletId,
						features,
						account,
						network,
						connectedAtByWalletId.get(walletId)
					))
				})
			})
			void features['aptos:onNetworkChange']?.onNetworkChange((network) => {
				updateVersion++
				networkByWalletId.set(walletId, network)
				const account = accountByWalletId.get(walletId)
				if (!subscribed || account == null) return

				updateConnection(aptosConnection(
					walletId,
					features,
					account,
					network,
					connectedAtByWalletId.get(walletId)
				))
			})

			if (!connectedAtByWalletId.has(walletId)) {
				const version = updateVersion
				void features['aptos:connect']?.connect(true).then(async (response) => {
					if (!subscribed || version !== updateVersion) return
					if (response.status === 'Rejected') {
						const network = networkByWalletId.get(walletId) ?? await features['aptos:network']?.network()
						if (network == null) return

						updateConnection(aptosConnection(
							walletId,
							features,
							null,
							network
						))
						return
					}

					const network = await features['aptos:network']?.network()
					if (!subscribed || version !== updateVersion || network == null) return

					const connectedAt = Date.now()
					connectedAtByWalletId.set(walletId, connectedAt)
					accountByWalletId.set(walletId, response.args)
					networkByWalletId.set(walletId, network)
					updateConnection(aptosConnection(
						walletId,
						features,
						response.args,
						network,
						connectedAt
					))
				}).catch(() => {})
			}

			return () => {
				subscribed = false
				updateVersion++
			}
		},
	}
}
