// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Avascan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Avascan,
	label: 'Avascan',
	sources: [
		{
			source: Source.Avascan_Rest,
			label: 'Avascan REST',
		},
	],
	bindings: [bindings[Source.Avascan_Rest]],
} satisfies SourceProviderDefinition
