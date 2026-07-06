// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const dogecoinDipsGithubSourceDefinition = {
	provider: SourceProvider.DogecoinDips,
	source: Source.DogecoinDips_Github,
	label: 'Dogecoin DIPs GitHub',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default dogecoinDipsGithubSourceDefinition
