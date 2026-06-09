import { type } from 'arktype'

import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

const polkadotRpcEndpointField = type({
	url: UrlString,
	transportType: type.valueOf(TransportType),
	providerName: 'string',
})

export default {
	entityType: EntityType.PolkadotNetwork,

	label: 'Polkadot network',
	labelPlural: 'Polkadot networks',

	id: Network.id,

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'rpcEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: polkadotRpcEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Polkadot_JsonRpc,
			],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Polkadot_JsonRpc,
			],
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Polkadot_JsonRpc,
			],
		},
		{
			name: '$$validators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PolkadotValidator,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.SubstrateSidecar_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
