import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AgentIdentityClaim.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			subjectKind: decodeURIComponent(params.subjectKind),
			subjectSelector: decodeURIComponent(params.subjectSelector),
			identityKind: decodeURIComponent(params.identityKind),
			objectKind: decodeURIComponent(params.objectKind),
			objectSelector: decodeURIComponent(params.objectSelector),
			source: decodeURIComponent(params.source),
			timestampMs: Number(params.timestampMs),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AgentIdentityClaim selector')

	return { selector }
}
