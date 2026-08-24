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

export type OpenSeaRestErrorCode = 'upstream' | 'malformed-response' | 'aborted'

export class OpenSeaRestError extends Error {
	readonly code: OpenSeaRestErrorCode

	constructor(code: OpenSeaRestErrorCode, message: string, options?: ErrorOptions) {
		super(message, options)
		this.name = 'OpenSeaRestError'
		this.code = code
	}
}

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
		throw new OpenSeaRestError('malformed-response', `OpenSea_Rest: invalid ${label} response envelope`)
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

const requestOpenSeaJson = async <_Response>({
	path,
}: {
	path: string
}) => {
	let response: Response
	try {
		response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString(), {
			headers: {
				accept: 'application/json',
			},
		})
	} catch (cause) {
		if (cause instanceof DOMException && cause.name === 'AbortError')
			throw new OpenSeaRestError('aborted', 'OpenSea_Rest: upstream request aborted', { cause })
		throw new OpenSeaRestError('upstream', 'OpenSea_Rest: upstream request failed', { cause })
	}

	if (!response.ok) {
		try {
			await throwHttpError(binding.source, response)
		} catch (cause) {
			throw new OpenSeaRestError('upstream', 'OpenSea_Rest: upstream request failed', { cause })
		}
	}

	try {
		return await response.json<_Response>()
	} catch (cause) {
		if (cause instanceof DOMException && cause.name === 'AbortError')
			throw new OpenSeaRestError('aborted', 'OpenSea_Rest: upstream request aborted', { cause })
		throw new OpenSeaRestError('malformed-response', 'OpenSea_Rest: malformed upstream JSON response', { cause })
	}
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
		nfts: {
			contract: string
			identifier: string
		}[]
	},
>(
	body: _Response,
	surface: string
) => {
	assertEnvelope(openSeaNftListEnvelope, body, surface)
	if (new Set(body.nfts.map((nft) => `${nft.contract.toLowerCase()}:${nft.identifier}`)).size !== body.nfts.length)
		throw new Error(`OpenSea_Rest: ${surface} contains duplicate NFT identities`)

	return body
}

const requireOwnersList = (
	body: OpenSeaNftOwnersResponse
) => {
	assertEnvelope(openSeaNftOwnersEnvelope, body, 'NFT owners')
	if (new Set(body.owners.map((owner) => owner.address.toLowerCase())).size !== body.owners.length)
		throw new Error('OpenSea_Rest: NFT owners contains duplicate addresses')

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
	chain,
	address,
	collection,
	limit = 200,
	next,
}: (
	& OpenSeaAccountNftsPath
	& OpenSeaAccountNftsQuery
)) => {
	const searchParameters = pagination({
		limit,
		next,
	})

	if (collection !== undefined)
		searchParameters.set('collection', collection)

	return requireNftList(
		await requestOpenSeaJson<OpenSeaAccountNftsResponse>({
			path: `/api/v2/chain/${encodeURIComponent(chain)}/account/${encodeURIComponent(address)}/nfts?${searchParameters}`,
		}),
		'account NFTs'
	)
}

export const getAccountEvents = async ({
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
			path: `/api/v2/events/accounts/${encodeURIComponent(address)}?${searchParameters}`,
		}),
		'account events'
	)
}

export const getNft = async ({
	chain,
	address,
	identifier,
}: (
	& OpenSeaNftPath
)) => {
	const body = await requestOpenSeaJson<OpenSeaNftResponse>({
		path: `/api/v2/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}/nfts/${encodeURIComponent(identifier)}`,
	})

	assertEnvelope(openSeaNftEnvelope, body, 'NFT')
	if (
		body.nft.contract.toLowerCase() !== address.toLowerCase()
		|| body.nft.identifier !== identifier
	)
		throw new Error('OpenSea_Rest: NFT response does not match requested identity')
	return body
}

export const getContract = async ({
	chain,
	address,
}: (
	& OpenSeaContractPath
)) => {
	const body = await requestOpenSeaJson<OpenSeaContractResponse>({
		path: `/api/v2/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}`,
	})

	assertEnvelope(openSeaContractEnvelope, body, 'contract')
	if (
		body.address.toLowerCase() !== address.toLowerCase()
			|| body.chain !== chain
	)
		throw new Error('OpenSea_Rest: contract response does not match requested identity')
	return body
}

export const getNftsByContract = async ({
	chain,
	address,
	limit = 200,
	next,
}: (
	& OpenSeaContractNftsPath
	& OpenSeaContractNftsQuery
)) => {
	const searchParameters = pagination({
		limit,
		next,
	})

	const body = requireNftList(
		await requestOpenSeaJson<OpenSeaContractNftsResponse>({
			path: `/api/v2/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}/nfts?${searchParameters}`,
		}),
		'contract NFTs'
	)
	if (body.nfts.some((nft) => nft.contract.toLowerCase() !== address.toLowerCase()))
		throw new Error('OpenSea_Rest: contract NFTs contains a foreign contract')
	return body
}

export const getNftOwners = async ({
	chain,
	address,
	identifier,
	limit = 100,
	next,
}: (
	& OpenSeaNftOwnersPath
	& OpenSeaNftOwnersQuery
)) => {
	const searchParameters = pagination({
		limit,
		next,
		maximum: 100,
	})

	return requireOwnersList(
		await requestOpenSeaJson<OpenSeaNftOwnersResponse>({
			path: `/api/v2/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}/nfts/${encodeURIComponent(identifier)}/owners?${searchParameters}`,
		})
	)
}

export const getNftEvents = async ({
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
			path: `/api/v2/events/chain/${encodeURIComponent(chain)}/contract/${encodeURIComponent(address)}/nfts/${encodeURIComponent(identifier)}?${searchParameters}`,
		}),
		'NFT events'
	)
}

export const getCollection = async ({
	slug,
}: (
	& OpenSeaCollectionPath
)) => {
	const body = await requestOpenSeaJson<OpenSeaCollectionResponse>({
		path: `/api/v2/collections/${encodeURIComponent(slug)}`,
	})

	assertEnvelope(openSeaCollectionEnvelope, body, 'collection')
	if (body.collection !== slug)
		throw new Error('OpenSea_Rest: collection response does not match requested slug')
	return body
}

export const getNftsByCollection = async ({
	slug,
	traits,
	has_agent_binding: hasAgentBinding,
	limit = 200,
	next,
}: (
	& OpenSeaCollectionNftsPath
	& OpenSeaCollectionNftsQuery
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
			path: `/api/v2/collection/${encodeURIComponent(slug)}/nfts?${searchParameters}`,
		}),
		'collection NFTs'
	)
}
