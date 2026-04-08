import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/$Sources.ts'

export default {
	entityType: EntityType.Actor,

	label: 'Actor',
	labelPlural: 'Actors',

	id: type({
		$network: Network.id,
		address: 'string.hex' as type.cast<`0x${string}`>,
		'interopAddress?': 'string',
	}),

	fields: [
		{
			name: '$primaryName',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Voltaire],
		},
		{
			name: 'avatarUrl',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Voltaire],
		},
		{
			name: '$$coins',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActorCoin,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [Source.Allium],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

