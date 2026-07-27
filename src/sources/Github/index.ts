// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Github/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Github,
	label: 'GitHub',
	sources: [
		{
			source: Source.Github_Rest,
			label: 'GitHub REST',
		},
		{
			source: Source.Github_Git,
			label: 'GitHub Git',
		},
	],
	bindings: [
		bindings[Source.Github_Rest],
		bindings[Source.Github_Git],
	],
} satisfies SourceProviderDefinition
