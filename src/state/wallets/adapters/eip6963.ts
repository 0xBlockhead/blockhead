import {
	type Eip1193Provider,
	personalSign,
	signTypedDataV4,
	switchEthereumChain,
} from './eip1193.ts'
import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadConnectionStatus.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter, WalletCandidate, WalletConnection } from './types.ts'
import { WalletAdapterPreDispatchFailure } from './types.ts'
import { sendEip1193Transaction } from './eip1193Transaction.ts'
import { buildWalletConnection } from '../walletConnectionState.ts'

type EipConnectionState = {
	accounts: `0x${string}`[]
	chainReference: string | null
	connectedAt: number
}

export type Eip6963ProviderInfo = Readonly<{
	uuid: string
	name: string
	icon: string
	rdns: string
}>

export type Eip6963ProviderDetail = {
	info: Eip6963ProviderInfo
	provider: Eip1193Provider
}

declare global {
	interface Window {
		ethereum?: Eip1193Provider
	}

	interface WindowEventMap {
		'eip6963:announceProvider': CustomEvent<Eip6963ProviderDetail>
	}
}

const EIP6963_ANNOUNCE_PROVIDER_EVENT = 'eip6963:announceProvider'
const EIP6963_REQUEST_PROVIDER_EVENT = 'eip6963:requestProvider'
const LEGACY_INJECTED_PROVIDER_RDNS = 'legacy.injected.provider'

const normalizeEipAccounts = (value: JsonValue) => {
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- EIP-1193 provider output is an untrusted JSON wire boundary.
	if (!Array.isArray(value))
		throw new Error('Provider did not return an accounts array')

	try {
		return [...new Set(value.map((account) => (
			EvmAddress.assert(EvmAddress.assert(account).toLowerCase())
		)))]
	} catch {
		throw new Error('Provider returned an invalid EVM account')
	}
}

const normalizeEipChainReference = (value: JsonValue) => {
	// oxlint-disable-next-line no-runtime-shape-guards/guards -- EIP-1193 provider output is an untrusted JSON wire boundary.
	if (typeof value !== 'string'
		|| !/^0x[1-9a-fA-F][0-9a-fA-F]*$/.test(value)
	)
		throw new Error('Provider returned an invalid chain ID')

	const chainId = BigInt(value)
	if (chainId.toString().length > 32)
		throw new Error('Provider returned an invalid chain ID')

	return chainId.toString()
}

const getChainReference = async (provider: Eip1193Provider) => (
	normalizeEipChainReference(await provider.request({
		method: 'eth_chainId',
		params: [],
	}))
)

const eipCapabilities = [
	WalletCapability.Discover,
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.Disconnect,
	WalletCapability.ListAccounts,
	WalletCapability.WatchAccounts,
	WalletCapability.WatchScopes,
	WalletCapability.SignMessage,
	WalletCapability.SignTransaction,
	WalletCapability.SendTransaction,
	WalletCapability.SignTypedData,
	WalletCapability.SwitchScope,
] satisfies WalletCapability[]

const eipScopeMethods = [
	'eth_accounts',
	'eth_requestAccounts',
	'personal_sign',
	'eth_signTypedData_v4',
	'eth_signTransaction',
	'eth_sendTransaction',
	'wallet_switchEthereumChain',
] as const

const eipScopeEvents = [
	'accountsChanged',
	'chainChanged',
	'disconnect',
] as const

export const eipCandidateFromDetail = (
	detail: Eip6963ProviderDetail
): WalletCandidate => ({
	id: `eip6963:${detail.info.uuid}`,
	name: detail.info.name,
	icon: detail.info.icon,
	protocol: WalletProtocol.Eip6963,
	discoveryKind: WalletDiscoveryKind.InjectedEvent,
	transportKind: WalletTransportKind.InjectedProvider,
	rdns: detail.info.rdns,
	capabilities: eipCapabilities,
})

export const eipConnectionFromAccounts = (
	walletId: string,
	accounts: `0x${string}`[],
	chainReference: string | number | null,
	status: BlockheadConnectionStatus,
	connectedAt?: number,
	error?: string
): WalletConnection => (
	buildWalletConnection({
		walletId,
		status,
		protocol: WalletProtocol.Eip6963,
		transportKind: WalletTransportKind.InjectedProvider,
		scopes: chainReference == null ?
			[]
		:
			[
				{
					namespace: 'eip155',
					reference: String(chainReference),
					methods: [
						...eipScopeMethods,
					],
					events: [
						...eipScopeEvents,
					],
				},
			],
		accounts: chainReference == null ?
			[]
		:
			accounts.map((accountAddress) => ({
				namespace: 'eip155',
				reference: String(chainReference),
				accountAddress,
				capabilities: eipCapabilities,
			})),
		selected: status === BlockheadConnectionStatus.Connected && chainReference != null,
		...(connectedAt != null && { connectedAt }),
		...(status === BlockheadConnectionStatus.Disconnected && { disconnectedAt: Date.now() }),
		...(error != null && { error }),
	})
)

