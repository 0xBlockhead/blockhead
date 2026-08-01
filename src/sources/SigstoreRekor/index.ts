// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/SigstoreRekor/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.SigstoreRekor,
	label: 'Sigstore Rekor',
	sources: [
		{
			source: Source.SigstoreRekor,
			label: 'Sigstore Rekor',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
