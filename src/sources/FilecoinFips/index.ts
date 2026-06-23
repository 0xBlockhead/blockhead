import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { filecoinFipsBindings } from '$/sources/FilecoinFips/bindings.ts'

export default {
	provider: SourceProvider.FilecoinFips,
	label: 'Filecoin FIPs',
	sources: [
		{
			provider: SourceProvider.FilecoinFips,
			source: Source.FilecoinFips_Github,
			label: 'Filecoin FIPs GitHub',
		},
	],
	bindings: filecoinFipsBindings,
} satisfies SourceProviderDefinition
