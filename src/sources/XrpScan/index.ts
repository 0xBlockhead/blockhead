import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { xrpScanBindings } from '$/sources/XrpScan/bindings.ts'

export default {
	provider: SourceProvider.XrpScan,
	label: 'XRPScan',
	sources: [
		{
			provider: SourceProvider.XrpScan,
			source: Source.XrpScan_Rest,
			label: 'XRPScan REST',
		},
	],
	bindings: xrpScanBindings,
} satisfies SourceProviderDefinition
