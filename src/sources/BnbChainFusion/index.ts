import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { bnbChainFusionBindings } from '$/sources/BnbChainFusion/bindings.ts'

export default {
	provider: SourceProvider.BnbChainFusion,
	label: 'BNB Chain Fusion',
	sources: [
		{
			provider: SourceProvider.BnbChainFusion,
			source: Source.BnbChainFusion_Rest,
			label: 'BNB Chain Fusion REST',
		},
	],
	bindings: bnbChainFusionBindings,
} satisfies SourceProviderDefinition
