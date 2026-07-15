import { getText } from '$/lib/http.ts'
import { zeroGMainnetExplorerEndpoints } from '$/sources/ZeroG/ChainScan/Rest/endpoints.ts'
import { zeroGOrigins } from '$/sources/ZeroG/ChainScan/Rest/endpoints.ts'
import type { ZeroGChainScanInfo } from '$/sources/ZeroG/ChainScan/Rest/types.ts'

export const getInfo = () => ({
	url: 'https://chainscan.0g.ai',
	chainId: 16661,
	features: [
		'blocks',
		'transactions',
		'accounts',
		'validators',
		'contracts',
	],
}) as const satisfies ZeroGChainScanInfo

export const getLlmInfo = () => (
	getText(new URL('/llms.txt', zeroGMainnetExplorerEndpoints[0].url).toString(), {
		origins: zeroGOrigins,
	})
)
