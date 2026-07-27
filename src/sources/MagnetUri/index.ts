// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/MagnetUri/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.MagnetUri,
	label: 'Magnet URI',
	sources: [
		{
			source: Source.MagnetUri_Uri,
			label: 'Magnet URI parser',
		},
	],
	bindings: [bindings[Source.MagnetUri_Uri]],
} satisfies SourceProviderDefinition
