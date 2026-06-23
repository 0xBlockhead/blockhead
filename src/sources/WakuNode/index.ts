import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { wakuNodeBindings } from '$/sources/WakuNode/bindings.ts'

export default {
	provider: SourceProvider.WakuNode,
	label: 'Waku node',
	sources: [
		{
			provider: SourceProvider.WakuNode,
			source: Source.WakuNode_Rest,
			label: 'Waku node REST',
		},
	],
	bindings: wakuNodeBindings,
} satisfies SourceProviderDefinition
