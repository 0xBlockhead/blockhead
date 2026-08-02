// Generated from APP.ts.

import bindings from '$/sources/Farcaster/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Farcaster,
	label: 'Farcaster',
	sources: [
		{
			source: Source.Farcaster_Rest,
			label: 'Farcaster REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
