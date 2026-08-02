// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/ZcashZips/bindings.ts'

export default {
	provider: SourceProvider.ZcashZips,
	label: 'Zcash ZIPs',
	sources: {
		[Source.ZcashZips_Github]: {
			label: 'Zcash ZIPs GitHub',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
