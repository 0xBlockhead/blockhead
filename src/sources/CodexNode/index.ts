import bindings from '$/sources/CodexNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CodexNode,
	label: 'Codex node',
	sources: {
		[Source.CodexNode_Rest]: {
			label: 'Codex node REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
