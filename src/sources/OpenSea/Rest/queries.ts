import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/OpenSea/bindings.ts'
import type {
	OpenSeaAccountEventsPath,
	OpenSeaAccountEventsQuery,
	OpenSeaAccountEventsResponse,
	OpenSeaAccountNftsPath,
	OpenSeaAccountNftsQuery,
	OpenSeaAccountNftsResponse,
	OpenSeaChainIdentifier,
	OpenSeaCollectionNftsPath,
	OpenSeaCollectionNftsQuery,
	OpenSeaCollectionNftsResponse,
	OpenSeaCollectionPath,
	OpenSeaCollectionResponse,
	OpenSeaContractNftsPath,
	OpenSeaContractNftsQuery,
	OpenSeaContractNftsResponse,
	OpenSeaContractPath,
	OpenSeaContractResponse,
	OpenSeaNftEventsPath,
	OpenSeaNftEventsQuery,
	OpenSeaNftEventsResponse,
	OpenSeaNftOwnersPath,
	OpenSeaNftOwnersQuery,
	OpenSeaNftOwnersResponse,
	OpenSeaNftPath,
	OpenSeaNftResponse,
} from '$/sources/OpenSea/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.OpenSea_Rest][0]

export const openSeaChainByChainId = {
	1: 'ethereum',
	10: 'optimism',
	130: 'unichain',
	137: 'polygon',
	143: 'monad',
	360: 'shape',
	747: 'flow',
	999: 'hyperevm',
	1329: 'sei',
	1868: 'soneium',
	2020: 'ronin',
	2741: 'abstract',
	4326: 'megaeth',
	4663: 'robinhood',
	5031: 'somnia',
	8333: 'b3',
	8453: 'base',
	33139: 'ape_chain',
	42161: 'arbitrum',
	43114: 'avalanche',
	43419: 'gunzilla',
	57073: 'ink',
	80094: 'bera_chain',
	81457: 'blast',
	7777777: 'zora',
} as const satisfies Record<number, OpenSeaChainIdentifier>

export const openSeaChainForChainId = (
	chainId: number
) => {
	const chain = openSeaChainByChainId[chainId as keyof typeof openSeaChainByChainId]
	if (chain == null)
		throw new Error(`OpenSea_Rest: unsupported EIP-155 chain ${chainId}`)

	return chain
}

export const requireOpenSeaCredential = (
	credential = process.env.OPENSEA_API_KEY?.trim()
) => {
	if (credential == null || credential === '')
		throw new Error('OpenSea_Rest: API key is required')

	return credential
}

