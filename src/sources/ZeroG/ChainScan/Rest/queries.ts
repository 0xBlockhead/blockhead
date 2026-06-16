import { getText } from '$/lib/http.ts'
import { zeroGMainnetExplorerEndpoints } from '$/sources/ZeroG/ChainScan/Rest/index.ts'
import ZeroG from '$/sources/ZeroG/index.ts'
import type { ZeroGChainScanInfo } from '$/sources/ZeroG/ChainScan/Rest/types.ts'

export const getInfo = () => ({
	url: zeroGMainnetExplorerEndpoints[0].url,
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
		origins: ZeroG.origins,
	})
)
