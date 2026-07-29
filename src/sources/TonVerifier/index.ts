// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
