// Generated from APP.ts.

import bindings from '$/sources/SigstoreRekor/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.SigstoreRekor,
	label: 'Sigstore Rekor',
	sources: {
		[Source.SigstoreRekor]: {
			label: 'Sigstore Rekor',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
