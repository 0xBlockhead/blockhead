// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Farcaster/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Farcaster,
	label: 'Farcaster',
	sources: [
		{
			source: Source.Farcaster_Rest,
			label: 'Farcaster REST',
		},
	],
	bindings: [bindings[Source.Farcaster_Rest]],
} satisfies SourceProviderDefinition
