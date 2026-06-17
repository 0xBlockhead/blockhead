import { error } from '@sveltejs/kit'

import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	if (!Number.isFinite(evmChainIdFromCaip2(`${params.caip2Namespace}:${params.caip2Reference}`)))
		error(404, 'Invalid network')

	const txHash = hexLowerOfByteSize(params.transactionId, 32)
	if (txHash == null)
		error(404, 'Invalid EVM transaction hash')

	const logIndex = Number(params.logIndex)
	if (!Number.isSafeInteger(logIndex) || logIndex < 0)
		error(404, 'Invalid EVM log index')

	return {
		selector: {
			$network: { caip2: { namespace: 'eip155', reference: params.caip2Reference } },
			txHash,
			logIndex,
		} as const,
	}
}
