import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { fedimintClientBindings } from '$/sources/FedimintClient/bindings.ts'

export default {
	provider: SourceProvider.FedimintClient,
	label: 'Fedimint client',
	sources: [
		{
			provider: SourceProvider.FedimintClient,
			source: Source.FedimintClient_Rpc,
			label: 'Fedimint client RPC',
		},
	],
	bindings: fedimintClientBindings,
} satisfies SourceProviderDefinition
