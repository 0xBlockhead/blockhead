import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/ZeroG/bindings.ts'
import type { ZeroGChainScanInfo } from '$/sources/ZeroG/ChainScan/Rest/types.ts'

const binding = bindings[Source.ZeroGChainScan_Rest][0]

export const getInfo = () => ({
	url: firstHttpUrlForBinding(binding),
	chainId: 16661,
	features: [
		'accounts',
		'blocks',
		'contracts',
		'transactions',
		'validators',
	],
}) satisfies ZeroGChainScanInfo

export const getLlmInfo = () => (
	sourceGetText(binding, new URL('/llms.txt', firstHttpUrlForBinding(binding)).toString())
)
