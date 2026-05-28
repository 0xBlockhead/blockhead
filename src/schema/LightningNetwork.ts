import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.LightningNetwork,

	label: 'Lightning Network',
	labelPlural: 'Lightning Networks',

	id: type({
		$network: Network.id,
	}),

	fields: [
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: '$settlementNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
			],
		},
		{
			name: '$$nodes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningNode,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: '$$channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningChannel,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
		},
		{
			name: '$$invoices',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningInvoice,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
		{
			name: '$$payments',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LightningPayment,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.LightningLnd_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
