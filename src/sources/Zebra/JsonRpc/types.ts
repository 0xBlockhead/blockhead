export type ZebraTransparentAddressUtxo = {
	address: string
	txid: string
	height: number
	outputIndex: number
	script: string
	satoshis: number
}

export type ZebraTransparentAddressUtxos = {
	utxos: ZebraTransparentAddressUtxo[]
	hash: string
	height: number
}
