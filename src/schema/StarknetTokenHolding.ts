// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default entity({
	entityType: EntityType.StarknetTokenHolding,
	labels: {
		singular: 'starknet token holding',
		plural: 'starknet token holdings',
	},
})({
	$owner: {
		entityType: EntityType.StarknetContract,
		cardinality: EntityFieldCardinality.One,
	},
	$tokenContract: {
		entityType: EntityType.StarknetContract,
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.StarknetTokenHolding_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Starkscan,
		],
	},
})({
	selectors: {
		OwnerTokenContract: [
			'$owner',
			'$tokenContract',
		],
	},
})
