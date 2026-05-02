import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

const id = type.or(
	type({
		variant: type.unit('trending'),
	}),
	type({
		variant: type.unit('byUser'),
		fid: 'number',
	}),
	type({
		variant: type.unit('byChannel'),
		channelId: 'string',
	}),
	type({
		variant: type.unit('following'),
		viewerFid: 'number',
	}),
)

export default {
	entityType: EntityType.FarcasterFeed,

	label: 'Farcaster Feed',
	labelPlural: 'Farcaster Feeds',

	id,

	fields: [
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$entries',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
