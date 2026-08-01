// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGStorageNode,
	labels: {
		singular: 'zero g storage node',
		plural: 'zero g storage nodes',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		label: 'node ID',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$operator: {
		label: 'operator',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endpoint: {
		label: 'endpoint',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.ZeroGStorageNode_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.ZeroGStorageScan_Rest,
		],
	},
	$$storedChunks: {
		label: 'stored chunks',
		entityType: EntityType.ZeroGDataChunk,
		cardinality: EntityFieldCardinality.Many,
	},
	$$proofs: {
		label: 'proofs',
		entityType: EntityType.ZeroGStorageProof,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkNodeId: [
			'$network',
			'nodeId',
		],
	},
})
