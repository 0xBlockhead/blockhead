import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { normalizeEvmTopicHex } from '$/lib/signature-paths.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const hex = ZeroExHex(params.hex)
	if (hex instanceof arktype.errors) error(404, 'Invalid topic hex')
	return {
		entitySelector: {
			hex: normalizeEvmTopicHex(hex),
		},
	}
}
