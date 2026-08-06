// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinMessageTransfer,
	labels: {
		singular: 'filecoin message transfer',
		plural: 'filecoin message transfers',
	},
	description: 'A native value transfer observed on Filfox message detail (transfers).',
})({
	$message: {
		entityType: EntityType.FilecoinMessage,
		cardinality: EntityFieldCardinality.One,
	},
	index: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	$to: {
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	valueAttoFil: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	transferType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
})({
	selectors: {
		MessageIndex: [
			'$message',
			'index',
		],
	},
})
