// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CycloneDx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CycloneDx,
	label: 'CycloneDX',
	sources: [
		{
			source: Source.CycloneDxDocument_Local,
			label: 'CycloneDX document',
		},
	],
	bindings: [bindings[Source.CycloneDxDocument_Local]],
} satisfies SourceProviderDefinition
