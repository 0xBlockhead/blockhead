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
		protocol.protocolControlledValueUSD ??= null
		protocol.cumulativeUniqueUsers ??= 0
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
