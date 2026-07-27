// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/SigstoreRekor/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.SigstoreRekor,
	label: 'Sigstore Rekor',
	sources: [
		{
			source: Source.SigstoreRekor_Rest,
			label: 'Sigstore Rekor REST',
		},
	],
	bindings: [bindings[Source.SigstoreRekor_Rest]],
} satisfies SourceProviderDefinition
