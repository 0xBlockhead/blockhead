import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BitTorrentDhtLookup_TimestampSelector {
	InfoHashObserverKeyTimestampMs = 'infoHash+observerKey+timestampMs',
}
export default {
	entityType: EntityType.BitTorrentDhtLookup_Timestamp,
	label: 'bit torrent DHT lookup timestamp',
	labelPlural: 'bit torrent DHT lookup observations',
	selectors: [
		{
			name: BitTorrentDhtLookup_TimestampSelector.InfoHashObserverKeyTimestampMs,
			fields: [
				'infoHash',
				'observerKey',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: 'infoHash',
			label: 'info hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'observerKey',
			label: 'observer key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: 'queriedNodeCount',
			label: 'queried node count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'responsiveNodeCount',
			label: 'responsive node count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'peerCount',
			label: 'peer count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'closestNodeIds',
			label: 'closest node ids',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
