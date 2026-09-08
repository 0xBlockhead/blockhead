// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchIpfsNamespace } from '$/params/ipfsNamespace.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import IpfsResource_TimestampSchema from '$/schema/IpfsResource_Timestamp.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(
		matchNonNegativeInteger(params.timestampMs)
		&& matchStringSegment(params.source)
		&& matchIpfsNamespace(params.namespace)
		&& matchStringSegment(params.target)
	))
		error(404, 'Route mapping not applicable')

	const ipfsResourceTimestampResourceTimestampMsSourceSelector = parseRouteEntitySelector(
		schema,
		IpfsResource_TimestampSchema,
		{
			$resource: {
				namespace: params.namespace,
				target: params.target,
				contentPath: '',
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		},
		'ResourceTimestampMsSource'
	)
	if (ipfsResourceTimestampResourceTimestampMsSourceSelector instanceof arktype.errors)
		error(404, 'Invalid IpfsResource_Timestamp selector')

	return {
		selector: ipfsResourceTimestampResourceTimestampMsSourceSelector,
	}
}
