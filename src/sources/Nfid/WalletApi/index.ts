// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const nfidWalletApiSourceDefinition = {
	provider: SourceProvider.Nfid,
	source: Source.Nfid_WalletApi,
	label: 'NFID wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default nfidWalletApiSourceDefinition
