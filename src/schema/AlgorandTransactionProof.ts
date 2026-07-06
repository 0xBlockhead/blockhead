// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AlgorandTransactionProofSelector {
	TransactionRoundHashTypeSource = 'TransactionRoundHashTypeSource',
}
export default {
	entityType: EntityType.AlgorandTransactionProof,
	label: 'algorand transaction proof',
	labelPlural: 'algorand transaction proofs',
	selectors: [
		{
			name: AlgorandTransactionProofSelector.TransactionRoundHashTypeSource,
			fields: [
				'$transaction',
				'round',
				'hashType',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AlgorandTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'round',
			label: 'round',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hashType',
			label: 'hash type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'proofBytes',
			label: 'proof bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stibHash',
			label: 'stib hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'treeDepth',
			label: 'tree depth',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'path',
			label: 'path',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
