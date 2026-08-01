export type ArweaveTransactionTagWire = {
	name: string
	value: string
}

export type ArweaveTransactionWire = {
	format: number
	id: string
	last_tx: string
	owner: string
	tags: ArweaveTransactionTagWire[]
	target: string
	quantity: string
	data: string
	data_size: string
	data_root: string
	reward: string
	signature: string
}

export type ArweaveTransactionStatus = {
	block_height: number
	block_indep_hash: string
	number_of_confirmations: number
}
