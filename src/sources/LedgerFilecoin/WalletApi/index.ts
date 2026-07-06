// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const ledgerFilecoinWalletApiSourceDefinition = {
	provider: SourceProvider.LedgerFilecoin,
	source: Source.LedgerFilecoin_WalletApi,
	label: 'Ledger Filecoin wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default ledgerFilecoinWalletApiSourceDefinition
