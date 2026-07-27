// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Sourcify/bindings.ts'

export default {
	provider: SourceProvider.Sourcify,
	label: 'Sourcify',
	sources: [
		{
			source: Source.Sourcify_Rest,
			label: 'Sourcify REST',
		},
	],
	bindings: [bindings[Source.Sourcify_Rest]],
} satisfies SourceProviderDefinition
