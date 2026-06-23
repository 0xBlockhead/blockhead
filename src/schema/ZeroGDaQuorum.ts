import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ZeroGDaQuorumSelector {
	NetworkQuorumId = 'networkQuorumId',
}
export default {
	entityType: EntityType.ZeroGDaQuorum,
	label: 'zero g da quorum',
	labelPlural: 'zero g da quorums',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'quorumId',
			label: 'quorum ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$consensusNetwork',
			label: 'consensus network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGConsensusNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'selectionMethod',
			label: 'selection method',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$daNodes',
			label: 'da nodes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGDaNode,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
