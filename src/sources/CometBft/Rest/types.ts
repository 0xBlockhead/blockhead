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
				chain_id?: string
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

export type CometBftStatusResponse = {
	result: {
		node_info: {
			network: string
			version?: string
			moniker?: string
		}
		sync_info: {
			latest_block_hash: string
			latest_block_height: string
			latest_block_time: string
			catching_up: boolean
		}
	}
}

export type CometBftBlockchainResponse = {
	result: {
		last_height: string
		block_metas: {
			block_id: {
				hash: string
			}
			header: {
				height: string
				time: string
				proposer_address: string
				chain_id?: string
			}
			num_txs: string
		}[]
	}
}
