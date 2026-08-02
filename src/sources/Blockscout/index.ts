// Generated from APP.ts.

import bindings from '$/sources/Blockscout/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Blockscout,
	label: 'Blockscout',
	sources: [
		{
			source: Source.Blockscout_Rest,
			label: 'Blockscout REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
