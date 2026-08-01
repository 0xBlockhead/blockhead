// Generated from APP.ts.

import bindings from '$/sources/Git/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Git,
	label: 'Git',
	sources: [
		{
			source: Source.Git_Local,
			label: 'Local Git repository',
		},
		{
			source: Source.Git_Remote,
			label: 'Remote Git repository',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
