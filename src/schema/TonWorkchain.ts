// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TonWorkchain,
	labels: {
		singular: 'ton workchain',
		plural: 'ton workchains',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	workchain: {
		label: 'workchain',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	addressFormat: {
		label: 'address format',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionFormat: {
		label: 'transaction format',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	virtualMachine: {
		label: 'virtual machine',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$shards: {
		label: 'shards',
		entityType: EntityType.TonShard_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$blocks: {
		label: 'blocks',
		entityType: EntityType.TonBlock,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkWorkchain: [
			'$network',
			'workchain',
		],
	},
})