const requestOpenSeaJson = async <_Response>({
	path,
	credential,
}: {
	path: string
	credential: string
}) => {
	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString(), {
		headers: {
			accept: 'application/json',
			'x-api-key': requireOpenSeaCredential(credential),
		},
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<_Response>()
}

const pagination = ({
	limit,
	next,
	maximum = 200,
}: {
	limit: number
	next?: string
	maximum?: number
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > maximum)
		throw new Error(`OpenSea_Rest: limit must be between 1 and ${maximum}`)

	if (next === '')
		throw new Error('OpenSea_Rest: pagination cursor must be opaque and nonempty')

	return new URLSearchParams({
		limit: String(limit),
		...(next !== undefined && { next }),
	})
}

const requireNftList = <
	_Response extends {
		nfts: unknown
	},
>(
	body: _Response,
	surface: string
) => {
	if (!Array.isArray(body.nfts))
		throw new Error(`OpenSea_Rest: ${surface} response missing nfts array`)

	return body
}

const requireOwnersList = (
	body: OpenSeaNftOwnersResponse
) => {
	if (!Array.isArray(body.owners))
		throw new Error('OpenSea_Rest: NFT owners response missing owners array')

	return body
}

const requireAssetEvents = <
	_Response extends {
		asset_events: unknown
	},
>(
	body: _Response,
	surface: string
) => {
	if (!Array.isArray(body.asset_events))
		throw new Error(`OpenSea_Rest: ${surface} response missing asset_events array`)

	return body
}

export const getAccountNfts = async ({
	credential,
	chain,
	address,
	collection,
	limit = 200,
	next,
}: (
	& OpenSeaAccountNftsPath
	& OpenSeaAccountNftsQuery
	& { credential: string }
)) => {
	const searchParameters = pagination({
		limit,
		next,
	})

	if (collection !== undefined)
		searchParameters.set('collection', collection)

	return requireNftList(
		await requestOpenSeaJson<OpenSeaAccountNftsResponse>({
			credential,
			path: `/api/v2/chain/${encodeURIComponent(chain)}/account/${encodeURIComponent(address)}/nfts?${searchParameters}`,
		}),
		'account NFTs'
	)
}

export const getAccountEvents = async ({
	credential,
	address,
	after,
	before,
	eventTypes,
	chain,
	limit = 200,
	next,
}: (
	& OpenSeaAccountEventsPath
	& Omit<OpenSeaAccountEventsQuery, 'event_type'>
	& {
		credential: string
		eventTypes?: OpenSeaAccountEventsQuery['event_type']
	}
)) => {
	const searchParameters = pagination({
		limit,
		next,
	})

	if (after !== undefined)
		searchParameters.set('after', String(after))

	if (before !== undefined)
		searchParameters.set('before', String(before))

	if (chain !== undefined)
		searchParameters.set('chain', chain)

	for (const eventType of eventTypes ?? [])
		searchParameters.append('event_type', eventType)

	return requireAssetEvents(
		await requestOpenSeaJson<OpenSeaAccountEventsResponse>({
			credential,
			path: `/api/v2/events/accounts/${encodeURIComponent(address)}?${searchParameters}`,
		}),
		'account events'
	)
}

export const getNft = async ({
	credential,
	chain,
	address,
	identifier,
}: (
	& OpenSeaNftPath
	& { credential: string }
)) => {
	const body = await requestOpenSeaJson<OpenSeaNftResponse>({
		credential,
		path: `/api/v2/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}/nfts/${encodeURIComponent(identifier)}`,
	})

	if (body.nft == null)
		throw new Error('OpenSea_Rest: NFT response missing nft')

	return body
}

export const getContract = async ({
	credential,
	chain,
	address,
}: (
	& OpenSeaContractPath
	& { credential: string }
)) => {
	const body = await requestOpenSeaJson<OpenSeaContractResponse>({
		credential,
		path: `/api/v2/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}`,
	})

	if (body.address == null || body.address === '')
		throw new Error('OpenSea_Rest: contract response missing address')
	if (body.collection == null || body.collection === '')
		throw new Error('OpenSea_Rest: contract response missing collection')

	return body
}

export const getNftsByContract = async ({
	credential,
	chain,
	address,
	limit = 200,
	next,
}: (
	& OpenSeaContractNftsPath
	& OpenSeaContractNftsQuery
	& { credential: string }
)) => {
	const searchParameters = pagination({
		limit,
		next,
	})

	return requireNftList(
		await requestOpenSeaJson<OpenSeaContractNftsResponse>({
			credential,
			path: `/api/v2/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}/nfts?${searchParameters}`,
		}),
		'contract NFTs'
	)
}

export const getNftOwners = async ({
	credential,
	chain,
	address,
	identifier,
	limit = 100,
	next,
}: (
	& OpenSeaNftOwnersPath
	& OpenSeaNftOwnersQuery
	& { credential: string }
)) => {
	const searchParameters = pagination({
		limit,
		next,
		maximum: 100,
	})

	return requireOwnersList(
		await requestOpenSeaJson<OpenSeaNftOwnersResponse>({
			credential,
			path: `/api/v2/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}/nfts/${encodeURIComponent(identifier)}/owners?${searchParameters}`,
		})
	)
}

export const getNftEvents = async ({
	credential,
	chain,
	address,
	identifier,
	after,
	before,
	eventTypes,
	limit = 200,
	next,
}: (
	& OpenSeaNftEventsPath
	& Omit<OpenSeaNftEventsQuery, 'event_type'>
	& {
		credential: string
		eventTypes?: OpenSeaNftEventsQuery['event_type']
	}
)) => {
	const searchParameters = pagination({
		limit,
		next,
	})

	if (after !== undefined)
		searchParameters.set('after', String(after))

	if (before !== undefined)
		searchParameters.set('before', String(before))

	for (const eventType of eventTypes ?? [])
		searchParameters.append('event_type', eventType)

	return requireAssetEvents(
		await requestOpenSeaJson<OpenSeaNftEventsResponse>({
			credential,
			path: `/api/v2/events/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}/nfts/${encodeURIComponent(identifier)}?${searchParameters}`,
		}),
		'NFT events'
	)
}

export const getCollection = async ({
	credential,
	slug,
}: (
	& OpenSeaCollectionPath
	& { credential: string }
)) => {
	const body = await requestOpenSeaJson<OpenSeaCollectionResponse>({
		credential,
		path: `/api/v2/collections/${encodeURIComponent(slug)}`,
	})

	if (body.collection == null || body.collection === '')
		throw new Error('OpenSea_Rest: collection response missing collection slug')
	if (!Array.isArray(body.contracts))
		throw new Error('OpenSea_Rest: collection response missing contracts array')

	return body
}

export const getNftsByCollection = async ({
	credential,
	slug,
	traits,
	has_agent_binding: hasAgentBinding,
	limit = 200,
	next,
}: (
	& OpenSeaCollectionNftsPath
	& OpenSeaCollectionNftsQuery
	& { credential: string }
)) => {
	const searchParameters = pagination({
		limit,
		next,
	})

	if (traits !== undefined)
		searchParameters.set('traits', traits)

	if (hasAgentBinding !== undefined)
		searchParameters.set('has_agent_binding', String(hasAgentBinding))

	return requireNftList(
		await requestOpenSeaJson<OpenSeaCollectionNftsResponse>({
			credential,
			path: `/api/v2/collection/${encodeURIComponent(slug)}/nfts?${searchParameters}`,
		}),
		'collection NFTs'
	)
}
