// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tonLiteServerAdnlSourceDefinition = {
	provider: SourceProvider.TonLiteServer,
	source: Source.TonLiteServer_Adnl,
	label: 'TON Lite Server ADNL',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tonLiteServerAdnlSourceDefinition
