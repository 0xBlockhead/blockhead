import { mastodonInstances } from '$/constants/Mastodon.ts'

export const mastodonRestOrigins = mastodonInstances.map((instance) => ({
	origin: instance.origin,
		corsEnabled: false,
}))
