import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'


// Constants

export const zeroGMainnetExplorerEndpoints = [
	{
		url: 'https://chainscan.0g.ai',
		transportType: TransportType.Http,
		providerName: '0G ChainScan',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]


// Source

export default {
	provider: SourceProvider.ZeroG,
	source: Source.ZeroGChainScan_Rest,
	label: '0G ChainScan REST',
} as const
