import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { hederaMirrorNodeBindings } from '$/sources/HederaMirrorNode/bindings.ts'

export default {
	provider: SourceProvider.HederaMirrorNode,
	label: 'Hedera mirror node',
	sources: [
		{
			provider: SourceProvider.HederaMirrorNode,
			source: Source.HederaMirrorNode_Rest,
			label: 'Hedera mirror node REST',
		},
	],
	bindings: hederaMirrorNodeBindings,
} satisfies SourceProviderDefinition
