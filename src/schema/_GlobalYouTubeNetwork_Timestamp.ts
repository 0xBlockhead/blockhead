// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalYoutubeNetwork_TimestampSelector {
	HubTimestampMsSource = 'HubTimestampMsSource',
}
export default {
	entityType: EntityType._GlobalYoutubeNetwork_Timestamp,
	label: 'YouTube hub observation',
	labelPlural: 'YouTube hub observations',
	selectors: [
		{
			name: _GlobalYoutubeNetwork_TimestampSelector.HubTimestampMsSource,
			fields: [
				'$hub',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$hub',
			label: 'Hub',
			type: EntityFieldType.EntityReference,
			entityType: EntityType._GlobalYoutubeNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sourceWindowChannelCount',
			label: 'Source-window channels',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceWindowVideoCount',
			label: 'Source-window videos',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceWindowPlaylistCount',
			label: 'Source-window playlists',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'localCatalogChannelCount',
			label: 'Local catalog channels',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'localCatalogVideoCount',
			label: 'Local catalog videos',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'localCatalogPlaylistCount',
			label: 'Local catalog playlists',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reachable',
			label: 'Reachable',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quotaRemaining',
			label: 'Quota remaining',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'searchWindowStartMs',
			label: 'Search window start',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'searchWindowEndMs',
			label: 'Search window end',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
