// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import CctpMessageSchema from '$/schema/CctpMessage.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchNonNegativeInteger(params.sourceDomain) && matchStringSegment(params.nonce)))
		error(404, 'Route mapping not applicable')

	const cctpMessageSourceDomainNonceSelector = parseRouteEntitySelector(
		schema,
		CctpMessageSchema,
		{
			sourceDomain: Number(params.sourceDomain),
			nonce: params.nonce,
		},
		'SourceDomainNonce'
	)
	if (cctpMessageSourceDomainNonceSelector instanceof arktype.errors)
		error(404, 'Invalid CctpMessage selector')

	return {
		selector: cctpMessageSourceDomainNonceSelector,
	}
}
