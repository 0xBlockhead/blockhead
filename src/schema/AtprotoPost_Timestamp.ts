import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import AtprotoPost from '$/schema/AtprotoPost.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.AtprotoPost_Timestamp,

	label: 'AT Protocol post snapshot',
	labelPlural: 'AT Protocol post snapshots',

	id: type({
		$post: AtprotoPost.id,
		timestampMs: 'number',
	}),

	fields: [
		{
			name: 'likeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
		},
		{
			name: 'repostCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
		},
		{
			name: 'replyCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
		},
		{
			name: 'quoteCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
