import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { transmissionBindings } from '$/sources/Transmission/bindings.ts'

export default {
	provider: SourceProvider.Transmission,
	label: 'Transmission',
	sources: [
		{
			provider: SourceProvider.Transmission,
			source: Source.TransmissionRpc_JsonRpc,
			label: 'Transmission RPC',
		},
	],
	bindings: transmissionBindings,
} satisfies SourceProviderDefinition
