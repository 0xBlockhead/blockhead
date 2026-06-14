import { type } from 'arktype'
import { ConsensusMechanismId } from '$/constants/ConsensusMechanism.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum ConsensusMechanismSelector {
	ConsensusMechanismId = 'consensusMechanismId',
}

export default {
	entityType: EntityType.ConsensusMechanism,

	label: 'Consensus mechanism',
	labelPlural: 'Consensus mechanisms',

	selectors: [
		{
			name: ConsensusMechanismSelector.ConsensusMechanismId,
			fields: [
				'consensusMechanismId',
			],
		},
	],

	fields: [
		{
			name: 'consensusMechanismId',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ConsensusMechanismId),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
