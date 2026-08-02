// Generated from APP.ts.

import bindings from '$/sources/Caips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Caips,
	label: 'CAIPs',
	sources: {
		[Source.Caips_Github]: {
			label: 'CAIPs GitHub',
		},
		[Source.CaipNamespaces_Github]: {
			label: 'CAIP namespaces GitHub',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
