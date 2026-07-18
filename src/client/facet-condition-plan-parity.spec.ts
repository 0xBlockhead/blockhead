import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	evaluateEntityFacetConditionPlan,
	ProjectionResolution,
	type EntityFacetConditionPlan,
} from '$/schema/$schema.ts'


describe('facet condition plan evaluator', () => {
	const plan = {
		dependencies: [{
			entityType: 'Fixture',
			facetPath: [],
			fieldName: 'types',
		}],
		predicates: [
			{
				dependencyIndex: 0,
				itemIndex: 1,
				is: 'erc20',
			},
			{
				dependencyIndex: 0,
				includes: 'erc20',
			},
		],
	} as const satisfies EntityFacetConditionPlan

	it('evaluates indexed and collection predicates from one dependency value', () => {
		expect(evaluateEntityFacetConditionPlan(plan, [[
			'native',
			'erc20',
		]])).toBe(ProjectionResolution.Applicable)
		expect(evaluateEntityFacetConditionPlan(plan, [[
			'native',
			'erc721',
		]])).toBe(ProjectionResolution.NotApplicable)
	})

	it('reports unresolved dependencies before predicate failure', () => {
		expect(evaluateEntityFacetConditionPlan(plan, [undefined])).toBe(ProjectionResolution.Blocked)
	})
})
