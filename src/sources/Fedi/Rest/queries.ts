import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { fediGet } from '$/sources/Fedi/Rest/client.ts'
import { fediInstanceOrigin } from '$/sources/Fedi/Rest/constants.ts'
import type {
	MastodonApiV1AccountWire,
	MastodonApiV1ContextWire,
	MastodonApiV1StatusWire,
} from '$/sources/Fedi/Rest/types.ts'

export const fediGetAccount = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localAccountId: string,
) => (
	localAccountId.includes('@') ?
		fediGet<MastodonApiV1AccountWire>(publicEnv, '/accounts/lookup', { acct: localAccountId })
	:	fediGet<MastodonApiV1AccountWire>(publicEnv, `/accounts/${encodeURIComponent(localAccountId)}`)
)

export const fediGetStatus = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localStatusId: string,
) => (
	fediGet<MastodonApiV1StatusWire>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}`)
)

export const fediGetStatusContext = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localStatusId: string,
) => (
	fediGet<MastodonApiV1ContextWire>(publicEnv, `/statuses/${encodeURIComponent(localStatusId)}/context`)
)

export const fediListAccountStatuses = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	localAccountId: string,
	limit: number,
) => {
	if (localAccountId.includes('@')) {
		const a = await fediGet<MastodonApiV1AccountWire>(publicEnv, '/accounts/lookup', { acct: localAccountId })
		if (a?.id == null) return []
		return fediGet<MastodonApiV1StatusWire[]>(
			publicEnv,
			`/accounts/${encodeURIComponent(String(a.id))}/statuses`,
			{ limit: String(Math.min(80, Math.max(1, limit))) },
		)
	}
	return fediGet<MastodonApiV1StatusWire[]>(
		publicEnv,
		`/accounts/${encodeURIComponent(localAccountId)}/statuses`,
		{ limit: String(Math.min(80, Math.max(1, limit))) },
	)
}

export const fediListPublicTimeline = async (
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	limit: number,
) => (
	fediGet<MastodonApiV1StatusWire[]>(
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
