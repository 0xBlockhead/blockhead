import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TonContractSelector {
	Account = '$account',
}
export default {
	entityType: EntityType.TonContract,
	label: 'ton contract',
	labelPlural: 'ton contracts',
	selectors: [
		{
			name: TonContractSelector.Account,
			fields: [
				'$account',
			],
		},
	],
	fields: [
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TonAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonContract_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$getMethods',
			label: 'get methods',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TonContractGetMethod,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
