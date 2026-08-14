import { type as arktype } from 'arktype'


const unsignedSafe = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)
const signedSafe = arktype(`number.integer >= ${Number.MIN_SAFE_INTEGER} <= ${Number.MAX_SAFE_INTEGER}`)
const nonEmptyString = arktype('string > 0')
const lovelaceQuantity = arktype('/^(0|[1-9][0-9]*)$/')

export const blockfrostAmountWire = arktype({
	unit: nonEmptyString,
	quantity: lovelaceQuantity,
})

export const blockfrostBlockWire = arktype({
	time: unsignedSafe,
	height: unsignedSafe.or(arktype('null')),
	hash: nonEmptyString,
	slot: unsignedSafe.or(arktype('null')),
	epoch: unsignedSafe.or(arktype('null')),
	epoch_slot: unsignedSafe.or(arktype('null')),
	slot_leader: nonEmptyString,
	size: unsignedSafe,
	tx_count: unsignedSafe,
	output: lovelaceQuantity.or(arktype('null')),
	fees: lovelaceQuantity.or(arktype('null')),
	block_vrf: 'string | null',
	op_cert: 'string | null',
	op_cert_counter: 'string | null',
	previous_block: 'string | null',
	next_block: 'string | null',
	confirmations: unsignedSafe,
})

export const blockfrostAddressWire = arktype({
	address: nonEmptyString,
	amount: blockfrostAmountWire.array(),
	stake_address: 'string | null',
	type: "'byron' | 'shelley'",
	script: 'boolean',
})

export const blockfrostAddressTotalWire = arktype({
	address: nonEmptyString,
	received_sum: blockfrostAmountWire.array(),
	sent_sum: blockfrostAmountWire.array(),
	tx_count: unsignedSafe,
})

export const blockfrostAddressTransactionWire = arktype({
	tx_hash: nonEmptyString,
	tx_index: unsignedSafe,
	block_height: unsignedSafe,
	block_time: unsignedSafe,
})

export const blockfrostAddressUtxoWire = arktype({
	address: nonEmptyString,
	tx_hash: nonEmptyString,
	tx_index: unsignedSafe,
	output_index: unsignedSafe,
	amount: blockfrostAmountWire.array(),
	block: nonEmptyString,
	'data_hash?': 'string | null',
	'inline_datum?': 'string | null',
	'reference_script_hash?': 'string | null',
})

export const blockfrostTransactionWire = arktype({
	hash: nonEmptyString,
	block: nonEmptyString,
	block_height: unsignedSafe,
	block_time: unsignedSafe,
	slot: unsignedSafe,
	index: unsignedSafe,
	output_amount: blockfrostAmountWire.array(),
	fees: lovelaceQuantity,
	deposit: lovelaceQuantity,
	size: unsignedSafe,
	invalid_before: 'string | null',
	invalid_hereafter: 'string | null',
	utxo_count: unsignedSafe,
	withdrawal_count: unsignedSafe,
	mir_cert_count: unsignedSafe,
	delegation_count: unsignedSafe,
	stake_cert_count: unsignedSafe,
	pool_update_count: unsignedSafe,
	pool_retire_count: unsignedSafe,
	asset_mint_or_burn_count: unsignedSafe,
	redeemer_count: unsignedSafe,
	valid_contract: 'boolean',
})

export const blockfrostTransactionUtxoPortWire = arktype({
	address: nonEmptyString,
	amount: blockfrostAmountWire.array(),
	tx_hash: nonEmptyString,
	output_index: unsignedSafe,
	'data_hash?': 'string | null',
	'inline_datum?': 'string | null',
	'collateral?': 'boolean',
	'reference?': 'boolean',
	'reference_script_hash?': 'string | null',
	'consumed_by_tx?': nonEmptyString.or(arktype('null')),
})

export const blockfrostTransactionUtxosWire = arktype({
	hash: nonEmptyString,
	inputs: blockfrostTransactionUtxoPortWire.array(),
	outputs: blockfrostTransactionUtxoPortWire.array(),
})

