import { describe, expect, it } from 'vitest'
import { entityFieldDefinitions } from '$/schema/$schema.ts'
import { entityDefinitionByType } from '$/schema/index.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

describe('EVM network timestamp cardinality', () => {
	it('requires gas estimate timestamp lists when the field resolves', () => {
		expect(
			entityFieldDefinitions(entityDefinitionByType[EntityType.Network])
				.find((fieldDefinition) => fieldDefinition.name === '$$gasEstimateTimestamps')
				?.cardinality
		).toBe(EntityFieldCardinality.Many)
	})

	it('requires txpool timestamp lists when the field resolves', () => {
		expect(
			entityFieldDefinitions(entityDefinitionByType[EntityType.Network])
				.find((fieldDefinition) => fieldDefinition.name === '$$txpoolTimestamps')
				?.cardinality
		).toBe(EntityFieldCardinality.Many)
	})
})
