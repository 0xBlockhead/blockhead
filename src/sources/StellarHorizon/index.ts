import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { stellarHorizonBindings } from '$/sources/StellarHorizon/bindings.ts'

export default {
	provider: SourceProvider.StellarHorizon,
	label: 'Stellar Horizon',
	sources: [
		{
			provider: SourceProvider.StellarHorizon,
			source: Source.StellarHorizon_Rest,
			label: 'Stellar Horizon REST',
		},
	],
	bindings: stellarHorizonBindings,
} satisfies SourceProviderDefinition
