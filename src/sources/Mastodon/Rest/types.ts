/** Mastodon API v1 Account and Status (wire; maps to ActivityPub in resolvers). */

export type MastodonApiV1Account = {
	id?: string
	uri?: string
	username?: string
	acct?: string
	display_name?: string
	note?: string
	avatar?: string
	url?: string
	website?: string | null
	header?: string
	followers_count?: number
	following_count?: number
	statuses_count?: number
	bot?: boolean
	locked?: boolean
	created_at?: string
}

export type MastodonApiV1MediaAttachment = {
	id?: string
	type?: string
	url?: string
	preview_url?: string
	description?: string | null
}

export type MastodonApiV1Status = {
	id?: string
	content?: string
	created_at?: string
	edited_at?: string | null
	url?: string
	uri?: string
	account?: MastodonApiV1Account
	in_reply_to_id?: string | null
	favourites_count?: number
	reblogs_count?: number
	replies_count?: number
	visibility?: string
	sensitive?: boolean
	language?: string | null
	spoiler_text?: string
	media_attachments?: MastodonApiV1MediaAttachment[]
	reblog?: MastodonApiV1Status | null
}

export type MastodonApiV1Context = {
	ancestors?: MastodonApiV1Status[]
	descendants?: MastodonApiV1Status[]
}

export type MastodonApiV1Instance = {
	uri?: string
	title?: string
	short_description?: string
	description?: string
	email?: string
	version?: string
	urls?: {
		url?: string
		title?: string
	}[]
	thumbnail?: string | null
	languages?: string[]
	registrations?: boolean
	approval_required?: boolean
	invites_enabled?: boolean
	configuration?: {
		statuses?: {
			max_characters?: number
		}
		media_attachments?: {
			supported_mime_types?: string[]
			image_size_limit?: number
			image_matrix_limit?: number
			video_size_limit?: number
			video_frame_rate_limit?: number
			video_matrix_limit?: number
		}
		polls?: {
			max_options?: number
			max_characters_per_option?: number
			min_expiration?: number
			max_expiration?: number
		}
	}
	contact_account?: MastodonApiV1Account | null
}

export type MastodonApiV1DomainBlock = {
	domain?: string
	digest?: string
	severity?: string
	comment?: string
}

export type MastodonApiV2Search = {
	accounts?: MastodonApiV1Account[]
	statuses?: MastodonApiV1Status[]
}
