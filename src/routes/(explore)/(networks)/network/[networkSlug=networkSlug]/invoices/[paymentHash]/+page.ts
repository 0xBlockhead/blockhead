// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadLightningInvoiceSchema from '$/schema/BlockheadLightningInvoice.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const blockheadLightningInvoiceSelector = parseEntitySelector(
		schema,
		BlockheadLightningInvoiceSchema,
		{
			$network: {
				slug: params.networkSlug,
			},
			paymentHash: params.paymentHash,
		}
	)
	if (blockheadLightningInvoiceSelector instanceof arktype.errors) error(404, 'Invalid BlockheadLightningInvoice selector')

	return {
		selector: blockheadLightningInvoiceSelector,
	}
}
