// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import CctpDomainSupportSchema from '$/schema/CctpDomainSupport.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchNonNegativeInteger(params.cctpVersion) && matchNonNegativeInteger(params.domainId)))
		error(404, 'Route mapping not applicable')

	const cctpDomainSupportCctpVersionDomainIdSelector = parseEntitySelector(
		schema,
		CctpDomainSupportSchema,
		{
			cctpVersion: Number(params.cctpVersion),
			domainId: Number(params.domainId),
		},
		'CctpVersionDomainId'
	)
	if (cctpDomainSupportCctpVersionDomainIdSelector instanceof arktype.errors)
		error(404, 'Invalid CctpDomainSupport selector')

	return {
		selector: cctpDomainSupportCctpVersionDomainIdSelector,
	}
}
