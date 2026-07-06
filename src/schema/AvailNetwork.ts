// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AvailNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.AvailNetwork,
	label: 'avail network',
	labelPlural: 'avail networks',
	selectors: [
		{
			name: AvailNetworkSelector.Network,
			fields: [
				'$network',
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
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AvailNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AvailBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$appIds',
			label: 'app ids',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AvailAppId,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$dataSubmissions',
			label: 'data submissions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AvailDataSubmission,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
