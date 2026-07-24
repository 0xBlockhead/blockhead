import type { SourcePublicEnv } from '$/sources/$sources.ts'
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

export const getAccountByLocalAccountId = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	localAccountId: string
) => (
	mastodonGet<MastodonApiV1Account>(publicEnv, instanceOrigin, `/accounts/${encodeURIComponent(localAccountId)}`)
)

export const getAccountByAcct = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	acct: string
) => (
	mastodonGet<MastodonApiV1Account>(publicEnv, instanceOrigin, '/accounts/lookup', { acct })
)

export const getAccountByActivityStreamsUri = async (
	publicEnv: SourcePublicEnv,
	activityStreamsUri: string
) => {
	const account = (await mastodonGet<MastodonApiV2Search>(
		publicEnv,
		new URL(activityStreamsUri).origin,
		'/search',
		{
			q: activityStreamsUri,
			resolve: 'true',
			type: 'accounts',
		},
		'v2'
	)).accounts?.find((account) => account.uri === activityStreamsUri)
	if (account == null)
		throw new Error('Mastodon_Rest: ActivityPub actor URI not found')
	return account
}

export const getStatus = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	localStatusId: string
) => (
	mastodonGet<MastodonApiV1Status>(publicEnv, instanceOrigin, `/statuses/${encodeURIComponent(localStatusId)}`)
)

export const getStatusByActivityStreamsUri = async (
	publicEnv: SourcePublicEnv,
	activityStreamsUri: string
) => {
	const status = (await mastodonGet<MastodonApiV2Search>(
		publicEnv,
		new URL(activityStreamsUri).origin,
		'/search',
		{
			q: activityStreamsUri,
			resolve: 'true',
			type: 'statuses',
		},
		'v2'
	)).statuses?.find((status) => status.uri === activityStreamsUri)
	if (status == null)
		throw new Error('Mastodon_Rest: ActivityPub note URI not found')
	return status
}

export const getStatusContext = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	localStatusId: string
) => (
	mastodonGet<MastodonApiV1Context>(publicEnv, instanceOrigin, `/statuses/${encodeURIComponent(localStatusId)}/context`)
)

export const listAccountStatusesByLocalAccountId = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	localAccountId: string,
	limit: number
) => (
	mastodonGet<MastodonApiV1Status[]>(
		publicEnv,
		instanceOrigin,
		`/accounts/${encodeURIComponent(localAccountId)}/statuses`,
		{ limit: String(Math.min(80, Math.max(1, limit))) }
	)
)

export const listAccountStatusesPageByLocalAccountId = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	localAccountId: string,
	limit: number,
	continuationToken?: string
) => {
	const configuredInstanceOrigin = new URL(instanceOrigin).origin
	if (
		configuredInstanceOrigin !== instanceOrigin
		|| !mastodonInstanceOrigins.some((origin) => origin === configuredInstanceOrigin)
	)
		throw new Error('Mastodon_Rest: invalid authored notes instance')

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

	const response = await mastodonFetchUrl(publicEnv, requestUrl)
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

export const getInstance = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string
) => (
	mastodonGet<MastodonApiV1Instance>(publicEnv, instanceOrigin, '/instance')
)

export const listPublicTimeline = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	limit: number
) => {
	if (!mastodonPublicTimelineOrigins.includes(instanceOrigin))
		throw new Error(`Mastodon_Rest: public timeline binding is missing for ${instanceOrigin}`)

	const url = `${instanceOrigin}/api/v1/timelines/public?limit=${Math.min(40, Math.max(1, limit))}`
	const response = await mastodonFetchPublicTimelineUrl(publicEnv, url)
	if (!response.ok)
		throw new Error(`Mastodon_Rest: public timeline failed for ${instanceOrigin}: ${response.status} ${response.statusText}`)

	return response.json<MastodonApiV1Status[]>()
}

export const listPublicTimelinePage = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	limit: number,
	continuationToken?: string
) => {
	const configuredInstanceOrigin = new URL(instanceOrigin).origin
	if (
		configuredInstanceOrigin !== instanceOrigin
		|| !mastodonPublicTimelineOrigins.some((origin) => origin === configuredInstanceOrigin)
	)
		throw new Error('Mastodon_Rest: invalid public timeline instance')

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

	const response = await mastodonFetchPublicTimelineUrl(publicEnv, requestUrl)
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
	publicEnv: SourcePublicEnv,
	instanceOrigin: string
) => {
	const response = await mastodonFetch(publicEnv, instanceOrigin, '/instance/peers')
	if (!response.ok)
		throw new Error(`Mastodon_Rest: instance peers failed for ${instanceOrigin}: ${response.status} ${response.statusText}`)
	return response.json<string[]>()
}

export const listInstanceModeratedDomains = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string
) => {
	const response = await mastodonFetch(publicEnv, instanceOrigin, '/instance/domain_blocks')
	if (!response.ok)
		throw new Error(`Mastodon_Rest: instance domain blocks failed for ${instanceOrigin}: ${response.status} ${response.statusText}`)
	return response.json<MastodonApiV1DomainBlock[]>()
}

export const assertInstanceMatches = (instanceOrigin: string) => {
	if (!mastodonInstanceOrigins.some((origin) => origin === new URL(instanceOrigin).origin))
		throw new Error('Mastodon_Rest: entity instance does not match configured Mastodon-compatible ActivityPub instance')
}
