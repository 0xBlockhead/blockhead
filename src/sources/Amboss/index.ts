// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Amboss/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Amboss,
	label: 'Amboss',
	sources: [
		{
			source: Source.Amboss_Graphql,
			label: 'Amboss Space GraphQL',
		},
	],
	bindings: [bindings[Source.Amboss_Graphql]],
} satisfies SourceProviderDefinition
