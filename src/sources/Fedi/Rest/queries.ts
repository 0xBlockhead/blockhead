import { Source } from '$/sources/Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { fediGet } from '$/sources/Fedi/Rest/client.ts'
import { fediInstanceOrigin } from '$/sources/Fedi/Rest/constants.ts'
import type {
	MastodonApiV1Account,
	MastodonApiV1Context,
	MastodonApiV1Instance,
	MastodonApiV1Status,
} from '$/sources/Mastodon/Rest/types.ts'

export const getAccount = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localAccountId: string,
) => (
	localAccountId.includes('@') ?
		fediGet<MastodonApiV1Account>(publicEnv, '/accounts/lookup', { acct: localAccountId })
	:
		fediGet<MastodonApiV1Account>(publicEnv, `/accounts/${encodeURIComponent(localAccountId)}`)
)

export const getStatus = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localStatusId: string,
) => (
	fediGet<MastodonApiV1Status>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}`)
)

export const getStatusContext = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localStatusId: string,
) => (
	fediGet<MastodonApiV1Context>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}/context`)
)

export const listAccountStatuses = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localAccountId: string,
	limit: number,
) => {
	if (localAccountId.includes('@')) {
		const a = await fediGet<MastodonApiV1Account>(publicEnv, '/accounts/lookup', { acct: localAccountId })
		if (a.id == null) return []
		return fediGet<MastodonApiV1Status[]>(
			publicEnv,
			`/accounts/${encodeURIComponent(String(a.id))}/statuses`,
			{ limit: String(Math.min(80, Math.max(1, limit))) },
		)
	}
	return fediGet<MastodonApiV1Status[]>(
		publicEnv,
		`/accounts/${encodeURIComponent(localAccountId)}/statuses`,
		{ limit: String(Math.min(80, Math.max(1, limit))) },
	)
}

export const getInstance = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
) => (
	fediGet<MastodonApiV1Instance>(publicEnv, '/instance')
)

export const listPublicTimeline = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	limit: number,
) => (
	fediGet<MastodonApiV1Status[]>(
		publicEnv,
		'/timelines/public',
		{ limit: String(Math.min(80, Math.max(1, limit))) },
	)
)

export const assertInstanceMatches = (instanceOrigin: string) => {
	if (new URL(instanceOrigin).origin !== new URL(fediInstanceOrigin).origin) {
		throw new Error('Fedi_Rest: entity instance does not match configured Fedi instance')
	}
}
