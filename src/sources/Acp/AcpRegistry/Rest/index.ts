// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const acpRegistryRestSourceDefinition = {
	provider: SourceProvider.Acp,
	source: Source.AcpRegistry_Rest,
	label: 'ACP registry REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default acpRegistryRestSourceDefinition
