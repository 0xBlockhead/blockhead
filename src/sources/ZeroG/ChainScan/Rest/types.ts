import { type as arktype } from 'arktype'


export const zeroGChainScanInfoWire = arktype({
	url: 'string.url',
	chainId: arktype.unit(16661),
	features: arktype('string > 0').array().atLeastLength(1),
})

export type ZeroGChainScanInfo = typeof zeroGChainScanInfoWire.infer

export const zeroGChainScanLlmIdentityWire = arktype({
	url: 'string.url',
	chainId: arktype.unit(16661),
})

export type ZeroGChainScanLlmIdentity = typeof zeroGChainScanLlmIdentityWire.infer

export const parseZeroGChainScanLlmIdentity = (
	llmText: string
) => {
	const urlMatch = llmText.match(/URL:\s*(https:\/\/chainscan\.0g\.ai\/?)/i)
	const chainIdMatch = llmText.match(/Chain ID:\s*(16661)\b/i)
	if (urlMatch == null || chainIdMatch == null)
		throw new Error('ZeroGChainScan_Rest: llms.txt missing URL or Chain ID 16661')

	return zeroGChainScanLlmIdentityWire.assert({
		url: urlMatch[1].replace(/\/$/, ''),
		chainId: 16661,
	})
}
