import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { createDiscoveryOnlyAdapter } from './createDiscoveryOnlyAdapter.ts'
import type { WalletAdapter } from './types.ts'

declare global {
	interface Window {
		tronLink?: object
		tronWeb?: object
	}
}

export const createTronInjectedAdapter = (): WalletAdapter => createDiscoveryOnlyAdapter({
	id: 'tron-injected',
	candidate: {
		protocol: WalletProtocol.TronTip1193,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedProvider,
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.WatchScopes,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
			WalletCapability.SendTransaction,
		],
	},
	getCandidates: () => (
		typeof window === 'undefined' || (window.tronLink == null && window.tronWeb == null) ?
			[]
		:
			[
				{
					id: 'tron:injected',
					name: 'TRON injected wallet',
					icon: '',
				},
			]
	),
})
