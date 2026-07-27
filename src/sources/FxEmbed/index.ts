// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/FxEmbed/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.FxEmbed,
	label: 'FxEmbed',
	sources: [
		{
			source: Source.X_FxEmbed_Rest,
			label: 'FxEmbed REST',
		},
	],
	bindings: [bindings[Source.X_FxEmbed_Rest]],
} satisfies SourceProviderDefinition
