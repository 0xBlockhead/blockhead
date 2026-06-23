import type { PolkadotInjectedWeb3Wallet } from '$/sources/PolkadotInjectedWeb3/WalletApi/types.ts'

declare global {
	interface Window {
		injectedWeb3?: Record<string, PolkadotInjectedWeb3Wallet>
	}
}

export const getWallets = () => (
	typeof window === 'undefined' ?
		{}
	:
		window.injectedWeb3 ?? {}
)

export const enableWallet = ({
	walletKey,
	appName,
}: {
	walletKey: string
	appName: string
}) => (
	getWallets()[walletKey]?.enable(appName)
)
