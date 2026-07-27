// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Eip8004Scan/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Eip8004Scan,
	label: '8004scan',
	sources: [
		{
			source: Source.Eip8004Scan_Rest,
			label: '8004scan REST',
		},
	],
	bindings: [bindings[Source.Eip8004Scan_Rest]],
} satisfies SourceProviderDefinition
