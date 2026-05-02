import { mastodonGet } from '$/sources/Mastodon/Rest/client.ts'
import { mastodonInstanceOrigin } from '$/sources/Mastodon/Rest/constants.ts'
import type {
	MastodonApiV1AccountWire,
	MastodonApiV1ContextWire,
	MastodonApiV1StatusWire,
} from '$/sources/Mastodon/Rest/types.ts'

export const mastodonGetAccount = async (localAccountId: string) => (
	localAccountId.includes('@') ?
		mastodonGet<MastodonApiV1AccountWire>('/accounts/lookup', { acct: localAccountId })
	:	mastodonGet<MastodonApiV1AccountWire>(`/accounts/${encodeURIComponent(localAccountId)}`)
)

export const mastodonGetStatus = async (localStatusId: string) => (
	mastodonGet<MastodonApiV1StatusWire>(`/statuses/${encodeURIComponent(localStatusId)}`)
)

export const mastodonGetStatusContext = async (localStatusId: string) => (
	mastodonGet<MastodonApiV1ContextWire>(`/statuses/${encodeURIComponent(localStatusId)}/context`)
)

export const mastodonListAccountStatuses = async (localAccountId: string, limit: number) => {
	if (localAccountId.includes('@')) {
		const a = await mastodonGet<MastodonApiV1AccountWire>('/accounts/lookup', { acct: localAccountId })
		if (a?.id == null) return []
		return mastodonGet<MastodonApiV1StatusWire[]>(
			`/accounts/${encodeURIComponent(String(a.id))}/statuses`,
			{ limit: String(Math.min(80, Math.max(1, limit))) },
		)
	}
	return mastodonGet<MastodonApiV1StatusWire[]>(
		`/accounts/${encodeURIComponent(localAccountId)}/statuses`,
		{ limit: String(Math.min(80, Math.max(1, limit))) },
	)
}

export const mastodonListPublicTimeline = async (limit: number) => (
	mastodonGet<MastodonApiV1StatusWire[]>(
		'/timelines/public',
		{ limit: String(Math.min(80, Math.max(1, limit))) },
	)
)

export const assertInstanceMatches = (instanceOrigin: string) => {
	if (new URL(instanceOrigin).origin !== new URL(mastodonInstanceOrigin).origin) {
		throw new Error('Mastodon_Rest: entity instance does not match configured Mastodon instance')
	}
}
