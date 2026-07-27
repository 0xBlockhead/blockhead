// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LensAccountSchema from '$/schema/LensAccount.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchEvmAddress(params.address))) error(404, 'Route mapping not applicable')

	const lensAccountAddressSelector = parseEntitySelector(
		schema,
		LensAccountSchema,
		{
			address: params.address,
		}
	)
	if (lensAccountAddressSelector instanceof arktype.errors) error(404, 'Invalid LensAccount selector')

	return {
		selector: lensAccountAddressSelector,
	}
}
