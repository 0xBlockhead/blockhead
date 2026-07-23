import { throwHttpError } from '$/lib/http.ts'
import { firstHttpUrlForBinding, sourceFetch } from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	BlockfrostAddress,
	BlockfrostAddressTotal,
	BlockfrostAddressTransactions,
	BlockfrostAddressUtxos,
	BlockfrostAssets,
	BlockfrostBlock,
	BlockfrostBlocks,
	BlockfrostCommittee,
	BlockfrostCommitteeVotes,
	BlockfrostDReps,
	BlockfrostDRepListItem,
	BlockfrostDRep,
	BlockfrostDRepIdentity,
	BlockfrostDRepMetadata,
	BlockfrostDRepVotes,
	BlockfrostEpoch,
	BlockfrostGovernanceProposals,
	BlockfrostGovernanceProposal,
	BlockfrostGovernanceProposalMetadata,
	BlockfrostGovernanceProposalVotes,
	BlockfrostHealth,
	BlockfrostNetwork,
	BlockfrostProtocolParameters,
	BlockfrostStakePools,
	BlockfrostStakePool,
	BlockfrostStakePoolMetadata,
	BlockfrostTransaction,
	BlockfrostTransactionUtxos,
	BlockfrostTransactions,
} from '$/sources/Blockfrost/Rest/types.ts'
import { blockfrostDRepIdentityMetadata } from '$/sources/Blockfrost/Rest/types.ts'
import { type } from 'arktype'

export const request = async <_Response>({
	binding,
	path,
}: {
	binding: SourceBinding
	path: string
}) => {
	const response = await sourceFetch(
		binding,
		new URL(path, firstHttpUrlForBinding(binding)).toString()
	)

	if (!response.ok)
		await throwHttpError('Blockfrost_Rest', response)

	return response.json<_Response>()
}

const get = <_Response>(binding: SourceBinding, path: string) => (
	request<_Response>({
		binding,
		path,
	})
)

const getOptional = async <_Response>(binding: SourceBinding, path: string) => {
	try {
		return await get<_Response>(binding, path)
	} catch {
		return undefined
	}
}

const listPage = <_Response>(
	binding: SourceBinding,
	path: string,
	count: number,
	order?: 'asc' | 'desc',
	page?: number
) => {
	if (!Number.isSafeInteger(count) || count < 0 || count > 100)
		throw new Error('Blockfrost_Rest: list count must be an integer from 0 through 100')
	if (page != null && (!Number.isSafeInteger(page) || page < 1))
		throw new Error('Blockfrost_Rest: list page must be a positive integer')

	return count === 0
		? Promise.resolve<_Response[]>([])
		: get<_Response[]>(
			binding,
			`${path}?count=${count.toString()}${order == null ? '' : `&order=${order}`}${page == null ? '' : `&page=${page.toString()}`}`
		)
}

export const getHealth = (binding: SourceBinding) => (
	get<BlockfrostHealth>(binding, 'health')
)

export const getLatestBlock = (binding: SourceBinding) => (
	get<BlockfrostBlock>(binding, 'blocks/latest')
)

export const getAddress = (binding: SourceBinding, address: string) => (
	get<BlockfrostAddress>(binding, `addresses/${encodeURIComponent(address)}`)
)

export const getAddressTotal = (binding: SourceBinding, address: string) => (
	get<BlockfrostAddressTotal>(binding, `addresses/${encodeURIComponent(address)}/total`)
)

export const listAddressTransactions = (
	binding: SourceBinding,
	address: string,
	count: number,
	page = 1
) => (
	listPage<BlockfrostAddressTransactions[number]>(
		binding,
		`addresses/${encodeURIComponent(address)}/transactions`,
		count,
		'desc',
		page
	)
)

export const listAddressUtxos = (
	binding: SourceBinding,
	address: string,
	count: number,
	page = 1
) => (
	listPage<BlockfrostAddressUtxos[number]>(
		binding,
		`addresses/${encodeURIComponent(address)}/utxos`,
		count,
		'desc',
		page
	)
)

export const getBlock = (binding: SourceBinding, blockId: string) => (
	get<BlockfrostBlock>(binding, `blocks/${encodeURIComponent(blockId)}`)
)

export const getTransaction = (binding: SourceBinding, hash: string) => (
	get<BlockfrostTransaction>(binding, `txs/${encodeURIComponent(hash)}`)
)

export const getTransactionUtxos = (binding: SourceBinding, hash: string) => (
	get<BlockfrostTransactionUtxos>(binding, `txs/${encodeURIComponent(hash)}/utxos`)
)

