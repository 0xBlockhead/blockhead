import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum IbcClientSelector {
	NetworkClientId = '$network+clientId',
}
export default {
	entityType: EntityType.IbcClient,
	label: 'ibc client',
	labelPlural: 'ibc clients',
	selectors: [
		{
			name: IbcClientSelector.NetworkClientId,
			fields: [
				'$network',
				'clientId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'clientId',
			label: 'client ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'clientType',
			label: 'client type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'latestHeight',
			label: 'latest height',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'frozenHeight',
			label: 'frozen height',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'trustLevel',
			label: 'trust level',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'trustingPeriodNs',
			label: 'trusting period ns',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unbondingPeriodNs',
			label: 'unbonding period ns',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxClockDriftNs',
			label: 'max clock drift ns',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'counterpartyChainId',
			label: 'counterparty chain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$counterpartyNetwork',
			label: 'counterparty network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'consensusStates',
			label: 'consensus states',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$connections',
			label: 'connections',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IbcConnection,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$channels',
			label: 'channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IbcChannel,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
