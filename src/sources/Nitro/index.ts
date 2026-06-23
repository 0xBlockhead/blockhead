import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { nitroBindings } from '$/sources/Nitro/bindings.ts'

export default {
	provider: SourceProvider.Nitro,
	label: 'Nitro',
	sources: [
		{
			provider: SourceProvider.Nitro,
			source: Source.Nitro_ClientStore,
			label: 'Nitro client store',
		},
		{
			provider: SourceProvider.Nitro,
			source: Source.Nitro_NodeRpc,
			label: 'Nitro node RPC',
		},
	],
	bindings: nitroBindings,
} satisfies SourceProviderDefinition
