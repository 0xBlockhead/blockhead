// Generated from APP.ts.

import bindings from '$/sources/_Constants/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider._Constants,
	label: 'Constants',
	sources: [
		{
			source: Source.Constants_Internal,
			label: 'Checked-in constants',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
