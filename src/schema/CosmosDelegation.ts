import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosDelegationSelector {
	DelegatorValidator = '$delegator+$validator',
}
export default {
	entityType: EntityType.CosmosDelegation,
	label: 'Cosmos delegation',
	labelPlural: 'Cosmos delegations',
	selectors: [
		{
			name: CosmosDelegationSelector.DelegatorValidator,
			fields: [
				'$delegator',
				'$validator',
			],
		},
	],
	fields: [
		{
			name: '$delegator',
			label: 'delegator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$validator',
			label: 'validator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosValidator,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosDelegation_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
