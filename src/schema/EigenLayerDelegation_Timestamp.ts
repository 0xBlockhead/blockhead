import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EigenLayerDelegation_TimestampSelector {
	StakerOperatorStrategyTimestampMsSource = '$staker+$operator+$strategy+timestampMs+source',
}
export default {
	entityType: EntityType.EigenLayerDelegation_Timestamp,
	label: 'eigen layer delegation timestamp',
	labelPlural: 'eigen layer delegation observations',
	selectors: [
		{
			name: EigenLayerDelegation_TimestampSelector.StakerOperatorStrategyTimestampMsSource,
			fields: [
				'$staker',
				'$operator',
				'$strategy',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$staker',
			label: 'staker',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetworkAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$operator',
			label: 'operator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EigenLayerOperator,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$strategy',
			label: 'strategy',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EigenLayerStrategy,
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
			name: 'delegatedShares',
			label: 'delegated shares',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'underlyingTokenAmount',
			label: 'underlying token amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'depositRoot',
			label: 'deposit root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'withdrawalRoot',
			label: 'withdrawal root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'withdrawalQueued',
			label: 'withdrawal queued',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'withdrawalCompleted',
			label: 'withdrawal completed',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
