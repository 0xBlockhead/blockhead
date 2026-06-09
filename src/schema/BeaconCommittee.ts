import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.BeaconCommittee,

	label: 'Beacon committee',
	labelPlural: 'Beacon committees',

	id: type({
		$network: Network.id,
		slot: 'number',
		index: 'number',
	}),

	fields: [
		{
			name: 'validatorIndices',
			type: EntityFieldType.Primitive,
			primitiveType: type('number[]'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
