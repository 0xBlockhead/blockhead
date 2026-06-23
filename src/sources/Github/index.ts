import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { githubBindings } from '$/sources/Github/bindings.ts'

export default {
	provider: SourceProvider.Github,
	label: 'GitHub',
	sources: [
		{
			provider: SourceProvider.Github,
			source: Source.Github_Rest,
			label: 'GitHub REST',
		},
		{
			provider: SourceProvider.Github,
			source: Source.Github_Git,
			label: 'GitHub Git',
		},
	],
	bindings: githubBindings,
} satisfies SourceProviderDefinition
