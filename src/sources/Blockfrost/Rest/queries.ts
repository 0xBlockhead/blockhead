import { throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { firstHttpUrlForBinding, sourceFetch } from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Blockfrost/bindings.ts'
import {
	assertBlockfrostEnvelope,
	blockfrostAccountAddressWire,
	blockfrostAccountWire,
	blockfrostAddressTotalWire,
	blockfrostAddressTransactionWire,
	blockfrostAddressUtxoWire,
	blockfrostAddressWire,
	blockfrostAssetListItemWire,
	blockfrostAssetWire,
	blockfrostBlockWire,
	blockfrostCommitteeVoteWire,
	blockfrostCommitteeWire,
	blockfrostDRepListItemWire,
	blockfrostDRepMetadataWire,
	blockfrostDRepVoteWire,
	blockfrostDRepWire,
	blockfrostEpochWire,
	blockfrostGovernanceProposalListItemWire,
	blockfrostGovernanceProposalMetadataWire,
	blockfrostGovernanceProposalVoteWire,
	blockfrostGovernanceProposalWire,
	blockfrostHealthWire,
	blockfrostNetworkWire,
	blockfrostProtocolParametersWire,
	blockfrostStakePoolMetadataWire,
	blockfrostStakePoolWire,
	blockfrostTransactionUtxosWire,
	blockfrostTransactionWire,
} from '$/sources/Blockfrost/Rest/envelopes.ts'
import {
	blockfrostDRepIdentityMetadata,
	blockfrostGovernanceActionTagByGovernanceType,
} from '$/sources/Blockfrost/Rest/types.ts'
import { parseCardanoGovernanceAction } from '$/sources/_shared/interfaces/CardanoGovernance/types.ts'
import { type } from 'arktype'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Blockfrost_Rest][0]

export const restEndpoints = [{
	url: firstHttpUrlForBinding(binding),
	transportType: TransportType.Http,
	providerName: 'Blockfrost',
}]

const request = async ({
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

	return response.json()
}

const get = (path: string) => (
	request({
		path,
	})
)

const getOptional = async (path: string) => {
	const response = await sourceFetch(
		binding,
		new URL(path, firstHttpUrlForBinding(binding)).toString()
	)
	if (response.status === 404)
		return undefined
	if (!response.ok)
		await throwHttpError('Blockfrost_Rest', response)

	return response.json()
}

const listPage = async (
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
		? []
		: get(
			`${path}?count=${count.toString()}${order == null ? '' : `&order=${order}`}${page == null ? '' : `&page=${page.toString()}`}`
		)
}

export const getHealth = async () => (
	assertBlockfrostEnvelope(
		blockfrostHealthWire,
		await get('health'),
		'health'
	)
)

export const getLatestBlock = async () => (
	assertBlockfrostEnvelope(
		blockfrostBlockWire,
		await get('blocks/latest'),
		'block'
	)
)

export const getAccount = async (stakeAddress: string) => (
	assertBlockfrostEnvelope(
		blockfrostAccountWire,
		await get(`accounts/${encodeURIComponent(stakeAddress)}`),
		'account'
	)
)

export const listAccountAddresses = async (
	stakeAddress: string,
	count: number,
	page = 1
) => (
	assertBlockfrostEnvelope(
		blockfrostAccountAddressWire.array(),
		await listPage(
			`accounts/${encodeURIComponent(stakeAddress)}/addresses`,
			count,
			'asc',
			page
		),
		'account addresses'
	)
)

export const getAddress = async (address: string) => (
	assertBlockfrostEnvelope(
		blockfrostAddressWire,
		await get(`addresses/${encodeURIComponent(address)}`),
		'address'
	)
)

export const getAddressTotal = async (address: string) => (
	assertBlockfrostEnvelope(
		blockfrostAddressTotalWire,
		await get(`addresses/${encodeURIComponent(address)}/total`),
		'address total'
	)
)

export const getAsset = async (asset: string) => (
	assertBlockfrostEnvelope(
		blockfrostAssetWire,
		await get(`assets/${encodeURIComponent(asset)}`),
		'asset'
	)
)

export const listAddressTransactions = async (
	address: string,
	count: number,
	page = 1
) => (
	assertBlockfrostEnvelope(
		blockfrostAddressTransactionWire.array(),
		await listPage(
			`addresses/${encodeURIComponent(address)}/transactions`,
			count,
			'desc',
			page
		),
		'address transactions'
	)
)

export const listAddressUtxos = async (
	address: string,
	count: number,
	page = 1
) => (
	assertBlockfrostEnvelope(
		blockfrostAddressUtxoWire.array(),
		await listPage(
			`addresses/${encodeURIComponent(address)}/utxos`,
			count,
			'desc',
			page
		),
		'address utxos'
	)
)

export const getBlock = async (blockId: string) => (
	assertBlockfrostEnvelope(
		blockfrostBlockWire,
		await get(`blocks/${encodeURIComponent(blockId)}`),
		'block'
	)
)

export const getTransaction = async (hash: string) => {
	const transaction = assertBlockfrostEnvelope(
		blockfrostTransactionWire,
		await get(`txs/${encodeURIComponent(hash)}`),
		'transaction'
	)
	if (transaction.hash !== hash)
		throw new Error('Blockfrost_Rest: transaction response does not match request')
	return transaction
}

export const getTransactionUtxos = async (hash: string) => {
	const transactionUtxos = assertBlockfrostEnvelope(
		blockfrostTransactionUtxosWire,
		await get(`txs/${encodeURIComponent(hash)}/utxos`),
		'transaction utxos'
	)
	if (transactionUtxos.hash !== hash)
		throw new Error('Blockfrost_Rest: transaction UTXO response does not match request')
	return transactionUtxos
}

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
		...assertBlockfrostEnvelope(
			blockfrostBlockWire.array(),
			await get(
				`blocks/${encodeURIComponent(latestBlock.hash)}/previous?count=${(count - 1).toString()}`
			),
			'blocks'
		),
	]
}

