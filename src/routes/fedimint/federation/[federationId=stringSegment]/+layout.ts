// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import FedimintFederationSchema from '$/schema/FedimintFederation.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.federationId)))
		error(404, 'Route mapping not applicable')

	const fedimintFederationFederationIdSelector = parseEntitySelector(
		schema,
		FedimintFederationSchema,
		{
			federationId: params.federationId,
		},
		'FederationId'
	)
	if (fedimintFederationFederationIdSelector instanceof arktype.errors)
		error(404, 'Invalid FedimintFederation selector')

	return {
		selector: fedimintFederationFederationIdSelector,
	}
}
