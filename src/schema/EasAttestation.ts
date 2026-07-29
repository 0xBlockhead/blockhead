// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	uid: {
		label: 'UID',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$schema: {
		label: 'Schema',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EasSchema,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	schemaUid: {
		label: 'Schema UID',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	recipient: {
		label: 'Recipient',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$recipientAccount: {
		label: 'Recipient account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	attester: {
		label: 'Attester',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$attesterAccount: {
		label: 'Attester account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	refUid: {
		label: 'Ref UID',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$refAttestation: {
		label: 'Ref attestation',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EasAttestation,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	attestedAt: {
		label: 'Attested at',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expirationTime: {
		label: 'Expiration time',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revocable: {
		label: 'Revocable',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	data: {
		label: 'Data',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Timestamps',
		type: EntityFieldType.EntitiesReference,
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
