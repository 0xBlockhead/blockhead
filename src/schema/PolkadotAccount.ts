import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum PolkadotAccountSelector {
	NetworkAccountId = 'networkAccountId',
}
export default {
	entityType: EntityType.PolkadotAccount,
	label: 'polkadot account',
	labelPlural: 'polkadot accounts',
	selectors: [
		{
			name: PolkadotAccountSelector.NetworkAccountId,
			fields: [
				'$network',
				'accountId',
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
			name: 'accountId',
			label: 'account ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$assetBalanceTimestamps',
			label: 'asset balance timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotAssetBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
