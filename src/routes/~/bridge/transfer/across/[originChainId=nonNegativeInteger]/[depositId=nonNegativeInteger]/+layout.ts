// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BridgeTransferSchema from '$/schema/BridgeTransfer.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchNonNegativeInteger(params.originChainId) && matchNonNegativeInteger(params.depositId)))
		error(404, 'Route mapping not applicable')

	const bridgeTransferOriginChainIdDepositIdSelector = parseEntitySelector(
		schema,
		BridgeTransferSchema,
		{
			originChainId: Number(params.originChainId),
			depositId: Number(params.depositId),
		},
		'OriginChainIdDepositId'
	)
	if (bridgeTransferOriginChainIdDepositIdSelector instanceof arktype.errors)
		error(404, 'Invalid BridgeTransfer selector')

	return {
		selector: bridgeTransferOriginChainIdDepositIdSelector,
	}
}
