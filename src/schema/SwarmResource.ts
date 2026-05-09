import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.SwarmResource,

	label: 'Swarm Resource',
	labelPlural: 'Swarm Resources',

	id: type({
		reference: 'string',
		contentPath: 'string',
	}),

	fields: [
		{
			name: 'canonicalUri',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Swarm_Rest,
			],
		},
		{
			name: 'gatewayOrigin',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Swarm_Rest,
			],
		},
		{
			name: 'gatewayUrl',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Swarm_Rest,
			],
		},
		{
			name: 'fileName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Swarm_Rest,
			],
		},
		{
			name: 'extension',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Swarm_Rest,
			],
		},
		{
			name: 'contentType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Swarm_Rest,
			],
		},
		{
			name: 'contentLength',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Swarm_Rest,
			],
		},
		{
			name: 'displayType',
			type: EntityFieldType.Primitive,
			primitiveType: type('"text" | "image" | "video" | "audio" | "json" | "xml" | "pdf" | "iframe" | "binary"'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Swarm_Rest,
			],
		},
		{
			name: 'isContentTypeInferred',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Swarm_Rest,
			],
		},
		{
			name: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Swarm_Rest,
			],
		},
		{
			name: '$media',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Swarm_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
