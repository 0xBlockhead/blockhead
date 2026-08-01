// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default entity({
	entityType: EntityType.TezosNetwork,
	labels: {
		singular: 'tezos network',
		plural: 'tezos networks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$blocks: {
		entityType: EntityType.TezosBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operationGroups: {
		entityType: EntityType.TezosOperationGroup,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operations: {
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		entityType: EntityType.TezosAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contracts: {
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bakers: {
		entityType: EntityType.TezosBaker,
		cardinality: EntityFieldCardinality.Many,
	},
	$$cycles: {
		entityType: EntityType.TezosCycle,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bakingRights: {
		entityType: EntityType.TezosBakingRight,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokens: {
		entityType: EntityType.TezosToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMaps: {
		entityType: EntityType.TezosBigMap,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMapKeys: {
		entityType: EntityType.TezosBigMapKey,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMapTimestamps: {
		entityType: EntityType.TezosBigMap_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMapKeyTimestamps: {
		entityType: EntityType.TezosBigMapKey_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenTransfers: {
		entityType: EntityType.TezosTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
