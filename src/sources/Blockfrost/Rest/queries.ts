import { throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { firstHttpUrlForBinding, sourceFetch } from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Blockfrost/bindings.ts'
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
	BlockfrostGovernanceProposalWire,
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
import {
	blockfrostDRepIdentityMetadata,
	blockfrostGovernanceActionTagByGovernanceType,
} from '$/sources/Blockfrost/Rest/types.ts'
import { parseCardanoGovernanceAction } from '$/sources/_shared/interfaces/CardanoGovernance/types.ts'
import { type } from 'arktype'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Blockfrost_Rest]

export const getRestEndpoints = () => [{
	url: firstHttpUrlForBinding(binding),
	transportType: TransportType.Http,
	providerName: 'Blockfrost',
}]

export const request = async <_Response>({
	path,
}: {
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

const get = <_Response>(path: string) => (
	request<_Response>({
		path,
	})
)

const getOptional = async <_Response>(path: string) => {
	const response = await sourceFetch(
		binding,
		new URL(path, firstHttpUrlForBinding(binding)).toString()
	)
	if (response.status === 404)
		return undefined
	if (!response.ok)
		await throwHttpError('Blockfrost_Rest', response)

	return response.json<_Response>()
}

const listPage = <_Response>(
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
			`${path}?count=${count.toString()}${order == null ? '' : `&order=${order}`}${page == null ? '' : `&page=${page.toString()}`}`
		)
}

export const getHealth = () => (
	get<BlockfrostHealth>('health')
)

export const getLatestBlock = () => (
	get<BlockfrostBlock>('blocks/latest')
)

export const getAddress = (address: string) => (
	get<BlockfrostAddress>(`addresses/${encodeURIComponent(address)}`)
)

export const getAddressTotal = (address: string) => (
	get<BlockfrostAddressTotal>(`addresses/${encodeURIComponent(address)}/total`)
)

export const listAddressTransactions = (
	address: string,
	count: number,
	page = 1
) => (
	listPage<BlockfrostAddressTransactions[number]>(
		`addresses/${encodeURIComponent(address)}/transactions`,
		count,
		'desc',
		page
	)
)

export const listAddressUtxos = (
	address: string,
	count: number,
	page = 1
) => (
	listPage<BlockfrostAddressUtxos[number]>(
		`addresses/${encodeURIComponent(address)}/utxos`,
		count,
		'desc',
		page
	)
)

export const getBlock = (blockId: string) => (
	get<BlockfrostBlock>(`blocks/${encodeURIComponent(blockId)}`)
)

export const getTransaction = (hash: string) => (
	get<BlockfrostTransaction>(`txs/${encodeURIComponent(hash)}`)
)

export const getTransactionUtxos = (hash: string) => (
	get<BlockfrostTransactionUtxos>(`txs/${encodeURIComponent(hash)}/utxos`)
)

export const listBlocks = async (count: number) => {
	if (!Number.isSafeInteger(count) || count < 0 || count > 100)
		throw new Error('Blockfrost_Rest: block list count must be an integer from 0 through 100')

	if (count === 0)
		return []

	const latestBlock = await getLatestBlock()
	if (count === 1)
		return [latestBlock]

	return [
		latestBlock,
		...await get<BlockfrostBlocks>(
			`blocks/${encodeURIComponent(latestBlock.hash)}/previous?count=${(count - 1).toString()}`
		),
	]
}

export const getLatestEpoch = () => (
	get<BlockfrostEpoch>('epochs/latest')
)

export const getNetwork = () => (
	get<BlockfrostNetwork>('network')
)

export const listLatestBlockTransactions = (
	count: number
) => (
	listPage<BlockfrostTransactions[number]>('blocks/latest/txs', count)
)

export const listStakePools = (count: number) => (
	listPage<BlockfrostStakePools[number]>('pools', count)
)

export const getStakePool = (poolId: string) => (
	get<BlockfrostStakePool>(`pools/${encodeURIComponent(poolId)}`)
)

export const getStakePoolMetadata = (poolId: string) => (
	getOptional<BlockfrostStakePoolMetadata>(`pools/${encodeURIComponent(poolId)}/metadata`)
)

export const listDReps = (count: number) => (
	listPage<BlockfrostDReps[number]>('governance/dreps', count).then((dReps) => (
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

export const getDRep = (drepId: string) => (
	get<BlockfrostDRep>(`governance/dreps/${encodeURIComponent(drepId)}`)
)

export const getDRepMetadata = (drepId: string) => (
	getOptional<BlockfrostDRepMetadata>(`governance/dreps/${encodeURIComponent(drepId)}/metadata`).then((metadata) => {
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

export const listDRepVotes = (drepId: string, count: number) => (
	listPage<BlockfrostDRepVotes[number]>(`governance/dreps/${encodeURIComponent(drepId)}/votes`, count)
)

export const listGovernanceProposals = (
	count: number,
	page?: number
) => (
	listPage<BlockfrostGovernanceProposals[number]>('governance/proposals', count, undefined, page)
)

export const getGovernanceProposal = (
	transactionHash: string,
	certificateIndex: number
) => (
	get<BlockfrostGovernanceProposalWire>(
		`governance/proposals/${encodeURIComponent(transactionHash)}/${certificateIndex.toString()}`
	).then((proposal) => {
		const governanceDescription = (
			proposal.governance_description == null ?
				null
			:
				parseCardanoGovernanceAction(proposal.governance_description)
		)
		if (
			governanceDescription != null
			&& blockfrostGovernanceActionTagByGovernanceType[proposal.governance_type]
				!== governanceDescription.tag
		)
			throw new Error('Blockfrost_Rest: governance type does not match description tag')

		return {
			...proposal,
			governance_description: governanceDescription,
		}
	})
)

export const getGovernanceProposalMetadata = (
	transactionHash: string,
	certificateIndex: number
) => (
	getOptional<BlockfrostGovernanceProposalMetadata>(`governance/proposals/${encodeURIComponent(transactionHash)}/${certificateIndex.toString()}/metadata`)
)

export const listGovernanceProposalVotes = (
	transactionHash: string,
	certificateIndex: number,
	count: number,
	page?: number
) => (
	listPage<BlockfrostGovernanceProposalVotes[number]>(`governance/proposals/${encodeURIComponent(transactionHash)}/${certificateIndex.toString()}/votes`, count, undefined, page)
)

export const listAssets = (count: number) => (
	listPage<BlockfrostAssets[number]>('assets', count)
)

export const getLatestProtocolParameters = () => (
	get<BlockfrostProtocolParameters>('epochs/latest/parameters')
)

export const getCommittee = () => (
	get<BlockfrostCommittee>('governance/committee')
)

export const listCommitteeVotes = (count: number) => (
	listPage<BlockfrostCommitteeVotes[number]>('governance/committee/votes', count)
)
