// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Git/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

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
	bindings: [
		bindings[Source.Git_Local],
		bindings[Source.Git_Remote],
	],
} satisfies SourceProviderDefinition
