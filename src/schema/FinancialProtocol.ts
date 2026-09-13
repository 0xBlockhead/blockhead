// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FinancialProtocol,
	labels: {
		singular: 'financial protocol',
		plural: 'financial protocols',
	},
	description: 'A financial protocol operating on a network, independent of the service indexing it.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	protocolKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$ammBlocks: {
		entityType: EntityType.FinancialProtocol_Amm_EvmBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$liquidityPools: {
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkProtocolKey: [
			'$network',
			'protocolKey',
		],
	},
})
