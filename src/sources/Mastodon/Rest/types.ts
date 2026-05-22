/** Mastodon API v1 Account and Status (wire; maps to ActivityPub in resolvers). */

export type MastodonApiV1AccountWire = {
	id?: string
	username?: string
	acct?: string
	display_name?: string
	note?: string
	avatar?: string
	url?: string
	header?: string
	followers_count?: number
	following_count?: number
	statuses_count?: number
	bot?: boolean
	locked?: boolean
	created_at?: string
}

export type MastodonApiV1StatusWire = {
	id?: string
	content?: string
	created_at?: string
	account?: MastodonApiV1AccountWire
	in_reply_to_id?: string | null
	favourites_count?: number
	reblogs_count?: number
	replies_count?: number
	visibility?: string
	sensitive?: boolean
	language?: string | null
	spoiler_text?: string
}

export type MastodonApiV1ContextWire = {
	ancestors?: MastodonApiV1StatusWire[]
	descendants?: MastodonApiV1StatusWire[]
}
