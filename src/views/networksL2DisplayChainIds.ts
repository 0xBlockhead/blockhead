import { l2BeatProjectChainIds } from '$/sources/L2Beat/Rest/constants.ts'


export const networksL2DisplayChainIds = l2BeatProjectChainIds.map(
	({ chainId }) => chainId,
)
