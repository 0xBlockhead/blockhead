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
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.One,
	},
	certificateHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	pathHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	treeHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	certifiedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subnetSignature: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	witness: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationStatus: {
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
