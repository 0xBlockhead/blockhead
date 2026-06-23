import { mastodonInstanceByKey } from '$/constants/Mastodon.ts'

export const mastodonRestOrigins = [
	{
		origin: mastodonInstanceByKey.mastodon_social.origin,
		corsEnabled: false,
	},
] as const
