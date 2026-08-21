import { expect, it } from 'vitest'
import { entityFieldDefinitions } from '$/schema/$schema.ts'
import { entityDefinitionByType } from '$/schema/index.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

it('requires resolved EVM network timestamp collections to be lists', () => {
	const networkFields = entityFieldDefinitions(entityDefinitionByType[EntityType.Network])
	for (const fieldName of [
		'$$gasEstimateTimestamps',
		'$$txpoolTimestamps',
	]) {
		expect(
			networkFields.find((fieldDefinition) => fieldDefinition.name === fieldName)?.cardinality
		).toBe(EntityFieldCardinality.Many)
}
})