export const getLatestEpoch = async () => (
	assertBlockfrostEnvelope(
		blockfrostEpochWire,
		await get('epochs/latest'),
		'epoch'
	)
)

export const getNetwork = async () => (
	assertBlockfrostEnvelope(
		blockfrostNetworkWire,
		await get('network'),
		'network'
	)
)

export const listLatestBlockTransactions = async (
	count: number
) => {
	const transactionHashes = assertBlockfrostEnvelope(
		type('string').array(),
		await listPage('blocks/latest/txs', count),
		'latest block transactions'
	)
	if (new Set(transactionHashes).size !== transactionHashes.length)
		throw new Error('Blockfrost_Rest: latest block transactions contains duplicate identities')

	return transactionHashes
}

export const listStakePools = async (count: number) => (
	assertBlockfrostEnvelope(
		type('string').array(),
		await listPage('pools', count),
		'stake pools'
	)
)

export const getStakePool = async (poolId: string) => (
	assertBlockfrostEnvelope(
		blockfrostStakePoolWire,
		await get(`pools/${encodeURIComponent(poolId)}`),
		'stake pool'
	)
)

export const getStakePoolMetadata = async (poolId: string) => {
	const metadata = await getOptional(`pools/${encodeURIComponent(poolId)}/metadata`)
	return metadata == null
		? undefined
		: assertBlockfrostEnvelope(
			blockfrostStakePoolMetadataWire,
			metadata,
			'stake pool metadata'
		)
}

export const listDReps = async (count: number) => (
	assertBlockfrostEnvelope(
		blockfrostDRepListItemWire.array(),
		await listPage('governance/dreps', count),
		'dreps'
	).map(({ metadata, ...dRep }) => {
		const identityMetadata = blockfrostDRepIdentityMetadata(metadata?.json_metadata)

		return {
			...dRep,
			...(identityMetadata instanceof type.errors ? {} : {
				displayName: identityMetadata.body.givenName,
			}),
		}
	})
)

export const getDRep = async (drepId: string) => (
	assertBlockfrostEnvelope(
		blockfrostDRepWire,
		await get(`governance/dreps/${encodeURIComponent(drepId)}`),
		'drep'
	)
)

