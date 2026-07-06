// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum SwarmProtocolSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType.SwarmProtocol,
	label: 'Swarm protocol',
	labelPlural: 'Swarm protocols',
	selectors: [
		{
			name: SwarmProtocolSelector.Scope,
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
			primitiveType: type.unit('SwarmProtocol'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocolName',
			label: 'Protocol name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'homeUrl',
			label: 'Home URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'docsUrl',
			label: 'Docs URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registryName',
			label: 'Registry name name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'relationshipModel',
			label: 'Relationship model',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
