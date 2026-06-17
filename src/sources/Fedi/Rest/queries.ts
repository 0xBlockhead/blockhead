import { fediInstanceBySlug } from '$/constants/Fedi.ts'
import { Source } from '$/sources/Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { fediGet } from '$/sources/Fedi/Rest/client.ts'
import type {
	MastodonApiV1Account,
	MastodonApiV1Context,
	MastodonApiV1Instance,
	MastodonApiV1Status,
	MastodonApiV2Search,
} from '$/sources/Mastodon/Rest/types.ts'

export const getAccountByLocalAccountId = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localAccountId: string
) => (
	fediGet<MastodonApiV1Account>(publicEnv, `/accounts/${encodeURIComponent(localAccountId)}`)
)

export const getAccountByAcct = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	acct: string
) => (
	fediGet<MastodonApiV1Account>(publicEnv, '/accounts/lookup', { acct })
)

export const getAccountByActivityStreamsUri = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	activityStreamsUri: string
) => {
	const account = (await fediGet<MastodonApiV2Search>(
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
		throw new Error('Fedi_Rest: ActivityPub actor URI not found')
	return account
}

export const getStatus = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localStatusId: string
) => (
	fediGet<MastodonApiV1Status>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}`)
)

export const getStatusByActivityStreamsUri = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	activityStreamsUri: string
) => {
	const status = (await fediGet<MastodonApiV2Search>(
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
		throw new Error('Fedi_Rest: ActivityPub note URI not found')
	return status
}

export const getStatusContext = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localStatusId: string
) => (
	fediGet<MastodonApiV1Context>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}/context`)
)

export const listAccountStatusesByLocalAccountId = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localAccountId: string,
	limit: number
) => (
	fediGet<MastodonApiV1Status[]>(
		publicEnv,
		`/accounts/${encodeURIComponent(localAccountId)}/statuses`,
		{ limit: String(Math.min(80, Math.max(1, limit))) }
	)
)

export const getInstance = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>
) => (
	fediGet<MastodonApiV1Instance>(publicEnv, '/instance')
)

export const listPublicTimeline = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	limit: number
) => (
	fediGet<MastodonApiV1Status[]>(
		publicEnv,
		'/timelines/public',
		{ limit: String(Math.min(80, Math.max(1, limit))) }
	)
)

export const assertInstanceMatches = (instanceOrigin: string) => {
	if (new URL(instanceOrigin).origin !== new URL(fediInstanceBySlug.fosstodon.origin).origin)
		throw new Error('Fedi_Rest: entity instance does not match configured Fedi instance')
}
