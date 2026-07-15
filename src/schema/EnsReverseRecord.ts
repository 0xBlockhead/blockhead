// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EnsReverseRecordSelector {
	AccountName = 'AccountName',
}
export const EnsReverseRecord = entity({
	entityType: EntityType.EnsReverseRecord,
	labels: {
		singular: 'ENS reverse record',
		plural: 'ENS reverse records',
	},
})({
	$account: {
		label: 'Account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.One,
	},
	$name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EnsName,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'Timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EnsReverseRecord_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AccountName: [
			'$account',
			'$name',
		],
	},
})
