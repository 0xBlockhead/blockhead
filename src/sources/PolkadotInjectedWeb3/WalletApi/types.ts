export type PolkadotInjectedAccount = {
	address: string
	genesisHash?: string | null
	name?: string
}

export type PolkadotInjectedExtension = {
	accounts: {
		get(
			anyType?: boolean,
			genesisHash?: string
		): Promise<PolkadotInjectedAccount[]>
		subscribe(callback: (accounts: PolkadotInjectedAccount[]) => void): () => void
	}
}

export type PolkadotInjectedWeb3Wallet = {
	enable(appName: string): Promise<PolkadotInjectedExtension>
}

declare global {
	interface Window {
		injectedWeb3?: Record<string, PolkadotInjectedWeb3Wallet>
	}
}
