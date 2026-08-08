import { print } from 'graphql'
import type { TadaDocumentNode } from 'gql.tada'

import { graphql as queryGraphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const executeAptosIndexer = async <
	_Result extends object,
	_Variables extends JsonValue & object,
>(
	binding: SourceBinding,
	document: TadaDocumentNode<_Result, _Variables>,
	variables: _Variables
) => {
	const data = await queryGraphql<_Result>({
		binding,
		query: print(document),
		variables,
	})
	if (data == null)
		throw new Error('AptosIndexer_Graphql: response data is missing')

	return data
}
