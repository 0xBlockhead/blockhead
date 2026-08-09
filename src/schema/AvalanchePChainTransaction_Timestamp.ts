// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AvalanchePChainTransaction_Timestamp,
	labels: {
		singular: 'avalanche p chain transaction timestamp',
		plural: 'avalanche p chain transaction observations',
	},
})({
	$transaction: {
		entityType: EntityType.AvalanchePChainTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	blockHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalanchePlatformVm_JsonRpc,
		],
	},
	blockId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionTimestampMsSource: [
			'$transaction',
			'timestampMs',
			'source',
		],
	},
})
