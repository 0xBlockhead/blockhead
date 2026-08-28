// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadLogosBlockchainNodeStateSchema from '$/schema/BlockheadLogosBlockchainNodeState.ts'
import BlockheadLogosBlockchainWalletKeyStateSchema from '$/schema/BlockheadLogosBlockchainWalletKeyState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(matchZeroExHex(params.publicKey)))
		error(404, 'Route mapping not applicable')

	const blockheadLogosBlockchainNodeStateConnectionIdPeerIdParentSelector = parseRouteEntitySelector(
		schema,
		BlockheadLogosBlockchainNodeStateSchema,
		parentData.selector,
		'ConnectionIdPeerId'
	)
	if (blockheadLogosBlockchainNodeStateConnectionIdPeerIdParentSelector instanceof arktype.errors)
		error(404, 'Parent route selector not applicable')

	const blockheadLogosBlockchainWalletKeyStateNodeStatePublicKeySelector = parseRouteEntitySelector(
		schema,
		BlockheadLogosBlockchainWalletKeyStateSchema,
		{
			$nodeState: blockheadLogosBlockchainNodeStateConnectionIdPeerIdParentSelector,
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
