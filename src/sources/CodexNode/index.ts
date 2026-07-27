// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CodexNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CodexNode,
	label: 'Codex node',
	sources: [
		{
			source: Source.CodexNode_Rest,
			label: 'Codex node REST',
		},
	],
	bindings: [bindings[Source.CodexNode_Rest]],
} satisfies SourceProviderDefinition
