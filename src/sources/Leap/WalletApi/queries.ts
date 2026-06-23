import type { LeapWallet } from '$/sources/Leap/WalletApi/types.ts'

declare global {
	interface Window {
		leap?: LeapWallet
	}
}

export const getWallet = () => (
	typeof window === 'undefined' ?
		undefined
	:
		window.leap
)
