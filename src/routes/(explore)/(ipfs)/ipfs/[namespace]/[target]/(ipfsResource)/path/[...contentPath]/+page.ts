// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { ipfsResourceAddressFromRouteParams } from '$/lib/ipfs.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import IpfsResourceSchema from '$/schema/IpfsResource.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const ipfsResourceSelector = parseEntitySelector(
		schema,
		IpfsResourceSchema,
		ipfsResourceAddressFromRouteParams({
			namespace: decodeURIComponent(params.namespace),
			target: decodeURIComponent(params.target),
			contentPath: decodeURIComponent(params.contentPath),
		})
	)
	if (ipfsResourceSelector instanceof arktype.errors) error(404, 'Invalid IpfsResource selector')

	return {
		selector: ipfsResourceSelector,
	}
}
