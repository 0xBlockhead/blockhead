// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadLightningPaymentSchema from '$/schema/BlockheadLightningPayment.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadLightningPaymentSelector = parseEntitySelector(
		schema,
		BlockheadLightningPaymentSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			paymentHash: params.paymentHash,
		}
	)
	if (blockheadLightningPaymentSelector instanceof arktype.errors) error(404, 'Invalid BlockheadLightningPayment selector')

	return {
		selector: blockheadLightningPaymentSelector,
	}
}
