// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmContractCompilation,
	labels: {
		singular: 'EVM contract compilation',
		plural: 'EVM contract compilations',
	},
})({
	$contract: {
		label: 'Contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	language: {
		label: 'Language',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	compiler: {
		label: 'Compiler',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	compilerVersion: {
		label: 'Compiler version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fullyQualifiedName: {
		label: 'Fully qualified name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	compilerSettingsJson: {
		label: 'Compiler settings JSON',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storageLayoutJson: {
		label: 'Storage layout JSON',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EvmContract: [
			'$contract',
		],
	},
})
