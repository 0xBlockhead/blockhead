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
	expect(projection).toBeDefined()
	if (projection == null)
		throw new Error('Missing EvmLog.Event.TokenTransfer projection')

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
	const transfer = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
	const approval = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
	for (const { name, values, expected } of [
		{
			name: 'both unresolved',
			values: [undefined, undefined],
			expected: ProjectionResolution.Blocked,
		},
		{
			name: 'ancestor rejects while child is unresolved',
			values: ['0x' + '00'.repeat(32), undefined],
			expected: ProjectionResolution.Blocked,
		},
		{
			name: 'child rejects while ancestor is unresolved',
			values: [undefined, approval],
			expected: ProjectionResolution.Blocked,
		},
		{
			name: 'both match',
			values: [transfer, transfer],
			expected: ProjectionResolution.Applicable,
		},
		{
			name: 'ancestor matches but child rejects',
			values: [transfer, approval],
			expected: ProjectionResolution.NotApplicable,
		},
	])
		expect(evaluateEntityFacetConditionPlan(projection.conditionPlan, values), name).toBe(expected)
})
