import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { easScanBindings } from '$/sources/EasScan/bindings.ts'

export default {
	provider: SourceProvider.EasScan,
	label: 'EAS Scan',
	sources: [
		{
			provider: SourceProvider.EasScan,
			source: Source.EasScan_Graphql,
			label: 'EAS Scan GraphQL',
		},
	],
	bindings: easScanBindings,
} satisfies SourceProviderDefinition
