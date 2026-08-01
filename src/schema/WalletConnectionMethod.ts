// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.WalletConnectionMethod,
	labels: {
		singular: 'wallet connection method',
		plural: 'wallet connection methods',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		label: 'protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	discoveryKind: {
		label: 'discovery kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transportKind: {
		label: 'transport kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	apiSurfaceKind: {
		label: 'API surface kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sessionKind: {
		label: 'session kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authorizationKind: {
		label: 'authorization kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	accountExposureKind: {
		label: 'account exposure kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestExecutionKind: {
		label: 'request execution kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	discoveryTrustKind: {
		label: 'discovery trust kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	formFactors: {
		label: 'form factors',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	networkNamespaces: {
		label: 'network namespaces',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	caipNamespaces: {
		label: 'CAIP namespaces',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	capabilities: {
		label: 'capabilities',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	sourceCapabilities: {
		label: 'source capabilities',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	runtimeCapabilities: {
		label: 'runtime capabilities',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	implementationStatus: {
		label: 'implementation status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	dependencyPolicy: {
		label: 'dependency policy',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
