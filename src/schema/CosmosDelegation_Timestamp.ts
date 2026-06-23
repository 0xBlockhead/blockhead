import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosDelegation_TimestampSelector {
	DelegationTimestampMsSource = '$delegation+timestampMs+source',
}
export default {
	entityType: EntityType.CosmosDelegation_Timestamp,
	label: 'Cosmos delegation timestamp',
	labelPlural: 'Cosmos delegation observations',
	selectors: [
		{
			name: CosmosDelegation_TimestampSelector.DelegationTimestampMsSource,
			fields: [
				'$delegation',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$delegation',
			label: 'delegation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosDelegation,
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
			name: 'shares',
			label: 'shares',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'balanceAmount',
			label: 'balance amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'balanceDenom',
			label: 'balance denom',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rewardAmount',
			label: 'reward amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rewardDenom',
			label: 'reward denom',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
