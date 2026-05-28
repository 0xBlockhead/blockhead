import { type } from 'arktype'

import { NetworkEnvironment } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { UrlString } from '$/schema/$Url.ts'
import { networkFields } from '$/schema/Network.ts'
import { Source } from '$/sources/$Source.ts'

const nearRpcEndpointField = type({
	url: UrlString,
	transportType: type.valueOf(TransportType),
	providerName: 'string',
})

export default {
	entityType: EntityType.NearNetwork,

	label: 'NEAR network',
	labelPlural: 'NEAR networks',

	id: type({
		networkSlug: type.unit('near'),
	}),

	fields: [
		networkFields[0],
		networkFields[1],
		networkFields[2],
		networkFields[3],
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
			name: 'rpcEndpoints',
			type: EntityFieldType.Primitive,
			primitiveType: nearRpcEndpointField,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
