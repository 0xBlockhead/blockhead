
import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import {
	rawOrigin,
	restOrigin,
} from '$/sources/Github/Rest/constants.ts'
import GithubRestSource from '$/sources/Github/Rest/index.ts'

export default {
	provider: SourceProvider.Github,
	label: 'Github',
	origins: [
		{
			origin: restOrigin,
			corsEnabled: true,
		},
		{
			origin: rawOrigin,
			corsEnabled: true,
		},
	],
	sources: [
		GithubRestSource,
	],
} satisfies SourceProviderDefinition
