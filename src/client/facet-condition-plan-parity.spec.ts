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

	it('distinguishes optional-many absence, empty values, and indexed membership', () => {
		for (const { name, value, expected } of [
			{
				name: 'empty collection is resolved and inapplicable',
				value: [],
				expected: ProjectionResolution.NotApplicable,
			},
			{
				name: 'membership matches but item index is out of range',
				value: ['erc20'],
				expected: ProjectionResolution.NotApplicable,
			},
			{
				name: 'membership matches at a different index',
				value: ['erc20', 'native'],
				expected: ProjectionResolution.NotApplicable,
			},
		])
			expect(evaluateEntityFacetConditionPlan(plan, [value]), name).toBe(expected)
	})

	it('evaluates is, isOneOf, and includes independently', () => {
		for (const { name, predicate, value, expected } of [
			{
				name: 'is preserves numeric zero',
				predicate: { dependencyIndex: 0, is: 0 },
				value: 0,
				expected: ProjectionResolution.Applicable,
			},
			{
				name: 'is does not coerce zero',
				predicate: { dependencyIndex: 0, is: 0 },
				value: '0',
				expected: ProjectionResolution.NotApplicable,
			},
			{
				name: 'isOneOf accepts its second indexed alternative',
				predicate: { dependencyIndex: 0, itemIndex: 1, isOneOf: ['erc20', 'erc721'] },
				value: ['native', 'erc721'],
				expected: ProjectionResolution.Applicable,
			},
			{
				name: 'isOneOf rejects an out-of-range index',
				predicate: { dependencyIndex: 0, itemIndex: 1, isOneOf: ['erc20'] },
				value: ['erc20'],
				expected: ProjectionResolution.NotApplicable,
			},
			{
				name: 'includes finds zero away from the first index',
				predicate: { dependencyIndex: 0, includes: 0 },
				value: [1, 0],
				expected: ProjectionResolution.Applicable,
			},
			{
				name: 'includes does not treat a scalar as a collection',
				predicate: { dependencyIndex: 0, includes: 'erc20' },
				value: 'erc20',
				expected: ProjectionResolution.NotApplicable,
			},
		])
			expect(evaluateEntityFacetConditionPlan({
				dependencies: plan.dependencies,
				predicates: [predicate],
			}, [value]), name).toBe(expected)
	})
})
