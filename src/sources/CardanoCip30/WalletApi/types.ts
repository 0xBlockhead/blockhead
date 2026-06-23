export type CardanoCip30WalletApi = {
	getUsedAddresses(): Promise<string[]>
	getUnusedAddresses?(): Promise<string[]>
	getNetworkId?(): Promise<number>
}

export type CardanoCip30Wallet = {
	name?: string
	icon?: string
	enable(): Promise<CardanoCip30WalletApi>
}
