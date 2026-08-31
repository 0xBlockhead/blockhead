import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceGetText,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/ZeroG/bindings.ts'
import {
	parseZeroGChainScanLlmIdentity,
	zeroGChainScanInfoWire,
	type ZeroGChainScanInfo,
	type ZeroGChainScanLlmIdentity,
} from '$/sources/ZeroG/ChainScan/Rest/types.ts'

const binding = bindings[Source.ZeroGChainScan_Rest][0]

const bindingInfo = () => (
	zeroGChainScanInfoWire.assert({
		url: firstHttpUrlForBinding(binding),
		chainId: 16661,
		features: [
			'accounts',
			'blocks',
			'contracts',
			'transactions',
			'validators',
		],
	})
)

export const getInfo = (): ZeroGChainScanInfo => (
	bindingInfo()
)

export const getLlmInfo = () => (
	sourceGetText(binding, new URL('/llms.txt', firstHttpUrlForBinding(binding)).toString())
)

export const getExplorerIdentity = async (): Promise<ZeroGChainScanLlmIdentity & {
	features: ZeroGChainScanInfo['features']
}> => {
	const bindingSnapshot = bindingInfo()
	const llmIdentity = parseZeroGChainScanLlmIdentity(await getLlmInfo())
	if (llmIdentity.url !== bindingSnapshot.url)
		throw new Error(`ZeroGChainScan_Rest: llms.txt URL ${llmIdentity.url} does not match binding ${bindingSnapshot.url}`)

	return {
		...llmIdentity,
		features: bindingSnapshot.features,
	}
}
