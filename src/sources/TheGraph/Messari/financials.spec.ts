import { describe, expect, it } from 'vitest'
import { parseProtocolFinancials } from './financials.ts'

const protocol = {
	id: 'deployment-scoped-protocol',
	name: 'Sushiswap V3',
	network: 'ARBITRUM_ONE',
	schemaVersion: '4.0.0',
	subgraphVersion: '1.1.3',
	methodologyVersion: '1.0.0',
	totalValueLockedUSD: '3609150.285418428116694209557061488',
	cumulativeVolumeUSD: '1028302949.766469147504539810967614',
	cumulativeSupplySideRevenueUSD: '1322480.949594054725482650526413884',
	cumulativeProtocolSideRevenueUSD: '0',
	cumulativeTotalRevenueUSD: '1322480.949594054725482650526413884',
	totalPoolCount: 1345,
}
const data = {
	_meta: {
		deployment: 'QmYiokPYizrLNEpQrNgU7LnKeMKpx6zsViJ9ve8RxgDyPM',
		hasIndexingErrors: false,
		block: { number: 504659475, hash: null, timestamp: 1789283624 },
	},
	dexAmmProtocols: [protocol],
}

describe('Messari protocol financial wire boundary', () => {
	it('retains deployed versions, exact decimals and upstream coordinates without manifest substitution', () => {
		const result = parseProtocolFinancials({ data })
		expect(result).toEqual(data)
		expect(result.dexAmmProtocols[0]?.schemaVersion).toBe('4.0.0')
	})
	it('preserves a valid empty result', () => {
		expect(parseProtocolFinancials({ data: { ...data, dexAmmProtocols: [] } }).dexAmmProtocols).toEqual([])
	})
	it.each([{}, { data: null }])('rejects missing data %j', (input) => {
		expect(() => parseProtocolFinancials(input)).toThrow('no data')
	})
	it('rejects partial data with GraphQL errors', () => {
		expect(() => parseProtocolFinancials({ data, errors: [{ message: 'partial failure' }] })).toThrow('GraphQL errors')
	})
	it('rejects indexed data marked unhealthy', () => {
		expect(() => parseProtocolFinancials({ data: { ...data, _meta: { ...data._meta, hasIndexingErrors: true } } })).toThrow('indexing errors')
	})
	it.each([12.5, 'NaN', ''])('rejects nondecimal wire amount %j', (amount) => {
		expect(() => parseProtocolFinancials({ data: { ...data, dexAmmProtocols: [{ ...protocol, totalValueLockedUSD: amount }] } })).toThrow()
	})
})
