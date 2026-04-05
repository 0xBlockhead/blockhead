import { type } from 'arktype'
import FarcasterCast from '$/schema/FarcasterCast.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.FarcasterCastEmbed,

	label: 'Farcaster Cast Embed',

	id: type({
		$cast: FarcasterCast.id,
		index: 'number',
	}),

	fields: [
		{
			name: 'url',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
