// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import HederaNftSchema from '$/schema/HederaNft.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchNonNegativeBigInt(params.serialNumber)))
		error(404, 'Route mapping not applicable')

	const hederaNftTokenSerialNumberSelector = parseEntitySelector(
		schema,
		HederaNftSchema,
		{
			$token: parentData.selector,
			serialNumber: BigInt(params.serialNumber),
		},
		'TokenSerialNumber'
	)
	if (hederaNftTokenSerialNumberSelector instanceof arktype.errors)
		error(404, 'Invalid HederaNft selector')

	return {
		selector: hederaNftTokenSerialNumberSelector,
	}
}
