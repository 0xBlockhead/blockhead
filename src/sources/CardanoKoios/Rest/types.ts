import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	CardanoGovernanceAction,
	CardanoGovernanceActionTag,
} from '$/sources/_shared/interfaces/CardanoGovernance/types.ts'
import {
	type as arktype,
	type Type,
} from 'arktype'


export interface CardanoKoiosTip {
	hash: string
	epoch_no: number
	era: string
	abs_slot: number
	block_height: number
	block_time: number
}

export const cardanoKoiosTip = arktype({
	hash: 'string',
	epoch_no: 'number.integer >= 0',
	era: 'string',
	abs_slot: 'number.integer >= 0',
	block_height: 'number.integer >= 0',
	block_time: 'number.integer >= 0',
}) satisfies Type<CardanoKoiosTip>

export interface CardanoKoiosBlock extends CardanoKoiosTip {
	tx_count: number
	vrf_key?: string | null
}

export const cardanoKoiosBlock = cardanoKoiosTip.and({
	tx_count: 'number.integer >= 0',
	'vrf_key?': 'string | null',
}) satisfies Type<CardanoKoiosBlock>

export interface CardanoKoiosBlockInfo extends CardanoKoiosBlock {
	vrf_key: string | null
}

export const cardanoKoiosBlockInfo = cardanoKoiosBlock.and({
	vrf_key: 'string | null',
}) satisfies Type<CardanoKoiosBlockInfo>

export interface CardanoKoiosBlockTransaction {
	tx_hash: string
}

export const cardanoKoiosBlockTransaction = arktype({
	tx_hash: 'string',
}) satisfies Type<CardanoKoiosBlockTransaction>

export interface CardanoKoiosTransactionCertificate {
	info: JsonValue
	type: string
	index: number
}

export interface CardanoKoiosTransactionNativeScript {
	script_hash: string
	type?: string
	script?: JsonValue
}

export interface CardanoKoiosTransactionPlutusContract {
	script_hash: string
	input: {
		datum: JsonValue | null
		redeemer: {
			fee: string
			unit: {
				mem: string
				steps: string
			}
			datum: JsonValue
			purpose: string
		}
	}
}

export interface CardanoKoiosTransactionVotingProcedure {
	vote: string
	voter: string
	voter_hex: string
	voter_role: string
	proposal_index: number
	proposal_tx_hash: string
}

export interface CardanoKoiosTransactionProposalProcedure {
	type: CardanoGovernanceActionTag
	index: number
	deposit: string
	meta_url: string | null
	meta_hash: string | null
	description: CardanoGovernanceAction
	return_address: string
}

type CardanoKoiosTransactionProposalProcedureWire = Omit<
	CardanoKoiosTransactionProposalProcedure,
	'description'
> & {
	description: unknown
}

export const cardanoKoiosTransactionProposalProcedure = arktype({
	type: "'ParameterChange' | 'HardForkInitiation' | 'TreasuryWithdrawals' | 'NoConfidence' | 'UpdateCommittee' | 'NewConstitution' | 'InfoAction'",
	index: 'number.integer >= 0',
	deposit: '/^(0|[1-9][0-9]*)$/',
	meta_url: 'string | null',
	meta_hash: 'string | null',
	description: 'unknown',
	return_address: 'string',
}) satisfies Type<CardanoKoiosTransactionProposalProcedureWire>

export interface CardanoKoiosTransactionAsset {
	policy_id: string
	asset_name: string
	quantity: string
	fingerprint?: string | null
	decimals?: number | null
}

export interface CardanoKoiosTransactionUtxo {
	payment_addr: {
		bech32: string
		cred?: string
	}
	stake_addr?: string | null
	tx_hash: string
	tx_index: number
	value: string
	datum_hash?: string | null
	inline_datum?: JsonValue | null
	reference_script?: {
		hash: string
		size?: number
		type?: string
		bytes?: string
		value?: JsonValue | null
	} | null
	asset_list?: CardanoKoiosTransactionAsset[] | null
}

export interface CardanoKoiosTransactionInfo {
	tx_hash: string
	epoch_no: number
	absolute_slot: number
	tx_timestamp: number
	tx_size: number
	fee: string
	deposit: string
	invalid_before: string | null
	invalid_after: string | null
	inputs: CardanoKoiosTransactionUtxo[]
	outputs: CardanoKoiosTransactionUtxo[]
	collateral_inputs: CardanoKoiosTransactionUtxo[]
	reference_inputs: CardanoKoiosTransactionUtxo[]
	certificates: CardanoKoiosTransactionCertificate[]
	native_scripts: CardanoKoiosTransactionNativeScript[]
	plutus_contracts: CardanoKoiosTransactionPlutusContract[]
	voting_procedures: CardanoKoiosTransactionVotingProcedure[]
	proposal_procedures: CardanoKoiosTransactionProposalProcedure[]
}

