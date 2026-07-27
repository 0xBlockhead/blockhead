// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Blockchair/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Blockchair,
	label: 'Blockchair',
	sources: [
		{
			source: Source.Blockchair_Rest,
			label: 'Blockchair REST',
		},
	],
	bindings: [bindings[Source.Blockchair_Rest]],
} satisfies SourceProviderDefinition
