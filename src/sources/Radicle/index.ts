// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Radicle/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

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
	bindings: [
		bindings[Source.Radicle_Local],
		bindings[Source.Radicle_Remote],
	],
} satisfies SourceProviderDefinition
