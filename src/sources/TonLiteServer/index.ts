import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tonLiteServerBindings } from '$/sources/TonLiteServer/bindings.ts'

export default {
	provider: SourceProvider.TonLiteServer,
	label: 'TON Lite Server',
	sources: [
		{
			provider: SourceProvider.TonLiteServer,
			source: Source.TonLiteServer_Adnl,
			label: 'TON Lite Server ADNL',
		},
	],
	bindings: tonLiteServerBindings,
} satisfies SourceProviderDefinition
