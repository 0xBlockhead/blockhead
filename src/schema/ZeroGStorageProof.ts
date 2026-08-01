// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGStorageProof,
	labels: {
		singular: 'zero g storage proof',
		plural: 'zero g storage proofs',
	},
})({
	$storageNode: {
		label: 'storage node',
		entityType: EntityType.ZeroGStorageNode,
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
	$consensusNetwork: {
		label: 'consensus network',
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofKind: {
		label: 'proof kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedAtBlock: {
		label: 'verified AT block',
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
