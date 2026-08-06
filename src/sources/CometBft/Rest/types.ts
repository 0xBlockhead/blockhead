export type CometBftBlockResponse = {
	result: {
		block_id: {
			hash: string
		}
		block: {
			header: {
				height: string
				time: string
				proposer_address: string
			}
			data: {
				txs?: string[]
			}
		}
	}
}

export type CometBftTxResponse = {
	result: {
		hash: string
		height: string
		index: number
		tx_result: {
			code: number
			codespace?: string
			gas_wanted: string
			gas_used: string
			log?: string
			events?: {
				type: string
			}[]
		}
	}
}
