import { print } from 'graphql'
import type { TadaDocumentNode } from 'gql.tada'

import bindings from '$/sources/AptosIndexer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { graphql as queryGraphql } from '$/sources/_shared/wire/Graphql/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const executeAptosIndexer = async <
	_Result extends object,
	_Variables extends JsonValue & object,
>(
	document: TadaDocumentNode<_Result, _Variables>,
	variables: _Variables
) => {
	const data = await queryGraphql<_Result>({
		binding: bindings[Source.AptosIndexer_Graphql][0],
		query: print(document),
		variables,
	})
	if (data == null)
		throw new Error('AptosIndexer_Graphql: response data is missing')

	return data
}