export const cardanoKoiosTransactionInfoScalars = arktype({
	tx_hash: 'string',
	epoch_no: 'number.integer >= 0',
	absolute_slot: 'number.integer >= 0',
	tx_timestamp: 'number.integer >= 0',
	tx_size: 'number.integer >= 0',
	fee: '/^(0|[1-9][0-9]*)$/',
	deposit: '/^(0|[1-9][0-9]*)$/',
	invalid_before: '/^(0|[1-9][0-9]*)$/ | null',
	invalid_after: '/^(0|[1-9][0-9]*)$/ | null',
}) satisfies Type<Pick<
	CardanoKoiosTransactionInfo,
	| 'tx_hash'
	| 'epoch_no'
	| 'absolute_slot'
	| 'tx_timestamp'
	| 'tx_size'
	| 'fee'
	| 'deposit'
	| 'invalid_before'
	| 'invalid_after'
>>

export const cardanoKoiosTransactionCertificate = arktype({
	info: 'unknown',
	type: 'string',
	index: 'number.integer >= 0',
}) satisfies Type<CardanoKoiosTransactionCertificate>

export const cardanoKoiosTransactionNativeScript = arktype({
	script_hash: 'string',
	'type?': 'string',
	'script?': 'unknown',
}) satisfies Type<CardanoKoiosTransactionNativeScript>

export const cardanoKoiosTransactionPlutusContract = arktype({
	script_hash: 'string',
	input: {
		datum: 'unknown | null',
		redeemer: {
			fee: 'string',
			unit: {
				mem: 'string',
				steps: 'string',
			},
			datum: 'unknown',
			purpose: 'string',
		},
	},
}) satisfies Type<CardanoKoiosTransactionPlutusContract>

export const cardanoKoiosTransactionVotingProcedure = arktype({
	vote: 'string',
	voter: 'string',
	voter_hex: 'string',
	voter_role: 'string',
	proposal_index: 'number.integer >= 0',
	proposal_tx_hash: 'string',
}) satisfies Type<CardanoKoiosTransactionVotingProcedure>

export const cardanoKoiosTransactionAsset = arktype({
	policy_id: 'string',
	asset_name: 'string',
	quantity: '/^(0|[1-9][0-9]*)$/',
	'fingerprint?': 'string | null',
	'decimals?': 'number.integer >= 0 | null',
}) satisfies Type<CardanoKoiosTransactionAsset>

export const cardanoKoiosTransactionUtxo = arktype({
	payment_addr: {
		bech32: 'string',
		'cred?': 'string',
	},
	'stake_addr?': 'string | null',
	tx_hash: 'string',
	tx_index: 'number.integer >= 0',
	value: '/^(0|[1-9][0-9]*)$/',
	'datum_hash?': 'string | null',
	'inline_datum?': 'unknown | null',
	'reference_script?': arktype({
		hash: 'string',
		'size?': 'number.integer >= 0',
		'type?': 'string',
		'bytes?': 'string',
		'value?': 'unknown | null',
	}).or('null'),
	'asset_list?': cardanoKoiosTransactionAsset.array().or('null'),
}) satisfies Type<CardanoKoiosTransactionUtxo>

export const cardanoKoiosTransactionInfo = cardanoKoiosTransactionInfoScalars.and({
	inputs: cardanoKoiosTransactionUtxo.array(),
	outputs: cardanoKoiosTransactionUtxo.array(),
	collateral_inputs: cardanoKoiosTransactionUtxo.array().or('null'),
	reference_inputs: cardanoKoiosTransactionUtxo.array().or('null'),
	certificates: cardanoKoiosTransactionCertificate.array(),
	native_scripts: cardanoKoiosTransactionNativeScript.array(),
	plutus_contracts: cardanoKoiosTransactionPlutusContract.array(),
	voting_procedures: cardanoKoiosTransactionVotingProcedure.array(),
	proposal_procedures: 'unknown[]',
})

export interface CardanoKoiosStakePool {
	pool_id_bech32: string
	ticker?: string | null
}

export const cardanoKoiosStakePool = arktype({
	pool_id_bech32: 'string',
	'ticker?': 'string | null',
}) satisfies Type<CardanoKoiosStakePool>

export interface CardanoKoiosDRep {
	drep_id: string
	has_script: boolean
}

