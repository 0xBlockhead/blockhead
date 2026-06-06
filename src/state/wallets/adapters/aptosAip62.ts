import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { createDiscoveryOnlyAdapter } from './createDiscoveryOnlyAdapter.ts'
import { optionalDiscoveredCandidate } from './types.ts'
import type { WalletAdapter } from './types.ts'

declare global {
	interface Window {
		aptos?: object
		martian?: object
		pontem?: object
	}
}

export const createAptosAip62Adapter = (): WalletAdapter => createDiscoveryOnlyAdapter({
	id: 'aptos-aip62',
	candidate: {
		protocol: WalletProtocol.AptosAip62,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedSigner,
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
		],
	},
	getCandidates: () => (
		typeof window === 'undefined' ?
			[]
		:
			[
				...optionalDiscoveredCandidate(window.aptos != null, { id: 'aptos:petra', name: 'Petra', icon: '' }),
				...optionalDiscoveredCandidate(window.martian != null, { id: 'aptos:martian', name: 'Martian', icon: '' }),
				...optionalDiscoveredCandidate(window.pontem != null, { id: 'aptos:pontem', name: 'Pontem', icon: '' }),
			]
	),
})
