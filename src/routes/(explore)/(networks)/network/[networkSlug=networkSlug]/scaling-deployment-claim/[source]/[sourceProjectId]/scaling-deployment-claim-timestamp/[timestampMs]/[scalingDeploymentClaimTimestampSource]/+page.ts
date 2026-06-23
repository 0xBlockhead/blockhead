import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/ScalingDeploymentClaim_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$claim': {
				'$network': {
					slug: decodeURIComponent(params.networkSlug),
				},
				source: decodeURIComponent(params.source),
				sourceProjectId: decodeURIComponent(params.sourceProjectId),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.scalingDeploymentClaimTimestampSource),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid ScalingDeploymentClaim_Timestamp selector')

	return { selector }
}
