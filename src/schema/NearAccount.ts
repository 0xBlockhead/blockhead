import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum NearAccountSelector {
	NetworkAccountId = 'networkAccountId',
}

export default {
	entityType: EntityType.NearAccount,

	label: 'NEAR Account',
	labelPlural: 'NEAR Accounts',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'accountId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'amountYoctoNear',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'storageUsageBytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$accessKeys',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearAccessKey,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
