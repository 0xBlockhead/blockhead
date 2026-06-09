import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { xApiOrigins } from '$/sources/X/Rest/constants.ts'
import XApiV2Source from '$/sources/X/Rest/index.ts'

export default {
	provider: SourceProvider.X,
	label: 'X',
	origins: xApiOrigins,
	env: arktype({
		PUBLIC_X_API_BEARER: 'string > 0',
	}),
	sources: [
		XApiV2Source,
	],
} satisfies SourceProviderDefinition
