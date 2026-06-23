import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { radicleNodeBindings } from '$/sources/RadicleNode/bindings.ts'

export default {
	provider: SourceProvider.RadicleNode,
	label: 'Radicle node',
	sources: [
		{
			provider: SourceProvider.RadicleNode,
			source: Source.RadicleNode_Control,
			label: 'Radicle node control API',
		},
	],
	bindings: radicleNodeBindings,
} satisfies SourceProviderDefinition
