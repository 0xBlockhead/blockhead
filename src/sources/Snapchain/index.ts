// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Snapchain/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Snapchain,
	label: 'Snapchain',
	sources: [
		{
			source: Source.Snapchain_Rest,
			label: 'Snapchain REST',
		},
	],
	bindings: [bindings[Source.Snapchain_Rest]],
} satisfies SourceProviderDefinition
