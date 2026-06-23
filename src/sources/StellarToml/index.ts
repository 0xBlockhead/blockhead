import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { stellarTomlBindings } from '$/sources/StellarToml/bindings.ts'

export default {
	provider: SourceProvider.StellarToml,
	label: 'Stellar TOML',
	sources: [
		{
			provider: SourceProvider.StellarToml,
			source: Source.StellarToml_Rest,
			label: 'Stellar TOML REST',
		},
	],
	bindings: stellarTomlBindings,
} satisfies SourceProviderDefinition
