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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	discoveryKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transportKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	apiSurfaceKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sessionKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authorizationKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	accountExposureKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestExecutionKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	discoveryTrustKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	formFactors: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	networkNamespaces: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	caipNamespaces: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	capabilities: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.One,
	},
	sourceCapabilities: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	runtimeCapabilities: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	implementationStatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	dependencyPolicy: {
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
