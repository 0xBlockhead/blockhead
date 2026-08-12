/** Mastodon API v1/v2 Account, Status, Instance (wire; maps to ActivityPub in resolvers). */

import {
	type as arktype,
	type Type,
} from 'arktype'


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
	remote_url?: string | null
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
		streaming_api?: string
	}
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

export type MastodonApiV2Instance = {
	domain?: string
	title?: string
	version?: string
	description?: string
	usage?: {
		users?: {
			active_month?: number
		}
	}
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


const nonNegativeInteger = arktype('number.integer >= 0')
const nullableString = arktype('string').or(arktype('null'))

export const mastodonApiV1AccountWire = arktype({
	'id?': 'string',
	'uri?': 'string',
	'username?': 'string',
	'acct?': 'string',
	'display_name?': 'string',
	'note?': 'string',
	'avatar?': 'string',
	'url?': 'string',
	'website?': nullableString,
	'header?': 'string',
	'followers_count?': nonNegativeInteger,
	'following_count?': nonNegativeInteger,
	'statuses_count?': nonNegativeInteger,
	'bot?': 'boolean',
	'locked?': 'boolean',
	'created_at?': 'string',
}) satisfies Type<MastodonApiV1Account>

export const mastodonApiV1MediaAttachmentWire = arktype({
	'id?': 'string',
	'type?': 'string',
	'url?': 'string',
	'remote_url?': nullableString,
	'preview_url?': 'string',
	'description?': nullableString,
}) satisfies Type<MastodonApiV1MediaAttachment>

const mastodonApiV1StatusBaseWire = arktype({
	'id?': 'string',
	'content?': 'string',
	'created_at?': 'string',
	'edited_at?': nullableString,
	'url?': 'string',
	'uri?': 'string',
	'account?': mastodonApiV1AccountWire,
	'in_reply_to_id?': nullableString,
	'favourites_count?': nonNegativeInteger,
	'reblogs_count?': nonNegativeInteger,
	'replies_count?': nonNegativeInteger,
	'visibility?': 'string',
	'sensitive?': 'boolean',
	'language?': nullableString,
	'spoiler_text?': 'string',
	'media_attachments?': mastodonApiV1MediaAttachmentWire.array(),
})

export const mastodonApiV1StatusWire = mastodonApiV1StatusBaseWire.and(arktype({
	'reblog?': mastodonApiV1StatusBaseWire.or(arktype('null')),
})) satisfies Type<MastodonApiV1Status>

export const mastodonApiV1StatusListWire = mastodonApiV1StatusWire.array() satisfies Type<MastodonApiV1Status[]>

export const mastodonApiV1ContextWire = arktype({
	'ancestors?': mastodonApiV1StatusWire.array(),
	'descendants?': mastodonApiV1StatusWire.array(),
}) satisfies Type<MastodonApiV1Context>

export const mastodonApiV1InstanceWire = arktype({
	'uri?': 'string',
	'title?': 'string',
	'short_description?': 'string',
	'description?': 'string',
	'email?': 'string',
	'version?': 'string',
	'urls?': {
		'streaming_api?': 'string',
	},
	'thumbnail?': nullableString,
	'languages?': 'string[]',
	'registrations?': 'boolean',
	'approval_required?': 'boolean',
	'invites_enabled?': 'boolean',
	'configuration?': {
		'statuses?': {
			'max_characters?': nonNegativeInteger,
		},
		'media_attachments?': {
			'supported_mime_types?': 'string[]',
			'image_size_limit?': nonNegativeInteger,
			'image_matrix_limit?': nonNegativeInteger,
			'video_size_limit?': nonNegativeInteger,
			'video_frame_rate_limit?': nonNegativeInteger,
			'video_matrix_limit?': nonNegativeInteger,
		},
		'polls?': {
			'max_options?': nonNegativeInteger,
			'max_characters_per_option?': nonNegativeInteger,
			'min_expiration?': nonNegativeInteger,
			'max_expiration?': nonNegativeInteger,
		},
	},
	'contact_account?': mastodonApiV1AccountWire.or(arktype('null')),
}) satisfies Type<MastodonApiV1Instance>

export const mastodonApiV2InstanceWire = arktype({
	'domain?': 'string',
	'title?': 'string',
	'version?': 'string',
	'description?': 'string',
	'usage?': {
		'users?': {
			'active_month?': nonNegativeInteger,
		},
	},
}) satisfies Type<MastodonApiV2Instance>

export const mastodonApiV1DomainBlockWire = arktype({
	'domain?': 'string',
	'digest?': 'string',
	'severity?': 'string',
	'comment?': 'string',
}) satisfies Type<MastodonApiV1DomainBlock>

export const mastodonApiV1DomainBlockListWire = mastodonApiV1DomainBlockWire.array() satisfies Type<MastodonApiV1DomainBlock[]>

export const mastodonApiV1PeerDomainListWire = arktype('string[]') satisfies Type<string[]>

export const mastodonApiV2SearchWire = arktype({
	'accounts?': mastodonApiV1AccountWire.array(),
	'statuses?': mastodonApiV1StatusWire.array(),
}) satisfies Type<MastodonApiV2Search>
