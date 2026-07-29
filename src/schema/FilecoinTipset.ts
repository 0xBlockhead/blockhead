// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FilecoinTipset,
	labels: {
		singular: 'filecoin tipset',
		plural: 'filecoin tipsets',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	height: {
		label: 'Height',
		description: 'The block height.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	tipsetKey: {
		label: 'Tipset key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parent: {
		label: 'Parent',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	},
	parentWeight: {
		label: 'Parent weight',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
		],
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	},
	$$blocks: {
		label: 'Blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FilecoinBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	},
})({
	selectors: {
		NetworkHeightTipsetKey: [
			'$network',
			'height',
			'tipsetKey',
		],
	},
})
