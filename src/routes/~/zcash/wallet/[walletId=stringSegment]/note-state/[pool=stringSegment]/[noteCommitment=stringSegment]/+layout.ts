// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadZcashNoteStateSchema from '$/schema/BlockheadZcashNoteState.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.walletId) && matchStringSegment(params.pool) && matchStringSegment(params.noteCommitment)))
		error(404, 'Route mapping not applicable')

	const blockheadZcashNoteStateWalletIdPoolNoteCommitmentSelector = parseEntitySelector(
		schema,
		BlockheadZcashNoteStateSchema,
		{
			walletId: params.walletId,
			pool: params.pool,
			noteCommitment: params.noteCommitment,
		},
		'WalletIdPoolNoteCommitment'
	)
	if (blockheadZcashNoteStateWalletIdPoolNoteCommitmentSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadZcashNoteState selector')

	return {
		selector: blockheadZcashNoteStateWalletIdPoolNoteCommitmentSelector,
	}
}
