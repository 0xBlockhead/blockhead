import type { CardanoCip30Wallet } from '$/sources/CardanoCip30/WalletApi/types.ts'

declare global {
	interface Window {
		cardano?: Record<string, CardanoCip30Wallet>
	}
}

export const getWallets = () => (
	typeof window === 'undefined' ?
		{}
	:
		window.cardano ?? {}
)

export const enableWallet = (
	walletKey: string
) => (
	getWallets()[walletKey]?.enable()
)
