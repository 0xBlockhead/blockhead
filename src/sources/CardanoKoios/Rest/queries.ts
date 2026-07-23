import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	getJson,
	postJson,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	CardanoKoiosGovernanceProposal,
	CardanoKoiosTransactionInfo,
} from '$/sources/CardanoKoios/Rest/types.ts'
import {
	cardanoKoiosAsset,
	cardanoKoiosBlock,
	cardanoKoiosBlockTransaction,
	cardanoKoiosCommittee,
	cardanoKoiosDRep,
	cardanoKoiosProtocolParameters,
	cardanoKoiosStakePool,
	cardanoKoiosTip,
	cardanoKoiosTransactionProposalProcedure,
} from '$/sources/CardanoKoios/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const query = <_Response>(
	binding: SourceBinding,
	path: string
) => (
	getJson<_Response>(binding, path)
)

export const getTip = async (binding: SourceBinding) => {
	const tips = cardanoKoiosTip.array().assert(
		await query<JsonValue>(binding, '/api/v1/tip')
	)
	if (tips.length !== 1)
		throw new Error('CardanoKoios_Rest: tip must return exactly one network observation')
	if (
		[
			tips[0].epoch_no,
			tips[0].abs_slot,
			tips[0].block_height,
			tips[0].block_time,
		].some((value) => !Number.isSafeInteger(value))
	)
		throw new Error('CardanoKoios_Rest: tip contains an unsafe integer')

	return tips
}

export const getEpochInfo = (binding: SourceBinding) => (
	query<Record<string, unknown>[]>(binding, '/api/v1/epoch_info')
)

const list = <_Response>(
	binding: SourceBinding,
	path: string,
	count: number,
	offset?: number
) => {
	if (!Number.isSafeInteger(count) || count < 0 || count > 100)
		throw new Error('CardanoKoios_Rest: list count must be an integer from 0 through 100')
	if (offset != null && (!Number.isSafeInteger(offset) || offset < 0))
		throw new Error('CardanoKoios_Rest: list offset must be a nonnegative integer')

	return count === 0
		? Promise.resolve<_Response[]>([])
		: query<_Response[]>(
			binding,
			`/api/v1/${path}?limit=${Math.min(count, 100).toString()}${offset == null ? '' : `&offset=${offset.toString()}`}`
		)
}

export const listBlocks = async (
	binding: SourceBinding,
	count: number
) => {
	const blocks = cardanoKoiosBlock.array().assert(
		await list<JsonValue>(binding, 'blocks', count)
	)
	if (new Set(blocks.map((block) => block.hash)).size !== blocks.length)
		throw new Error('CardanoKoios_Rest: blocks contains duplicate identities')
	if (
		blocks.some((block) => (
			[
				block.epoch_no,
				block.abs_slot,
				block.block_height,
				block.block_time,
				block.tx_count,
			].some((value) => !Number.isSafeInteger(value))
		))
	)
		throw new Error('CardanoKoios_Rest: blocks contains an unsafe integer')
	if (
		blocks.some((block, index) => (
			index > 0
				&& (
					block.block_height >= blocks[index - 1].block_height
					|| block.abs_slot >= blocks[index - 1].abs_slot
				)
		))
	)
		throw new Error('CardanoKoios_Rest: blocks must be strictly newest-first')

	return blocks
}

export const listLatestBlockTransactions = async (
	binding: SourceBinding,
	count: number
) => {
	if (!Number.isSafeInteger(count) || count < 0 || count > 100)
		throw new Error('CardanoKoios_Rest: list count must be an integer from 0 through 100')
	if (count === 0)
		return []

	const [tip] = await getTip(binding)
	const transactions = cardanoKoiosBlockTransaction.array().assert(await postJson<JsonValue>({
		binding,
		path: '/api/v1/block_txs',
		body: {
			_block_hashes: [tip.hash],
		},
	}))
	if (new Set(transactions.map((transaction) => transaction.tx_hash)).size !== transactions.length)
		throw new Error('CardanoKoios_Rest: block_txs contains duplicate identities')

	return transactions.slice(0, count)
}

