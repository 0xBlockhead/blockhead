// Generated from APP.ts.

import bindings from '$/sources/Payjoin/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Payjoin,
	label: 'Payjoin',
	sources: {
		[Source.PayjoinOhttpRelay_Http]: {
			label: 'Payjoin OHTTP relay',
		},
		[Source.PayjoinReceiver_Http]: {
			label: 'Payjoin receiver HTTP',
		},
		[Source.PayjoinDirectory_Rest]: {
			label: 'Payjoin directory REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
