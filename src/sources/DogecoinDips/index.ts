// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/DogecoinDips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.DogecoinDips,
	label: 'Dogecoin DIPs',
	sources: [
		{
			source: Source.DogecoinDips_Github,
			label: 'Dogecoin DIPs GitHub',
		},
	],
	bindings: [bindings[Source.DogecoinDips_Github]],
} satisfies SourceProviderDefinition
