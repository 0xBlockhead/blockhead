// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Eip8004CrossRegistration,
	labels: {
		singular: 'EIP-8004 cross registration',
		plural: 'EIP-8004 cross registrations',
	},
})({
	$registrationFile: {
		entityType: EntityType.Eip8004AgentRegistrationFile,
		cardinality: EntityFieldCardinality.One,
	},
	targetKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetSelectorHashAlgorithm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetSelectorHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	targetSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceUri: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RegistrationFileTargetKindTargetSelectorHashAlgorithmTargetSelectorHash: [
			'$registrationFile',
			'targetKind',
			'targetSelectorHashAlgorithm',
			'targetSelectorHash',
		],
	},
})
