import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum IbcConnectionSelector {
	NetworkConnectionId = '$network+connectionId',
}
export default {
	entityType: EntityType.IbcConnection,
	label: 'ibc connection',
	labelPlural: 'ibc connections',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'connectionId',
			label: 'connection ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'clientId',
			label: 'client ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$client',
			label: 'client',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IbcClient,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'counterpartyClientId',
			label: 'counterparty client ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'counterpartyConnectionId',
			label: 'counterparty connection ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'state',
			label: 'state',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'delayPeriodNs',
			label: 'delay period ns',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
