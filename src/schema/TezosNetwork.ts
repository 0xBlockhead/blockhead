// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TezosNetwork,
	labels: {
		singular: 'tezos network',
		plural: 'tezos networks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$blocks: {
		label: 'blocks',
		entityType: EntityType.TezosBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operationGroups: {
		label: 'operation groups',
		entityType: EntityType.TezosOperationGroup,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operations: {
		label: 'operations',
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		label: 'accounts',
		entityType: EntityType.TezosAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contracts: {
		label: 'contracts',
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bakers: {
		label: 'bakers',
		entityType: EntityType.TezosBaker,
		cardinality: EntityFieldCardinality.Many,
	},
	$$cycles: {
		label: 'cycles',
		entityType: EntityType.TezosCycle,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bakingRights: {
		label: 'baking rights',
		entityType: EntityType.TezosBakingRight,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokens: {
		label: 'tokens',
		entityType: EntityType.TezosToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMaps: {
		label: 'big maps',
		entityType: EntityType.TezosBigMap,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMapKeys: {
		label: 'big map keys',
		entityType: EntityType.TezosBigMapKey,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMapTimestamps: {
		label: 'big map timestamps',
		entityType: EntityType.TezosBigMap_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMapKeyTimestamps: {
		label: 'big map key timestamps',
		entityType: EntityType.TezosBigMapKey_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenTransfers: {
		label: 'token transfers',
		entityType: EntityType.TezosTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.TezosNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
