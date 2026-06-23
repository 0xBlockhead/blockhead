import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { ensipsBindings } from '$/sources/Ensips/bindings.ts'

export default {
	provider: SourceProvider.Ensips,
	label: 'ENSIPs',
	sources: [
		{
			provider: SourceProvider.Ensips,
			source: Source.Ensips_Github,
			label: 'ENSIPs GitHub',
		},
	],
	bindings: ensipsBindings,
} satisfies SourceProviderDefinition
