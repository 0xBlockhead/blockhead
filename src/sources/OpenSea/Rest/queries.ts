import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/OpenSea/bindings.ts'
import { openSeaChainByChainId } from '$/sources/OpenSea/Rest/constants.ts'
import type {
	OpenSeaAccountEventsPath,
	OpenSeaAccountEventsQuery,
	OpenSeaAccountEventsResponse,
	OpenSeaAccountNftsPath,
	OpenSeaAccountNftsQuery,
	OpenSeaAccountNftsResponse,
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
import { type as arktype } from 'arktype'

const binding = Object.fromEntries(bindings[Source.OpenSea_Rest].map((binding) => [binding.target.key, binding]))['opensea-api']

/** OpenAPI Trait — transport-typed; no enrolled EvmNft trait bag. */
const openSeaTraitWire = arktype({
	trait_type: 'string',
	value: 'unknown',
	'display_type?': 'string',
	'max_value?': 'string',
})

/** OpenAPI Rarity — transport-only until APP enrolls NFT rarity. */
const openSeaRarityWire = arktype({
	strategy_id: 'string',
	strategy_version: 'string',
	'rank?': 'number',
})

const openSeaOwnerWire = arktype({
	address: 'string',
	quantity: 'number',
	quantity_string: 'string',
})

/**
 * OpenAPI Nft list row + optional media / valuation leftovers.
 * Enrolled EvmNft projections still only use standard / URI / name / description / image / active.
 */
const openSeaNftWire = arktype({
	identifier: 'string',
	collection: 'string',
	contract: 'string',
	token_standard: 'string',
	opensea_url: 'string',
	updated_at: 'string',
	is_disabled: 'boolean',
	is_nsfw: 'boolean',
	traits: openSeaTraitWire.array(),
	'name?': 'string',
	'description?': 'string',
	'image_url?': 'string',
	'display_image_url?': 'string',
	'display_animation_url?': 'string',
	'metadata_url?': 'string',
	'original_image_url?': 'string',
	'original_animation_url?': 'string',
	'estimated_value_usd?': 'number',
	'decimals?': 'number',
})
const openSeaNftDetailedWire = arktype({
	...openSeaNftWire.definition,
	creator: 'string',
	is_suspicious: 'boolean',
	owners: openSeaOwnerWire.array(),
	'animation_url?': 'string',
	'rarity?': openSeaRarityWire,
})
const openSeaNftListEnvelope = arktype({
	nfts: openSeaNftWire.array(),
	'next?': 'string',
})
const openSeaNftEnvelope = arktype({
	nft: openSeaNftDetailedWire,
})
const openSeaNftOwnersEnvelope = arktype({
	owners: openSeaOwnerWire.array(),
	'next?': 'string',
})
/** Shared AssetEventsResponse spine — event-type payloads stay transport-only. */
const openSeaAssetEventsEnvelope = arktype({
	asset_events: arktype({
		event_type: 'string',
		event_timestamp: 'number',
	}).array(),
	'next?': 'string',
})
const openSeaContractEnvelope = arktype({
	address: 'string',
	collection: 'string',
	'chain?': 'string',
	'contract_standard?': 'string',
	'name?': 'string',
})
const openSeaCollectionEnvelope = arktype({
	collection: 'string',
	contracts: arktype({
		address: 'string',
		chain: 'string',
	}).array(),
	'name?': 'string',
	'description?': 'string',
	'image_url?': 'string',
	'banner_image_url?': 'string',
	'opensea_url?': 'string',
	'total_supply?': 'number',
})

const assertEnvelope = (
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`OpenSea_Rest: invalid ${label} response envelope`)
	}
}

export const openSeaChainForChainId = (
	chainId: number
) => {
	const chain = openSeaChainByChainId[chainId]
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
	assertEnvelope(openSeaNftListEnvelope, body, surface)
	return body
}

const requireOwnersList = (
	body: OpenSeaNftOwnersResponse
) => {
	assertEnvelope(openSeaNftOwnersEnvelope, body, 'NFT owners')
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
	assertEnvelope(openSeaAssetEventsEnvelope, body, surface)
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

	assertEnvelope(openSeaNftEnvelope, body, 'NFT')
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

	assertEnvelope(openSeaContractEnvelope, body, 'contract')
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

	assertEnvelope(openSeaCollectionEnvelope, body, 'collection')
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
