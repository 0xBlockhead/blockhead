import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { gitlabBindings } from '$/sources/Gitlab/bindings.ts'

export default {
	provider: SourceProvider.Gitlab,
	label: 'GitLab',
	sources: [
		{
			provider: SourceProvider.Gitlab,
			source: Source.Gitlab_Rest,
			label: 'GitLab REST',
		},
	],
	bindings: gitlabBindings,
} satisfies SourceProviderDefinition
