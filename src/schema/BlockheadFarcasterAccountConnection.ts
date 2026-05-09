import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export enum BlockheadFarcasterConnectionAuthMethod {
	Custody = 'custody',
	AuthAddress = 'authAddress',
}

export default {
	entityType: EntityType.BlockheadFarcasterAccountConnection,

	label: 'Farcaster Account Connection',
	labelPlural: 'Farcaster Account Connections',

	id: type({
		fid: 'number',
	}),

	fields: [
		{
			name: 'username',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'displayName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		},
		{
			name: 'bio',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifications',
			type: EntityFieldType.Primitive,
			primitiveType: type('string[]'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'custody',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'authMethod',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BlockheadFarcasterConnectionAuthMethod),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'signedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
