import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { nearConnectBindings } from '$/sources/NearConnect/bindings.ts'

export default {
	provider: SourceProvider.NearConnect,
	label: 'NEAR Connect',
	sources: [
		{
			provider: SourceProvider.NearConnect,
			source: Source.NearConnect_WalletApi,
			label: 'NEAR Connect wallet API',
		},
	],
	bindings: nearConnectBindings,
} satisfies SourceProviderDefinition
