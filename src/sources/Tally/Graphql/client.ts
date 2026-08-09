import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { graphql as queryGraphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const maximumTallyGraphqlResponseBytes = 2_000_000

export const queryTally = async <
	_Result extends object,
>(
	binding: SourceBinding,
	query: string,
	variables?: JsonValue & object
) => {
	const data = await queryGraphql<_Result>({
		binding,
		maximumResponseBytes: maximumTallyGraphqlResponseBytes,
		query,
		variables,
	})
	if (data == null)
		throw new Error('Tally: response is missing data')

	return data
}
