// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGStorageProofSelector {
	ZeroGStorageNodeProofId = 'ZeroGStorageNodeProofId',
}
export const ZeroGStorageProof = entity({
	entityType: EntityType.ZeroGStorageProof,
	labels: {
		singular: 'zero g storage proof',
		plural: 'zero g storage proofs',
	},
})({
	$storageNode: {
		label: 'storage node',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGStorageNode,
		cardinality: EntityFieldCardinality.One,
	},
	proofId: {
		label: 'proof ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$dataBlob: {
		label: 'data blob',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$consensusNetwork: {
		label: 'consensus network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofKind: {
		label: 'proof kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAtBlock: {
		label: 'verified AT block',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ZeroGStorageNodeProofId: [
			'$storageNode',
			'proofId',
		],
	},
})
