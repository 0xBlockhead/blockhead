import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
import bindings from '$/sources/ZcashClientBackend/bindings.ts'

export default {
	provider: SourceProvider.ZcashClientBackend,
	label: 'zcash_client_backend',
	sources: {
		[Source.ZcashClientBackend_Local]: {
			label: 'zcash_client_backend local store',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
