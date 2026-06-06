import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { createDiscoveryOnlyAdapter } from './createDiscoveryOnlyAdapter.ts'
import { optionalDiscoveredCandidate } from './types.ts'
import type { WalletAdapter } from './types.ts'

declare global {
	interface Window {
		starknet?: object
		starknet_argentX?: object
		starknet_braavos?: object
	}
}

export const createStarknetWalletApiAdapter = (): WalletAdapter => createDiscoveryOnlyAdapter({
	id: 'starknet-wallet-api',
	candidate: {
		protocol: WalletProtocol.StarknetWalletApi,
		discoveryKind: WalletDiscoveryKind.InjectedGlobal,
		transportKind: WalletTransportKind.InjectedProvider,
		capabilities: [
			WalletCapability.Discover,
			WalletCapability.Connect,
			WalletCapability.ListAccounts,
			WalletCapability.WatchAccounts,
			WalletCapability.SignMessage,
			WalletCapability.SignTransaction,
			WalletCapability.SendTransaction,
		],
	},
	getCandidates: () => (
		typeof window === 'undefined' ?
			[]
		:
			[
				...optionalDiscoveredCandidate(window.starknet != null, { id: 'starknet:injected', name: 'Starknet injected wallet', icon: '' }),
				...optionalDiscoveredCandidate(window.starknet_argentX != null, { id: 'starknet:argentx', name: 'Argent X', icon: '' }),
				...optionalDiscoveredCandidate(window.starknet_braavos != null, { id: 'starknet:braavos', name: 'Braavos', icon: '' }),
			]
	),
})
