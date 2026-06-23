import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { codexNetworkPresetsBindings } from '$/sources/CodexNetworkPresets/bindings.ts'

export default {
	provider: SourceProvider.CodexNetworkPresets,
	label: 'Codex network presets',
	sources: [
		{
			provider: SourceProvider.CodexNetworkPresets,
			source: Source.CodexNetworkPresets_Github,
			label: 'Codex network presets GitHub',
		},
	],
	bindings: codexNetworkPresetsBindings,
} satisfies SourceProviderDefinition
