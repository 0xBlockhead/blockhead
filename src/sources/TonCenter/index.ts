import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tonCenterBindings } from '$/sources/TonCenter/bindings.ts'

export default {
	provider: SourceProvider.TonCenter,
	label: 'TON Center',
	sources: [
		{
			provider: SourceProvider.TonCenter,
			source: Source.TonCenter_V2_Rest,
			label: 'TON Center v2 REST',
		},
		{
			provider: SourceProvider.TonCenter,
			source: Source.TonCenter_V3_Rest,
			label: 'TON Center v3 REST',
		},
	],
	bindings: tonCenterBindings,
} satisfies SourceProviderDefinition
