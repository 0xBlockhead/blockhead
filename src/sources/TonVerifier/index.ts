// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/TonVerifier/bindings.ts'

export default {
	provider: SourceProvider.TonVerifier,
	label: 'TON Verifier',
	sources: [
		{
			source: Source.TonVerifier_Rest,
			label: 'TON Verifier REST',
		},
	],
	bindings: [bindings[Source.TonVerifier_Rest]],
} satisfies SourceProviderDefinition
