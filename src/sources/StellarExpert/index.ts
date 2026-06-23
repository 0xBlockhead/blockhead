import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { stellarExpertBindings } from '$/sources/StellarExpert/bindings.ts'

export default {
	provider: SourceProvider.StellarExpert,
	label: 'StellarExpert',
	sources: [
		{
			provider: SourceProvider.StellarExpert,
			source: Source.StellarExpert_Rest,
			label: 'StellarExpert REST',
		},
	],
	bindings: stellarExpertBindings,
} satisfies SourceProviderDefinition