export const createEip6963Adapter = (): WalletAdapter => {
	const providerByWalletId = new SvelteMap<string, Eip1193Provider>()
	const eipStateByWalletId = new SvelteMap<string, EipConnectionState>()
	const providerByUuid = new Map<string, Eip6963ProviderDetail>()
	const LEGACY_INJECTED_FALLBACK_POLL_MS = 100
	const LEGACY_INJECTED_FALLBACK_MAX_MS = 10_000
	let legacyInjectedFallbackTimeout: number | null = null
	let legacyInjectedFallbackElapsedMs = 0

	const updateProvider = (
		detail: Eip6963ProviderDetail,
		updateCandidates: (candidates: WalletCandidate[]) => void
	) => {
		if (detail.info.rdns !== LEGACY_INJECTED_PROVIDER_RDNS)
			providerByUuid.delete(LEGACY_INJECTED_PROVIDER_RDNS)

		providerByUuid.set(detail.info.uuid, detail)

		const providers = [...providerByUuid.values()]

		for (const provider of providers)
			providerByWalletId.set(eipCandidateFromDetail(provider).id, provider.provider)

		updateCandidates(providers.map(eipCandidateFromDetail))
	}

	return {
		id: 'eip6963',
		start: (updateCandidates) => {
			if (typeof window === 'undefined') return () => {}

			const onProviderAnnounce = (
				event: CustomEvent<Eip6963ProviderDetail>
			) => updateProvider(
				event.detail,
				updateCandidates
			)

			window.addEventListener(
				EIP6963_ANNOUNCE_PROVIDER_EVENT,
				onProviderAnnounce
			)
			window.dispatchEvent(new Event(EIP6963_REQUEST_PROVIDER_EVENT))

			const pollLegacyInjectedFallback = () => {
				legacyInjectedFallbackTimeout = null

				if (
					providerByUuid.size > 0
					&& !providerByUuid.has(LEGACY_INJECTED_PROVIDER_RDNS)
				)
					return

				if (window.ethereum != null) {
					updateProvider(
						{
							info: {
								uuid: LEGACY_INJECTED_PROVIDER_RDNS,
								name: 'Injected provider',
								icon: '',
								rdns: LEGACY_INJECTED_PROVIDER_RDNS,
							},
							provider: window.ethereum,
						},
						updateCandidates
					)
					return
				}

				legacyInjectedFallbackElapsedMs += LEGACY_INJECTED_FALLBACK_POLL_MS
				if (legacyInjectedFallbackElapsedMs >= LEGACY_INJECTED_FALLBACK_MAX_MS)
					return

				legacyInjectedFallbackTimeout = window.setTimeout(
					pollLegacyInjectedFallback,
					LEGACY_INJECTED_FALLBACK_POLL_MS
				)
			}

			legacyInjectedFallbackTimeout = window.setTimeout(
				pollLegacyInjectedFallback,
				LEGACY_INJECTED_FALLBACK_POLL_MS
			)

			updateCandidates([...providerByUuid.values()].map(eipCandidateFromDetail))

			return () => {
				window.removeEventListener(
					EIP6963_ANNOUNCE_PROVIDER_EVENT,
					onProviderAnnounce
				)

				if (legacyInjectedFallbackTimeout != null)
					window.clearTimeout(legacyInjectedFallbackTimeout)

				legacyInjectedFallbackTimeout = null
				legacyInjectedFallbackElapsedMs = 0
				providerByUuid.clear()
				providerByWalletId.clear()
			}
		},
		connect: async (walletId) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null) return undefined

			const accounts = normalizeEipAccounts(await provider.request({
				method: 'eth_requestAccounts',
				params: [],
			}))
			if (!accounts.length)
				throw new Error('Provider did not return any accounts')

			const chainReference = await getChainReference(provider)

			eipStateByWalletId.set(walletId, {
				accounts,
				chainReference,
				connectedAt: Date.now(),
			})

			return eipConnectionFromAccounts(
				walletId,
				accounts,
				chainReference,
				BlockheadConnectionStatus.Connected,
				eipStateByWalletId.get(walletId)?.connectedAt
			)
		},
		sendEvmTransaction: async (walletId, transaction, assertAuthorityCurrent) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null)
				throw new WalletAdapterPreDispatchFailure('EIP-6963 provider is unavailable')
			return sendEip1193Transaction(provider, transaction, () => {
				if (providerByWalletId.get(walletId) !== provider)
					throw new Error('EIP-6963 provider changed before transaction dispatch')
				assertAuthorityCurrent()
			})
		},
		signMessage: async (walletId, accountAddress, message) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null)
				throw new Error('EIP-6963 provider is unavailable')

			return personalSign(provider, accountAddress, message)
		},
		signTypedData: async (walletId, accountAddress, typedData) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null)
				throw new Error('EIP-6963 provider is unavailable')

			return signTypedDataV4(provider, accountAddress, typedData)
		},
		switchScope: async (walletId, scope) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null)
				throw new Error('EIP-6963 provider is unavailable')
			if (scope.namespace !== 'eip155')
				throw new Error('EIP-6963 switchScope only supports eip155')

			await switchEthereumChain(provider, scope.reference)
			const state = eipStateByWalletId.get(walletId)
			const accounts = state?.accounts ?? []
			eipStateByWalletId.set(walletId, {
				accounts,
				chainReference: scope.reference,
				connectedAt: state?.connectedAt ?? Date.now(),
			})

			return eipConnectionFromAccounts(
				walletId,
				accounts,
				scope.reference,
				BlockheadConnectionStatus.Connected,
				eipStateByWalletId.get(walletId)?.connectedAt
			)
		},
		disconnect: (walletId) => {
			eipStateByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null) return () => {}
			let subscribed = true

			const onProviderAccountsChanged = (payload: JsonValue) => {
				let accounts: `0x${string}`[]
				try {
					accounts = normalizeEipAccounts(payload)
				} catch {
					return
				}

				const connectedAt = eipStateByWalletId.get(walletId)?.connectedAt ?? Date.now()
				const chainReference = eipStateByWalletId.get(walletId)?.chainReference ?? null

				eipStateByWalletId.set(walletId, {
					accounts,
					chainReference,
					connectedAt,
				})

				if (!accounts.length || chainReference != null) {
					updateConnection(eipConnectionFromAccounts(
						walletId,
						accounts,
						chainReference,
						accounts.length ?
							BlockheadConnectionStatus.Connected
						:
							BlockheadConnectionStatus.Disconnected,
						connectedAt
					))
					return
				}

				void getChainReference(provider).then((providerChainReference) => {
					const state = eipStateByWalletId.get(walletId)
					if (!subscribed || state == null || state.accounts !== accounts) return

					const currentChainReference = state.chainReference ?? providerChainReference
					eipStateByWalletId.set(walletId, {
						...state,
						chainReference: currentChainReference,
					})
					updateConnection(eipConnectionFromAccounts(
						walletId,
						accounts,
						currentChainReference,
						BlockheadConnectionStatus.Connected,
						connectedAt
					))
				}).catch((error) => {
					const state = eipStateByWalletId.get(walletId)
					if (
						!subscribed
						|| state?.accounts !== accounts
						|| state.chainReference != null
					) return

					updateConnection(eipConnectionFromAccounts(
						walletId,
						[],
						null,
						BlockheadConnectionStatus.Error,
						connectedAt,
						error instanceof Error ? error.message : String(error)
					))
				})
			}
			provider.on?.('accountsChanged', onProviderAccountsChanged)

			const onProviderChainChanged = (payload: JsonValue) => {
				let chainReference: string
				try {
					chainReference = normalizeEipChainReference(payload)
				} catch {
					return
				}

				const accounts = eipStateByWalletId.get(walletId)?.accounts ?? []

				eipStateByWalletId.set(walletId, {
					accounts,
					chainReference,
					connectedAt: eipStateByWalletId.get(walletId)?.connectedAt ?? Date.now(),
				})

				updateConnection(eipConnectionFromAccounts(
					walletId,
					accounts,
					chainReference,
					accounts.length ?
						BlockheadConnectionStatus.Connected
					:
						BlockheadConnectionStatus.Disconnected,
					eipStateByWalletId.get(walletId)?.connectedAt
				))
			}
			provider.on?.('chainChanged', onProviderChainChanged)
			const onProviderDisconnect = () => {
				const state = eipStateByWalletId.get(walletId)
				eipStateByWalletId.delete(walletId)
				updateConnection(eipConnectionFromAccounts(
					walletId,
					[],
					state?.chainReference ?? null,
					BlockheadConnectionStatus.Disconnected,
					state?.connectedAt
				))
			}
			provider.on?.('disconnect', onProviderDisconnect)

			return () => {
				subscribed = false
				provider.removeListener?.('accountsChanged', onProviderAccountsChanged)
				provider.removeListener?.('chainChanged', onProviderChainChanged)
				provider.removeListener?.('disconnect', onProviderDisconnect)
			}
		},
	}
}
