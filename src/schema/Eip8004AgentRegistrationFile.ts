// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum Eip8004AgentRegistrationFileSelector {
	RegistrationFileUrl = 'RegistrationFileUrl',
}
export default {
	entityType: EntityType.Eip8004AgentRegistrationFile,
	label: 'EIP-8004 agent registration file',
	labelPlural: 'EIP-8004 agent registration files',
	selectors: [
		{
			name: Eip8004AgentRegistrationFileSelector.RegistrationFileUrl,
			fields: [
				'$registration',
				'fileUrl',
			],
		},
	],
	fields: [
		{
			name: '$registration',
			label: 'Registration',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Eip8004AgentRegistration,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fileUrl',
			label: 'File URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
