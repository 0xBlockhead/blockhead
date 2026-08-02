// Generated from APP.ts.

import bindings from '$/sources/EasScan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.EasScan,
	label: 'EAS Scan',
	sources: [
		{
			source: Source.EasScan_Graphql,
			label: 'EAS Scan GraphQL',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
