import type { ParamMatcher } from '@sveltejs/kit'

import { networks } from '$/constants/Network.ts'


export const match = ((param: string) => (
	/^[-a-z0-9]{3,8}$/.test(param)
	&& networks.some((network) => (
		'caip2' in network
		&& network.caip2.namespace === param
	))
)) satisfies ParamMatcher
