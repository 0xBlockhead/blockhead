import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EnsReverseRecordSelector {
	AccountName = '$account+$name',
}
export default {
	entityType: EntityType.EnsReverseRecord,
	label: 'ENS reverse record',
	labelPlural: 'ENS reverse records',
	selectors: [
		{
			name: EnsReverseRecordSelector.AccountName,
			fields: [
				'$account',
				'$name',
			],
		},
	],
	fields: [
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Account,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EnsReverseRecord_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
