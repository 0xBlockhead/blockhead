// Generated from APP.ts.

import bindings from '$/sources/CosmosSdk/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CosmosSdk,
	label: 'Cosmos SDK',
	sources: {
		[Source.CosmosSdk_Rest]: {
			label: 'Cosmos SDK REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
