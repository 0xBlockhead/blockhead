// Generated from APP.ts.

import bindings from '$/sources/Blockfrost/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Blockfrost,
	label: 'Blockfrost',
	sources: [
		{
			source: Source.Blockfrost_Rest,
			label: 'Blockfrost REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
