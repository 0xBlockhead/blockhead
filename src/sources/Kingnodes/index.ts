// Generated from APP.ts.

import bindings from '$/sources/Kingnodes/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Kingnodes,
	label: 'Kingnodes',
	sources: [
		{
			source: Source.KingnodesDydxNode,
			label: 'Kingnodes dYdX node',
		},
	],
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
