import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum LensAccount_TimestampSelector {
	LensAccountTimestampMs = 'lensAccountTimestampMs',
	AccountTimestampMs = '$account+timestampMs',
}
export default {
	entityType: EntityType.LensAccount_Timestamp,
	label: 'lens account timestamp',
	labelPlural: 'lens account observations',
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
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LensAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'followerCount',
			label: 'follower count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followingCount',
			label: 'following count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
