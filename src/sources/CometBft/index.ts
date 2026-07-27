// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CometBft/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CometBft,
	label: 'CometBFT',
	sources: [
		{
			source: Source.CometBft_Rest,
			label: 'CometBFT REST',
		},
	],
	bindings: [bindings[Source.CometBft_Rest]],
} satisfies SourceProviderDefinition
