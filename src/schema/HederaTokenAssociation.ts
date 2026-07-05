// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaTokenAssociationSelector {
	AccountToken = 'AccountToken',
}
export default {
	entityType: EntityType.HederaTokenAssociation,
	label: 'hedera token association',
	labelPlural: 'hedera token associations',
	selectors: [
		{
			name: HederaTokenAssociationSelector.AccountToken,
			fields: [
				'$account',
				'$token',
			],
		},
	],
	fields: [
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$token',
				label: 'token',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HederaToken,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HederaTokenAssociation_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
