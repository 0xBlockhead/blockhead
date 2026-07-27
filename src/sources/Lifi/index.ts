// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Lifi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

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
	bindings: [
		bindings[Source.LifiStatus_Rest],
		bindings[Source.Lifi_Rest],
	],
} satisfies SourceProviderDefinition
