// Generated from APP.ts. Do not edit by hand.

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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
