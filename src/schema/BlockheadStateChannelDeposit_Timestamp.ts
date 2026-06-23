import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadStateChannelDeposit_TimestampSelector {
	DepositTimestampMsSource = '$deposit+timestampMs+source',
}
export default {
	entityType: EntityType.BlockheadStateChannelDeposit_Timestamp,
	label: 'blockhead state channel deposit timestamp',
	labelPlural: 'blockhead state channel deposit observations',
	selectors: [
		{
			name: BlockheadStateChannelDeposit_TimestampSelector.DepositTimestampMsSource,
			fields: [
				'$deposit',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$deposit',
			label: 'deposit',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadStateChannelDeposit,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'availableBalance',
			label: 'available balance',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'lockedBalance',
			label: 'locked balance',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
