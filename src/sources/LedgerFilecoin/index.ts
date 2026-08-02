// Generated from APP.ts.

import bindings from '$/sources/LedgerFilecoin/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.LedgerFilecoin,
	label: 'Ledger Filecoin',
	sources: [
		{
			source: Source.LedgerFilecoin_WalletApi,
			label: 'Ledger Filecoin wallet API',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
