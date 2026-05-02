/** Mastodon API v1 Account and Status (wire; maps to ActivityPub in resolvers). */

export type MastodonApiV1AccountWire = {
	id?: string
	username?: string
	acct?: string
	display_name?: string
	note?: string
	avatar?: string
}

export type MastodonApiV1StatusWire = {
	id?: string
	content?: string
	created_at?: string
	account?: MastodonApiV1AccountWire
	in_reply_to_id?: string | null
}

export type MastodonApiV1ContextWire = {
	ancestors?: MastodonApiV1StatusWire[]
	descendants?: MastodonApiV1StatusWire[]
}
