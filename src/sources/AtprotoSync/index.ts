import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { atprotoSyncBindings } from '$/sources/AtprotoSync/bindings.ts'

export default {
	provider: SourceProvider.AtprotoSync,
	label: 'AT Protocol sync',
	sources: [
		{
			provider: SourceProvider.AtprotoSync,
			source: Source.AtprotoSync_Xrpc,
			label: 'AT Protocol sync XRPC',
		},
	],
	bindings: atprotoSyncBindings,
} satisfies SourceProviderDefinition
