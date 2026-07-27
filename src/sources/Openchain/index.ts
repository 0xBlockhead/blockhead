// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Openchain/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Openchain,
	label: 'Openchain',
	sources: [
		{
			source: Source.Openchain_Rest,
			label: 'Openchain REST',
		},
	],
	bindings: [bindings[Source.Openchain_Rest]],
} satisfies SourceProviderDefinition
