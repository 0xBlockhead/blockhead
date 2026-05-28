import type { ParamMatcher } from '@sveltejs/kit'

import { caip2NetworkNamespaceByNamespace } from '$/constants/Network.ts'


export const match = ((param: string) => (
	/^[-a-z0-9]{3,8}$/.test(param)
	&& param in caip2NetworkNamespaceByNamespace
)) satisfies ParamMatcher
