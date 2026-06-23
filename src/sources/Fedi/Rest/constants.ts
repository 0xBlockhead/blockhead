import { fediInstanceBySlug } from '$/constants/Fedi.ts'

export const fediRestOrigins = [
	{
		origin: fediInstanceBySlug.fosstodon.origin,
		corsEnabled: false,
	},
] as const
