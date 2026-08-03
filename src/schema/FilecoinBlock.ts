// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const lotusJsonRpcFilfoxRestSources = [
	Source.Lotus_JsonRpc,
	Source.Filfox_Rest,
] as const
const lotusJsonRpcSources = [
	Source.Lotus_JsonRpc,
] as const

export default entity({
	entityType: EntityType.FilecoinBlock,
	labels: {
		singular: 'filecoin block',
		plural: 'filecoin blocks',
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
	$tipset: {
		entityType: EntityType.FilecoinTipset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcFilfoxRestSources,
	},
	$miner: {
		entityType: EntityType.FilecoinMiner,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcFilfoxRestSources,
	},
	ticketVrFProof: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	winCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: lotusJsonRpcSources,
	},
	$$messages: {
		entityType: EntityType.FilecoinMessage,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Filfox_Rest,
		],
	},
})({
	selectors: {
		NetworkCid: [
			'$network',
			'cid',
		],
	},
})
