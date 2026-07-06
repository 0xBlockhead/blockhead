// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const nitroClientStoreSourceDefinition = {
	provider: SourceProvider.Nitro,
	source: Source.Nitro_ClientStore,
	label: 'Nitro client store',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default nitroClientStoreSourceDefinition
