import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Block from '$/schema/PolkadotBlock.ts'

export default {
	entityType: EntityType.PolkadotEvent,

	label: 'Polkadot Event',
	labelPlural: 'Polkadot Events',

	id: type({
		$block: Block.id,
		eventIndex: 'number',
	}),

	fields: [
		{
			name: '$extrinsic',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotExtrinsic,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$pallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotPallet,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'eventName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
