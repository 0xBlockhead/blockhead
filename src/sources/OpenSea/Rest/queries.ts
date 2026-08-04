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
	OpenSeaContractNftsPath,
	OpenSeaContractNftsQuery,
	OpenSeaContractNftsResponse,
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
	2020: 'ronin',
	8453: 'base',
	33139: 'ape_chain',
	42161: 'arbitrum',
	43114: 'avalanche',
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
		throw new Error('OpenSea API key is required')

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
}: {
	limit: number
	next?: string
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 200)
		throw new Error('OpenSea limit must be between 1 and 200')

	if (next === '')
		throw new Error('OpenSea pagination cursor must be opaque and nonempty')

	return new URLSearchParams({
		limit: String(limit),
		...(next !== undefined && { next }),
	})
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

	return requestOpenSeaJson<OpenSeaAccountNftsResponse>({
		credential,
		path: `/api/v2/chain/${encodeURIComponent(chain)}/account/${encodeURIComponent(address)}/nfts?${searchParameters}`,
	})
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

	return requestOpenSeaJson<OpenSeaAccountEventsResponse>({
		credential,
		path: `/api/v2/events/accounts/${encodeURIComponent(address)}?${searchParameters}`,
	})
}

export const getNft = async ({
	credential,
	chain,
	address,
	identifier,
}: (
	& OpenSeaNftPath
	& { credential: string }
)) => (
	requestOpenSeaJson<OpenSeaNftResponse>({
		credential,
		path: `/api/v2/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}/nfts/${encodeURIComponent(identifier)}`,
	})
)

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

	return requestOpenSeaJson<OpenSeaContractNftsResponse>({
		credential,
		path: `/api/v2/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}/nfts?${searchParameters}`,
	})
}
