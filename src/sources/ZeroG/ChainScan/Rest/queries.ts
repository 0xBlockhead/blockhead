import { getText } from '$/lib/http.ts'
import ZeroG from '$/sources/ZeroG/index.ts'
import type { ZeroGChainScanInfo } from '$/sources/ZeroG/ChainScan/Rest/types.ts'

export const zeroGChainScanInfo = {
	url: 'https://chainscan.0g.ai',
	chainId: 16661,
	features: [
		'blocks',
		'transactions',
		'accounts',
		'validators',
		'contracts',
	],
} as const satisfies ZeroGChainScanInfo

export const getChainScanLlmInfo = () => (
	getText('https://chainscan.0g.ai/llms.txt', {
		origins: ZeroG.origins ?? [],
	})
)
