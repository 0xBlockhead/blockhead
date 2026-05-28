import { type } from 'arktype'
import { ConsensusMechanismId } from '$/constants/ConsensusMechanism.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.ConsensusMechanism,

	label: 'Consensus mechanism',
	labelPlural: 'Consensus mechanisms',

	id: type({
		consensusMechanismId: type.valueOf(ConsensusMechanismId),
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
