// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/BetterCallDev/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.BetterCallDev,
	label: 'Better Call Dev',
	sources: [
		{
			source: Source.BetterCallDev_Rest,
			label: 'Better Call Dev REST',
		},
	],
	bindings: [bindings[Source.BetterCallDev_Rest]],
} satisfies SourceProviderDefinition
