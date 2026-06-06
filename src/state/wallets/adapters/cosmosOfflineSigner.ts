import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { createDiscoveryOnlyAdapter } from './createDiscoveryOnlyAdapter.ts'
import { optionalDiscoveredCandidate } from './types.ts'
import type { WalletAdapter } from './types.ts'

declare global {
	interface Window {
		keplr?: object
		leap?: object
	}
}

export const createCosmosOfflineSignerAdapter = (): WalletAdapter => createDiscoveryOnlyAdapter({
	id: 'cosmos-offline-signer',
	candidate: {
		protocol: WalletProtocol.CosmosOfflineSigner,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedSigner,
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.Reconnect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.SignTransaction,
			WalletCapability.SendTransaction,
			WalletCapability.SwitchScope,
		],
	},
	getCandidates: () => (
		typeof window === 'undefined' ?
			[]
		:
			[
				...optionalDiscoveredCandidate(window.keplr != null, { id: 'cosmos:keplr', name: 'Keplr', icon: '' }),
				...optionalDiscoveredCandidate(window.leap != null, { id: 'cosmos:leap', name: 'Leap', icon: '' }),
			]
	),
})
