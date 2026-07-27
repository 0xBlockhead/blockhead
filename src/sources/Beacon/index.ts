// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Beacon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Beacon,
	label: 'Beacon',
	sources: [
		{
			source: Source.Beacon_Rest,
			label: 'Beacon (consensus) REST',
		},
	],
	bindings: bindings[Source.Beacon_Rest],
} satisfies SourceProviderDefinition
