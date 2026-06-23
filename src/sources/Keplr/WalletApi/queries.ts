import type { KeplrWallet } from '$/sources/Keplr/WalletApi/types.ts'

declare global {
	interface Window {
		keplr?: KeplrWallet
	}
}

export const getWallet = () => (
	typeof window === 'undefined' ?
		undefined
	:
		window.keplr
)
