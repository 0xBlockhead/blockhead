import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.AtprotoPost,

	label: 'AT Protocol post',
	labelPlural: 'AT Protocol posts',

	id: type({
		uri: 'string',
	}),

	fields: [
		{
			name: '$author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$root',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
