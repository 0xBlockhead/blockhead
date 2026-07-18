import { expect, test } from 'vitest'

import {
	entityFieldAddressKey,
	ProjectionResolution,
	evaluateEntityFacetConditionPlan,
} from '$/schema/$schema.ts'
import { schemaMeta } from '$/schema/index.ts'


test('compiles nested facet ancestors into one indexed dependency plan', () => {
	const projection = schemaMeta.projectionDefinitionByEntityTypeAndPath[
		entityFieldAddressKey('EvmLog', [
			'Event',
			'TokenTransfer',
		], '')
	]

	expect(projection?.conditionPlan.dependencies).toEqual([
		{
			entityType: 'EvmLog',
			facetPath: [],
			fieldName: 'topic0',
		},
		{
			entityType: 'EvmLog',
			facetPath: ['Event'],
			fieldName: 'signatureHash',
		},
	])
	expect(projection?.conditionPlan.predicates.length).toBe(2)
	expect(evaluateEntityFacetConditionPlan(
		projection?.conditionPlan ?? {
			dependencies: [],
			predicates: [],
		},
		[
			undefined,
			undefined,
		]
	)).toBe(ProjectionResolution.Blocked)
})
