import { type } from 'arktype'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const decimal = type('string').matching(/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/)
const financials = type({
	_meta: {
		deployment: 'string',
		hasIndexingErrors: 'boolean',
		block: {
			number: 'number.integer >= 0',
			hash: 'string | null',
			timestamp: 'number.integer | null',
		},
	},
	dexAmmProtocols: type({
		id: 'string',
		name: 'string',
		network: 'string',
		schemaVersion: 'string',
		subgraphVersion: 'string',
		methodologyVersion: 'string',
		totalValueLockedUSD: decimal,
		cumulativeVolumeUSD: decimal,
		cumulativeSupplySideRevenueUSD: decimal,
		cumulativeProtocolSideRevenueUSD: decimal,
		cumulativeTotalRevenueUSD: decimal,
		totalPoolCount: 'number.integer >= 0',
	}).array(),
})

const response = type({
	'data?': financials.or('null'),
	'errors?': type({ message: 'string' }).array(),
})

/** Wire validation only: native identities and observations belong to resolvers. */
export const parseProtocolFinancials = (input: JsonValue) => {
	const payload = response.assert(input)
	if (payload.errors?.length)
		throw new Error('Messari financial query returned GraphQL errors')

	if (payload.data == null)
		throw new Error('Messari financial query returned no data')

	if (payload.data._meta.hasIndexingErrors)
		throw new Error('Messari financial query reports indexing errors')

	return payload.data
}
