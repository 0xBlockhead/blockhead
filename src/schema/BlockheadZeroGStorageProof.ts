// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadZeroGStorageProof,
	labels: {
		singular: 'blockhead zero g storage proof',
		plural: 'blockhead zero g storage proofs',
	},
})({
	$nodeState: {
		label: 'node state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadZeroGStorageNodeState,
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
	$chunk: {
		label: 'chunk',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadZeroGStoredChunk,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofKind: {
		label: 'proof kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofBytes: {
		label: 'proof bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verified: {
		label: 'verified',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	verifiedAt: {
		label: 'verified AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAtBlock: {
		label: 'verified AT block',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NodeStateProofId: [
			'$nodeState',
			'proofId',
		],
	},
})
