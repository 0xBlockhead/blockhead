// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EvmBlobSelector {
	TransactionIndexInTransaction = 'TransactionIndexInTransaction',
}
export default {
	entityType: EntityType.EvmBlob,
	label: 'EVM blob',
	labelPlural: 'EVM blobs',
	description: 'A blob sidecar referenced by an EIP-4844 EVM transaction.',
	selectors: [
		{
			name: EvmBlobSelector.TransactionIndexInTransaction,
			fields: [
				'$transaction',
				'indexInTransaction',
			],
		},
	],
	fields: [
		{
			name: 'indexInTransaction',
			label: 'Index in transaction',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'versionedHash',
			label: 'Versioned hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$transaction',
			label: 'Transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			label: 'Block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'kzgCommitment',
			label: 'KZG commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'blobDataStorageReferences',
			label: 'Blob data storage references',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
