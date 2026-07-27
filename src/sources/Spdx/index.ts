// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Spdx/bindings.ts'

export default {
	provider: SourceProvider.Spdx,
	label: 'SPDX',
	sources: [
		{
			source: Source.SpdxDocument_Local,
			label: 'SPDX document',
		},
	],
	bindings: [bindings[Source.SpdxDocument_Local]],
} satisfies SourceProviderDefinition
