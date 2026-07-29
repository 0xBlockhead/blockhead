// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Payjoin/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Payjoin,
	label: 'Payjoin',
	sources: [
		{
			source: Source.PayjoinOhttpRelay_Http,
			label: 'Payjoin OHTTP relay',
		},
		{
			source: Source.PayjoinReceiver_Http,
			label: 'Payjoin receiver HTTP',
		},
		{
			source: Source.PayjoinDirectory_Rest,
			label: 'Payjoin directory REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
