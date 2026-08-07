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
				/** Transport leftovers — unenrolled beside CosmosBlock hash/height/proposer/time/tx-count. */
				version?: {
					block?: string
					app?: string
				}
				last_block_id?: {
					hash?: string
					parts?: {
						total?: number
						hash?: string
					}
				}
				last_commit_hash?: string
				data_hash?: string
				validators_hash?: string
				next_validators_hash?: string
				consensus_hash?: string
				app_hash?: string
				last_results_hash?: string
				evidence_hash?: string
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
				/** Transport leftover — event attributes unenrolled beside eventTypes. */
				attributes?: {
					key: string
					value?: string
					index?: boolean
				}[]
			}[]
		}
		/** Transport leftover — raw tx bytes; unenrolled on CosmosTransaction. */
		tx?: string
	}
}

export type CometBftStatusResponse = {
	result: {
		node_info: {
			network: string
			version?: string
			moniker?: string
			/** Transport leftovers — unenrolled beside Network_Timestamp chainId/nodeNetwork. */
			id?: string
			listen_addr?: string
			channels?: string
			protocol_version?: {
				p2p?: string
				block?: string
				app?: string
			}
			other?: {
				tx_index?: string
				rpc_address?: string
			}
		}
		sync_info: {
			latest_block_hash: string
			latest_block_height: string
			latest_block_time: string
			catching_up: boolean
			/** Transport leftovers — pruning window; unenrolled on Network_Timestamp.Cosmos tip. */
			latest_app_hash?: string
			earliest_block_hash?: string
			earliest_app_hash?: string
			earliest_block_height?: string
			earliest_block_time?: string
		}
		/** Transport leftover — local validator card; unenrolled (no CosmosValidator from CometBFT). */
		validator_info?: {
			address?: string
			pub_key?: {
				type?: string
				value?: string
			}
			voting_power?: string
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
