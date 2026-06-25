import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AiEvaluation_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$benchmark': {
				source: decodeURIComponent(params.source),
				sourceBenchmarkId: decodeURIComponent(params.sourceBenchmarkId),
			},
			subjectKind: decodeURIComponent(params.subjectKind),
			subjectSelector: decodeURIComponent(params.subjectSelector),
			metricName: decodeURIComponent(params.metricName),
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.aiEvaluationTimestampSource),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AiEvaluation_Timestamp selector')

	return { selector }
}
