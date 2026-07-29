// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Lifi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Lifi,
	label: 'LI.FI',
	sources: [
		{
			source: Source.LifiStatus_Rest,
			label: 'LI.FI status REST',
		},
		{
			source: Source.Lifi_Rest,
			label: 'LI.FI REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
