import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter } from './types.ts'
import type {
	WalletStandardRegisterWalletEvent,
	WalletStandardWallet,
} from '$/sources/WalletStandard/WalletApi/types.ts'

export const createWalletStandardAdapter = (): WalletAdapter => ({
	id: 'wallet-standard',
	start: (updateCandidates) => {
		if (typeof window === 'undefined') return () => {}

		const walletByName = new SvelteMap<string, WalletStandardWallet>()
		const emitCandidates = () => updateCandidates(
			[...walletByName.values()].map((wallet) => ({
				id: `wallet-standard:${wallet.name}`,
				name: wallet.name,
				icon: wallet.icon ?? '',
				protocol: WalletProtocol.WalletStandard,
				discoveryKind: WalletDiscoveryKind.Registry,
				transportKind: WalletTransportKind.InjectedSigner,
				capabilities: [
					WalletCapability.Discover,
				],
			}))
		)
		const onRegisterWallet = (event: WalletStandardRegisterWalletEvent) => {
			event.detail.register((wallet: WalletStandardWallet) => {
				walletByName.set(wallet.name, wallet)
				emitCandidates()
			})
		}

		window.addEventListener('wallet-standard:register-wallet', onRegisterWallet)
		window.dispatchEvent(new Event('wallet-standard:app-ready'))

		return () => {
			window.removeEventListener('wallet-standard:register-wallet', onRegisterWallet)
			walletByName.clear()
		}
	},
	connect: async (walletId) => ({
		walletId,
		status: BlockheadConnectionStatus.Disconnected,
		protocol: WalletProtocol.WalletStandard,
		transportKind: WalletTransportKind.InjectedSigner,
		scopes: [],
		accounts: [],
		selected: false,
		error: 'Wallet Standard discovery is available, but connection is not implemented yet.',
	}),
	disconnect: () => {},
	subscribeConnection: () => () => {},
})
