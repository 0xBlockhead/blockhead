// Generated from APP.ts.

import bindings from '$/sources/Amboss/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Amboss,
	label: 'Amboss',
	sources: [
		{
			source: Source.Amboss_Graphql,
			label: 'Amboss Space GraphQL',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
