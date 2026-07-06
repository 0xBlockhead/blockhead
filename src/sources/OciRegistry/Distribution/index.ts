// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const ociRegistryDistributionSourceDefinition = {
	provider: SourceProvider.OciRegistry,
	source: Source.OciRegistry_Distribution,
	label: 'OCI distribution registry',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default ociRegistryDistributionSourceDefinition
