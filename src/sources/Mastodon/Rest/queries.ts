import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { mastodonGet } from '$/sources/Mastodon/Rest/client.ts'
import { mastodonInstanceOrigin } from '$/sources/Mastodon/Rest/constants.ts'
import type {
	MastodonApiV1Account,
	MastodonApiV1Context,
	MastodonApiV1Instance,
	MastodonApiV1Status,
} from '$/sources/Mastodon/Rest/types.ts'

export const getAccount = async (
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
	localAccountId: string,
) => (
	localAccountId.includes('@') ?
		mastodonGet<MastodonApiV1Account>(publicEnv, '/accounts/lookup', { acct: localAccountId })
	:
		mastodonGet<MastodonApiV1Account>(publicEnv, `/accounts/${encodeURIComponent(localAccountId)}`)
)

export const getStatus = async (
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
	localStatusId: string,
) => (
	mastodonGet<MastodonApiV1Status>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}`)
)

export const getStatusContext = async (
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
	localStatusId: string,
) => (
	mastodonGet<MastodonApiV1Context>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}/context`)
)

export const listAccountStatuses = async (
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
	localAccountId: string,
	limit: number,
) => {
	if (localAccountId.includes('@')) {
		const a = await mastodonGet<MastodonApiV1Account>(publicEnv, '/accounts/lookup', { acct: localAccountId })
		if (a?.id == null) return []
		return mastodonGet<MastodonApiV1Status[]>(
			publicEnv,
			`/accounts/${encodeURIComponent(String(a.id))}/statuses`,
			{ limit: String(Math.min(80, Math.max(1, limit))) },
		)
	}
	return mastodonGet<MastodonApiV1Status[]>(
		publicEnv,
		`/accounts/${encodeURIComponent(localAccountId)}/statuses`,
		{ limit: String(Math.min(80, Math.max(1, limit))) },
	)
}

export const getInstance = async (
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
) => (
	mastodonGet<MastodonApiV1Instance>(publicEnv, '/instance')
)

export const listPublicTimeline = async (
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
	limit: number,
) => (
	mastodonGet<MastodonApiV1Status[]>(
		publicEnv,
		'/timelines/public',
		{ limit: String(Math.min(80, Math.max(1, limit))) },
	)
)

export const assertInstanceMatches = (instanceOrigin: string) => {
	if (new URL(instanceOrigin).origin !== new URL(mastodonInstanceOrigin).origin) {
		throw new Error('Mastodon_Rest: entity instance does not match configured Mastodon instance')
	}
}
