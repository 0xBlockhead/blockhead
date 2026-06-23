export type PolkadotInjectedExtension = {
	accounts: {
		get(): Promise<{ address: string, name?: string }[]>
	}
}

export type PolkadotInjectedWeb3Wallet = {
	enable(appName: string): Promise<PolkadotInjectedExtension>
}
