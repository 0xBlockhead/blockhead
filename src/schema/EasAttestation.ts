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
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	uid: {
		label: 'UID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$schema: {
		label: 'Schema',
		entityType: EntityType.EasSchema,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	schemaUid: {
		label: 'Schema UID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	recipient: {
		label: 'Recipient',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$recipientAccount: {
		label: 'Recipient account',
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	attester: {
		label: 'Attester',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$attesterAccount: {
		label: 'Attester account',
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	refUid: {
		label: 'Ref UID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$refAttestation: {
		label: 'Ref attestation',
		entityType: EntityType.EasAttestation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	attestedAt: {
		label: 'Attested at',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expirationTime: {
		label: 'Expiration time',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revocable: {
		label: 'Revocable',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		label: 'Data',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
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
