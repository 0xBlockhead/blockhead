// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/SnapshotHub/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.SnapshotHub,
	label: 'Snapshot Hub',
	sources: [
		{
			source: Source.SnapshotHub_Graphql,
			label: 'Snapshot Hub GraphQL',
		},
	],
	bindings: [bindings[Source.SnapshotHub_Graphql]],
} satisfies SourceProviderDefinition
