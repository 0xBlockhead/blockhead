// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Lens/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Lens,
	label: 'Lens Protocol',
	sources: [
		{
			source: Source.Lens_Graphql,
			label: 'Lens Protocol GraphQL',
		},
	],
	bindings: [bindings[Source.Lens_Graphql]],
} satisfies SourceProviderDefinition
