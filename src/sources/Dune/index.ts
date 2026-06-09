import { type as arktype } from 'arktype'

import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { origin } from '$/sources/Dune/Rest/constants.ts'
import DuneRestSource from '$/sources/Dune/Rest/index.ts'

export default {
	provider: SourceProvider.Dune,
	label: 'Dune',
	env: arktype({
		PUBLIC_DUNE_API_KEY: 'string > 0',
	}),
	origins: [
		{
			origin,
			corsEnabled: false,
		},
	],
	sources: [
		DuneRestSource,
	],
} satisfies SourceProviderDefinition
