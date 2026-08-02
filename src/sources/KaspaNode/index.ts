// Generated from APP.ts.

import bindings from '$/sources/KaspaNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.KaspaNode,
	label: 'Kaspa node',
	sources: {
		[Source.KaspaNode_Grpc]: {
			label: 'Kaspa node gRPC',
		},
		[Source.KaspaNode_Rest]: {
			label: 'Kaspa node REST',
		},
		[Source.KaspaNode_Wrpc]: {
			label: 'Kaspa node wRPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
