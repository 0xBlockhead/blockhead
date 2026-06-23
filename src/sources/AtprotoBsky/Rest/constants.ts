import { atprotoAppViewBySlug } from '$/constants/AtprotoAppView.ts'

export const atprotoBskyRestOrigins = [
	{
		origin: atprotoAppViewBySlug.bsky_public.origin,
		corsEnabled: false,
	},
] as const
