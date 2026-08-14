// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BeaconExecutionPayloadEnvelopeSchema from '$/schema/BeaconExecutionPayloadEnvelope.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
	))
		error(404, 'Route mapping not applicable')

	const beaconExecutionPayloadEnvelopeBeaconBlockSelector = parseEntitySelector(
		schema,
		BeaconExecutionPayloadEnvelopeSchema,
		{
			$beaconBlock: parentData.selector,
		},
		'BeaconBlock'
	)
	if (beaconExecutionPayloadEnvelopeBeaconBlockSelector instanceof arktype.errors)
		error(404, 'Invalid BeaconExecutionPayloadEnvelope selector')

	return {
		selector: beaconExecutionPayloadEnvelopeBeaconBlockSelector,
	}
}
