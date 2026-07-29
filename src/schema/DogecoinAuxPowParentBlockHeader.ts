// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.DogecoinAuxPowParentBlockHeader,
	labels: {
		singular: 'dogecoin aux pow parent block header',
		plural: 'dogecoin aux pow parent block headers',
	},
})({
	$auxPow: {
		label: 'AuxPoW',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.DogecoinBlockAuxPow,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	merkleRoot: {
		label: 'Merkle root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nonce: {
		label: 'Nonce',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AuxPow: [
			'$auxPow',
		],
	},
})
