// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AssetEligibilitySelector {
	AssetInstanceAccountTimestampMsSource = 'AssetInstanceAccountTimestampMsSource',
}
export default {
	entityType: EntityType.AssetEligibility,
	label: 'asset eligibility',
	labelPlural: 'asset eligibilities',
	selectors: [
		{
			name: AssetEligibilitySelector.AssetInstanceAccountTimestampMsSource,
			fields: [
				'$assetInstance',
				'$account',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$assetInstance',
				label: 'asset instance',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AssetInstance,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Account,
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
				name: 'ledgerCoordinateKind',
				label: 'ledger coordinate kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'ledgerCoordinateValue',
				label: 'ledger coordinate value',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'canHold',
				label: 'can hold',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'canSend',
				label: 'can send',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'canReceive',
				label: 'can receive',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'reasons',
				label: 'reasons',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
