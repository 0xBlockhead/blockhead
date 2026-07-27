// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/KaspaNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.KaspaNode,
	label: 'Kaspa node',
	sources: [
		{
			source: Source.KaspaNode_Grpc,
			label: 'Kaspa node gRPC',
		},
		{
			source: Source.KaspaNode_Rest,
			label: 'Kaspa node REST',
		},
		{
			source: Source.KaspaNode_Wrpc,
			label: 'Kaspa node wRPC',
		},
	],
	bindings: [
		bindings[Source.KaspaNode_Grpc],
		bindings[Source.KaspaNode_Rest],
		bindings[Source.KaspaNode_Wrpc],
	],
} satisfies SourceProviderDefinition
