import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum FarcasterFeedSelector {
	Variant = 'variant',
	ByUser = 'byUser',
	VariantFid = 'variant+fid',
	ByChannel = 'byChannel',
	VariantChannelId = 'variant+channelId',
	Following = 'following',
	VariantViewerFid = 'variant+viewerFid',
}
export default {
	entityType: EntityType.FarcasterFeed,
	label: 'Farcaster feed',
	labelPlural: 'Farcaster feeds',
	selectors: [
		{
			name: FarcasterFeedSelector.Variant,
			fields: [
				'variant',
			],
		},
		{
			name: FarcasterFeedSelector.ByUser,
			fields: [
				'variant',
				'fid',
			],
		},
		{
			name: FarcasterFeedSelector.ByChannel,
			fields: [
				'variant',
				'channelId',
			],
		},
		{
			name: FarcasterFeedSelector.Following,
			fields: [
				'variant',
				'viewerFid',
			],
		},
	],
	fields: [
		{
			name: 'variant',
			label: 'variant',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fid',
			label: 'FID',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'channelId',
			label: 'channel ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'viewerFid',
			label: 'viewer FID',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$entries',
			label: 'entries',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
