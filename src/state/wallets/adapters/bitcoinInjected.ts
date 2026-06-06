import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { createDiscoveryOnlyAdapter } from './createDiscoveryOnlyAdapter.ts'
import { optionalDiscoveredCandidate } from './types.ts'
import type { WalletAdapter } from './types.ts'

declare global {
	interface Window {
		LeatherProvider?: object
		magicEden?: {
			bitcoin?: object
		}
		unisat?: object
		XverseProviders?: object
	}
}

export const createBitcoinInjectedAdapter = (): WalletAdapter => createDiscoveryOnlyAdapter({
	id: 'bitcoin-injected',
	candidate: {
		protocol: WalletProtocol.SatsConnect,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedSigner,
		capabilities: [
			WalletCapability.Connect,
			WalletCapability.ListAccounts,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
		],
	},
	getCandidates: () => (
		typeof window === 'undefined' ?
			[]
		:
			[
				...optionalDiscoveredCandidate(window.LeatherProvider != null, { id: 'bitcoin:leather', name: 'Leather', icon: '' }),
				...optionalDiscoveredCandidate(window.XverseProviders != null, { id: 'bitcoin:xverse', name: 'Xverse', icon: '' }),
				...optionalDiscoveredCandidate(window.unisat != null, { id: 'bitcoin:unisat', name: 'UniSat', icon: '' }),
				...optionalDiscoveredCandidate(window.magicEden?.bitcoin != null, { id: 'bitcoin:magiceden', name: 'Magic Eden', icon: '' }),
			]
	),
})
