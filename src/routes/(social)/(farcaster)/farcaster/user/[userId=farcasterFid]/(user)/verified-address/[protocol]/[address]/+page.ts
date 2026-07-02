// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FarcasterVerifiedAddressSchema from '$/schema/FarcasterVerifiedAddress.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const farcasterVerifiedAddressSelector = parseEntitySelector(
		schema,
		FarcasterVerifiedAddressSchema,
		{
			fid: Number(params.userId),
			protocol: params.protocol,
			address: decodeURIComponent(params.address),
		}
	)
	if (farcasterVerifiedAddressSelector instanceof arktype.errors) error(404, 'Invalid FarcasterVerifiedAddress selector')

	return {
		selector: farcasterVerifiedAddressSelector,
	}
}
