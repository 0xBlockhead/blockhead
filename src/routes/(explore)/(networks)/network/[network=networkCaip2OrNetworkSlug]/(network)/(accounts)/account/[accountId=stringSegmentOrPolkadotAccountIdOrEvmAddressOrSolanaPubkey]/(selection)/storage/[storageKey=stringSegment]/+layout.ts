// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import StarknetContractSchema from '$/schema/StarknetContract.ts'
import StarknetStorageEntrySchema from '$/schema/StarknetStorageEntry.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchStringSegment(params.storageKey)))
		error(404, 'Route mapping not applicable')

	const starknetContractNetworkAddressParentSelector = parseRouteEntitySelector(
		schema,
		StarknetContractSchema,
		parentData.selector,
		'NetworkAddress'
	)
	if (starknetContractNetworkAddressParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const starknetStorageEntryContractStorageKeySelector = parseRouteEntitySelector(
		schema,
		StarknetStorageEntrySchema,
		{
			$contract: starknetContractNetworkAddressParentSelector,
			storageKey: params.storageKey,
		},
		'ContractStorageKey'
	)
	if (starknetStorageEntryContractStorageKeySelector instanceof arktype.errors)
		error(404, 'Invalid StarknetStorageEntry selector')

	return {
		selector: starknetStorageEntryContractStorageKeySelector,
	}
}
