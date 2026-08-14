// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLightningPeer_Timestamp,
	labels: {
		singular: 'local LND peer observation',
		plural: 'local LND peer observations',
	},
	description: 'A timestamped peer snapshot from the configured local LND node\'s listPeers response; it is private node state, not a public graph observation.',
})({
	$peer: {
		entityType: EntityType.BlockheadLightningPeer,
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
			Source.LightningLnd_Rest,
		],
	},
	bytesSent: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	bytesRecv: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	satsSent: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	satsRecv: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	inbound: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
	pingTimeMicros: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.LightningLnd_Rest,
		],
	},
})({
	selectors: {
		PeerTimestampMsSource: [
			'$peer',
			'timestampMs',
			'source',
		],
	},
})
