// Generated from APP.ts.

import bindings from '$/sources/Lens/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Lens,
	label: 'Lens Protocol',
	sources: [
		{
			source: Source.Lens_Graphql,
			label: 'Lens Protocol GraphQL',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
