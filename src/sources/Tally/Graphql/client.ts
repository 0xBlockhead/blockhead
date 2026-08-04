import bindings from '$/sources/Tally/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { graphql as queryGraphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const maximumTallyGraphqlResponseBytes = 2_000_000

export const queryTally = async <
	_Result extends object,
>(
	query: string,
	variables?: JsonValue & object
) => {
	const data = await queryGraphql<_Result>({
		binding: bindings[Source.Tally][0],
		maximumResponseBytes: maximumTallyGraphqlResponseBytes,
		query,
		variables,
	})
	if (data == null)
		throw new Error('Tally: response is missing data')

	return data
}
