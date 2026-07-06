// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const cosmosSdkRestSourceDefinition = {
	provider: SourceProvider.CosmosSdk,
	source: Source.CosmosSdk_Rest,
	label: 'Cosmos SDK REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default cosmosSdkRestSourceDefinition
