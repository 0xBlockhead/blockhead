// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CosmosSdk/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CosmosSdk,
	label: 'Cosmos SDK',
	sources: [
		{
			source: Source.CosmosSdk_Rest,
			label: 'Cosmos SDK REST',
		},
	],
	bindings: [bindings[Source.CosmosSdk_Rest]],
} satisfies SourceProviderDefinition
