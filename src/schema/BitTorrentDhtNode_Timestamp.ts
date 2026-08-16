// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitTorrentDhtNode_Timestamp,
	labels: {
		singular: 'mainline DHT node observation',
		plural: 'mainline DHT node observations',
	},
	description: 'A source-scoped compact-node or bootstrap contact observed during one mainline DHT query. Address and reachability belong to that observation clock, not a stored routing table.',
})({
	nodeId: {
		primitiveType: type('string'),
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
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitTorrent,
		],
	},
	port: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitTorrent,
		],
	},
	reachable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitTorrent,
		],
	},
})({
	selectors: {
		NodeIdTimestampMsSource: [
			'nodeId',
			'timestampMs',
			'source',
		],
	},
})
