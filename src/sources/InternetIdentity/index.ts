// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/InternetIdentity/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.InternetIdentity,
	label: 'Internet Identity',
	sources: [
		{
			source: Source.InternetIdentity_Delegation,
			label: 'Internet Identity delegation',
		},
	],
	bindings: [bindings[Source.InternetIdentity_Delegation]],
} satisfies SourceProviderDefinition
