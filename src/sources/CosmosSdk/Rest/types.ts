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

export type CosmosSdkNodeInfoResponse = {
	default_node_info: {
		network: string
		version?: string
		moniker?: string
	}
	application_version?: {
		name?: string
		app_name?: string
		version?: string
		cosmos_sdk_version?: string
	}
}

export type CosmosSdkSyncingResponse = {
	syncing: boolean
}

export type CosmosSdkTx = {
	body?: {
		memo?: string
		timeout_height?: string
		messages?: {
			'@type'?: string
			signer?: string
			sender?: string
			from_address?: string
			contract?: string
		}[]
	}
	auth_info?: {
		fee?: {
			amount?: {
				denom: string
				amount: string
			}[]
			gas_limit?: string
		}
	}
	signatures?: string[]
}

export type CosmosSdkTxResponse = {
	tx?: CosmosSdkTx
	tx_response: {
		height: string
		txhash: string
		code: number
		codespace?: string
		gas_wanted: string
		gas_used: string
		raw_log: string
		timestamp?: string
		events?: {
			type: string
		}[]
	}
}

export type CosmosSdkTxsEventResponse = {
	txs: CosmosSdkTx[]
	tx_responses: CosmosSdkTxResponse['tx_response'][]
	pagination?: {
		next_key?: string | null
		total?: string
	}
	total: string
}

export type CosmosSdkCoin = {
	denom: string
	amount: string
}

export type CosmosSdkPagination = {
	next_key?: string | null
	total?: string
}

export type CosmosSdkGovernanceAny = {
	'@type': string
	[key: string]: JsonValue
}

export type CosmosSdkTally = {
	yes_count: string
	abstain_count: string
	no_count: string
	no_with_veto_count: string
}

export type CosmosSdkProposal = {
	id: string
	messages: CosmosSdkGovernanceAny[]
	status: string
	final_tally_result?: CosmosSdkTally
	submit_time?: string
	deposit_end_time?: string
	total_deposit: CosmosSdkCoin[]
	voting_start_time?: string
	voting_end_time?: string
	metadata: string
	title: string
	summary: string
	proposer?: string
	expedited?: boolean
	failed_reason?: string
}

export type CosmosSdkProposalResponse = {
	proposal: CosmosSdkProposal
}

export type CosmosSdkWeightedVoteOption = {
	option: string
	weight: string
}

export type CosmosSdkVote = {
	proposal_id: string
	voter: string
	options: CosmosSdkWeightedVoteOption[]
	metadata?: string
}

export type CosmosSdkVoteResponse = {
	vote: CosmosSdkVote
}

export type CosmosSdkVotesResponse = {
	votes: CosmosSdkVote[]
	pagination?: CosmosSdkPagination
}

export type CosmosSdkDeposit = {
	proposal_id: string
	depositor: string
	amount: CosmosSdkCoin[]
}

export type CosmosSdkDepositResponse = {
	deposit: CosmosSdkDeposit
}

export type CosmosSdkDepositsResponse = {
	deposits: CosmosSdkDeposit[]
	pagination?: CosmosSdkPagination
}

export type CosmosSdkTallyResponse = {
	tally: CosmosSdkTally
}

export type CosmosSdkDenomMetadataResponse = {
	metadata: {
		name: string
		description: string
		base: string
		display: string
		symbol: string
		denom_units: {
			denom: string
			exponent: number
			aliases: string[]
		}[]
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

export type CosmosSdkAccount = {
	'@type'?: string
	address?: string
	account_number?: string
	sequence?: string
	base_account?: {
		address?: string
		account_number?: string
		sequence?: string
	}
	base_vesting_account?: {
		base_account?: {
			address?: string
			account_number?: string
			sequence?: string
		}
	}
}

export type CosmosSdkAccountResponse = {
	account?: CosmosSdkAccount
}

export type CosmosSdkAccountsResponse = {
	accounts: CosmosSdkAccount[]
	pagination?: {
		total?: string
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
	pagination?: {
		total?: string
	}
}

export type CosmosSdkValidatorResponse = {
	validator: CosmosSdkValidatorsResponse['validators'][number]
}

export type CosmosSdkStakingPoolResponse = {
	pool: {
		bonded_tokens: string
		not_bonded_tokens: string
	}
}

export type CosmosSdkProposalsResponse = {
	proposals: CosmosSdkProposal[]
	pagination?: CosmosSdkPagination
}

export type CosmosSdkBalancesResponse = {
	balances: {
		denom: string
		amount: bigint
	}[]
	blockHeight: bigint
	continuationToken?: string
	total?: bigint
}

export type CosmosSdkDelegationResponse = {
	delegation: {
		delegator_address: string
		validator_address: string
		shares: string
	}
	balance: CosmosSdkCoin
}

export type CosmosSdkDelegationsResponse = {
	delegation_responses: CosmosSdkDelegationResponse[]
	pagination?: CosmosSdkPagination
}

export type CosmosSdkDelegationRewardsResponse = {
	rewards: {
		validator_address: string
		reward: CosmosSdkCoin[]
	}[]
	total: CosmosSdkCoin[]
}
