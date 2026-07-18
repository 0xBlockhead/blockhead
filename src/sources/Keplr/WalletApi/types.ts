export type KeplrWallet = {
	enable: (chainIds: string | string[]) => Promise<void>
	getOfflineSigner: (chainId: string, signOptions?: KeplrSignOptions) => KeplrOfflineSigner
	getOfflineSignerOnlyAmino: (chainId: string, signOptions?: KeplrSignOptions) => KeplrOfflineAminoSigner
	getOfflineSignerAuto: (chainId: string, signOptions?: KeplrSignOptions) => Promise<KeplrOfflineAminoSigner | KeplrOfflineSigner>
	signAmino: (chainId: string, signer: string, signDoc: KeplrSignDoc, signOptions?: KeplrSignOptions) => Promise<KeplrAminoSignResponse>
	signDirect: (chainId: string, signer: string, signDoc: KeplrDirectSignDoc, signOptions?: KeplrSignOptions) => Promise<KeplrDirectSignResponse>
	signEIP712CosmosTx0707?: (chainId: string, signer: string, eip712: KeplrEIP712, signDoc: KeplrSignDoc, signOptions?: KeplrSignOptions) => Promise<KeplrDirectSignResponse>
}

export type KeplrSignOptions = {
	preferNoSetFee?: boolean
	preferNoSetMemo?: boolean
	disableBalanceCheck?: boolean
}

export type KeplrOfflineSigner = {
	getAccounts: () => Promise<readonly KeplrAccount[]>
	signDirect: (signerAddress: string, signDoc: KeplrDirectSignDoc) => Promise<KeplrDirectSignResponse>
}

export type KeplrOfflineAminoSigner = {
	getAccounts: () => Promise<readonly KeplrAccount[]>
	signAmino: (signerAddress: string, signDoc: KeplrSignDoc) => Promise<KeplrAminoSignResponse>
}

export type KeplrAccount = {
	address: string
	pubkey: Uint8Array
	algo: string
}

export type KeplrSignDoc = {
	account_number?: string
	chain_id?: string
	fee?: KeplrFee
	memo?: string
	msgs: readonly KeplerMessage[]
	sequence?: string
	timeout_height?: string
}

export type KeplrFee = {
	amount: readonly KeplrCoin[]
	gas: string
}

export type KeplrCoin = {
	amount: string
	denom: string
}

export type KeplerMessage = {
	type: string
	value: Record<string, unknown>
}

export type KeplrAminoSignResponse = {
	signature: KeplrSignature
	signed: KeplrSignDoc
}

export type KeplrDirectSignDoc = {
	bodyBytes: Uint8Array
	authInfoBytes: Uint8Array
	chainId: string
	accountNumber: string
}

export type KeplrDirectSignResponse = {
	signature: KeplrSignature
	signed: KeplrDirectSignDoc
}

export type KeplrSignature = {
	pub_key: {
		type: string
		value: string
	}
	signature: string
}

export type KeplrEIP712 = {
	types: Record<string, readonly { name: string; type: string }[]>
	primaryType: string
	domain: Record<string, string | number>
	message: Record<string, unknown>
}
