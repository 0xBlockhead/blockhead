import bindings from '$/sources/CardanoKoios/bindings.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	httpUrl,
	postJson,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import {
	cardanoKoiosAsset,
	cardanoKoiosBlock,
	cardanoKoiosBlockTransaction,
	cardanoKoiosCommittee,
	cardanoKoiosDRep,
	cardanoKoiosGovernanceProposal,
	cardanoKoiosProtocolParameters,
	cardanoKoiosStakePool,
	cardanoKoiosTip,
	cardanoKoiosTransactionInfo,
	cardanoKoiosTransactionProposalProcedure,
} from '$/sources/CardanoKoios/Rest/types.ts'
import { parseCardanoGovernanceAction } from '$/sources/_shared/interfaces/CardanoGovernance/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.CardanoKoios_Rest][0]

export const restEndpoints = [{
	url: firstHttpUrlForBinding(binding),
	transportType: TransportType.Http,
	providerName: 'Koios',
}]

const query = <_Response>(
	path: string
) => sourceGetJson<_Response>(binding, httpUrl(binding, path))

const cardanoKoiosPostJson = <_Response>({
	path,
	body,
}: {
	path: string
	body: unknown
}) => postJson<_Response>({
		binding,
		path,
		body,
	})

export const getTip = async () => {
	const tips = cardanoKoiosTip.array().assert(
		await query<JsonValue>('/api/v1/tip')
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

const list = <_Response>(
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
			`/api/v1/${path}?limit=${Math.min(count, 100).toString()}${offset == null ? '' : `&offset=${offset.toString()}`}`
		)
}

export const listBlocks = async (
	count: number
) => {
	const blocks = cardanoKoiosBlock.array().assert(
		await list<JsonValue>('blocks', count)
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
	count: number
) => {
	if (!Number.isSafeInteger(count) || count < 0 || count > 100)
		throw new Error('CardanoKoios_Rest: list count must be an integer from 0 through 100')
	if (count === 0)
		return []

	const [tip] = await getTip()
	const transactions = cardanoKoiosBlockTransaction.array().assert(await cardanoKoiosPostJson<JsonValue>({
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
	transactionHash: string
) => {
	const transactions = cardanoKoiosTransactionInfo.array().assert(
		await cardanoKoiosPostJson<JsonValue>({
			path: '/api/v1/tx_info',
			body: {
				_tx_hashes: [transactionHash],
				_inputs: true,
				_metadata: false,
				_assets: true,
				_withdrawals: false,
				_certs: true,
				_scripts: true,
				_bytecode: false,
				_governance: true,
			},
		})
	)
	if (transactions.length !== 1)
		throw new Error(
			transactions.length === 0 ?
				'CardanoKoios_Rest: transaction response is missing'
			:
				'CardanoKoios_Rest: tx_info must return exactly one transaction'
		)
	const transaction = transactions[0]
	const collateralInputs = transaction.collateral_inputs ?? []
	const referenceInputs = transaction.reference_inputs ?? []
	const utxos = [
		...transaction.inputs,
		...transaction.outputs,
		...collateralInputs,
		...referenceInputs,
	]
	if (
		[
			transaction.epoch_no,
			transaction.absolute_slot,
			transaction.tx_timestamp,
			transaction.tx_size,
			...utxos.map((utxo) => utxo.tx_index),
		].some((value) => !Number.isSafeInteger(value))
		|| transaction.certificates.some((certificate) => !Number.isSafeInteger(certificate.index))
		|| transaction.voting_procedures.some((votingProcedure) => !Number.isSafeInteger(votingProcedure.proposal_index))
	)
		throw new Error('CardanoKoios_Rest: transaction contains an unsafe integer')
	if (new Set(transaction.certificates.map((certificate) => certificate.index)).size !== transaction.certificates.length)
		throw new Error('CardanoKoios_Rest: certificates contains duplicate identities')
	if (
		new Set(transaction.voting_procedures.map((votingProcedure) => (
			`${votingProcedure.voter_role}:${votingProcedure.voter}:${votingProcedure.proposal_tx_hash}:${votingProcedure.proposal_index.toString()}`
		))).size !== transaction.voting_procedures.length
	)
		throw new Error('CardanoKoios_Rest: voting_procedures contains duplicate identities')
	if (
		new Set(transaction.outputs.map((output) => output.tx_index)).size
			!== transaction.outputs.length
	)
		throw new Error('CardanoKoios_Rest: outputs contains duplicate identities')
	for (const [label, rows] of [
		['inputs', transaction.inputs],
		['collateral_inputs', collateralInputs],
		['reference_inputs', referenceInputs],
	] as const) {
		if (
			new Set(rows.map((utxo) => (
				`${utxo.tx_hash}:${utxo.tx_index.toString()}`
			))).size !== rows.length
		)
			throw new Error(`CardanoKoios_Rest: ${label} contains duplicate identities`)
	}

	return {
		...transaction,
		collateral_inputs: collateralInputs,
		reference_inputs: referenceInputs,
		proposal_procedures: transaction.proposal_procedures.map((proposal) => {
			const validated = cardanoKoiosTransactionProposalProcedure.assert(proposal)
			const description = parseCardanoGovernanceAction(validated.description)
			if (validated.type !== description.tag)
				throw new Error('CardanoKoios_Rest: proposal type does not match description tag')

			return {
				type: validated.type,
				index: validated.index,
				deposit: validated.deposit,
				meta_url: validated.meta_url,
				meta_hash: validated.meta_hash,
				description,
				return_address: validated.return_address,
			}
		}),
	}
}

export const listStakePools = async (
	count: number
) => {
	const stakePools = cardanoKoiosStakePool.array().assert(
		await list<JsonValue>('pool_list', count)
	)
	if (new Set(stakePools.map((stakePool) => stakePool.pool_id_bech32)).size !== stakePools.length)
		throw new Error('CardanoKoios_Rest: pool_list contains duplicate identities')

	return stakePools.map((stakePool) => ({
		pool_id_bech32: stakePool.pool_id_bech32,
		...(stakePool.ticker == null ? {} : { ticker: stakePool.ticker }),
	}))
}

export const listDReps = async (
	count: number
) => {
	const dReps = cardanoKoiosDRep.array().assert(
		await list<JsonValue>('drep_list', count)
	)
	if (new Set(dReps.map((dRep) => dRep.drep_id)).size !== dReps.length)
		throw new Error('CardanoKoios_Rest: drep_list contains duplicate identities')

	return dReps
}

export const listGovernanceProposals = async (
	count: number,
	offset?: number
) => {
	const proposals = cardanoKoiosGovernanceProposal.array().assert(
		await list<JsonValue>('proposal_list', count, offset)
	)
	if (
		proposals.some((proposal) => !Number.isSafeInteger(proposal.proposal_index))
	)
		throw new Error('CardanoKoios_Rest: proposal_list contains an unsafe integer')
	if (new Set(proposals.map((proposal) => (
		`${proposal.proposal_tx_hash}:${proposal.proposal_index.toString()}`
	))).size !== proposals.length)
		throw new Error('CardanoKoios_Rest: proposal_list contains duplicate identities')

	return proposals
}

export const listAssets = async (
	count: number
) => {
	const assets = cardanoKoiosAsset.array().assert(
		await list<JsonValue>('asset_list', count)
	)
	if (
		new Set(assets.map((asset) => (
			JSON.stringify([asset.policy_id, asset.asset_name])
		))).size !== assets.length
	)
		throw new Error('CardanoKoios_Rest: asset_list contains duplicate identities')

	return assets
}

export const getLatestProtocolParameters = async () => {
	const parameters = cardanoKoiosProtocolParameters.array().assert(await query<JsonValue>(
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

export const getCommittee = async () => {
	const committees = cardanoKoiosCommittee.array().assert(
		await query<JsonValue>('/api/v1/committee_info')
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
