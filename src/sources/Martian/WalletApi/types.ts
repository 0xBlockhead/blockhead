export type MartianWallet = {
	connect: () => Promise<MartianAccount>
	disconnect: () => Promise<void>
	account: MartianAccount | null
	signAndSubmitTransaction: (transaction: MartianTransaction) => Promise<MartianTransactionResponse>
	signTransaction: (transaction: MartianTransaction) => Promise<Uint8Array>
	signMessage: (message: string | Uint8Array) => Promise<MartianSignatureResponse>
	getNetwork: () => Promise<MartianNetworkInfo>
	onNetworkChange: (callback: (network: MartianNetworkInfo) => void) => void
	onAccountChange: (callback: (account: MartianAccount | null) => void) => void
}

export type MartianAccount = {
	address: string
	publicKey: string
}

export type MartianTransaction = {
	data: {
		function: string
		typeArguments: string[]
		functionArguments: (string | number | boolean | object)[]
	}
}

export type MartianTransactionResponse = {
	hash: string
}

export type MartianSignatureResponse = {
	signature: string
	publicKey: string
}

export type MartianNetworkInfo = {
	name: string
	chainId: string
}
