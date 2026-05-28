import type { JsonValue } from '$/typescript/JsonValue.ts'

export type CosmosSdkBlockResponse = {
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

export type CosmosSdkTxResponse = {
	tx?: {
		body?: {
			memo?: string
			messages?: {
				'@type'?: string
				signer?: string
				sender?: string
				contract?: string
			}[]
		}
	}
	tx_response: {
		height: string
		txhash: string
		code: number
		gas_wanted: string
		gas_used: string
		raw_log: string
	}
}

export type CosmosSdkProposalResponse = {
	proposal: {
		id: string
		title?: string
		summary?: string
		status: string
		messages?: {
			content?: {
				title?: string
				description?: string
			}
		}[]
	}
}

export type CosmosSdkDenomMetadataResponse = {
	metadata: {
		base: string
		display: string
		symbol: string
	}
}

export type CosmosSdkModuleAccountResponse = {
	account?: {
		name?: string
		base_account?: {
			address?: string
		}
	}
}

export type CosmosSdkContractInfoResponse = {
	contract_info: {
		code_id: string
		creator: string
		admin?: string
	}
}

export type CosmosSdkAccountResponse = {
	account?: {
		account_number?: string
		sequence?: string
		base_account?: {
			account_number?: string
			sequence?: string
		}
	}
}

export type CosmosSdkValidatorsResponse = {
	validators: {
		operator_address: string
		consensus_pubkey?: JsonValue
		jailed: boolean
		status: string
		tokens: string
		description?: {
			moniker?: string
		}
	}[]
}

export type CosmosSdkValidatorResponse = {
	validator: CosmosSdkValidatorsResponse['validators'][number]
}
