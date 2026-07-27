// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/XrpScan/bindings.ts'

export default {
	provider: SourceProvider.XrpScan,
	label: 'XRPScan',
	sources: [
		{
			source: Source.XrpScan_Rest,
			label: 'XRPScan REST',
		},
	],
	bindings: [bindings[Source.XrpScan_Rest]],
} satisfies SourceProviderDefinition
