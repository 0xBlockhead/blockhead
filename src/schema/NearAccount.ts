import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NearAccountSelector {
	NetworkAccountId = 'networkAccountId',
}
export default {
	entityType: EntityType.NearAccount,
	label: 'near account',
	labelPlural: 'near accounts',
	selectors: [
		{
			name: NearAccountSelector.NetworkAccountId,
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
			name: 'amountYoctoNear',
			label: 'amount yocto near',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'storageUsageBytes',
			label: 'storage usage bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$accessKeys',
			label: 'access keys',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearAccessKey,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