export const listBlocks = async (binding: SourceBinding, count: number) => {
	if (!Number.isSafeInteger(count) || count < 0 || count > 100)
		throw new Error('Blockfrost_Rest: block list count must be an integer from 0 through 100')

	if (count === 0)
		return []

	const latestBlock = await getLatestBlock(binding)
	if (count === 1)
		return [latestBlock]

	return [
		latestBlock,
		...await get<BlockfrostBlocks>(
			binding,
			`blocks/${encodeURIComponent(latestBlock.hash)}/previous?count=${(count - 1).toString()}`
		),
	]
}

export const getLatestEpoch = (binding: SourceBinding) => (
	get<BlockfrostEpoch>(binding, 'epochs/latest')
)

export const getNetwork = (binding: SourceBinding) => (
	get<BlockfrostNetwork>(binding, 'network')
)

export const listLatestBlockTransactions = (
	binding: SourceBinding,
	count: number
) => (
	listPage<BlockfrostTransactions[number]>(binding, 'blocks/latest/txs', count)
)

export const listStakePools = (binding: SourceBinding, count: number) => (
	listPage<BlockfrostStakePools[number]>(binding, 'pools', count)
)

export const getStakePool = (binding: SourceBinding, poolId: string) => (
	get<BlockfrostStakePool>(binding, `pools/${encodeURIComponent(poolId)}`)
)

export const getStakePoolMetadata = (binding: SourceBinding, poolId: string) => (
	getOptional<BlockfrostStakePoolMetadata>(binding, `pools/${encodeURIComponent(poolId)}/metadata`)
)

export const listDReps = (binding: SourceBinding, count: number) => (
	listPage<BlockfrostDReps[number]>(binding, 'governance/dreps', count).then((dReps) => (
		dReps.map(({ metadata, ...dRep }): BlockfrostDRepListItem => {
			const identityMetadata = blockfrostDRepIdentityMetadata(metadata?.json_metadata)

			return {
				...dRep,
				...(identityMetadata instanceof type.errors ? {} : {
					displayName: identityMetadata.body.givenName,
				}),
			}
		})
	))
)

export const getDRep = (binding: SourceBinding, drepId: string) => (
	get<BlockfrostDRep>(binding, `governance/dreps/${encodeURIComponent(drepId)}`)
)

export const getDRepMetadata = (binding: SourceBinding, drepId: string) => (
	getOptional<BlockfrostDRepMetadata>(binding, `governance/dreps/${encodeURIComponent(drepId)}/metadata`).then((metadata) => {
		if (metadata == null)
			return

		const identityMetadata = blockfrostDRepIdentityMetadata(metadata.json_metadata)

		return {
			url: metadata.url,
			hash: metadata.hash,
			...(identityMetadata instanceof type.errors ? {} : {
				displayName: identityMetadata.body.givenName,
			}),
		} satisfies BlockfrostDRepIdentity
	})
)

export const listDRepVotes = (binding: SourceBinding, drepId: string, count: number) => (
	listPage<BlockfrostDRepVotes[number]>(binding, `governance/dreps/${encodeURIComponent(drepId)}/votes`, count)
)

export const listGovernanceProposals = (
	binding: SourceBinding,
	count: number,
	page?: number
) => (
	listPage<BlockfrostGovernanceProposals[number]>(binding, 'governance/proposals', count, undefined, page)
)

export const getGovernanceProposal = (
	binding: SourceBinding,
	transactionHash: string,
	certificateIndex: number
) => (
	get<BlockfrostGovernanceProposal>(binding, `governance/proposals/${encodeURIComponent(transactionHash)}/${certificateIndex.toString()}`)
)

export const getGovernanceProposalMetadata = (
	binding: SourceBinding,
	transactionHash: string,
	certificateIndex: number
) => (
	getOptional<BlockfrostGovernanceProposalMetadata>(binding, `governance/proposals/${encodeURIComponent(transactionHash)}/${certificateIndex.toString()}/metadata`)
)

export const listGovernanceProposalVotes = (
	binding: SourceBinding,
	transactionHash: string,
	certificateIndex: number,
	count: number,
	page?: number
) => (
	listPage<BlockfrostGovernanceProposalVotes[number]>(binding, `governance/proposals/${encodeURIComponent(transactionHash)}/${certificateIndex.toString()}/votes`, count, undefined, page)
)

export const listAssets = (binding: SourceBinding, count: number) => (
	listPage<BlockfrostAssets[number]>(binding, 'assets', count)
)

export const getLatestProtocolParameters = (binding: SourceBinding) => (
	get<BlockfrostProtocolParameters>(binding, 'epochs/latest/parameters')
)

export const getCommittee = (binding: SourceBinding) => (
	get<BlockfrostCommittee>(binding, 'governance/committee')
)

export const listCommitteeVotes = (binding: SourceBinding, count: number) => (
	listPage<BlockfrostCommitteeVotes[number]>(binding, 'governance/committee/votes', count)
)
