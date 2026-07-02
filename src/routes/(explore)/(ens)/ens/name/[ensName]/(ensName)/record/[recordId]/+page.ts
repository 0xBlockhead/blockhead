// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import EnsRecordSchema from '$/schema/EnsRecord.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const ensRecordSelector = parseEntitySelector(
		schema,
		EnsRecordSchema,
		{
			$name: {
				name: decodeURIComponent(params.ensName),
			},
			recordKey: decodeURIComponent(params.recordId),
		}
	)
	if (ensRecordSelector instanceof arktype.errors) error(404, 'Invalid EnsRecord selector')

	return {
		selector: ensRecordSelector,
	}
}
