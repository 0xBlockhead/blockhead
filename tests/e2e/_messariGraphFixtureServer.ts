import { readFileSync } from 'node:fs'

type GraphRequest = {
	query?: string
	variables?: {
		protocolId?: string
		block?: { hash?: string }
	}
}

const capturedResponse = (file: string) => JSON.parse(readFileSync(new URL(
	`../../src/sources/TheGraph/Messari/fixtures/${file}`,
	import.meta.url
), 'utf8')).response.result.content.find((content: { type: string }) => content.type === 'text').text

const fixtures = [
	JSON.parse(capturedResponse('live-uniswap-arbitrum-introspection.json.query.json')),
	JSON.parse(capturedResponse('live-sushiswap-arbitrum-introspection.json.query.json')),
]
for (const fixture of fixtures) {
	for (const protocol of fixture.data.dexAmmProtocols ?? []) {
		protocol.totalLiquidityUSD ??= '2500000.00'
		protocol.activeLiquidityUSD ??= '1800000.00'
		protocol.uncollectedProtocolSideValueUSD ??= '12.50'
		protocol.uncollectedSupplySideValueUSD ??= '25.00'
		protocol.protocolControlledValueUSD ??= null
		protocol.cumulativeUniqueLPs ??= 11
		protocol.cumulativeUniqueTraders ??= 22
		protocol.cumulativeUniqueUsers ??= 0
		protocol.openPositionCount ??= 3
		protocol.cumulativePositionCount ??= 5
		protocol.lastSnapshotDayID ??= 20000
		protocol.lastUpdateTimestamp ??= '1700000000'
		protocol.lastUpdateBlockNumber ??= '19000000'
	}
}

export const messariGraphFixtureResponse = (request: GraphRequest) => {
	if (!request.query?.includes('MessariAmmFinancialsAtBlockHash')
		&& !request.query?.includes('MessariAmmFinancialsLatest')
		&& !request.query?.includes('MessariEvmBlockAtHash'))
		return undefined

	const fixture = request.variables?.protocolId == null ?
		fixtures.find(value => value.data._meta.block.hash === request.variables?.block?.hash)
	:
		fixtures.find(value => value.data.dexAmmProtocols[0]?.id.toLowerCase() === request.variables.protocolId?.toLowerCase())
	if (fixture == null) return undefined
	if (request.query?.includes('MessariEvmBlockAtHash')) {
		return {
			data: {
				...fixture.data,
				_meta: {
					...fixture.data._meta,
					// EvmBlock has network+hash identity, so its source is the
					// canonical block deployment rather than the protocol deployment.
					deployment: fixtures[0].data._meta.deployment,
				},
			},
		}
	}
	return request.query?.includes('MessariAmmFinancialsLatest') ?
		{ data: { ...fixture.data, liquidityPools: [] } }
	:
		{ data: fixture.data }
}
