// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/Sqd/bindings.ts'

export default {
	provider: SourceProvider.Sqd,
	label: 'SQD',
	sources: [
		{
			source: Source.SqdPortal_RawHttp,
			label: 'SQD Portal',
		},
	],
	bindings: [bindings[Source.SqdPortal_RawHttp]],
} satisfies SourceProviderDefinition
