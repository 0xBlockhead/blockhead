import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosAccountSelector {
	NetworkAddress = 'networkAddress',
}
export default {
	entityType: EntityType.CosmosAccount,
	label: 'Cosmos account',
	labelPlural: 'Cosmos accounts',
	selectors: [
		{
			name: CosmosAccountSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
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
			name: 'address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$balances',
			label: 'balances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosAccountBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$delegations',
			label: 'delegations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosDelegation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
