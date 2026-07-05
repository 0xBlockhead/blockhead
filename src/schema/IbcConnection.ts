// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IbcConnectionSelector {
	NetworkConnectionId = 'NetworkConnectionId',
}
export default {
	entityType: EntityType.IbcConnection,
	label: 'IBC connection',
	labelPlural: 'IBC connections',
	selectors: [
		{
			name: IbcConnectionSelector.NetworkConnectionId,
			fields: [
				'$network',
				'connectionId',
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
				name: 'connectionId',
				label: 'Connection ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'clientId',
				label: 'Client ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$client',
				label: 'Client',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.IbcClient,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'counterpartyClientId',
				label: 'Counterparty client ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'counterpartyConnectionId',
				label: 'Counterparty connection ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'state',
				label: 'State',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'delayPeriodNs',
				label: 'Delay period ns',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
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
