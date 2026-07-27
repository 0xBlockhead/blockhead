// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/EthForks/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.EthForks,
	label: 'EthForks',
	sources: [
		{
			source: Source.EthForks_Rest,
			label: 'EthForks REST',
		},
	],
	bindings: [bindings[Source.EthForks_Rest]],
} satisfies SourceProviderDefinition
