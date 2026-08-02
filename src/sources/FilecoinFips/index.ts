// Generated from APP.ts.

import bindings from '$/sources/FilecoinFips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.FilecoinFips,
	label: 'Filecoin FIPs',
	sources: {
		[Source.FilecoinFips_Github]: {
			label: 'Filecoin FIPs GitHub',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
