import {
	mastodonFetch,
	mastodonFetchPublicTimelineUrl,
	mastodonFetchUrl,
	mastodonGet,
	mastodonInstanceOrigins,
	mastodonPublicTimelineOrigins,
} from '$/sources/Mastodon/Rest/client.ts'
import type {
	MastodonApiV1Account,
	MastodonApiV1Context,
	MastodonApiV1DomainBlock,
	MastodonApiV1Instance,
	MastodonApiV1Status,
	MastodonApiV2Search,
} from '$/sources/Mastodon/Rest/types.ts'

const mastodonContinuationFromLink = (
	linkHeader: string | null,
	operationLabel: string
) => {
	if (linkHeader == null)
		return undefined

	const linkValues: string[] = []
	let linkValueStart = 0
	let insideUri = false
	let insideQuotedParameter = false
	let quotedParameterEscape = false
	for (let index = 0; index < linkHeader.length; index++) {
		const character = linkHeader[index]
		if (insideQuotedParameter) {
			if (quotedParameterEscape)
				quotedParameterEscape = false
			else if (character === '\\')
				quotedParameterEscape = true
			else if (character === '"')
				insideQuotedParameter = false
		}
		else if (character === '<')
			insideUri = true
		else if (character === '>')
			insideUri = false
		else if (character === '"')
			insideQuotedParameter = true
		else if (character === ',' && !insideUri) {
			linkValues.push(linkHeader.slice(linkValueStart, index).trim())
			linkValueStart = index + 1
		}
	}
	linkValues.push(linkHeader.slice(linkValueStart).trim())

	const nextUrls = linkValues.flatMap((linkValue) => {
		const match = /^<([^>]*)>(.*)$/.exec(linkValue)
		const relationValues = [...linkValue.matchAll(/;\s*rel\s*=\s*(?:"[^"]*"|[^;\s,]+)/gi)]
			.flatMap((relation) => relation[0]
				.slice(relation[0].indexOf('=') + 1)
				.trim()
				.replace(/^"|"$/g, '')
				.split(/\s+/))
		if (!relationValues.some((relation) => relation.toLowerCase() === 'next'))
			return []
		if (match == null || match[1] === '')
			throw new Error(`Mastodon_Rest: malformed ${operationLabel} continuation`)

		return [match[1]]
	})
	if (nextUrls.length > 1)
		throw new Error(`Mastodon_Rest: ambiguous ${operationLabel} continuation`)

	return nextUrls[0]
}

export const getAccountByLocalAccountId = (
	instanceOrigin: string,
	localAccountId: string
) => (
	mastodonGet<MastodonApiV1Account>(instanceOrigin, `/accounts/${encodeURIComponent(localAccountId)}`)
)

const assertPublicTimelineMatches = (instanceOrigin: string) => {
	if (!mastodonPublicTimelineOrigins.includes(new URL(instanceOrigin).origin))
		throw new Error(`Mastodon_Rest: public timeline binding is missing for ${instanceOrigin}`)
}

export const getAccountByAcct = (
	instanceOrigin: string,
	acct: string
) => (
	mastodonGet<MastodonApiV1Account>(instanceOrigin, '/accounts/lookup', { acct })
)

const searchByActivityStreamsUri = async <_Result extends { uri?: string }>(
	activityStreamsUri: string,
	queryType: 'accounts' | 'statuses',
	resultsFromSearch: (search: MastodonApiV2Search) => _Result[] | undefined,
	resultLabel: 'actor' | 'note'
) => {
	const result = resultsFromSearch(await mastodonGet<MastodonApiV2Search>(
		new URL(activityStreamsUri).origin,
		'/search',
		{
			q: activityStreamsUri,
			resolve: 'true',
			type: queryType,
		},
		'v2'
	))?.find((result) => result.uri === activityStreamsUri)
	if (result == null)
		throw new Error(`Mastodon_Rest: ActivityPub ${resultLabel} URI not found`)
	return result
}

export const getAccountByActivityStreamsUri = (activityStreamsUri: string) => (
	searchByActivityStreamsUri(activityStreamsUri, 'accounts', ({ accounts }) => accounts, 'actor')
)

export const getStatus = (
	instanceOrigin: string,
	localStatusId: string
) => (
	mastodonGet<MastodonApiV1Status>(instanceOrigin, `/statuses/${encodeURIComponent(localStatusId)}`)
)

export const getStatusByActivityStreamsUri = (activityStreamsUri: string) => (
	searchByActivityStreamsUri(activityStreamsUri, 'statuses', ({ statuses }) => statuses, 'note')
)

export const getStatusContext = (
	instanceOrigin: string,
	localStatusId: string
) => (
	mastodonGet<MastodonApiV1Context>(instanceOrigin, `/statuses/${encodeURIComponent(localStatusId)}/context`)
)

export const listAccountStatusesPageByLocalAccountId = async (
	instanceOrigin: string,
	localAccountId: string,
	limit: number,
	continuationToken?: string
) => {
	const configuredInstanceOrigin = new URL(instanceOrigin).origin
	if (
		configuredInstanceOrigin !== instanceOrigin
	)
		throw new Error('Mastodon_Rest: invalid authored notes instance')
	assertInstanceMatches(configuredInstanceOrigin)

	const pathname = `/api/v1/accounts/${encodeURIComponent(localAccountId)}/statuses`
	const requestUrl = continuationToken ?? `${instanceOrigin}${pathname}?limit=${Math.min(80, Math.max(1, limit))}`
	const url = new URL(requestUrl)
	if (
		url.origin !== configuredInstanceOrigin
		|| url.pathname !== pathname
		|| url.username !== ''
		|| url.password !== ''
		|| url.hash !== ''
	)
		throw new Error('Mastodon_Rest: invalid authored notes continuation')

	const response = await mastodonFetchUrl(requestUrl)
	if (!response.ok)
		throw new Error(`Mastodon_Rest: authored notes failed for ${instanceOrigin}: ${response.status} ${response.statusText}`)

	const nextUrl = mastodonContinuationFromLink(response.headers.get('Link'), 'authored notes')
	if (nextUrl != null) {
		const continuationUrl = new URL(nextUrl)
		if (
			continuationUrl.origin !== configuredInstanceOrigin
			|| continuationUrl.pathname !== pathname
			|| continuationUrl.username !== ''
			|| continuationUrl.password !== ''
			|| continuationUrl.hash !== ''
		)
			throw new Error('Mastodon_Rest: invalid authored notes continuation')
	}

	return {
		statuses: await response.json<MastodonApiV1Status[]>(),
		continuationToken: nextUrl === continuationToken ? undefined : nextUrl,
	}
}

export const getInstance = (
	instanceOrigin: string
) => (
	mastodonGet<MastodonApiV1Instance>(instanceOrigin, '/instance')
)

export const listPublicTimelinePage = async (
	instanceOrigin: string,
	limit: number,
	continuationToken?: string
) => {
	const configuredInstanceOrigin = new URL(instanceOrigin).origin
	if (
		configuredInstanceOrigin !== instanceOrigin
	)
		throw new Error('Mastodon_Rest: invalid public timeline instance')
	assertPublicTimelineMatches(configuredInstanceOrigin)

	const requestUrl = continuationToken ?? `${instanceOrigin}/api/v1/timelines/public?limit=${Math.min(40, Math.max(1, limit))}`
	const url = new URL(requestUrl)
	if (
		url.origin !== configuredInstanceOrigin
		|| url.pathname !== '/api/v1/timelines/public'
		|| url.username !== ''
		|| url.password !== ''
		|| url.hash !== ''
	)
		throw new Error('Mastodon_Rest: invalid public timeline continuation')

	const response = await mastodonFetchPublicTimelineUrl(requestUrl)
	if (!response.ok)
		throw new Error(`Mastodon_Rest: public timeline failed for ${instanceOrigin}: ${response.status} ${response.statusText}`)

	const nextUrl = mastodonContinuationFromLink(response.headers.get('Link'), 'public timeline')
	if (nextUrl != null) {
		const continuationUrl = new URL(nextUrl)
		if (
			continuationUrl.origin !== configuredInstanceOrigin
			|| continuationUrl.pathname !== '/api/v1/timelines/public'
			|| continuationUrl.username !== ''
			|| continuationUrl.password !== ''
			|| continuationUrl.hash !== ''
		)
			throw new Error('Mastodon_Rest: invalid public timeline continuation')
	}

	return {
		statuses: await response.json<MastodonApiV1Status[]>(),
		continuationToken: nextUrl === continuationToken ? undefined : nextUrl,
	}
}

export const listInstancePeerDomains = async (
	instanceOrigin: string
) => {
	const response = await mastodonFetch(instanceOrigin, '/instance/peers')
	if (!response.ok)
		throw new Error(`Mastodon_Rest: instance peers failed for ${instanceOrigin}: ${response.status} ${response.statusText}`)
	return response.json<string[]>()
}

export const listInstanceModeratedDomains = async (
	instanceOrigin: string
) => {
	const response = await mastodonFetch(instanceOrigin, '/instance/domain_blocks')
	if (!response.ok)
		throw new Error(`Mastodon_Rest: instance domain blocks failed for ${instanceOrigin}: ${response.status} ${response.statusText}`)
	return response.json<MastodonApiV1DomainBlock[]>()
}

export const assertInstanceMatches = (instanceOrigin: string) => {
	if (!mastodonInstanceOrigins.includes(new URL(instanceOrigin).origin))
		throw new Error(`Mastodon_Rest: entity instance binding is missing for ${instanceOrigin}`)
}
