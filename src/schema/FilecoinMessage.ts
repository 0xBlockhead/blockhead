// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const filfoxRestSources = [
	Source.Filfox_Rest,
] as const

export default entity({
	entityType: EntityType.FilecoinMessage,
	labels: {
		singular: 'filecoin message',
		plural: 'filecoin messages',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	cid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: filfoxRestSources,
	},
	$to: {
		entityType: EntityType.FilecoinActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: filfoxRestSources,
	},
	method: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: filfoxRestSources,
	},
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: filfoxRestSources,
	},
	valueAttoFil: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: filfoxRestSources,
	},
	gasLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: filfoxRestSources,
	},
})({
	selectors: {
		NetworkCid: [
			'$network',
			'cid',
		],
	},
})