export const blockfrostStakePoolWire = arktype({
	pool_id: nonEmptyString,
	hex: nonEmptyString,
	vrf_key: nonEmptyString,
	blocks_minted: unsignedSafe,
	blocks_epoch: unsignedSafe,
	live_stake: lovelaceQuantity,
	live_size: 'number',
	live_saturation: 'number',
	live_delegators: unsignedSafe,
	active_stake: lovelaceQuantity,
	active_size: 'number',
	declared_pledge: lovelaceQuantity,
	live_pledge: lovelaceQuantity,
	margin_cost: 'number',
	fixed_cost: lovelaceQuantity,
	reward_account: nonEmptyString,
	owners: arktype('string').array(),
	registration: arktype('string').array(),
	retirement: arktype('string').array(),
})

export const blockfrostStakePoolMetadataWire = arktype({
	pool_id: nonEmptyString,
	hex: nonEmptyString,
	url: 'string | null',
	hash: 'string | null',
	ticker: 'string | null',
	name: 'string | null',
	description: 'string | null',
	homepage: 'string | null',
})

export const blockfrostAccountWire = arktype({
	stake_address: nonEmptyString,
	active: 'boolean',
	registered: 'boolean',
	active_epoch: unsignedSafe.or(arktype('null')),
	controlled_amount: lovelaceQuantity,
	rewards_sum: lovelaceQuantity,
	withdrawals_sum: lovelaceQuantity,
	reserves_sum: lovelaceQuantity,
	treasury_sum: lovelaceQuantity,
	withdrawable_amount: lovelaceQuantity,
	pool_id: 'string | null',
	'drep_id?': 'string | null',
})

export const blockfrostAccountAddressWire = arktype({
	address: nonEmptyString,
})

export const blockfrostEpochWire = arktype({
	epoch: unsignedSafe,
	start_time: unsignedSafe,
	end_time: unsignedSafe,
	first_block_time: unsignedSafe,
	last_block_time: unsignedSafe,
	block_count: unsignedSafe,
	tx_count: unsignedSafe,
	output: lovelaceQuantity,
	fees: lovelaceQuantity,
	active_stake: lovelaceQuantity.or(arktype('null')),
})

export const blockfrostNetworkWire = arktype({
	supply: {
		max: lovelaceQuantity,
		total: lovelaceQuantity,
		circulating: lovelaceQuantity,
		locked: lovelaceQuantity,
		treasury: lovelaceQuantity,
		reserves: lovelaceQuantity,
	},
	stake: {
		live: lovelaceQuantity,
		active: lovelaceQuantity,
	},
})

export const blockfrostProtocolParametersWire = arktype({
	epoch: unsignedSafe,
	'min_fee_a?': unsignedSafe,
	'min_fee_b?': unsignedSafe,
	'max_block_size?': unsignedSafe,
	'max_tx_size?': unsignedSafe,
	'max_block_header_size?': unsignedSafe,
	'key_deposit?': lovelaceQuantity,
	'pool_deposit?': lovelaceQuantity,
	'e_max?': unsignedSafe,
	'n_opt?': unsignedSafe,
	'a0?': 'number',
	'rho?': 'number',
	'tau?': 'number',
	'decentralisation_param?': 'number',
	'extra_entropy?': 'string | null',
	'protocol_major_ver?': unsignedSafe,
	'protocol_minor_ver?': unsignedSafe,
	'min_utxo?': lovelaceQuantity,
	'min_pool_cost?': lovelaceQuantity,
	'nonce?': 'string',
	'cost_models?': 'unknown',
	'cost_models_raw?': 'unknown',
	'price_mem?': 'number | null',
	'price_step?': 'number | null',
	'max_tx_ex_mem?': 'string | null',
	'max_tx_ex_steps?': 'string | null',
	'max_block_ex_mem?': 'string | null',
	'max_block_ex_steps?': 'string | null',
	'max_val_size?': 'string | null',
	'collateral_percent?': signedSafe.or(arktype('null')),
	'max_collateral_inputs?': unsignedSafe.or(arktype('null')),
	'coins_per_utxo_size?': lovelaceQuantity.or(arktype('null')),
	'coins_per_utxo_word?': lovelaceQuantity.or(arktype('null')),
})

export const blockfrostHealthWire = arktype({
	is_healthy: 'boolean',
})

export const blockfrostAssetListItemWire = arktype({
	asset: nonEmptyString,
	quantity: lovelaceQuantity,
})

