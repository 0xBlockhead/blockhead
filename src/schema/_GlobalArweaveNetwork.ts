// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalArweaveNetwork,
	labels: {
		singular: 'global Arweave network',
		plural: 'global Arweave networks',
	},
})({
	scope: {
		primitiveType: type.unit('_GlobalArweaveNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedNetworks: {
		entityType: EntityType.ArweaveNetwork,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedBlocks: {
		entityType: EntityType.ArweaveBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedTransactions: {
		entityType: EntityType.ArweaveTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedResources: {
		entityType: EntityType.ArweaveResource,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
