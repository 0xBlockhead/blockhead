import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export type CastHash = `0x${string}`

export default {
	entityType: EntityType.FarcasterCast,

	label: 'Farcaster Cast',

	id: type({
		fid: 'number',
		hash: 'string.hex' as type.cast<CastHash>,
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
