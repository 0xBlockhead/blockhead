// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BnbBeaconArchive/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.BnbBeaconArchive,
	label: 'BNB Beacon archive',
	sources: [
		{
			source: Source.BnbBeaconArchive_Rest,
			label: 'BNB Beacon archive REST',
		},
	],
	bindings: [bindings[Source.BnbBeaconArchive_Rest]],
} satisfies SourceProviderDefinition
