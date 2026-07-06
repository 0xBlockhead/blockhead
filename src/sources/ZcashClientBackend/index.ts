// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const zcashClientBackendLocalSourceDefinition = {
	provider: SourceProvider.ZcashClientBackend,
	source: Source.ZcashClientBackend_Local,
	label: 'zcash_client_backend local store',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default zcashClientBackendLocalSourceDefinition
