import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { codexNodeBindings } from '$/sources/CodexNode/bindings.ts'

export default {
	provider: SourceProvider.CodexNode,
	label: 'Codex node',
	sources: [
		{
			provider: SourceProvider.CodexNode,
			source: Source.CodexNode_Rest,
			label: 'Codex node REST',
		},
	],
	bindings: codexNodeBindings,
} satisfies SourceProviderDefinition
