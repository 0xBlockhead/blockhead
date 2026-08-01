// Generated from APP.ts.

import bindings from '$/sources/CometBft/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CometBft,
	label: 'CometBFT',
	sources: [
		{
			source: Source.CometBft_Rest,
			label: 'CometBFT REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
