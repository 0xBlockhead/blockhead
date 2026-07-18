export type AptosAip62Wallet = {
	connect: () => Promise<AptosAip62Account>
	disconnect: () => Promise<void>
	account: AptosAip62Account | null
	signAndSubmitTransaction: (transaction: AptosAip62Transaction) => Promise<AptosAip62TransactionResponse>
	signTransaction: (transaction: AptosAip62Transaction) => Promise<Uint8Array>
	signMessage: (message: string | Uint8Array) => Promise<AptosAip62SignatureResponse>
	getNetwork: () => Promise<AptosAip62NetworkInfo>
	onNetworkChange: (callback: (network: AptosAip62NetworkInfo) => void) => void
	onAccountChange: (callback: (account: AptosAip62Account | null) => void) => void
}

export type AptosAip62Account = {
	address: string
	publicKey: string
}

export type AptosAip62Transaction = {
	data: {
		function: string
		typeArguments: string[]
		functionArguments: (string | number | boolean | object)[]
	}
}

export type AptosAip62TransactionResponse = {
	hash: string
}

export type AptosAip62SignatureResponse = {
	signature: string
	publicKey: string
}

export type AptosAip62NetworkInfo = {
	name: string
	chainId: string
}
