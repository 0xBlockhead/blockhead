import { print } from 'graphql'
import type {
	TadaDocumentNode,
} from 'gql.tada'

import {
	optionalPublicEnvString,
} from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import type { GraphqlResponse } from '$/sources/_shared/wire/Graphql/client.ts'
import bindings from '$/sources/TheGraph/bindings.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.TheGraph_Graphql][0]

export const queryTheGraph = async <
	_Result extends object,
	_Variables extends JsonValue & object,
	>({
	document,
	publicEnv,
	variables,
}: {
	document: TadaDocumentNode<_Result, _Variables>
	publicEnv: SourcePublicEnv
	variables?: _Variables
}) => {
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_THEGRAPH_API_KEY')

	if (apiKey == null)
		throw new Error('PUBLIC_THEGRAPH_API_KEY is required for The Graph gateway queries')

	const response = await sourceFetch(
		binding,
		firstHttpUrlForBinding(binding),
		{
			method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
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
