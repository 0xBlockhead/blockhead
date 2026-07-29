// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/SnapshotHub/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.SnapshotHub,
	label: 'Snapshot Hub',
	sources: [
		{
			source: Source.SnapshotHub_Graphql,
			label: 'Snapshot Hub GraphQL',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
