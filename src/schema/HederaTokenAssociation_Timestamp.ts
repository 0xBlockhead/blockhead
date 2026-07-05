// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaTokenAssociation_TimestampSelector {
	AssociationTimestampMsSource = 'AssociationTimestampMsSource',
}
export default {
	entityType: EntityType.HederaTokenAssociation_Timestamp,
	label: 'hedera token association timestamp',
	labelPlural: 'hedera token association observations',
	selectors: [
		{
			name: HederaTokenAssociation_TimestampSelector.AssociationTimestampMsSource,
			fields: [
				'$association',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$association',
				label: 'association',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaTokenAssociation,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
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
				name: 'associationStatus',
				label: 'association status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'balance',
				label: 'balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'kycStatus',
				label: 'kyc status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'freezeStatus',
				label: 'freeze status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
