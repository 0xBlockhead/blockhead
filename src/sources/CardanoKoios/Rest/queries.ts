import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	getJson,
	postJson,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	CardanoKoiosAsset,
	CardanoKoiosBlock,
	CardanoKoiosBlockTransaction,
	CardanoKoiosCommittee,
	CardanoKoiosDRep,
	CardanoKoiosGovernanceProposal,
	CardanoKoiosProtocolParameters,
	CardanoKoiosStakePool,
	CardanoKoiosTip,
} from '$/sources/CardanoKoios/Rest/types.ts'

export const query = <_Response>(
	binding: SourceBinding,
	path: string
) => (
	getJson<_Response>(binding, path)
)

export const getTip = (binding: SourceBinding) => (
	query<CardanoKoiosTip[]>(binding, '/api/v1/tip')
)

export const getEpochInfo = (binding: SourceBinding) => (
	query<Record<string, unknown>[]>(binding, '/api/v1/epoch_info')
)

const list = <_Response>(
	binding: SourceBinding,
	path: string,
	count: number
) => (
	count === 0
		? Promise.resolve<_Response[]>([])
		: query<_Response[]>(
			binding,
			`/api/v1/${path}?limit=${Math.min(count, 100).toString()}`
		)
)

export const listBlocks = (
	binding: SourceBinding,
	count: number
) => (
	list<CardanoKoiosBlock>(binding, 'blocks', count)
)

export const listLatestBlockTransactions = async (
	binding: SourceBinding,
	count: number
) => {
	if (count === 0)
		return []

	const [tip] = await getTip(binding)

	return postJson<CardanoKoiosBlockTransaction[]>({
		binding,
		path: '/api/v1/block_txs',
		body: {
			_block_hashes: [tip.hash],
		},
	}).then((transactions) => transactions.slice(0, count))
}

export const listStakePools = (
	binding: SourceBinding,
	count: number
) => (
	list<CardanoKoiosStakePool>(binding, 'pool_list', count)
)

export const listDReps = (
	binding: SourceBinding,
	count: number
) => (
	list<CardanoKoiosDRep>(binding, 'drep_list', count)
)

export const listGovernanceProposals = (
	binding: SourceBinding,
	count: number
) => (
	list<CardanoKoiosGovernanceProposal>(binding, 'proposal_list', count)
)

export const listAssets = (
	binding: SourceBinding,
	count: number
) => (
	list<CardanoKoiosAsset>(binding, 'asset_list', count)
)

export const getLatestProtocolParameters = (binding: SourceBinding) => (
	query<CardanoKoiosProtocolParameters[]>(
		binding,
		'/api/v1/epoch_params?limit=1&order=epoch_no.desc'
	)
)

export const getCommittee = (binding: SourceBinding) => (
	query<CardanoKoiosCommittee[]>(binding, '/api/v1/committee_info')
)
