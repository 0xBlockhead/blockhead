import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { avalancheInfoBindings } from '$/sources/AvalancheInfo/bindings.ts'

export default {
	provider: SourceProvider.AvalancheInfo,
	label: 'Avalanche Info API',
	sources: [
		{
			provider: SourceProvider.AvalancheInfo,
			source: Source.AvalancheInfo_JsonRpc,
			label: 'Avalanche Info JSON-RPC',
		},
	],
	bindings: avalancheInfoBindings,
} satisfies SourceProviderDefinition
