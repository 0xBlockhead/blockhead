// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/LedgerFilecoin/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.LedgerFilecoin,
	label: 'Ledger Filecoin',
	sources: [
		{
			source: Source.LedgerFilecoin_WalletApi,
			label: 'Ledger Filecoin wallet API',
		},
	],
	bindings: [bindings[Source.LedgerFilecoin_WalletApi]],
} satisfies SourceProviderDefinition
