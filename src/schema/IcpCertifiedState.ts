// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpCertifiedStateSelector {
	CanisterCertificateHashPathHash = 'CanisterCertificateHashPathHash',
}
export default {
	entityType: EntityType.IcpCertifiedState,
	label: 'icp certified state',
	labelPlural: 'icp certified states',
	selectors: [
		{
			name: IcpCertifiedStateSelector.CanisterCertificateHashPathHash,
			fields: [
				'$canister',
				'certificateHash',
				'pathHash',
			],
		},
	],
	fields: [
		{
			name: '$canister',
			label: 'canister',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IcpCanister,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'certificateHash',
			label: 'certificate hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pathHash',
			label: 'path hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'treeHash',
			label: 'tree hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'certifiedAtMs',
			label: 'certified AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'subnetSignature',
			label: 'subnet signature',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'witness',
			label: 'witness',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'value',
			label: 'Value',
			description: 'The source-domain value.',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verificationStatus',
			label: 'verification status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
