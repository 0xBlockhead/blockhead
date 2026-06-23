import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalActivityPubNetworkSelector {
	Scope = 'scope',
}
export default {
	entityType: EntityType._GlobalActivityPubNetwork,
	label: 'global activity pub network',
	labelPlural: 'global activity pub networks',
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
			primitiveType: type("'_GlobalActivityPubNetwork'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowActors',
			label: 'source window actors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubActor,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowNotes',
			label: 'source window notes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalActivityPubNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
