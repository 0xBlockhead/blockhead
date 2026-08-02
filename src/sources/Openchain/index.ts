// Generated from APP.ts.

import bindings from '$/sources/Openchain/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Openchain,
	label: 'Openchain',
	sources: [
		{
			source: Source.Openchain_Rest,
			label: 'Openchain REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
