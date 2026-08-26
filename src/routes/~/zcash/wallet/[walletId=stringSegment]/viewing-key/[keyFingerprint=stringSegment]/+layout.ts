// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import BlockheadZcashViewingKeySchema from '$/schema/BlockheadZcashViewingKey.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.walletId) && matchStringSegment(params.keyFingerprint)))
		error(404, 'Route mapping not applicable')

	const blockheadZcashViewingKeyWalletIdKeyFingerprintSelector = parseRouteEntitySelector(
		schema,
		BlockheadZcashViewingKeySchema,
		{
			walletId: params.walletId,
			keyFingerprint: params.keyFingerprint,
		},
		'WalletIdKeyFingerprint'
	)
	if (blockheadZcashViewingKeyWalletIdKeyFingerprintSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadZcashViewingKey selector')

	return {
		selector: blockheadZcashViewingKeyWalletIdKeyFingerprintSelector,
	}
}
