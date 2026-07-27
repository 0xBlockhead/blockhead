// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/LogosDocs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.LogosDocs,
	label: 'Logos docs',
	sources: [
		{
			source: Source.LogosDocs_Rest,
			label: 'Logos docs',
		},
	],
	bindings: [bindings[Source.LogosDocs_Rest]],
} satisfies SourceProviderDefinition
