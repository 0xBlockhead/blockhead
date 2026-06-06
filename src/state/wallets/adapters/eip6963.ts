import type { Eip6963ProviderDetail } from '$/lib/eip6963.ts'
import { subscribeEip6963Providers } from '$/lib/eip6963.ts'
import {
	type Eip1193Provider,
	getChainId,
	onAccountsChanged,
	onChainChanged,
	requestAccounts,
} from '$/lib/eip1193.ts'
import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter, WalletCandidate, WalletConnection } from './types.ts'

type EipConnectionState = {
	accounts: `0x${string}`[]
	chainId: number | null
}

const eipCapabilities = [
	WalletCapability.Connect,
	WalletCapability.Reconnect,
	WalletCapability.ListAccounts,
	WalletCapability.WatchAccounts,
	WalletCapability.WatchScopes,
	WalletCapability.SignMessage,
	WalletCapability.SignTransaction,
	WalletCapability.SendTransaction,
	WalletCapability.SignTypedData,
] satisfies WalletCapability[]

export const eipCandidateFromDetail = (
	detail: Eip6963ProviderDetail,
): WalletCandidate => ({
	id: `eip6963:${detail.info.rdns}`,
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
	chainId: number | null,
	status: BlockheadConnectionStatus,
	error?: string,
): WalletConnection => ({
	walletId,
	status,
	protocol: WalletProtocol.Eip6963,
	transportKind: WalletTransportKind.InjectedProvider,
	scopes: chainId == null ?
		[]
	:
		[
			{
				namespace: 'eip155',
				reference: String(chainId),
				methods: ['eth_accounts', 'eth_requestAccounts', 'personal_sign', 'eth_sendTransaction'],
				events: ['accountsChanged', 'chainChanged'],
			},
		],
	accounts: accounts.map((accountAddress) => ({
		namespace: 'eip155',
		reference: String(chainId ?? 1),
		accountAddress,
		capabilities: eipCapabilities,
	})),
	selected: status === BlockheadConnectionStatus.Connected,
	connectedAt: Date.now(),
	...(error != null && { error }),
})

export const createEip6963Adapter = (): WalletAdapter => {
	const providerByWalletId = new SvelteMap<string, Eip1193Provider>()
	const eipStateByWalletId = new SvelteMap<string, EipConnectionState>()

	return {
		id: 'eip6963',
		start: (updateCandidates) => (
			subscribeEip6963Providers((providers) => {
				const candidates = providers.map(eipCandidateFromDetail)

				for (const provider of providers)
					providerByWalletId.set(eipCandidateFromDetail(provider).id, provider.provider)

				updateCandidates(candidates)
			})
		),
		connect: async (walletId) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null) return undefined

			const accounts = await requestAccounts(provider)
			if (!accounts.length)
				throw new Error('Provider did not return any accounts')

			const chainId = await getChainId(provider)

			eipStateByWalletId.set(walletId, {
				accounts,
				chainId,
			})

			return eipConnectionFromAccounts(
				walletId,
				accounts,
				chainId,
				BlockheadConnectionStatus.Connected,
			)
		},
		disconnect: (walletId) => {
			eipStateByWalletId.delete(walletId)
		},
		subscribeConnection: (walletId, updateConnection) => {
			const provider = providerByWalletId.get(walletId)
			if (provider == null) return () => {}

			const unsubscribeAccountsChanged = onAccountsChanged(provider, (accounts) => {
				eipStateByWalletId.set(walletId, {
					accounts,
					chainId: eipStateByWalletId.get(walletId)?.chainId ?? null,
				})

				updateConnection(eipConnectionFromAccounts(
					walletId,
					accounts,
					eipStateByWalletId.get(walletId)?.chainId ?? null,
					accounts.length ?
						BlockheadConnectionStatus.Connected
					:
						BlockheadConnectionStatus.Disconnected,
				))
			})

			const unsubscribeChainChanged = onChainChanged(provider, (chainId) => {
				const accounts = eipStateByWalletId.get(walletId)?.accounts ?? []

				eipStateByWalletId.set(walletId, {
					accounts,
					chainId,
				})

				updateConnection(eipConnectionFromAccounts(
					walletId,
					accounts,
					chainId,
					accounts.length ?
						BlockheadConnectionStatus.Connected
					:
						BlockheadConnectionStatus.Disconnected,
				))
			})

			return () => {
				unsubscribeAccountsChanged()
				unsubscribeChainChanged()
			}
		},
	}
}
