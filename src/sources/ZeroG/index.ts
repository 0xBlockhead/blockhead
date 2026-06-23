import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { zeroGBindings } from '$/sources/ZeroG/bindings.ts'

export const zeroGOrigins = [
	...new Map(
		zeroGBindings
			.flatMap((binding) => binding.endpoints)
			.flatMap((endpoint) => (
				endpoint.origin == null ?
					[]
				:
					[[
						endpoint.origin,
						{
							origin: endpoint.origin,
							corsEnabled: endpoint.corsEnabled === true,
						},
					]]
			))
	).values(),
]

export default {
	provider: SourceProvider.ZeroG,
	label: '0G',
	sources: [
		{
			provider: SourceProvider.ZeroG,
			source: Source.ZeroGChain_JsonRpc,
			label: '0G Chain JSON-RPC',
		},
		{
			provider: SourceProvider.ZeroG,
			source: Source.ZeroGStorageNode_JsonRpc,
			label: '0G Storage node JSON-RPC',
		},
		{
			provider: SourceProvider.ZeroG,
			source: Source.ZeroGChainScan_Rest,
			label: '0G ChainScan REST',
		},
		{
			provider: SourceProvider.ZeroG,
			source: Source.ZeroGStorageScan_Rest,
			label: '0G StorageScan REST',
		},
	],
	bindings: zeroGBindings,
} satisfies SourceProviderDefinition
