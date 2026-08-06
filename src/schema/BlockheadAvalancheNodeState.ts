// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAvalancheNodeState,
	labels: {
		singular: 'blockhead avalanche node state',
		plural: 'blockhead avalanche node states',
	},
})({
	nodeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	nodeIp: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nodePopPublicKey: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	nodePopProofOfPossession: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
	$$timestamps: {
		entityType: EntityType.BlockheadAvalancheNodeState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.AvalancheInfo_JsonRpc,
		],
	},
})({
	selectors: {
		NodeId: [
			'nodeId',
		],
	},
})
