import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.BeaconSlashing,

	label: 'Beacon slashing',
	labelPlural: 'Beacon slashings',

	id: type({
		$network: Network.id,
		slot: 'number',
		kind: type('"attester" | "proposer"'),
		index: 'number',
	}),

	fields: [
		{
			name: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('"attester" | "proposer"'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
