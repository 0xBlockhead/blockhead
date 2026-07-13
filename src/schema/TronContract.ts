// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronContractSelector {
	NetworkAddress = 'NetworkAddress',
}
export const TronContract = entity({
	entityType: EntityType.TronContract,
	labels: {
		singular: 'tron contract',
		plural: 'tron contracts',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'Account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronGrid_Rest,
			Source.TronScan_Rest,
		],
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	$creator: {
		label: 'Creator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TronAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	$creationTransaction: {
		label: 'Creation transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.TronTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TronContract_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
	$$tokens: {
		label: 'Tokens',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.TronToken,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.TronScan_Rest,
		],
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})
