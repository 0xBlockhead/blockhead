import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum HederaAccountSelector {
	NetworkAccountId = '$network+accountId',
}
export default {
	entityType: EntityType.HederaAccount,
	label: 'hedera account',
	labelPlural: 'hedera accounts',
	selectors: [
		{
			name: HederaAccountSelector.NetworkAccountId,
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
			entityType: EntityType.HederaNetwork,
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
			name: '$$allowances',
			label: 'allowances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaAllowance,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokens',
			label: 'tokens',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaTokenAssociation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$nfts',
			label: 'nfts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaNft,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
