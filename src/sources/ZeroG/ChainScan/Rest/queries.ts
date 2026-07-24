import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import type { ZeroGChainScanInfo } from '$/sources/ZeroG/ChainScan/Rest/types.ts'

export const getInfo = (binding: SourceBinding) => ({
	url: firstHttpUrlForBinding(binding),
	chainId: 16661,
	features: [
		'blocks',
		'transactions',
		'accounts',
		'validators',
		'contracts',
	],
}) as const satisfies ZeroGChainScanInfo

export const getLlmInfo = (binding: SourceBinding) => (
	sourceGetText(binding, new URL('/llms.txt', firstHttpUrlForBinding(binding)).toString())
)
