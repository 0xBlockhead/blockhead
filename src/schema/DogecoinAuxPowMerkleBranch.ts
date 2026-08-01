// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DogecoinAuxPowMerkleBranch,
	labels: {
		singular: 'dogecoin aux pow merkle branch',
		plural: 'dogecoin aux pow merkle branches',
	},
})({
	$auxPow: {
		label: 'AuxPoW',
		entityType: EntityType.DogecoinBlockAuxPow,
		cardinality: EntityFieldCardinality.One,
	},
	branchKind: {
		label: 'Branch kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	branchHashes: {
		label: 'Branch hashes',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	index: {
		label: 'Index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AuxPowBranchKind: [
			'$auxPow',
			'branchKind',
		],
	},
})
