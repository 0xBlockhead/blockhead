// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AlgorandTransactionProofSelector {
	TransactionRoundHashTypeSource = 'TransactionRoundHashTypeSource',
}
export const AlgorandTransactionProof = entity({
	entityType: EntityType.AlgorandTransactionProof,
	labels: {
		singular: 'algorand transaction proof',
		plural: 'algorand transaction proofs',
	},
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AlgorandTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	round: {
		label: 'round',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	hashType: {
		label: 'hash type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	proofBytes: {
		label: 'proof bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stibHash: {
		label: 'stib hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	treeDepth: {
		label: 'tree depth',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	path: {
		label: 'path',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionRoundHashTypeSource: [
			'$transaction',
			'round',
			'hashType',
			'source',
		],
	},
})
