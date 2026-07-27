// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Voyager/bindings.ts'

export default {
	provider: SourceProvider.Voyager,
	label: 'Voyager',
	sources: [
		{
			source: Source.Voyager_Rest,
			label: 'Voyager REST',
		},
	],
	bindings: [bindings[Source.Voyager_Rest]],
} satisfies SourceProviderDefinition
