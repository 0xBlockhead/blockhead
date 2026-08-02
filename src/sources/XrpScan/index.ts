// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/XrpScan/bindings.ts'

export default {
	provider: SourceProvider.XrpScan,
	label: 'XRPScan',
	sources: {
		[Source.XrpScan_Rest]: {
			label: 'XRPScan REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
