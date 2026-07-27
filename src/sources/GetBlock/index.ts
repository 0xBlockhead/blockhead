// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/GetBlock/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.GetBlock,
	label: 'GetBlock',
	sources: [
		{
			source: Source.GetBlockRpc_JsonRpc,
			label: 'GetBlock EVM JSON-RPC',
		},
		{
			source: Source.GetBlockYellowstone_Grpc,
			label: 'GetBlock Yellowstone gRPC',
		},
	],
	bindings: [
		bindings[Source.GetBlockRpc_JsonRpc],
		bindings[Source.GetBlockYellowstone_Grpc],
	],
} satisfies SourceProviderDefinition
