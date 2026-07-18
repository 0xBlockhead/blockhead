export type PontemWallet = {
	connect: () => Promise<PontemAccount>
	disconnect: () => Promise<void>
	account: PontemAccount | null
	signAndSubmitTransaction: (transaction: PontemTransaction) => Promise<PontemTransactionResponse>
	signTransaction: (transaction: PontemTransaction) => Promise<Uint8Array>
	signMessage: (message: string | Uint8Array) => Promise<PontemSignatureResponse>
	getNetwork: () => Promise<PontemNetworkInfo>
	onNetworkChange: (callback: (network: PontemNetworkInfo) => void) => void
	onAccountChange: (callback: (account: PontemAccount | null) => void) => void
}

export type PontemAccount = {
	address: string
	publicKey: string
}

export type PontemTransaction = {
	data: {
		function: string
		typeArguments: string[]
		functionArguments: (string | number | boolean | object)[]
	}
}

export type PontemTransactionResponse = {
	hash: string
}

export type PontemSignatureResponse = {
	signature: string
	publicKey: string
}

export type PontemNetworkInfo = {
	name: string
	chainId: string
}
