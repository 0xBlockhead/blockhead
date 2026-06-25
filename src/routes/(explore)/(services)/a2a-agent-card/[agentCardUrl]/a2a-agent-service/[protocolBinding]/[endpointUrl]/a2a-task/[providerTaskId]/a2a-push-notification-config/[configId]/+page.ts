import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/A2aPushNotificationConfig.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$task': {
				'$service': {
					'$card': {
						agentCardUrl: decodeURIComponent(params.agentCardUrl),
					},
					protocolBinding: decodeURIComponent(params.protocolBinding),
					endpointUrl: decodeURIComponent(params.endpointUrl),
				},
				providerTaskId: decodeURIComponent(params.providerTaskId),
			},
			configId: decodeURIComponent(params.configId),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid A2aPushNotificationConfig selector')

	return { selector }
}
