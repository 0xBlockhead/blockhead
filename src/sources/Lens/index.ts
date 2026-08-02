// Generated from APP.ts.

import bindings from '$/sources/Lens/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Lens,
	label: 'Lens Protocol',
	sources: {
		[Source.Lens_Graphql]: {
			label: 'Lens Protocol GraphQL',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
