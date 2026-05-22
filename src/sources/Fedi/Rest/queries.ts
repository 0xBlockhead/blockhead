import { fediGet } from '$/sources/Fedi/Rest/client.ts'
import { fediInstanceOrigin } from '$/sources/Fedi/Rest/constants.ts'
import type {
	MastodonApiV1AccountWire,
	MastodonApiV1ContextWire,
	MastodonApiV1StatusWire,
} from '$/sources/Fedi/Rest/types.ts'

export const fediGetAccount = async (localAccountId: string) => (
	localAccountId.includes('@') ?
		fediGet<MastodonApiV1AccountWire>('/accounts/lookup', { acct: localAccountId })
	:	fediGet<MastodonApiV1AccountWire>(`/accounts/${encodeURIComponent(localAccountId)}`)
)

export const fediGetStatus = async (localStatusId: string) => (
	fediGet<MastodonApiV1StatusWire>(`/statuses/${encodeURIComponent(localStatusId)}`)
)

export const fediGetStatusContext = async (localStatusId: string) => (
	fediGet<MastodonApiV1ContextWire>(`/statuses/${encodeURIComponent(localStatusId)}/context`)
)

export const fediListAccountStatuses = async (localAccountId: string, limit: number) => {
	if (localAccountId.includes('@')) {
		const a = await fediGet<MastodonApiV1AccountWire>('/accounts/lookup', { acct: localAccountId })
		if (a?.id == null) return []
		return fediGet<MastodonApiV1StatusWire[]>(
			`/accounts/${encodeURIComponent(String(a.id))}/statuses`,
			{ limit: String(Math.min(80, Math.max(1, limit))) },
		)
	}
	return fediGet<MastodonApiV1StatusWire[]>(
		`/accounts/${encodeURIComponent(localAccountId)}/statuses`,
		{ limit: String(Math.min(80, Math.max(1, limit))) },
	)
}

export const fediListPublicTimeline = async (limit: number) => (
	fediGet<MastodonApiV1StatusWire[]>(
		'/timelines/public',
		{ limit: String(Math.min(80, Math.max(1, limit))) },
	)
)

export const assertInstanceMatches = (instanceOrigin: string) => {
	if (new URL(instanceOrigin).origin !== new URL(fediInstanceOrigin).origin) {
		throw new Error('Fedi_Rest: entity instance does not match configured Fedi instance')
	}
}
