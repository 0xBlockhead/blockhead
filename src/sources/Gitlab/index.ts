// Generated from APP.ts.

import bindings from '$/sources/Gitlab/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Gitlab,
	label: 'GitLab',
	sources: [
		{
			source: Source.Gitlab_Rest,
			label: 'GitLab REST',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
