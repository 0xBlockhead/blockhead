// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum Eip8004AgentRegistrationFileSelector {
	RegistrationFileUrl = 'RegistrationFileUrl',
}
export const Eip8004AgentRegistrationFile = entity({
	entityType: EntityType.Eip8004AgentRegistrationFile,
	labels: {
		singular: 'EIP-8004 agent registration file',
		plural: 'EIP-8004 agent registration files',
	},
})({
	$registration: {
		label: 'Registration',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Eip8004AgentRegistration,
		cardinality: EntityFieldCardinality.One,
	},
	fileUrl: {
		label: 'File URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		RegistrationFileUrl: [
			'$registration',
			'fileUrl',
		],
	},
})
