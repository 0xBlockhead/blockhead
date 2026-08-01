// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.BlockheadZeroGStorageNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	proofId: {
		label: 'proof ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$dataBlob: {
		label: 'data blob',
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$chunk: {
		label: 'chunk',
		entityType: EntityType.BlockheadZeroGStoredChunk,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofKind: {
		label: 'proof kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofBytes: {
		label: 'proof bytes',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verified: {
		label: 'verified',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	verifiedAt: {
		label: 'verified AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAtBlock: {
		label: 'verified AT block',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
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
