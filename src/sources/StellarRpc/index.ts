import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { stellarRpcBindings } from '$/sources/StellarRpc/bindings.ts'

export default {
	provider: SourceProvider.StellarRpc,
	label: 'Stellar RPC',
	sources: [
		{
			provider: SourceProvider.StellarRpc,
			source: Source.StellarRpc_JsonRpc,
			label: 'Stellar RPC JSON-RPC',
		},
	],
	bindings: stellarRpcBindings,
} satisfies SourceProviderDefinition