export const blockfrostAssetWire = arktype({
	asset: nonEmptyString,
	policy_id: nonEmptyString,
	asset_name: 'string | null',
	fingerprint: nonEmptyString,
	quantity: lovelaceQuantity,
	initial_mint_tx_hash: nonEmptyString,
	mint_or_burn_count: unsignedSafe,
	'onchain_metadata?': 'unknown',
	'onchain_metadata_standard?': 'string | null',
	'onchain_metadata_extra?': 'string | null',
	'metadata?': 'unknown',
})

export const blockfrostDRepListItemWire = arktype({
	drep_id: nonEmptyString,
	hex: nonEmptyString,
	amount: lovelaceQuantity,
	has_script: 'boolean',
	retired: 'boolean',
	expired: 'boolean',
	last_active_epoch: unsignedSafe.or(arktype('null')),
	'metadata?': arktype({
		url: 'string | null',
		hash: 'string | null',
		json_metadata: 'unknown',
		bytes: 'string | null',
	}).or(arktype('null')),
})

export const blockfrostDRepWire = arktype({
	drep_id: nonEmptyString,
	hex: nonEmptyString,
	amount: lovelaceQuantity,
	active: 'boolean',
	active_epoch: unsignedSafe.or(arktype('null')),
	has_script: 'boolean',
	retired: 'boolean',
	expired: 'boolean',
})

export const blockfrostDRepMetadataWire = arktype({
	drep_id: nonEmptyString,
	hex: nonEmptyString,
	url: 'string | null',
	hash: 'string | null',
	json_metadata: 'unknown',
	bytes: 'string | null',
})

export const blockfrostDRepVoteWire = arktype({
	tx_hash: nonEmptyString,
	cert_index: unsignedSafe,
	proposal_tx_hash: nonEmptyString,
	proposal_cert_index: unsignedSafe,
	vote: "'yes' | 'no' | 'abstain'",
})

export const blockfrostGovernanceProposalListItemWire = arktype({
	'id?': nonEmptyString,
	tx_hash: nonEmptyString,
	cert_index: unsignedSafe,
	governance_type: nonEmptyString,
})

export const blockfrostGovernanceProposalWire = arktype({
	'id?': nonEmptyString,
	tx_hash: nonEmptyString,
	cert_index: unsignedSafe,
	governance_type: nonEmptyString,
	deposit: lovelaceQuantity,
	'return_address?': 'string',
	'governance_description?': 'unknown',
	'ratified_epoch?': unsignedSafe.or(arktype('null')),
	'enacted_epoch?': unsignedSafe.or(arktype('null')),
	'dropped_epoch?': unsignedSafe.or(arktype('null')),
	'expired_epoch?': unsignedSafe.or(arktype('null')),
	'expiration?': unsignedSafe.or(arktype('null')),
})

export const blockfrostGovernanceProposalMetadataWire = arktype({
	tx_hash: nonEmptyString,
	cert_index: unsignedSafe,
	url: 'string | null',
	hash: 'string | null',
	json_metadata: 'unknown',
	bytes: 'string | null',
})

export const blockfrostGovernanceProposalVoteWire = arktype({
	tx_hash: nonEmptyString,
	cert_index: unsignedSafe,
	voter_role: nonEmptyString,
	vote: "'yes' | 'no' | 'abstain'",
})

export const blockfrostCommitteeWire = arktype({
	gov_action_id: 'string | null',
	proposal_tx_hash: 'string | null',
	proposal_index: unsignedSafe.or(arktype('null')),
	is_dissolved: 'boolean',
	quorum: {
		numerator: unsignedSafe,
		denominator: unsignedSafe,
	},
	members: arktype({
		status: nonEmptyString,
		'cc_hot_id?': 'string | null',
		'cc_cold_id?': 'string | null',
		'expiration_epoch?': unsignedSafe.or(arktype('null')),
	}).array(),
})

export const blockfrostCommitteeVoteWire = arktype({
	tx_hash: nonEmptyString,
	voter_hot_id: nonEmptyString,
	proposal_id: nonEmptyString,
	proposal_tx_hash: nonEmptyString,
	proposal_index: unsignedSafe,
	governance_type: nonEmptyString,
	vote: "'yes' | 'no' | 'abstain'",
	metadata_url: 'string | null',
	metadata_hash: 'string | null',
	block_height: unsignedSafe,
	block_time: unsignedSafe,
})

export const assertBlockfrostEnvelope = <_Value>(
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown,
	label: string
): _Value => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Blockfrost_Rest: invalid ${label} envelope`)
	}
}
