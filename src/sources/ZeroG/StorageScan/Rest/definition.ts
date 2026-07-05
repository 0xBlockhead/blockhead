import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'


// Constants

export const zeroGMainnetStorageEndpoints = [
	{
		url: 'https://storagescan.0g.ai',
		transportType: TransportType.Http,
		providerName: '0G StorageScan',
	},
] as const satisfies readonly {
	url: string
	transportType: TransportType
	providerName: string
}[]


// Source

export default {
	provider: SourceProvider.ZeroG,
	source: Source.ZeroGStorageScan_Rest,
	label: '0G StorageScan REST',
} as const
