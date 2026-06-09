import { type } from 'arktype'

import { ActionType } from '$/constants/actions.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const action = type({
	type: type.valueOf(ActionType),
	params: 'object',
})

export default {
	entityType: EntityType.BlockheadSessionAction,

	label: 'Session action',
	labelPlural: 'Session actions',

	id: type({
		sessionId: 'string',
		actionId: 'string',
	}),

	fields: [
		{
			name: '$session',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadSession,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'indexInSequence',
			type: EntityFieldType.Primitive,
			primitiveType: type('number.integer'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'action',
			type: EntityFieldType.Primitive,
			primitiveType: action,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'updatedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