export const getDRepMetadata = async (drepId: string) => {
	const metadata = await getOptional(`governance/dreps/${encodeURIComponent(drepId)}/metadata`)
	if (metadata == null)
		return

	const validated = assertBlockfrostEnvelope(
		blockfrostDRepMetadataWire,
		metadata,
		'drep metadata'
	)
	const identityMetadata = blockfrostDRepIdentityMetadata(validated.json_metadata)

	return {
		url: validated.url,
		hash: validated.hash,
		...(identityMetadata instanceof type.errors ? {} : {
			displayName: identityMetadata.body.givenName,
		}),
	}
}

export const listDRepVotes = async (
	drepId: string,
	count: number,
	page?: number
) => (
	assertBlockfrostEnvelope(
		blockfrostDRepVoteWire.array(),
		await listPage(`governance/dreps/${encodeURIComponent(drepId)}/votes`, count, undefined, page),
		'drep votes'
	)
)

export const listGovernanceProposals = async (
	count: number,
	page?: number
) => (
	assertBlockfrostEnvelope(
		blockfrostGovernanceProposalListItemWire.array(),
		await listPage('governance/proposals', count, undefined, page),
		'governance proposals'
	)
)

export const getGovernanceProposal = async (
	transactionHash: string,
	certificateIndex: number
) => {
	const proposal = assertBlockfrostEnvelope(
		blockfrostGovernanceProposalWire,
		await get(
			`governance/proposals/${encodeURIComponent(transactionHash)}/${certificateIndex.toString()}`
		),
		'governance proposal'
	)
	const governanceDescription = (
		proposal.governance_description == null ?
			null
		:
			parseCardanoGovernanceAction(proposal.governance_description)
	)
	const expectedTag = (
		proposal.governance_type in blockfrostGovernanceActionTagByGovernanceType ?
			blockfrostGovernanceActionTagByGovernanceType[
				proposal.governance_type as keyof typeof blockfrostGovernanceActionTagByGovernanceType
			]
		:
			undefined
	)
	if (governanceDescription != null && expectedTag !== governanceDescription.tag)
		throw new Error('Blockfrost_Rest: governance type does not match description tag')

	return {
		...proposal,
		governance_description: governanceDescription,
	}
}

export const getGovernanceProposalMetadata = async (
	transactionHash: string,
	certificateIndex: number
) => {
	const metadata = await getOptional(
		`governance/proposals/${encodeURIComponent(transactionHash)}/${certificateIndex.toString()}/metadata`
	)
	return metadata == null
		? undefined
		: assertBlockfrostEnvelope(
			blockfrostGovernanceProposalMetadataWire,
			metadata,
			'governance proposal metadata'
		)
}

export const listGovernanceProposalVotes = async (
	transactionHash: string,
	certificateIndex: number,
	count: number,
	page?: number
) => (
	assertBlockfrostEnvelope(
		blockfrostGovernanceProposalVoteWire.array(),
		await listPage(
			`governance/proposals/${encodeURIComponent(transactionHash)}/${certificateIndex.toString()}/votes`,
			count,
			undefined,
			page
		),
		'governance proposal votes'
	)
)

export const listAssets = async (count: number) => (
	assertBlockfrostEnvelope(
		blockfrostAssetListItemWire.array(),
		await listPage('assets', count),
		'assets'
	)
)

export const getLatestProtocolParameters = async () => (
	assertBlockfrostEnvelope(
		blockfrostProtocolParametersWire,
		await get('epochs/latest/parameters'),
		'protocol parameters'
	)
)

export const getCommittee = async () => (
	assertBlockfrostEnvelope(
		blockfrostCommitteeWire,
		await get('governance/committee'),
		'committee'
	)
)

export const listCommitteeVotes = async (
	count: number,
	page?: number
) => (
	assertBlockfrostEnvelope(
		blockfrostCommitteeVoteWire.array(),
		await listPage('governance/committee/votes', count, undefined, page),
		'committee votes'
	)
)
