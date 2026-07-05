// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CelestiaBlobSelector {
	NamespaceHeightCommitment = 'NamespaceHeightCommitment',
}
export default {
	entityType: EntityType.CelestiaBlob,
	label: 'celestia blob',
	labelPlural: 'celestia blobs',
	selectors: [
		{
			name: CelestiaBlobSelector.NamespaceHeightCommitment,
			fields: [
				'$namespace',
				'height',
				'commitment',
			],
		},
	],
	fields: [
		{
				name: '$namespace',
				label: 'Namespace',
				description: 'The namespace that qualifies the identifier.',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CelestiaNamespace,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'height',
				label: 'Height',
				description: 'The block or ledger height in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'commitment',
				label: 'commitment',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'dataHash',
				label: 'data hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'shareVersion',
				label: 'share version',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'index',
				label: 'index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sizeBytes',
				label: 'size bytes',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signer',
				label: 'signer',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'txHash',
				label: 'Transaction hash',
				description: 'The transaction hash in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$block',
				label: 'block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CelestiaBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'proof',
				label: 'proof',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'shareProofAvailable',
				label: 'share proof available',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'blobData',
				label: 'blob data',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'payloadRequested',
				label: 'payload requested',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
