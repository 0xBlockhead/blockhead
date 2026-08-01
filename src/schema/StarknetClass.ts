// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.StarknetNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	classHash: {
		label: 'class hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sierraProgramHash: {
		label: 'sierra program hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	casmClassHash: {
		label: 'casm class hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	abiHash: {
		label: 'ABI hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractClassVersion: {
		label: 'contract class version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredAtBlockNumber: {
		label: 'declared at block number',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredByTransactionHash: {
		label: 'declared by transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$contracts: {
		label: 'contracts',
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
