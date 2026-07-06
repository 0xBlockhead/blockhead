import { optionalPublicEnvString, type SourcePublicEnv } from '$/sources/$sources.ts'
import { mastodonFetch, mastodonGet } from '$/sources/Mastodon/Rest/client.ts'
import { mastodonInstanceByBaseUrl } from '$/constants/Mastodon.ts'
import type {
	MastodonApiV1Account,
	MastodonApiV1Context,
	MastodonApiV1DomainBlock,
	MastodonApiV1Instance,
	MastodonApiV1Status,
	MastodonApiV2Search,
} from '$/sources/Mastodon/Rest/types.ts'

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
) => (
	optionalPublicEnvString(publicEnv, 'PUBLIC_MASTODON_ACCESS_TOKEN') == null ?
		[]
	:
		mastodonGet<MastodonApiV1Status[]>(
			publicEnv,
			instanceOrigin,
			'/timelines/public',
			{ limit: String(Math.min(80, Math.max(1, limit))) }
		)
)

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
	if (mastodonInstanceByBaseUrl[new URL(instanceOrigin).origin] == null)
		throw new Error('Mastodon_Rest: entity instance does not match configured Mastodon-compatible ActivityPub instance')
}
