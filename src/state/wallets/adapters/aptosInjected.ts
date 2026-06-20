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

export const createAptosInjectedAdapter = (): WalletAdapter => createDiscoveryOnlyAdapter({
	id: 'aptos-injected',
	candidate: {
		protocol: WalletProtocol.AptosInjected,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedSigner,
		capabilities: [
			WalletCapability.Discover,
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
