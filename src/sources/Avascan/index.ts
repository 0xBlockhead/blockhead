// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Avascan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Avascan,
	label: 'Avascan',
	sources: [
		{
			source: Source.Avascan_Rest,
			label: 'Avascan REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
