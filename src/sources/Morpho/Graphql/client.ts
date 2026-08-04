import bindings from '$/sources/Morpho/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Morpho_Graphql][0]

export const queryMorpho = async <_Data extends object>(
	query: string,
	variables: JsonValue
) => {
	const data = await graphql<_Data>({
		binding,
		query,
		variables,
	})
	if (data == null)
		throw new Error(`${Source.Morpho_Graphql}: response missing data`)

	return data
}
