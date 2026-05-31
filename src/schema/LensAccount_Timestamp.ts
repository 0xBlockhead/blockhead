import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import LensAccount from '$/schema/LensAccount.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.LensAccount_Timestamp,

	label: 'Lens account snapshot',
	labelPlural: 'Lens account snapshots',

	id: type({
		$account: LensAccount.id,
		timestampMs: 'number',
	}),

	fields: [
		{
			name: 'followerCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
				Source.Hey_Graphql,
			],
		},
		{
			name: 'followingCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
				Source.Hey_Graphql,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