export const getTransactionInfo = async (
	binding: SourceBinding,
	transactionHash: string
) => {
	const transaction = (
		await postJson<CardanoKoiosTransactionInfo[]>({
			binding,
			path: '/api/v1/tx_info',
			body: {
				_tx_hashes: [transactionHash],
				_inputs: false,
				_metadata: false,
				_assets: false,
				_withdrawals: false,
				_certs: true,
				_scripts: true,
				_bytecode: false,
				_governance: true,
			},
		})
	).at(0)

	if (transaction == null)
		throw new Error('CardanoKoios_Rest: transaction response is missing')

	return {
		...transaction,
		proposal_procedures: transaction.proposal_procedures.map((proposal) => {
			const validated = cardanoKoiosTransactionProposalProcedure.assert(proposal)

			return {
				...proposal,
				type: validated.type,
				index: validated.index,
				deposit: validated.deposit,
				meta_url: validated.meta_url,
				meta_hash: validated.meta_hash,
				return_address: validated.return_address,
			}
		}),
	}
}

export const listStakePools = async (
	binding: SourceBinding,
	count: number
) => {
	const stakePools = cardanoKoiosStakePool.array().assert(
		await list<JsonValue>(binding, 'pool_list', count)
	)
	if (new Set(stakePools.map((stakePool) => stakePool.pool_id_bech32)).size !== stakePools.length)
		throw new Error('CardanoKoios_Rest: pool_list contains duplicate identities')

	return stakePools.map((stakePool) => ({
		pool_id_bech32: stakePool.pool_id_bech32,
		...(stakePool.ticker == null ? {} : { ticker: stakePool.ticker }),
	}))
}

export const listDReps = async (
	binding: SourceBinding,
	count: number
) => {
	const dReps = cardanoKoiosDRep.array().assert(
		await list<JsonValue>(binding, 'drep_list', count)
	)
	if (new Set(dReps.map((dRep) => dRep.drep_id)).size !== dReps.length)
		throw new Error('CardanoKoios_Rest: drep_list contains duplicate identities')

	return dReps
}

export const listGovernanceProposals = (
	binding: SourceBinding,
	count: number,
	offset?: number
) => (
	list<CardanoKoiosGovernanceProposal>(binding, 'proposal_list', count, offset)
)

export const listAssets = async (
	binding: SourceBinding,
	count: number
) => {
	const assets = cardanoKoiosAsset.array().assert(
		await list<JsonValue>(binding, 'asset_list', count)
	)
	if (
		new Set(assets.map((asset) => (
			JSON.stringify([asset.policy_id, asset.asset_name])
		))).size !== assets.length
	)
		throw new Error('CardanoKoios_Rest: asset_list contains duplicate identities')

	return assets
}

export const getLatestProtocolParameters = async (binding: SourceBinding) => {
	const parameters = cardanoKoiosProtocolParameters.array().assert(await query<JsonValue>(
		binding,
		'/api/v1/epoch_params?limit=1&order=epoch_no.desc'
	))
	if (parameters.length !== 1)
		throw new Error('CardanoKoios_Rest: epoch_params must return exactly one latest epoch')
	if (
		[
			parameters[0].epoch_no,
			parameters[0].min_fee_a,
			parameters[0].min_fee_b,
			parameters[0].max_block_size,
			parameters[0].max_tx_size,
			parameters[0].max_bh_size,
			parameters[0].max_epoch,
			parameters[0].optimal_pool_count,
			parameters[0].protocol_major,
			parameters[0].protocol_minor,
		].some((value) => !Number.isSafeInteger(value))
	)
		throw new Error('CardanoKoios_Rest: epoch_params contains an unsafe integer')

	return parameters
}

export const getCommittee = async (binding: SourceBinding) => {
	const committees = cardanoKoiosCommittee.array().assert(
		await query<JsonValue>(binding, '/api/v1/committee_info')
	)
	if (committees.length !== 1)
		throw new Error('CardanoKoios_Rest: committee_info must return exactly one committee')
	if (
		committees.some((committee) => (
			!Number.isSafeInteger(committee.proposal_index)
				|| !Number.isSafeInteger(committee.quorum_numerator)
				|| !Number.isSafeInteger(committee.quorum_denominator)
				|| committee.members.some((member) => !Number.isSafeInteger(member.expiration_epoch))
		))
	)
		throw new Error('CardanoKoios_Rest: committee_info contains an unsafe integer')
	if (
		new Set(committees[0].members.map((member) => member.cc_cold_id)).size
			!== committees[0].members.length
	)
		throw new Error('CardanoKoios_Rest: committee_info contains duplicate member identities')

	return committees
}
