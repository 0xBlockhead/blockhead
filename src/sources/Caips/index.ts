import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { caipsBindings } from '$/sources/Caips/bindings.ts'

export default {
	provider: SourceProvider.Caips,
	label: 'CAIPs',
	sources: [
		{
			provider: SourceProvider.Caips,
			source: Source.Caips_Github,
			label: 'CAIPs GitHub',
		},
		{
			provider: SourceProvider.Caips,
			source: Source.CaipNamespaces_Github,
			label: 'CAIP namespaces GitHub',
		},
	],
	bindings: caipsBindings,
} satisfies SourceProviderDefinition
