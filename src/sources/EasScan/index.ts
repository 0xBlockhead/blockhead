// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EasScan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.EasScan,
	label: 'EAS Scan',
	sources: [
		{
			source: Source.EasScan_Graphql,
			label: 'EAS Scan GraphQL',
		},
	],
	bindings: [bindings[Source.EasScan_Graphql]],
} satisfies SourceProviderDefinition
