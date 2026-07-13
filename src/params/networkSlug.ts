import type { ParamMatcher } from '@sveltejs/kit'

import { networkBySlug } from '$/constants/Network.ts'


export const match = ((param: string) => (
	networkBySlug[param] != null
)) satisfies ParamMatcher
