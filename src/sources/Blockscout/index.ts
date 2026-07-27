// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Blockscout/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Blockscout,
	label: 'Blockscout',
	sources: [
		{
			source: Source.Blockscout_Rest,
			label: 'Blockscout REST',
		},
	],
	bindings: bindings[Source.Blockscout_Rest],
} satisfies SourceProviderDefinition
