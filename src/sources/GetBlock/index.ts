import bindings from '$/sources/GetBlock/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.GetBlock,
	label: 'GetBlock',
	sources: {
		[Source.GetBlockRpc_JsonRpc]: {
			label: 'GetBlock EVM JSON-RPC',
		},
		[Source.GetBlockYellowstone_Grpc]: {
			label: 'GetBlock Yellowstone gRPC',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
