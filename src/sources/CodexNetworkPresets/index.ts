// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CodexNetworkPresets/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CodexNetworkPresets,
	label: 'Codex network presets',
	sources: [
		{
			source: Source.CodexNetworkPresets_Github,
			label: 'Codex network presets GitHub',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
