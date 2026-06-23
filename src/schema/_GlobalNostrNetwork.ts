import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalNostrNetworkSelector {
	Scope = 'scope',
}
export default {
	entityType: EntityType._GlobalNostrNetwork,
	label: 'global Nostr network',
	labelPlural: 'global Nostr networks',
	selectors: [
		{
			name: _GlobalNostrNetworkSelector.Scope,
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
			primitiveType: type("'_GlobalNostrNetwork'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowProfiles',
			label: 'source window profiles',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrProfile,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowNotes',
			label: 'source window notes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowRelays',
			label: 'source window relays',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrRelay,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowReposts',
			label: 'source window reposts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrRepost,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowArticles',
			label: 'source window articles',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrArticle,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalNostrNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
