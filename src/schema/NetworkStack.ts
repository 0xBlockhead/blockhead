import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NetworkStackSelector {
	NetworkStackId = 'networkStackId',
}
export default {
	entityType: EntityType.NetworkStack,
	label: 'network stack',
	labelPlural: 'network stacks',
	description: 'A curated protocol-stack classification used by network catalog rows.',
	selectors: [
		{
			name: NetworkStackSelector.NetworkStackId,
			fields: [
				'networkStackId',
			],
		},
	],
	fields: [
		{
			name: 'networkStackId',
			label: 'network stack ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
