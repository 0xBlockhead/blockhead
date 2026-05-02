import {
	atprotoPublicAppViewOrigin,
	atprotoPublicAppViewXrpcBase,
} from '$/constants/AtprotoAppView.ts'

import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

export const publicAppViewOrigin = atprotoPublicAppViewOrigin

export const publicAppViewXrpcBase = atprotoPublicAppViewXrpcBase

export const atprotoBskyOrigins: readonly SourceOrigin[] = [
	{
		origin: publicAppViewOrigin,
		corsEnabled: true,
	},
]
