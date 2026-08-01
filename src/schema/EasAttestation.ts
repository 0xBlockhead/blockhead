// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EasAttestation,
	labels: {
		singular: 'EAS attestation',
		plural: 'EAS attestations',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	uid: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$schema: {
		entityType: EntityType.EasSchema,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	schemaUid: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	recipient: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$recipientAccount: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	attester: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$attesterAccount: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	refUid: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$refAttestation: {
		entityType: EntityType.EasAttestation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	attestedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expirationTime: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revocable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.EasAttestation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkUid: [
			'$network',
			'uid',
		],
	},
})
