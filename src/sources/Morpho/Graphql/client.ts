import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const queryMorpho = async <_Data extends object>(
	binding: SourceBinding,
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
