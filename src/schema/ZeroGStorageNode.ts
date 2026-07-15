// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ZeroGStorageNodeSelector {
	NetworkNodeId = 'NetworkNodeId',
}
export const ZeroGStorageNode = entity({
	entityType: EntityType.ZeroGStorageNode,
	labels: {
		singular: 'zero g storage node',
		plural: 'zero g storage nodes',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		label: 'node ID',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.One,
	},
	$operator: {
		label: 'operator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endpoint: {
		label: 'endpoint',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ZeroGStorageNode_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.ZeroGStorageScan_Rest,
		],
	},
	$$storedChunks: {
		label: 'stored chunks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ZeroGDataChunk,
		cardinality: EntityFieldCardinality.Many,
	},
	$$proofs: {
		label: 'proofs',
		type: EntityFieldType.EntitiesReference,
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
