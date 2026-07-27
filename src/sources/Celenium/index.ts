// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Celenium/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Celenium,
	label: 'Celenium',
	sources: [
		{
			source: Source.Celenium_Rest,
			label: 'Celenium REST',
		},
	],
	bindings: [bindings[Source.Celenium_Rest]],
} satisfies SourceProviderDefinition
