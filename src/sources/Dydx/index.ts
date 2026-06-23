import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { dydxBindings } from '$/sources/Dydx/bindings.ts'

export default {
	provider: SourceProvider.Dydx,
	label: 'dYdX',
	sources: [
		{
			provider: SourceProvider.Dydx,
			source: Source.DydxIndexer_Rest,
			label: 'dYdX Indexer REST',
		},
		{
			provider: SourceProvider.Dydx,
			source: Source.DydxValidator_Rest,
			label: 'dYdX Validator REST',
		},
	],
	bindings: dydxBindings,
} satisfies SourceProviderDefinition
