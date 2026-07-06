// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IbcClientSelector {
	NetworkClientId = 'NetworkClientId',
}
export default {
	entityType: EntityType.IbcClient,
	label: 'IBC client',
	labelPlural: 'IBC clients',
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
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'clientId',
			label: 'Client ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'clientType',
			label: 'Client type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'latestHeight',
			label: 'Latest height',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'frozenHeight',
			label: 'Frozen height',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'trustLevel',
			label: 'Trust level',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'trustingPeriodNs',
			label: 'Trusting period ns',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unbondingPeriodNs',
			label: 'Unbonding period ns',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxClockDriftNs',
			label: 'Max clock drift ns',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'counterpartyChainId',
			label: 'Counterparty chain ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$counterpartyNetwork',
			label: 'Counterparty network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'consensusStates',
			label: 'Consensus states',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$connections',
			label: 'Connections',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IbcConnection,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$channels',
			label: 'Channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IbcChannel,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
