// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const pontemWalletApiSourceDefinition = {
	provider: SourceProvider.Pontem,
	source: Source.Pontem_WalletApi,
	label: 'Pontem wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default pontemWalletApiSourceDefinition
