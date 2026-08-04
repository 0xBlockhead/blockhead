// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import LensUsernameNamespaceSchema from '$/schema/LensUsernameNamespace.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchEvmAddress(params.address)))
		error(404, 'Route mapping not applicable')

	const lensUsernameNamespaceAddressSelector = parseEntitySelector(
		schema,
		LensUsernameNamespaceSchema,
		{
			address: params.address,
		},
		'Address'
	)
	if (lensUsernameNamespaceAddressSelector instanceof arktype.errors)
		error(404, 'Invalid LensUsernameNamespace selector')

	return {
		selector: lensUsernameNamespaceAddressSelector,
	}
}
