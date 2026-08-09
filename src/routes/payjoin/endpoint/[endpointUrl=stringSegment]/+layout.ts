// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import PayjoinEndpointSchema from '$/schema/PayjoinEndpoint.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.endpointUrl)))
		error(404, 'Route mapping not applicable')

	const payjoinEndpointEndpointUrlSelector = parseEntitySelector(
		schema,
		PayjoinEndpointSchema,
		{
			endpointUrl: params.endpointUrl,
		},
		'EndpointUrl'
	)
	if (payjoinEndpointEndpointUrlSelector instanceof arktype.errors)
		error(404, 'Invalid PayjoinEndpoint selector')

	return {
		selector: payjoinEndpointEndpointUrlSelector,
	}
}
