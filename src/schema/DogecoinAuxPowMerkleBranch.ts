// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.DogecoinBlockAuxPow,
		cardinality: EntityFieldCardinality.One,
	},
	branchKind: {
		label: 'Branch kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	branchHashes: {
		label: 'Branch hashes',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	index: {
		label: 'Index',
		type: EntityFieldType.Primitive,
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
