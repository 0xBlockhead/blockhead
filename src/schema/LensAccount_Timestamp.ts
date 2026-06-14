import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import LensAccount from '$/schema/LensAccount.ts'
import { Source } from '$/sources/Source.ts'

export enum LensAccount_TimestampSelector {
	LensAccountTimestampMs = 'lensAccountTimestampMs',
}

export default {
	entityType: EntityType.LensAccount_Timestamp,

	label: 'Lens account snapshot',
	labelPlural: 'Lens account snapshots',

	selectors: [
		{
			name: LensAccount_TimestampSelector.LensAccountTimestampMs,
			fields: [
				'$account',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LensAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'followerCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
		{
			name: 'followingCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
