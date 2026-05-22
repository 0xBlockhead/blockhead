import { optionalPublicEnvString } from '$/lib/sources.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourceOrigin } from '$/sources/$SourceProvider.ts'

export const pipedApiDefaultOrigin = 'https://pipedapi.kavin.rocks' as const

export const pipedApiOrigins: readonly SourceOrigin[] = [
	{
		origin: pipedApiDefaultOrigin,
		corsEnabled: false,
	},
]

export const pipedApiBaseUrl = (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
) => (
	optionalPublicEnvString(publicEnv, 'PUBLIC_PIPED_API_BASE_URL')
	?? pipedApiDefaultOrigin
)

export const pipedApiOriginsForPublicEnv = (
	publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
): readonly SourceOrigin[] => {
	const origin = new URL(pipedApiBaseUrl(publicEnv)).origin
	return (
		origin === pipedApiDefaultOrigin ?
			pipedApiOrigins
		:	[{
				origin,
				corsEnabled: false,
			}]
	)
}
