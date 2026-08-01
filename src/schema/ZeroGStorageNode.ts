// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.ZeroGStorageNode,
	labels: {
		singular: 'zero g storage node',
		plural: 'zero g storage nodes',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$operator: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endpoint: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.ZeroGStorageNode_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.ZeroGStorageScan_Rest,
		],
	},
	$$storedChunks: {
		entityType: EntityType.ZeroGDataChunk,
		cardinality: EntityFieldCardinality.Many,
	},
	$$proofs: {
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
