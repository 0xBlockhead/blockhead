import { rawOrigin, restOrigin } from '$/sources/Github/Rest/constants.ts'


export const githubHttpAllowedOrigins = (
	[
		restOrigin,
		rawOrigin,
	] as const
)
