// Generated from APP.ts.

import bindings from '$/sources/Radicle/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Radicle,
	label: 'Radicle',
	sources: [
		{
			source: Source.Radicle_Local,
			label: 'Radicle local repository',
		},
		{
			source: Source.Radicle_Remote,
			label: 'Radicle remote repository',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
