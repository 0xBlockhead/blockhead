import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { layerZeroScanBindings } from '$/sources/LayerZeroScan/bindings.ts'

export default {
	provider: SourceProvider.LayerZeroScan,
	label: 'LayerZero Scan',
	sources: [
		{
			provider: SourceProvider.LayerZeroScan,
			source: Source.LayerZeroScan_Rest,
			label: 'LayerZero Scan REST',
		},
	],
	bindings: layerZeroScanBindings,
} satisfies SourceProviderDefinition
