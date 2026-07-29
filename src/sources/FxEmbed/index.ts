// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/FxEmbed/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.FxEmbed,
	label: 'FxEmbed',
	sources: [
		{
			source: Source.X_FxEmbed_Rest,
			label: 'FxEmbed REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
