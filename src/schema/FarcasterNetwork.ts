import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.FarcasterNetwork,

	label: 'Farcaster Network',

	id: type({
		scope: type.unit('FarcasterNetwork'),
	}),

	fields: [
		{
			name: '$$farcasterChannels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterChannel,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
