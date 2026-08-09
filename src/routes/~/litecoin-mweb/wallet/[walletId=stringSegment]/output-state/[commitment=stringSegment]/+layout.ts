// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadLitecoinMwebOutputStateSchema from '$/schema/BlockheadLitecoinMwebOutputState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.walletId) && matchStringSegment(params.commitment)))
		error(404, 'Route mapping not applicable')

	const blockheadLitecoinMwebOutputStateWalletIdCommitmentSelector = parseEntitySelector(
		schema,
		BlockheadLitecoinMwebOutputStateSchema,
		{
			walletId: params.walletId,
			commitment: params.commitment,
		},
		'WalletIdCommitment'
	)
	if (blockheadLitecoinMwebOutputStateWalletIdCommitmentSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadLitecoinMwebOutputState selector')

	return {
		selector: blockheadLitecoinMwebOutputStateWalletIdCommitmentSelector,
	}
}
