import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ZeroGConsensusNetwork_TimestampSelector {
	ConsensusNetworkTimestampMsSource = '$consensusNetwork+timestampMs+source',
}
export default {
	entityType: EntityType.ZeroGConsensusNetwork_Timestamp,
	label: 'zero g consensus network timestamp',
	labelPlural: 'zero g consensus network observations',
	selectors: [
		{
			name: ZeroGConsensusNetwork_TimestampSelector.ConsensusNetworkTimestampMsSource,
			fields: [
				'$consensusNetwork',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$consensusNetwork',
			label: 'consensus network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGConsensusNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sharedStakingStatusSource',
			label: 'shared staking status source',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
