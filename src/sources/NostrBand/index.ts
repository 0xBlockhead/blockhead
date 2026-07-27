// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/NostrBand/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.NostrBand,
	label: 'NostrBand',
	sources: [
		{
			source: Source.NostrBand_Rest,
			label: 'NostrBand REST',
		},
	],
	bindings: [bindings[Source.NostrBand_Rest]],
} satisfies SourceProviderDefinition