export const cardanoKoiosDRep = arktype({
	drep_id: 'string',
	has_script: 'boolean',
}) satisfies Type<CardanoKoiosDRep>

export interface CardanoKoiosGovernanceProposal {
	proposal_tx_hash: string
	proposal_index: number
	proposal_type: string
}

export const cardanoKoiosGovernanceProposal = arktype({
	proposal_tx_hash: 'string',
	proposal_index: 'number.integer >= 0',
	proposal_type: 'string',
}) satisfies Type<CardanoKoiosGovernanceProposal>

export interface CardanoKoiosAsset {
	policy_id: string
	asset_name: string
}

export const cardanoKoiosAsset = arktype({
	policy_id: 'string',
	asset_name: 'string',
}) satisfies Type<CardanoKoiosAsset>

export interface CardanoKoiosProtocolParameters {
	epoch_no: number
	min_fee_a: number
	min_fee_b: number
	max_block_size: number
	max_tx_size: number
	max_bh_size: number
	key_deposit: string
	pool_deposit: string
	max_epoch: number
	optimal_pool_count: number
	monetary_expand_rate: number
	treasury_growth_rate: number
	decentralisation: number
	protocol_major: number
	protocol_minor: number
	min_pool_cost: string
	coins_per_utxo_size: string
	cost_models?: unknown
	price_mem?: number | null
	price_step?: number | null
	max_tx_ex_mem?: number | null
	max_tx_ex_steps?: number | null
	max_block_ex_mem?: number | null
	max_block_ex_steps?: number | null
	max_val_size?: number | null
	collateral_percent?: number | null
	max_collateral_inputs?: number | null
}

export const cardanoKoiosProtocolParameters = arktype({
	epoch_no: 'number.integer >= 0',
	min_fee_a: 'number.integer >= 0',
	min_fee_b: 'number.integer >= 0',
	max_block_size: 'number.integer >= 0',
	max_tx_size: 'number.integer >= 0',
	max_bh_size: 'number.integer >= 0',
	key_deposit: '/^(0|[1-9][0-9]*)$/',
	pool_deposit: '/^(0|[1-9][0-9]*)$/',
	max_epoch: 'number.integer >= 0',
	optimal_pool_count: 'number.integer >= 0',
	monetary_expand_rate: 'number >= 0',
	treasury_growth_rate: 'number >= 0',
	decentralisation: 'number >= 0',
	protocol_major: 'number.integer >= 0',
	protocol_minor: 'number.integer >= 0',
	min_pool_cost: '/^(0|[1-9][0-9]*)$/',
	coins_per_utxo_size: '/^(0|[1-9][0-9]*)$/',
	'cost_models?': 'unknown',
	'price_mem?': 'number | null',
	'price_step?': 'number | null',
	'max_tx_ex_mem?': 'number.integer >= 0 | null',
	'max_tx_ex_steps?': 'number.integer >= 0 | null',
	'max_block_ex_mem?': 'number.integer >= 0 | null',
	'max_block_ex_steps?': 'number.integer >= 0 | null',
	'max_val_size?': 'number.integer >= 0 | null',
	'collateral_percent?': 'number.integer >= 0 | null',
	'max_collateral_inputs?': 'number.integer >= 0 | null',
}) satisfies Type<CardanoKoiosProtocolParameters>

export interface CardanoKoiosCommittee {
	proposal_id: string
	proposal_tx_hash: string
	proposal_index: number
	quorum_numerator: number
	quorum_denominator: number
	members: CardanoKoiosCommitteeMember[]
}

export interface CardanoKoiosCommitteeMember {
	status: string
	cc_hot_id: string | null
	cc_cold_id: string
	cc_hot_hex: string | null
	cc_cold_hex: string
	expiration_epoch: number
	cc_hot_has_script: boolean | null
	cc_cold_has_script: boolean
}

export const cardanoKoiosCommittee = arktype({
	proposal_id: 'string',
	proposal_tx_hash: 'string',
	proposal_index: 'number.integer >= 0',
	quorum_numerator: 'number.integer >= 0',
	quorum_denominator: 'number.integer >= 0',
	members: arktype({
		status: 'string',
		cc_hot_id: 'string | null',
		cc_cold_id: 'string',
		cc_hot_hex: 'string | null',
		cc_cold_hex: 'string',
		expiration_epoch: 'number.integer >= 0',
		cc_hot_has_script: 'boolean | null',
		cc_cold_has_script: 'boolean',
	}).array(),
}) satisfies Type<CardanoKoiosCommittee>
