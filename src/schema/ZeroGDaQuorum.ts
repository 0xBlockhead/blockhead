import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum ZeroGDaQuorumSelector {
	NetworkQuorumId = 'networkQuorumId',
}

export default {
	entityType: EntityType.ZeroGDaQuorum,

	label: '0G DA quorum',
	labelPlural: '0G DA quorums',

	selectors: [
		{
			name: ZeroGDaQuorumSelector.NetworkQuorumId,
			fields: [
				'$network',
				'quorumId',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'quorumId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$consensusNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGConsensusNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'selectionMethod',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$daNodes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGDaNode,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
