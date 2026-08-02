// Generated from APP.ts.

import bindings from '$/sources/Git/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Git,
	label: 'Git',
	sources: {
		[Source.Git_Local]: {
			label: 'Local Git repository',
		},
		[Source.Git_Remote]: {
			label: 'Remote Git repository',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
