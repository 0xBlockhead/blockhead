// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import BlockheadCashuProofSchema from '$/schema/BlockheadCashuProof.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(
		matchStringSegment(params.walletId)
		&& matchAbsoluteUrl(params.mintUrl)
		&& matchStringSegment(params.keysetId)
		&& matchStringSegment(params.secretHash)
	))
		error(404, 'Route mapping not applicable')

	const blockheadCashuProofWalletIdMintUrlKeysetIdSecretHashSelector = parseEntitySelector(
		schema,
		BlockheadCashuProofSchema,
		{
			walletId: params.walletId,
			mintUrl: decodeURIComponent(params.mintUrl),
			keysetId: params.keysetId,
			secretHash: params.secretHash,
		},
		'WalletIdMintUrlKeysetIdSecretHash'
	)
	if (blockheadCashuProofWalletIdMintUrlKeysetIdSecretHashSelector instanceof arktype.errors)
		error(404, 'Invalid BlockheadCashuProof selector')

	return {
		selector: blockheadCashuProofWalletIdMintUrlKeysetIdSecretHashSelector,
	}
}
