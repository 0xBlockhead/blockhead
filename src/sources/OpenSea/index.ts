// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/OpenSea/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.OpenSea,
	label: 'OpenSea',
	sources: [
		{
			source: Source.OpenSea_Rest,
			label: 'OpenSea REST',
		},
	],
	bindings: [bindings[Source.OpenSea_Rest]],
} satisfies SourceProviderDefinition
