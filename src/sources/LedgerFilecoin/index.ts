import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { ledgerFilecoinBindings } from '$/sources/LedgerFilecoin/bindings.ts'

export default {
	provider: SourceProvider.LedgerFilecoin,
	label: 'Ledger Filecoin',
	sources: [
		{
			provider: SourceProvider.LedgerFilecoin,
			source: Source.LedgerFilecoin_WalletApi,
			label: 'Ledger Filecoin wallet API',
		},
	],
	bindings: ledgerFilecoinBindings,
} satisfies SourceProviderDefinition
