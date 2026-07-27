// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Gitlab/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Gitlab,
	label: 'GitLab',
	sources: [
		{
			source: Source.Gitlab_Rest,
			label: 'GitLab REST',
		},
	],
	bindings: [bindings[Source.Gitlab_Rest]],
} satisfies SourceProviderDefinition
