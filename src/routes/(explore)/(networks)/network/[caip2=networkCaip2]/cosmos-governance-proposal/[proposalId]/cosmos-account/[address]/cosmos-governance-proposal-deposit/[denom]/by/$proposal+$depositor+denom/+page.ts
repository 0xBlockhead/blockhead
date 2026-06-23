import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import { caip2ParamValueFromString } from '$/lib/caip2.ts'
import EntitySchema from '$/schema/CosmosGovernanceProposalDeposit.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$proposal': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				proposalId: decodeURIComponent(params.proposalId),
			},
			'$depositor': {
				'$network': {
					caip2: caip2ParamValueFromString(params.caip2),
				},
				address: decodeURIComponent(params.address),
			},
			denom: decodeURIComponent(params.denom),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid CosmosGovernanceProposalDeposit selector')

	return { selector }
}
