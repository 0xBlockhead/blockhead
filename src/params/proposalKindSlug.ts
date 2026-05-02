import type { ParamMatcher } from '@sveltejs/kit'

import { proposalCategoryBySlug } from '$/constants/Proposal.ts'


export const match = ((param: string) => (
	param in proposalCategoryBySlug
)) satisfies ParamMatcher

