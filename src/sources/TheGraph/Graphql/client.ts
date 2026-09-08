import { print } from 'graphql'
import type {
	TadaDocumentNode,
} from 'gql.tada'

import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { GraphqlResponse } from '$/sources/_shared/wire/Graphql/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const queryTheGraph = async <
	_Result extends object,
	_Variables extends JsonValue & object,
	>({
	binding,
	document,
	variables,
}: {
	binding: SourceBinding
	document: TadaDocumentNode<_Result, _Variables>
	variables?: _Variables
}) => {
	const response = await sourceFetch(
		binding,
		firstHttpUrlForBinding(binding),
		{
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: print(document),
				variables,
			}),
		}
	)
	if (!response.ok)
		throw new Error(`The Graph query failed: ${response.status} ${response.statusText}`)

	const payload = await response.json<GraphqlResponse<_Result>>()
	if (payload.errors?.length) {
		throw new Error(
			`The Graph query error: ${
				payload.errors
					.map((error) => error.message ?? 'Unknown error')
					.join(', ')
			}`
		)
	}

	if (payload.data == null)
		throw new Error('The Graph query returned no data')

	return payload.data
}
