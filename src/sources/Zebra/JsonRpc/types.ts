export type {
	ZcashBlock as ZebraBlock,
	ZcashTransaction as ZebraTransaction,
} from '$/sources/Zcashd/JsonRpc/types.ts'

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
