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

export type CosmosSdkValidatorDescription = {
	moniker?: string
	identity?: string
	website?: string
	security_contact?: string
	details?: string
}

export type CosmosSdkValidatorCommission = {
	commission_rates?: {
		rate?: string
		max_rate?: string
		max_change_rate?: string
	}
	update_time?: string
}

export type CosmosSdkValidator = {
	operator_address: string
	consensus_pubkey?: JsonValue
	jailed: boolean
	status: string
	tokens: string
	delegator_shares?: string
	description?: CosmosSdkValidatorDescription
	commission?: CosmosSdkValidatorCommission
	min_self_delegation?: string
	/** Transport leftovers — unenrolled beside CosmosValidator_Timestamp.tokens / commissionRate. */
	unbonding_height?: string
	unbonding_time?: string
}

export type CosmosSdkValidatorsResponse = {
	validators: CosmosSdkValidator[]
	pagination?: {
		total?: string
	}
}

export type CosmosSdkValidatorResponse = {
	validator: CosmosSdkValidator
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

export type CosmosSdkIbcHeight = {
	revision_number: string
	revision_height: string
}

export type CosmosSdkIbcChannel = {
	state: string
	ordering: string
	counterparty: {
		port_id: string
		channel_id: string
	}
	connection_hops: string[]
	version: string
	port_id?: string
	channel_id?: string
}

export type CosmosSdkIbcChannelResponse = {
	channel: CosmosSdkIbcChannel
}

export type CosmosSdkIbcChannelsResponse = {
	channels: CosmosSdkIbcChannel[]
	pagination?: CosmosSdkPagination
}

export type CosmosSdkIbcClientConnectionsResponse = {
	connection_paths: string[]
}

export type CosmosSdkIbcConnection = {
	client_id: string
	state: string
	counterparty: {
		client_id: string
		connection_id: string
	}
	delay_period: string
}

export type CosmosSdkIbcConnectionResponse = {
	connection: CosmosSdkIbcConnection
}

export type CosmosSdkIbcConnectionsResponse = {
	connections: (CosmosSdkIbcConnection & {
		id: string
	})[]
	pagination?: CosmosSdkPagination
}

export type CosmosSdkIbcTendermintClientState = {
	'@type': string
	chain_id: string
	trust_level: {
		numerator: string
		denominator: string
	}
	trusting_period: string
	unbonding_period: string
	max_clock_drift: string
	frozen_height: CosmosSdkIbcHeight
	latest_height: CosmosSdkIbcHeight
	/** Transport leftovers — unenrolled beside IbcClient trust/height fields. */
	proof_specs?: JsonValue[]
	upgrade_path?: string[]
	allow_update_after_expiry?: boolean
	allow_update_after_misbehaviour?: boolean
}

export type CosmosSdkIbcClientStateResponse = {
	client_state: CosmosSdkIbcTendermintClientState
}

export type CosmosSdkIbcClientStatesResponse = {
	client_states: {
		client_id: string
		client_state: JsonValue
	}[]
	pagination?: CosmosSdkPagination
}

export type CosmosSdkIbcDenomTraceResponse = {
	denom_trace: {
		path: string
		base_denom: string
	}
}

export type CosmosSdkIbcNextSequenceSendResponse = {
	next_sequence_send: string
}

export type CosmosSdkIbcNextSequenceReceiveResponse = {
	next_sequence_receive: string
}
