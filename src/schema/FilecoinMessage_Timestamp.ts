// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinMessage_Timestamp,
	labels: {
		singular: 'filecoin message timestamp',
		plural: 'filecoin message observations',
	},
	description: 'As-of observation for a Filecoin message (inclusion height / tipset clock). Filfox supplies height, timestamp, and block CIDs; Lotus ChainGetMessage alone does not.',
})({
	$message: {
		entityType: EntityType.FilecoinMessage,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	tipsetKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$tipset: {
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	blockCids: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
})({
	selectors: {
		MessageHeightTipsetKeySource: [
			'$message',
			'height',
			'tipsetKey',
			'source',
		],
	},
})
