// Generated from APP.ts.

import bindings from '$/sources/Beacon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Beacon,
	label: 'Beacon',
	sources: [
		{
			source: Source.Beacon_Rest,
			label: 'Beacon (consensus) REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
