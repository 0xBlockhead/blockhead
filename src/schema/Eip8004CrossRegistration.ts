// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Eip8004AgentRegistrationFile,
		cardinality: EntityFieldCardinality.One,
	},
	targetKind: {
		label: 'Target kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetSelectorHashAlgorithm: {
		label: 'Target selector hash algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetSelectorHash: {
		label: 'Target selector hash',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	targetSelector: {
		label: 'Target selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceUri: {
		label: 'Evidence URI',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		label: 'Signature',
		type: EntityFieldType.Primitive,
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
