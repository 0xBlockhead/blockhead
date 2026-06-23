import type {
	WalletStandardRegisterWalletEvent,
	WalletStandardWallet,
} from '$/sources/WalletStandard/WalletApi/types.ts'

declare global {
	interface WindowEventMap {
		'wallet-standard:register-wallet': WalletStandardRegisterWalletEvent
	}
}

export const discoverWallets = () => {
	const wallets: WalletStandardWallet[] = []
	if (typeof window === 'undefined')
		return wallets

	const onRegisterWallet = (event: WalletStandardRegisterWalletEvent) => {
		event.detail.register((wallet: WalletStandardWallet) => {
			wallets.push(wallet)
		})
	}

	window.addEventListener('wallet-standard:register-wallet', onRegisterWallet)
	window.dispatchEvent(new Event('wallet-standard:app-ready'))
	window.removeEventListener('wallet-standard:register-wallet', onRegisterWallet)

	return wallets
}
