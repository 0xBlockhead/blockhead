// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpCertifiedState,
	labels: {
		singular: 'icp certified state',
		plural: 'icp certified states',
	},
})({
	$canister: {
		label: 'canister',
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.One,
	},
	certificateHash: {
		label: 'certificate hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	pathHash: {
		label: 'path hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	treeHash: {
		label: 'tree hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	certifiedAtMs: {
		label: 'certified AT ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subnetSignature: {
		label: 'subnet signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	witness: {
		label: 'witness',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationStatus: {
		label: 'verification status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CanisterCertificateHashPathHash: [
			'$canister',
			'certificateHash',
			'pathHash',
		],
	},
})
