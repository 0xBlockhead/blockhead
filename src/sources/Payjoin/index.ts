// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Payjoin/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

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
	bindings: [
		bindings[Source.PayjoinOhttpRelay_Http],
		bindings[Source.PayjoinReceiver_Http],
		bindings[Source.PayjoinDirectory_Rest],
	],
} satisfies SourceProviderDefinition
