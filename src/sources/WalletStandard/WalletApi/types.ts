export type WalletStandardWallet = {
	name: string
	icon?: string
	features?: object
}

export type WalletStandardRegisterWalletEvent = CustomEvent<{
	register(wallet: WalletStandardWallet): void
}>

declare global {
	interface WindowEventMap {
		'wallet-standard:register-wallet': WalletStandardRegisterWalletEvent
	}
}
