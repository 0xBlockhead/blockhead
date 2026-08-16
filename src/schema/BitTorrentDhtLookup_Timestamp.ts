// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitTorrentDhtLookup_Timestamp,
	labels: {
		singular: 'mainline DHT lookup',
		plural: 'mainline DHT lookups',
	},
	description: 'A source-scoped one-shot BEP 5 get_peers observation for a v1 torrent infohash. It is not a recursive Kademlia walk and not a durable local routing table.',
})({
	$torrent: {
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	queriedNodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitTorrent,
		],
	},
	responsiveNodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitTorrent,
		],
	},
	peerCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitTorrent,
		],
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitTorrent,
		],
	},
	$$closestNodes: {
		entityType: EntityType.BitTorrentDhtNode_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.BitTorrent,
		],
	},
})({
	selectors: {
		TorrentTimestampMsSource: [
			'$torrent',
			'timestampMs',
			'source',
		],
	},
})
