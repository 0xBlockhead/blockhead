// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/MlCommons/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.MlCommons,
	label: 'MLCommons',
	sources: [
		{
			source: Source.CroissantDocument_Local,
			label: 'Croissant document',
		},
	],
	bindings: [bindings[Source.CroissantDocument_Local]],
} satisfies SourceProviderDefinition
