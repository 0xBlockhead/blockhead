// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BnbBeaconArchive/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.BnbBeaconArchive,
	label: 'BNB Beacon archive',
	sources: [
		{
			source: Source.BnbBeaconArchive_Rest,
			label: 'BNB Beacon archive REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
