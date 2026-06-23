import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { avalanchePlatformVmBindings } from '$/sources/AvalanchePlatformVm/bindings.ts'

export default {
	provider: SourceProvider.AvalanchePlatformVm,
	label: 'Avalanche PlatformVM',
	sources: [
		{
			provider: SourceProvider.AvalanchePlatformVm,
			source: Source.AvalanchePlatformVm_JsonRpc,
			label: 'Avalanche PlatformVM JSON-RPC',
		},
	],
	bindings: avalanchePlatformVmBindings,
} satisfies SourceProviderDefinition
