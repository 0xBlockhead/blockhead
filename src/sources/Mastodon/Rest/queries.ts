import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { mastodonGet } from '$/sources/Mastodon/Rest/client.ts'
import { mastodonInstanceByKey } from '$/constants/Mastodon.ts'
import type {
	MastodonApiV1Account,
	MastodonApiV1Context,
	MastodonApiV1Instance,
	MastodonApiV1Status,
	MastodonApiV2Search,
} from '$/sources/Mastodon/Rest/types.ts'

export const getAccountByLocalAccountId = async (
	publicEnv: SourcePublicEnv,
	localAccountId: string
) => (
	mastodonGet<MastodonApiV1Account>(publicEnv, `/accounts/${encodeURIComponent(localAccountId)}`)
)

export const getAccountByAcct = async (
	publicEnv: SourcePublicEnv,
	acct: string
) => (
	mastodonGet<MastodonApiV1Account>(publicEnv, '/accounts/lookup', { acct })
)

export const getAccountByActivityStreamsUri = async (
	publicEnv: SourcePublicEnv,
	activityStreamsUri: string
) => {
	const account = (await mastodonGet<MastodonApiV2Search>(
		publicEnv,
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
	localStatusId: string
) => (
	mastodonGet<MastodonApiV1Status>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}`)
)

export const getStatusByActivityStreamsUri = async (
	publicEnv: SourcePublicEnv,
	activityStreamsUri: string
) => {
	const status = (await mastodonGet<MastodonApiV2Search>(
		publicEnv,
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
	localStatusId: string
) => (
	mastodonGet<MastodonApiV1Context>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}/context`)
)

export const listAccountStatusesByLocalAccountId = async (
	publicEnv: SourcePublicEnv,
	localAccountId: string,
	limit: number
) => (
	mastodonGet<MastodonApiV1Status[]>(
		publicEnv,
		`/accounts/${encodeURIComponent(localAccountId)}/statuses`,
		{ limit: String(Math.min(80, Math.max(1, limit))) }
	)
)

export const getInstance = async (
	publicEnv: SourcePublicEnv
) => (
	mastodonGet<MastodonApiV1Instance>(publicEnv, '/instance')
)

export const listPublicTimeline = async (
	publicEnv: SourcePublicEnv,
	limit: number
) => (
	mastodonGet<MastodonApiV1Status[]>(
		publicEnv,
		'/timelines/public',
		{ limit: String(Math.min(80, Math.max(1, limit))) }
	)
)

export const assertInstanceMatches = (instanceOrigin: string) => {
	if (new URL(instanceOrigin).origin !== new URL(mastodonInstanceByKey.mastodon_social.origin).origin)
		throw new Error('Mastodon_Rest: entity instance does not match configured Mastodon instance')
}
