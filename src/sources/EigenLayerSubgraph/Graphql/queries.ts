import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { graphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const query = (
	binding: SourceBinding,
	document: string,
	variables?: JsonValue
) => (
	graphql({
		binding,
		query: document,
		variables,
	})
)
