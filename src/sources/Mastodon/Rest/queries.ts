import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { mastodonGet } from '$/sources/Mastodon/Rest/client.ts'
import { mastodonInstanceOrigin } from '$/sources/Mastodon/Rest/constants.ts'
import type {
	MastodonApiV1AccountWire,
	MastodonApiV1ContextWire,
	MastodonApiV1StatusWire,
} from '$/sources/Mastodon/Rest/types.ts'

export const mastodonGetAccount = async (
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
	localAccountId: string,
) => (
	localAccountId.includes('@') ?
		mastodonGet<MastodonApiV1AccountWire>(publicEnv, '/accounts/lookup', { acct: localAccountId })
	:	mastodonGet<MastodonApiV1AccountWire>(publicEnv, `/accounts/${encodeURIComponent(localAccountId)}`)
)

export const mastodonGetStatus = async (
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
	localStatusId: string,
) => (
	mastodonGet<MastodonApiV1StatusWire>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}`)
)

export const mastodonGetStatusContext = async (
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
	localStatusId: string,
) => (
	mastodonGet<MastodonApiV1ContextWire>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}/context`)
)

export const mastodonListAccountStatuses = async (
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
	localAccountId: string,
	limit: number,
) => {
	if (localAccountId.includes('@')) {
		const a = await mastodonGet<MastodonApiV1AccountWire>(publicEnv, '/accounts/lookup', { acct: localAccountId })
		if (a?.id == null) return []
		return mastodonGet<MastodonApiV1StatusWire[]>(
			publicEnv,
			`/accounts/${encodeURIComponent(String(a.id))}/statuses`,
			{ limit: String(Math.min(80, Math.max(1, limit))) },
		)
	}
	return mastodonGet<MastodonApiV1StatusWire[]>(
		publicEnv,
		`/accounts/${encodeURIComponent(localAccountId)}/statuses`,
		{ limit: String(Math.min(80, Math.max(1, limit))) },
	)
}

export const mastodonListPublicTimeline = async (
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
	limit: number,
) => (
	mastodonGet<MastodonApiV1StatusWire[]>(
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
