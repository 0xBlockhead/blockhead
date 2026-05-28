import type { ParamMatcher } from '@sveltejs/kit'

import { specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'


export const match = ((param: string) => (
	param in specificationRealmBySlug
)) satisfies ParamMatcher
