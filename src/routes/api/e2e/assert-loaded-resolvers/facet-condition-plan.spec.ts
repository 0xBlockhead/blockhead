import {
	expect,
	test,
} from 'vitest'

import { ProjectionResolution } from '$/schema/$schema.ts'

import { resolveFacetConditions } from './_runProbes.ts'


test('resolver probes consume one indexed facet plan without re-resolving dependencies', async () => {
	let resolutions = 0

	await expect(resolveFacetConditions({
		conditionPlan: {
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
		},
		resolveDependency: () => {
			resolutions += 1

			return [
				'native',
				'erc20',
			]
		},
	})).resolves.toBe(ProjectionResolution.Applicable)
	expect(resolutions).toBe(1)
})
