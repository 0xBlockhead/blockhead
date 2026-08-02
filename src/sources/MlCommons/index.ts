// Generated from APP.ts.

import bindings from '$/sources/MlCommons/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.MlCommons,
	label: 'MLCommons',
	sources: {
		[Source.CroissantDocument_Local]: {
			label: 'Croissant document',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
