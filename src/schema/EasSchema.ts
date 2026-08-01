// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EasSchema,
	labels: {
		singular: 'EAS schema',
		plural: 'EAS schemas',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	schemaUid: {
		label: 'Schema UID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	schema: {
		label: 'Schema',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	resolver: {
		label: 'Resolver',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$resolverContract: {
		label: 'Resolver contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revocable: {
		label: 'Revocable',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registerer: {
		label: 'Registerer',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$registererAccount: {
		label: 'Registerer account',
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registeredAt: {
		label: 'Registered at',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registeredTransactionHash: {
		label: 'Registered transaction hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registeredLogIndex: {
		label: 'Registered log index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$attestations: {
		label: 'Attestations',
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
