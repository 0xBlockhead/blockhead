// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalActivityPubNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType._GlobalActivityPubNetwork,
	label: 'global ActivityPub network',
	labelPlural: 'global ActivityPub networks',
	selectors: [
		{
			name: _GlobalActivityPubNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
				name: 'scope',
				label: 'Scope',
				description: 'The fixed scope value that identifies this hub row.',
				type: EntityFieldType.Primitive,
				primitiveType: type.unit('_GlobalActivityPubNetwork'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$sourceWindowActors',
				label: 'Source-window actors',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ActivityPubActor,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$sourceWindowNotes',
				label: 'Source-window notes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ActivityPubNote,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'Timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType._GlobalActivityPubNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
