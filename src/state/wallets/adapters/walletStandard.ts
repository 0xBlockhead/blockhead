import { WalletCapability, WalletDiscoveryKind, WalletProtocol, WalletTransportKind } from '$/constants/Wallet.ts'
import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
import { SvelteMap } from 'svelte/reactivity'
import type { WalletAdapter } from './types.ts'

type WalletStandardWallet = {
	name: string
	icon?: string
	version?: string
}

type WalletStandardRegisterWalletEvent = CustomEvent<{
	register(wallet: WalletStandardWallet): void
}>

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
					WalletCapability.Connect,
					WalletCapability.Reconnect,
					WalletCapability.ListAccounts,
					WalletCapability.WatchAccounts,
					WalletCapability.SignMessage,
					WalletCapability.SignTransaction,
					WalletCapability.SendTransaction,
				],
			}))
		)
		const onRegisterWallet = (event: WalletStandardRegisterWalletEvent) => {
			event.detail.register((wallet) => {
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
		connectedAt: Date.now(),
		error: 'Wallet Standard discovery is available, but connection is not implemented yet.',
	}),
	disconnect: () => {},
	subscribeConnection: () => () => {},
})
