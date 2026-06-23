import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/SorobanContractStorageEntry.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$contract': {
				'$network': {
					'$network': {
						caip2: caip2ParamValueFromString(params.caip2),
					},
				},
				contractId: decodeURIComponent(params.contractId),
			},
			keyHash: decodeURIComponent(params.keyHash),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid SorobanContractStorageEntry selector')

	return { selector }
}
