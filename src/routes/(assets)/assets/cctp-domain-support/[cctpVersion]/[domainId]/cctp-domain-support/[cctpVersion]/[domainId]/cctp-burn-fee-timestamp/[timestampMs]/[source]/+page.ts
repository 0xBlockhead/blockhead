import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/CctpBurnFee_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$sourceDomain': {
				cctpVersion: decodeURIComponent(params.cctpVersion),
				domainId: decodeURIComponent(params.domainId),
			},
			'$destinationDomain': {
				cctpVersion: decodeURIComponent(params.cctpVersion),
				domainId: decodeURIComponent(params.domainId),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid CctpBurnFee_Timestamp selector')

	return { selector }
}
