// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadLogosBlockchainWalletKeyStateSchema from '$/schema/BlockheadLogosBlockchainWalletKeyState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchZeroExHex(params.publicKey)))
		error(404, 'Route mapping not applicable')

	const blockheadLogosBlockchainWalletKeyStateNodeStatePublicKeySelector = parseEntitySelector(
		schema,
		BlockheadLogosBlockchainWalletKeyStateSchema,
		{
			$nodeState: parentData.selector,
			publicKey: params.publicKey,
		},
		'NodeStatePublicKey'
	)
	if (blockheadLogosBlockchainWalletKeyStateNodeStatePublicKeySelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadLogosBlockchainWalletKeyState selector')

	return {
		selector: blockheadLogosBlockchainWalletKeyStateNodeStatePublicKeySelector,
	}
}
