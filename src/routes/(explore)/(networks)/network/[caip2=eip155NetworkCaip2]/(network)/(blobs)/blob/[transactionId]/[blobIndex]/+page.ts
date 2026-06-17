import { error } from '@sveltejs/kit'

import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const blobIndex = Number(params.blobIndex)
	if (!Number.isSafeInteger(blobIndex) || blobIndex < 0)
		error(404, 'Invalid blob index')

	const chainId = evmChainIdFromCaip2(params.caip2)
	if (!Number.isFinite(chainId))
		error(404, 'Invalid network')

	const txHash = hexLowerOfByteSize(params.transactionId, 32)
	if (txHash == null)
		error(404, 'Invalid blob transaction hash')

	return {
		selector: {
			$network: { caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } },
			txHash,
			blobIndex,
		} as const,
	}
}
