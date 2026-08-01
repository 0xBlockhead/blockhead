import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/OpenSea/bindings.ts'
import type {
	OpenSeaAccountEventsPath,
	OpenSeaAccountEventsQuery,
	OpenSeaAccountEventsResponse,
	OpenSeaAccountNftsPath,
	OpenSeaAccountNftsQuery,
	OpenSeaAccountNftsResponse,
} from '$/sources/OpenSea/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.OpenSea_Rest]

const requestOpenSeaJson = async <_Response>({
	path,
	credential,
}: {
	path: string
	credential: string
}) => {
	if (!credential)
		throw new Error('OpenSea API key is required')

	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString(), {
		headers: {
			accept: 'application/json',
			'x-api-key': credential,
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
