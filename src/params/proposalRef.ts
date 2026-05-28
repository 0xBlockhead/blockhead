import type { ParamMatcher } from '@sveltejs/kit'

import { proposalCategoryBySlug } from '$/constants/SpecificationProposal.ts'


export const match = ((param: string) => {
	const last = param.lastIndexOf('-')
	return (
		last > 0
		&& proposalCategoryBySlug[param.slice(0, last).toLowerCase()] != null
		&& /^\d+$/.test(param.slice(last + 1))
	)
}) satisfies ParamMatcher
