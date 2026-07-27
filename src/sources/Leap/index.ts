// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Leap/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Leap,
	label: 'Leap',
	sources: [
		{
			source: Source.Leap_WalletApi,
			label: 'Leap wallet API',
		},
	],
	bindings: [bindings[Source.Leap_WalletApi]],
} satisfies SourceProviderDefinition
