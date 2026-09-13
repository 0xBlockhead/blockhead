import { stringify } from 'devalue'

const network = { caip2: { namespace: 'eip155', reference: '42161' } } as const

const fixture = ({
	protocolKey,
	deployment,
	blockHash,
	blockNumber,
	expected,
}: {
	protocolKey: string
	deployment: string
	blockHash: `0x${string}`
	blockNumber: number
	expected: readonly string[]
}) => ({
	name: protocolKey,
	pathname: `/network/eip155:42161/financial-protocol/${protocolKey}/amm-observation/${encodeURIComponent(stringify({ $network: network, hash: blockHash }))}/${encodeURIComponent(`thegraph:${deployment}`)}`,
	blockNumber: String(blockNumber),
	expected,
})

export const messariStandardizedSubgraphRouteFixtures = [
	fixture({
		protocolKey: 'uniswap-v3',
		deployment: 'QmXMJ2Hnhhoz6bGFNtTBjnf7kAk9CNCQG7r4R5b7fyVjD7',
		blockHash: '0x3494bd92c2c70687d9479e6bd19f3559c9e1476e4e3c1a826f713f0dccec0667',
		blockNumber: 504659092,
		expected: [
			'81562701.3341817671456280610519393',
			'264156613847.4321949114146250317592',
			'233544214.3956716316057441808254689',
			'26841', '4.0.1', '1.5.3', '1.0.0',
		],
	}),
	fixture({
		protocolKey: 'sushiswap-v3',
		deployment: 'QmYiokPYizrLNEpQrNgU7LnKeMKpx6zsViJ9ve8RxgDyPM',
		blockHash: '0xb3e9e5d9be7400de5eb616cb2d3fa258eea5a1596e468fd09f1edb14dbe4b5d5',
		blockNumber: 504659475,
		expected: [
			'3609150.285418428116694209557061488',
			'1028302949.766469147504539810967614',
			'1322480.949594054725482650526413884',
			'1345', '4.0.1', '4.0.0', '1.1.3', '1.0.0',
		],
	}),
] as const
