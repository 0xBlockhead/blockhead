// Generated from APP.ts.

import bindings from '$/sources/DogecoinDips/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.DogecoinDips,
	label: 'Dogecoin DIPs',
	sources: [
		{
			source: Source.DogecoinDips_Github,
			label: 'Dogecoin DIPs GitHub',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
