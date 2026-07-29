// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StarknetClass,
	labels: {
		singular: 'starknet class',
		plural: 'starknet classes',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StarknetNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	classHash: {
		label: 'class hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sierraProgramHash: {
		label: 'sierra program hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	casmClassHash: {
		label: 'casm class hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	abiHash: {
		label: 'ABI hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractClassVersion: {
		label: 'contract class version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredAtBlockNumber: {
		label: 'declared at block number',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredByTransactionHash: {
		label: 'declared by transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$contracts: {
		label: 'contracts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.StarknetContract,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkClassHash: [
			'$network',
			'classHash',
		],
	},
})
