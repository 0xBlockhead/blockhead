import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import { zcashClientBackendBindings } from '$/sources/ZcashClientBackend/bindings.ts'

const zcashClientBackendOrigins = sourceOriginsFromBindings(zcashClientBackendBindings)

const zcashClientBackendSourceProviderDefinition = {
	provider: SourceProvider.ZcashClientBackend,
	label: 'zcash_client_backend',
	sources: [
		{
			provider: SourceProvider.ZcashClientBackend,
			source: Source.ZcashClientBackend_Local,
			label: 'zcash_client_backend local store',
		},
	],
	bindings: zcashClientBackendBindings,
	origins: zcashClientBackendOrigins,
} satisfies SourceProviderDefinition

export default zcashClientBackendSourceProviderDefinition
