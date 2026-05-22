import type { SourceOrigin } from '$/sources/$SourceProvider.ts'
import { rawOrigin, restOrigin } from '$/sources/Github/Rest/constants.ts'


export const githubHttpAllowedOrigins = (
	[
		{
			origin: restOrigin,
			corsEnabled: true,
		},
		{
			origin: rawOrigin,
			corsEnabled: true,
		},
	] as const
) satisfies readonly SourceOrigin[]
