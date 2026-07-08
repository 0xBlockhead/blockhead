// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EasSchemaSelector {
	NetworkSchemaUid = 'NetworkSchemaUid',
}
export const EasSchema = entity({
	entityType: EntityType.EasSchema,
	label: 'EAS schema',
	labelPlural: 'EAS schemas',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	schemaUid: {
		label: 'Schema UID',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.One,
	},
	schema: {
		label: 'Schema',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	resolver: {
		label: 'Resolver',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$resolverContract: {
		label: 'Resolver contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revocable: {
		label: 'Revocable',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registerer: {
		label: 'Registerer',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$registererAccount: {
		label: 'Registerer account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registeredAt: {
		label: 'Registered at',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registeredTransactionHash: {
		label: 'Registered transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registeredLogIndex: {
		label: 'Registered log index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$attestations: {
		label: 'Attestations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EasAttestation,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkSchemaUid: [
			'$network',
			'schemaUid',
		],
	},
})
