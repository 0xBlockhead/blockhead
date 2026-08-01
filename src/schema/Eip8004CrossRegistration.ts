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
		label: 'Registration file',
		entityType: EntityType.Eip8004AgentRegistrationFile,
		cardinality: EntityFieldCardinality.One,
	},
	targetKind: {
		label: 'Target kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetSelectorHashAlgorithm: {
		label: 'Target selector hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetSelectorHash: {
		label: 'Target selector hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	targetSelector: {
		label: 'Target selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceUri: {
		label: 'Evidence URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		label: 'Signature',
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
