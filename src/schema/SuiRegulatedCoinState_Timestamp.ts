// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiRegulatedCoinState_TimestampSelector {
	CoinTypeTimestampMsSource = 'CoinTypeTimestampMsSource',
}
export default {
	entityType: EntityType.SuiRegulatedCoinState_Timestamp,
	label: 'sui regulated coin state timestamp',
	labelPlural: 'sui regulated coin state observations',
	selectors: [
		{
			name: SuiRegulatedCoinState_TimestampSelector.CoinTypeTimestampMsSource,
			fields: [
				'$coinType',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$coinType',
			label: 'coin type',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiCoinType,
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
			name: 'denyCapObjectId',
			label: 'deny cap object ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'denyListObjectId',
			label: 'deny list object ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'globalPause',
			label: 'global pause',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'denyListEpoch',
			label: 'deny list epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deniedAddressCount',
			label: 'denied address count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'authoritySelector',
			label: 'authority selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
