import { type } from 'arktype'
import { NetworkStackId } from '$/constants/NetworkStack.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default {
	entityType: EntityType.NetworkStack,

	label: 'Network stack',
	labelPlural: 'Network stacks',

	id: type({
		networkStackId: type.valueOf(NetworkStackId),
	}),

	fields: [
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
