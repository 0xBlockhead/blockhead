// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinMessageFee,
	labels: {
		singular: 'filecoin message fee',
		plural: 'filecoin message fees',
	},
	description: 'Gas fee breakdown for an executed Filecoin message from Filfox getMessage.fee (Lotus ChainGetMessage alone does not).',
})({
	$message: {
		entityType: EntityType.FilecoinMessage,
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	baseFeeBurn: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	overEstimationBurn: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	minerPenalty: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	minerTip: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
	refund: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
})({
	selectors: {
		MessageSource: [
			'$message',
			'source',
		],
	},
})
