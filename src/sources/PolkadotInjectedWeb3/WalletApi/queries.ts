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
