import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { kaspaNodeBindings } from '$/sources/KaspaNode/bindings.ts'

export default {
	provider: SourceProvider.KaspaNode,
	label: 'Kaspa node',
	sources: [
		{
			provider: SourceProvider.KaspaNode,
			source: Source.KaspaNode_Grpc,
			label: 'Kaspa node gRPC',
		},
		{
			provider: SourceProvider.KaspaNode,
			source: Source.KaspaNode_Rest,
			label: 'Kaspa node REST',
		},
		{
			provider: SourceProvider.KaspaNode,
			source: Source.KaspaNode_Wrpc,
			label: 'Kaspa node wRPC',
		},
	],
	bindings: kaspaNodeBindings,
} satisfies SourceProviderDefinition
