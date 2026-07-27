// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Blockfrost/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Blockfrost,
	label: 'Blockfrost',
	sources: [
		{
			source: Source.Blockfrost_Rest,
			label: 'Blockfrost REST',
		},
	],
	bindings: [bindings[Source.Blockfrost_Rest]],
} satisfies SourceProviderDefinition
