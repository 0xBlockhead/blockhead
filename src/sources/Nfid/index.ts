import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { nfidBindings } from '$/sources/Nfid/bindings.ts'

export default {
	provider: SourceProvider.Nfid,
	label: 'NFID',
	sources: [
		{
			provider: SourceProvider.Nfid,
			source: Source.Nfid_WalletApi,
			label: 'NFID wallet API',
		},
	],
	bindings: nfidBindings,
} satisfies SourceProviderDefinition
