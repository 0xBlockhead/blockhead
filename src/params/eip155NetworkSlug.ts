import type { ParamMatcher } from '@sveltejs/kit'

import {
	NetworkNamespace,
	networkBySlug,
} from '$/constants/Network.ts'


export const match = ((param: string) => (
	networkBySlug[param]?.namespace === NetworkNamespace.Evm
)) satisfies ParamMatcher
