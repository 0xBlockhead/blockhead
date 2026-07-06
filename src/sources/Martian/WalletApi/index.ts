// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const martianWalletApiSourceDefinition = {
	provider: SourceProvider.Martian,
	source: Source.Martian_WalletApi,
	label: 'Martian wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default martianWalletApiSourceDefinition
