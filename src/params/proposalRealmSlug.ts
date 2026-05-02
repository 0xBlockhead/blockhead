import type { ParamMatcher } from '@sveltejs/kit'

import { proposalRealmBySlug } from '$/constants/Proposal.ts'


export const match = ((param: string) => (
	param in proposalRealmBySlug
)) satisfies ParamMatcher
