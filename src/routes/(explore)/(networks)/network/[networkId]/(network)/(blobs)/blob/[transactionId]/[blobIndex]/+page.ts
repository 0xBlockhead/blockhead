import { error } from '@sveltejs/kit'

import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const blobIndex = Number(params.blobIndex)
	if (!Number.isInteger(blobIndex) || blobIndex < 0) {
		error(404, 'Invalid blob index')
	}
	const chainId = Number(params.networkId)
	if (!Number.isFinite(chainId)) {
		error(404, 'Invalid network')
	}
	const txHash = hexLowerOfByteSize(params.transactionId, 32)
	if (txHash == null) {
		error(404, 'Invalid blob transaction hash')
	}
	return {
		entityId: {
			$network: { chainId },
			txHash,
			blobIndex,
		},
	}
}
