// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ContractInterfaceMember,
	labels: {
		singular: 'contract interface member',
		plural: 'contract interface members',
	},
})({
	interfaceId: {
		label: 'Interface ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	memberKey: {
		label: 'Member key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	memberKind: {
		label: 'Member kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	canonicalSignature: {
		label: 'Canonical signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selector: {
		label: 'Selector',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	topic: {
		label: 'Topic',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inputs: {
		label: 'Inputs',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	outputs: {
		label: 'Outputs',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stateMutability: {
		label: 'State mutability',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		InterfaceIdMemberKey: [
			'interfaceId',
			'memberKey',
		],
	},
})
