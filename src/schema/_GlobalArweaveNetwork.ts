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
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type.unit('_GlobalArweaveNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedNetworks: {
		label: 'Observed networks',
		entityType: EntityType.ArweaveNetwork,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedBlocks: {
		label: 'Observed blocks',
		entityType: EntityType.ArweaveBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedTransactions: {
		label: 'Observed transactions',
		entityType: EntityType.ArweaveTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedResources: {
		label: 'Observed resources',
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
