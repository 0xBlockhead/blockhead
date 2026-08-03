// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const lotusJsonRpcSources = [
	Source.Lotus_JsonRpc,
] as const

export default entity({
	entityType: EntityType.FilecoinActor_Timestamp,
	labels: {
		singular: 'filecoin actor timestamp',
		plural: 'filecoin actor observations',
	},
})({
	$actor: {
		entityType: EntityType.FilecoinActor,
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
		cardinality: EntityFieldCardinality.One,
		defaultSources: lotusJsonRpcSources,
	},
	idAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	actorCodeCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	nonce: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	balanceAttoFil: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	stateRootCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
})({
	selectors: {
		ActorHeightTipsetKeySource: [
			'$actor',
			'height',
			'tipsetKey',
			'source',
		],
	},
})
