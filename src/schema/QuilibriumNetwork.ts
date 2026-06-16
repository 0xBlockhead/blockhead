import { type } from 'arktype'

import { NetworkEnvironment } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { networkFields } from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

export enum QuilibriumNetworkSelector {
	Slug = 'slug',
}


const quilibriumDocsEndpointField = type({
	url: UrlString,
	transportType: type.valueOf(TransportType),
	providerName: 'string',
})

const quilibriumNodeInterfaceField = type({
	label: 'string',
	port: 'number',
	transportType: type.valueOf(TransportType),
})

const quilibriumProtocolFactField = type({
	label: 'string',
	value: 'string',
})

const quilibriumServiceLayerField = type({
	label: 'string',
	description: 'string',
})

export default {
	entityType: EntityType.QuilibriumNetwork,

	label: 'Quilibrium network',
	labelPlural: 'Quilibrium networks',

	selectors: [
		{
			name: QuilibriumNetworkSelector.Slug,
			fields: [
				'slug',
			],
		},
	],

	fields: [
		{
			name: 'slug',
			type: EntityFieldType.Primitive,
			primitiveType: type.unit('quilibrium'),
			cardinality: EntityFieldCardinality.One,
		},
		networkFields[1],
		networkFields[3],
		networkFields[11],
		networkFields[12],
		networkFields[13],
		networkFields[14],
		{
			name: 'environment',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(NetworkEnvironment),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'docsEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: quilibriumDocsEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.QuilibriumDocs_Rest,
			],
		},
		{
			name: 'nodeInterfaces',
			type: EntityFieldType.Primitive,
			primitiveType: quilibriumNodeInterfaceField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.QuilibriumDocs_Rest,
			],
		},
		{
			name: 'protocolFacts',
			type: EntityFieldType.Primitive,
			primitiveType: quilibriumProtocolFactField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.QuilibriumDocs_Rest,
			],
		},
		{
			name: 'serviceLayers',
			type: EntityFieldType.Primitive,
			primitiveType: quilibriumServiceLayerField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.QuilibriumDocs_Rest,
			],
		},
		{
			name: '$protocolDocument',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SpecificationProposal,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.QuilibriumDocs_Rest,
			],
		},
		{
			name: '$masterShard',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumShard,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.QuilibriumNodeRpc_Grpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
