import type { SourceOrigin } from '$/sources/SourceProvider.ts'


export const bskySocialOrigin = 'https://bsky.social' as const

export const bskySocialXrpcBase = `${bskySocialOrigin}/xrpc` as const

export const atprotoBskySocialOrigins: readonly SourceOrigin[] = [
	{
		origin: bskySocialOrigin,
		corsEnabled: true,
	},
]
