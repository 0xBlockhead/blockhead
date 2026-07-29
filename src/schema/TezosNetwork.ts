// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operationGroups: {
		label: 'operation groups',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosOperationGroup,
		cardinality: EntityFieldCardinality.Many,
	},
	$$operations: {
		label: 'operations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosOperation,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		label: 'accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$contracts: {
		label: 'contracts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosContract,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bakers: {
		label: 'bakers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBaker,
		cardinality: EntityFieldCardinality.Many,
	},
	$$cycles: {
		label: 'cycles',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosCycle,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bakingRights: {
		label: 'baking rights',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBakingRight,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokens: {
		label: 'tokens',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMaps: {
		label: 'big maps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBigMap,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMapKeys: {
		label: 'big map keys',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBigMapKey,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMapTimestamps: {
		label: 'big map timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBigMap_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bigMapKeyTimestamps: {
		label: 'big map key timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosBigMapKey_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokenTransfers: {
		label: 'token transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TezosTokenTransfer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
