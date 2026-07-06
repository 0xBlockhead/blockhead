// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum NostrNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType.NostrNetwork,
	label: 'Nostr network',
	labelPlural: 'Nostr networks',
	description: 'Compatibility protocol row for the Nostr network concept. The product-backed observed is modeled by _GlobalNostrNetwork.',
	selectors: [
		{
			name: NostrNetworkSelector.Scope,
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
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocolName',
			label: 'protocol name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'homeUrl',
			label: 'home URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'docsUrl',
			label: 'docs URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registryName',
			label: 'registry name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'relationshipModel',
			label: 'relationshipModel',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
