// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const nearRpcJsonRpcSources = [
	Source.NearRpc_JsonRpc,
] as const

export default entity({
	entityType: EntityType.NearChunk,
	labels: {
		singular: 'near chunk',
		plural: 'near chunks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	chunkHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		entityType: EntityType.NearBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	shardId: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	gasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: nearRpcJsonRpcSources,
	},
	$$transactions: {
		entityType: EntityType.NearTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: nearRpcJsonRpcSources,
	},
})({
	selectors: {
		NetworkChunkHash: [
			'$network',
			'chunkHash',
		],
	},
})
