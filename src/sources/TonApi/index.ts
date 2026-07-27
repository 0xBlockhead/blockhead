// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/TonApi/bindings.ts'

export default {
	provider: SourceProvider.TonApi,
	label: 'TonAPI',
	sources: [
		{
			source: Source.TonApi_Rest,
			label: 'TonAPI REST',
		},
	],
	bindings: [bindings[Source.TonApi_Rest]],
} satisfies SourceProviderDefinition
