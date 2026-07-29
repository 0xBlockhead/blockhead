// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TronContract_Timestamp,
	labels: {
		singular: 'tron contract timestamp',
		plural: 'tron contract observations',
	},
})({
	$contract: {
		label: 'Contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TronContract,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	compiler: {
		label: 'Compiler',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	verifyStatus: {
		label: 'Verify status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	isProxy: {
		label: 'Proxy',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	$implementation: {
		label: 'Implementation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TronContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
})({
	selectors: {
		ContractTimestampMsSource: [
			'$contract',
			'timestampMs',
			'source',
		],
	},
})
