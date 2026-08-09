// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

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
		defaultSources: [
			Source.Tzkt_Rest,
			Source.TezosDappetizer_Postgres,
		],
	},
	$$operationGroups: {
		entityType: EntityType.TezosOperationGroup,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
		],
	},
	$$operations: {
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
		],
	},
	$$accounts: {
		entityType: EntityType.TezosAccount,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
		],
	},
	$$contracts: {
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
			Source.TezosDappetizer_Postgres,
		],
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
		defaultSources: [
			Source.Tzkt_Rest,
			Source.TezosDappetizer_Postgres,
		],
	},
	$$bigMaps: {
		entityType: EntityType.TezosBigMap,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
		],
	},
	$$bigMapKeys: {
		entityType: EntityType.TezosBigMapKey,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
		],
	},
	$$bigMapTimestamps: {
		entityType: EntityType.TezosBigMap_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
		],
	},
	$$bigMapKeyTimestamps: {
		entityType: EntityType.TezosBigMapKey_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
		],
	},
	$$tokenTransfers: {
		entityType: EntityType.TezosTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
			Source.TezosDappetizer_Postgres,
		],
	},
	$$timestamps: {
		entityType: EntityType.TezosNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tzkt_Rest,
		],
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
