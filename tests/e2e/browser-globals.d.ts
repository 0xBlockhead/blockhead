type ArgentXRequest = {
	request(request: {
		type: 'wallet_requestAccounts'
		params: { silent_mode: true }
	}): Promise<string[]>
	request(request: {
		type: 'wallet_requestChainId'
	}): Promise<string>
}

type Cip30Wallet = {
	enable(): Promise<object>
	name?: string
}

type InjectedWeb3Wallet = {
	enable(name: string): Promise<{
		accounts: {
			get(): Promise<Array<{ address: string }>>
		}
	}>
}

type TonkeeperProvider = {
	tonconnect: {
		connect: (...args: never[]) => unknown
		listen: (...args: never[]) => unknown
		restoreConnection: (...args: never[]) => unknown
		send: (...args: never[]) => unknown
	}
}

declare global {
	var blockheadWalletHarnessFixture: boolean
	var starknet_argentX: ArgentXRequest

	interface Window {
		__blockheadClientProbeEnabled?: boolean
		__blockheadPersistedCollectionSchemaVersionOverride?: number
		__blockheadWaSqliteDatabaseNameOverride?: string
		__blockheadWaSqliteVfsNameOverride?: string
		cardano?: Record<string, Cip30Wallet | undefined>
		injectedWeb3?: Record<string, InjectedWeb3Wallet | undefined>
		tonkeeper?: TonkeeperProvider
	}
}

export {}
