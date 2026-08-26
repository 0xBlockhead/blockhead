// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import AiArtifactSchema from '$/schema/AiArtifact.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.digestAlgorithm) && matchZeroExHex(params.digest)))
		error(404, 'Route mapping not applicable')

	const aiArtifactDigestSelector = parseRouteEntitySelector(
		schema,
		AiArtifactSchema,
		{
			digestAlgorithm: params.digestAlgorithm,
			digest: params.digest,
		},
		'Digest'
	)
	if (aiArtifactDigestSelector instanceof arktype.errors)
		error(404, 'Invalid AiArtifact selector')

	return {
		selector: aiArtifactDigestSelector,
	}
}
